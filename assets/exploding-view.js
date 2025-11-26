import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

let model, explodeProgress = 0, allParts = [];
const container = document.getElementById("speaker-3d");
const cameraStartPos = new THREE.Vector3();

// Camera settings
const CAM = {
  zoomIN: 0.65,
  rotation: Math.PI * 0.5,
  pan: new THREE.Vector3(0, -0.1, 0),
  tilt: new THREE.Vector3(0, -5, 0)
};

// Colors
const COLORS = { black: 0x3c3c3c, metal: 0x9d9d9d, glass: 0xffffff, inside: 0xbcbcbc };
const partColors = [COLORS.inside, COLORS.inside, COLORS.inside, COLORS.metal, COLORS.black, COLORS.metal, COLORS.metal, COLORS.black, COLORS.metal, COLORS.metal, COLORS.glass, COLORS.inside, COLORS.metal, COLORS.metal, COLORS.metal, COLORS.black, COLORS.metal, COLORS.black, COLORS.metal, COLORS.metal, COLORS.inside, COLORS.black, COLORS.black];

// Part directions & distances combined
const partData = [
  [1,0,0, 0.6], [1,0,0, 0.8], [1,0,0, 0.4], [1,0,0, 0.3], [0,-1,0, 0.6], [0,-1,0, 0.5],
  [0,-1,0, 0.3], [1,0,0, 0.2], [0,0,0, 0], [0,0,0, 0], [0,0,0, 0], [0,0,0, 0], [0,0,1, 0.5],
  [0,-1,0, 0.2], [0,-1,0, 1], [0,0,0, 0], [0,-1,0, 1], [0,-1,0, 0.3], [-1,0,0, 0.3],
  [0,-1,0, 0.6], [1,0,0, 0.3], [1,0,0, 0.75], [0,-1,0, 1]
];

// Renderer setup
const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(18, container.clientWidth / container.clientHeight, 1, 500);
camera.position.set(-35, 35, 106);
camera.rotation.set(-0.2, -0.6, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 200;
controls.target.set(0, 1, 0);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
scene.add(new THREE.DirectionalLight(0xffffff, 0.9), new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.9));
const lights = scene.children.filter(c => c.isLight).slice(-3);
lights[0].position.set(5, 8, 5);
lights[1].position.set(-5, 4, 3);
lights[2].position.set(-3, 5, -5);

// HDR Environment
new HDRLoader().load("/assets/3d-model/speaker/studio_small_03_4k.hdr", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
});

// Load model
new GLTFLoader().load("/assets/3d-model/speaker/speaker.glb", (gltf) => {
  model = gltf.scene;
  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);
  model.rotation.set(0, -2.2, 0);
  scene.add(model);

  // Get all parts
  allParts = [];
  model.traverse(node => { if (node.isMesh) allParts.push(node); });

  // Camera auto-centering
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  controls.target.copy(center);
  
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const cameraZ = maxDim / Math.tan(fov / 2);
  
  camera.position.set(center.x + cameraZ * 0.1, center.y + cameraZ * 0.1, center.z + cameraZ * 1.5);
  camera.lookAt(center);
  controls.update();
  cameraStartPos.copy(camera.position);

  // Apply colors and setup parts
  allParts.forEach((part, i) => {
    if (part.material) {
      part.material = part.material.clone();
      part.material.color.set(partColors[i % partColors.length]);
      if (part.material.map) part.material.map.colorSpace = THREE.SRGBColorSpace;
      if (part.material.color) part.material.color.multiplyScalar(1.5);
      if (part.material.isMeshPhysicalMaterial) {
        part.material.metalness = Math.max(part.material.metalness * 0.8, 0);
        part.material.roughness = Math.min(part.material.roughness, 0.8);
        part.material.envMapIntensity = 1.2;
      }
    }

    // Setup part data
    const [dx, dy, dz, dist] = partData[i] || [0, 0, 0, 0];
    part.userData.originalPos = part.position.clone();
    part.userData.direction = new THREE.Vector3(dx, dy, dz).normalize();
    part.userData.distance = dist;
  });
});

// Slider control
const slider = document.getElementById("explode-slider");
if (slider) slider.addEventListener("input", e => explodeProgress = e.target.value / 100);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model && allParts.length > 0) {
    allParts.forEach(part => {
      if (part.userData.originalPos) {
        const target = part.userData.originalPos.clone()
          .add(part.userData.direction.clone().multiplyScalar(part.userData.distance));
        part.position.lerpVectors(part.userData.originalPos, target, explodeProgress);
      }
    });

    // Camera animation
    const angle = CAM.rotation * explodeProgress;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    
    const rotated = new THREE.Vector3(
      cameraStartPos.x * cos - cameraStartPos.z * sin,
      cameraStartPos.y,
      cameraStartPos.x * sin + cameraStartPos.z * cos
    );

    rotated.multiplyScalar(THREE.MathUtils.lerp(1, CAM.zoomIN, explodeProgress));
    rotated.add(CAM.pan.clone().multiplyScalar(explodeProgress));
    rotated.add(CAM.tilt.clone().multiplyScalar(explodeProgress));

    camera.position.copy(rotated);
    camera.lookAt(controls.target.clone().add(CAM.pan.clone().multiplyScalar(explodeProgress)));
  }

  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});