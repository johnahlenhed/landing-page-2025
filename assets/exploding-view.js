import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

let model;
let explodeProgress = 0;
let allParts = [];

let cameraStartPos = new THREE.Vector3();
let cameraZoomIN = 0.65; // Adjust this to control zoom distance (1 = no zoom, 0.5 = half distance)

// Rotation, tilt and pan settings
let cameraRotationAmount = Math.PI * 0.5; // Full rotation (2π radians)
let cameraPanAmount = new THREE.Vector3(0, -0.1, 0); // Pan upward
let cameraTiltAmount = new THREE.Vector3(0, -5, 0); // Tilt amount (adjust as needed)

// ---- Container for the 3d model
const container = document.getElementById("speaker-3d");

// Renderer
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

// Handle window resize
function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize);

// Scene + Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  18,
  container.clientWidth / container.clientHeight,
  1,
  500
);
camera.position.set(-35, 35, 106);
camera.rotation.set(-0.2, -0.6, 0);

// ---- Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 200;
controls.target.set(0, 1, 0);

// ---- Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(5, 8, 5);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 4, 3);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
rimLight.position.set(-3, 5, -5);
scene.add(rimLight);

// Load HDR environment map
const hdrLoader = new HDRLoader();
hdrLoader.load("./assets/3d-model/speaker/studio_small_03_4k.hdr", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
  scene.background = null;
});

// DIRECTIONS PER PART
const partDirections = [
  new THREE.Vector3(1, 0, 0), // 1
  new THREE.Vector3(1, 0, 0), // 2
  new THREE.Vector3(1, 0, 0), // 3
  new THREE.Vector3(1, 0, 0), // 4
  new THREE.Vector3(0, -1, 0), // 5
  new THREE.Vector3(0, -1, 0), // 6
  new THREE.Vector3(0, -1, 0), // 7
  new THREE.Vector3(1, 0, 0), // 8
  new THREE.Vector3(0, 0, 0), // 9
  new THREE.Vector3(0, 0, 0), // 10
  new THREE.Vector3(0, 0, 0), // 11
  new THREE.Vector3(0, 0, 0), // 12
  new THREE.Vector3(0, 0, 1), // 13
  new THREE.Vector3(0, -1, 0), // 14
  new THREE.Vector3(0, -1, 0), // 15
  new THREE.Vector3(0, 0, 0), // 16
  new THREE.Vector3(0, -1, 0), // 17
  new THREE.Vector3(0, -1, 0), // 18
  new THREE.Vector3(-1, 0, 0), // 19
  new THREE.Vector3(0, -1, 0), // 20
  new THREE.Vector3(1, 0, 0), // 21
  new THREE.Vector3(1, 0, 0), // 22
  new THREE.Vector3(0, -1, 0), // 23
];

// DISTANCES PER PART
const partDistances = [
  0.6, 0.8, 0.4, 0.3, 0.6, 0.5, 0.3, 0.2, 0, 0, 0, 0, 0.5, 0.2, 1, 0, 1, 0.3,
  0.3, 0.6, 0.3, 0.75, 1,
];

// Helper function to get all nested parts
function getAllParts(object, parts = []) {
  object.children.forEach((child) => {
    parts.push(child);
    getAllParts(child, parts);
  });
  return parts;
}

// ---- Load GLTF/GLB
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "./assets/3d-model/speaker/speaker.glb",
  (gltf) => {
    console.log("GLTF loaded successfully");

    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, -2.2, 0);

    scene.add(model);

    // Auto-center camera
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    controls.target.copy(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const cameraZ = maxDim / Math.tan(fov / 2);

    camera.position.set(
      center.x + cameraZ * 0.1,
      center.y + cameraZ * 0.1,
      center.z + cameraZ * 1.5
    );

    camera.lookAt(center);
    controls.update();

    camera.lookAt(center);
    controls.update();

    cameraStartPos.copy(camera.position);

    // Get all parts
    allParts = getAllParts(model);

    // Color definitions
    const blackPlastic = 0x3c3c3c;
    const metal = 0x9d9d9d;
    const glass = 0xffffff;
    const speakerInside = 0xbcbcbc;

    const partColors = [
      speakerInside,
      speakerInside,
      speakerInside,
      metal,
      blackPlastic,
      metal,
      metal,
      blackPlastic,
      metal,
      metal,
      glass,
      speakerInside,
      metal,
      metal,
      metal,
      blackPlastic,
      metal,
      blackPlastic,
      metal,
      metal,
      speakerInside,
      blackPlastic,
      blackPlastic,
    ];

    // Apply colors
    allParts.forEach((part, i) => {
      if (part.isMesh && part.material) {
        part.material = part.material.clone();
        part.material.color.set(partColors[i % partColors.length]);
        part.material.needsUpdate = true;
      }
    });

    // Fix material and texture handling
    model.traverse((node) => {
      if (node.isMesh && node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        materials.forEach((mat) => {
          if (!mat) return;

          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }

          if (mat.color) {
            mat.color.multiplyScalar(1.5);
          }

          if (mat.isMeshPhysicalMaterial) {
            mat.metalness = Math.max(mat.metalness * 0.8, 0);
            mat.roughness = Math.min(mat.roughness, 0.8);
            mat.envMapIntensity = 1.2;
          }
        });
      }
    });

    // Store original positions
    allParts.forEach((part, i) => {
      part.userData.originalPos = part.position.clone();
      const customDir = partDirections[i] || new THREE.Vector3(0, 0, 0);
      part.userData.direction = customDir.clone().normalize();
      part.userData.distance = partDistances[i] || 0;
    });
  },
  (error) => {
    console.error("GLTF load error:", error);
  }
);

// ---- Range slider control
const explodeSlider = document.getElementById("explode-slider");
if (explodeSlider) {
  explodeSlider.addEventListener("input", (e) => {
    explodeProgress = parseFloat(e.target.value) / 100;
  });
} else {
  console.warn("#explode-slider not found in DOM");
}

// ---- Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model && allParts.length > 0) {
    // Update parts as before
    allParts.forEach((part) => {
      if (part.userData.originalPos) {
        const original = part.userData.originalPos;
        const distance = part.userData.distance || 5;
        const target = original
          .clone()
          .add(part.userData.direction.clone().multiplyScalar(distance));
        part.position.lerpVectors(original, target, explodeProgress);
      }
    });

    // Calculate rotated camera position
    const angle = cameraRotationAmount * explodeProgress;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    // Rotate the starting position around the Y axis
    const rotatedPos = new THREE.Vector3(
      cameraStartPos.x * cosAngle - cameraStartPos.z * sinAngle,
      cameraStartPos.y,
      cameraStartPos.x * sinAngle + cameraStartPos.z * cosAngle
    );

    // Apply zoom
    const zoomFactor = THREE.MathUtils.lerp(1, cameraZoomIN, explodeProgress);
    rotatedPos.multiplyScalar(zoomFactor);

    // Apply pan
    const panCurrent = cameraPanAmount.clone().multiplyScalar(explodeProgress);
    rotatedPos.add(panCurrent);

    camera.position.copy(rotatedPos);

    // Apply tilt
    const tiltCurrent = cameraTiltAmount
      .clone()
      .multiplyScalar(explodeProgress);
    camera.position.add(tiltCurrent);

    // Update look-at target to follow the pan
    const targetPos = controls.target.clone().add(panCurrent);
    camera.lookAt(targetPos);
  }

  renderer.render(scene, camera);
}

animate();
