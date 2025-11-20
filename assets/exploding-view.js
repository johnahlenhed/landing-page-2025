import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

let model;
let exploded = false;
let explodeProgress = 0; // 0 = normal, 1 = exploded

// ---- Container for the 3d model
const container = document.getElementById("speaker-3d");

// Renderer
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xd8d8d8);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

// Scene + Camera
const scene = new THREE.Scene();
// Put camera closer (or bump maxDistance)
const camera = new THREE.PerspectiveCamera(
  25,
  container.clientWidth / container.clientHeight,
  1,
  500
);
camera.position.set(-40, 25, 80); // <- within reasonable distance

// ---- Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 200; // make sure > camera distance
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

// DIRECTIONS PER PART (in same order as model.children)
const partDirections = [
  new THREE.Vector3(1, 0, 0), // speaker center
  new THREE.Vector3(1, 0, 0), // speakers
  new THREE.Vector3(0, 0, 0), // speaker holder
  new THREE.Vector3(1, 0, 0), // nobs
  new THREE.Vector3(0, -1, 0), // feet
  new THREE.Vector3(0, -1, 0), // bottom bracket 1
  new THREE.Vector3(0, -1, 0), // bottom bracket 2
  new THREE.Vector3(0, 0, 0), // nobs spacers
  new THREE.Vector3(0, -1, 0), // bottom panel
  new THREE.Vector3(0, 0, 0), // speaker console
  new THREE.Vector3(0, 0, 0), // glass box
  new THREE.Vector3(-1, 0, 0), // speaker cords
  new THREE.Vector3(0, 0, 1), // small screw/spacer
  new THREE.Vector3(0, -1, 0), // bottom bracket
  new THREE.Vector3(0, -1, 0), // square spacer???????
  new THREE.Vector3(1, 0, 0), // black square
  new THREE.Vector3(0, 1, 0), // some spacer ???????
  new THREE.Vector3(0, 0, 0), // black square???????????????
  new THREE.Vector3(-1, 0, 0), // back screws
  new THREE.Vector3(0, -1, 0), // bottom screws
  new THREE.Vector3(1, 0, 0), // speaker spacers
];

// DISTANCES PER PART (in same order as model.children)

const partDistances = [
  1, // speaker center
  1, // speakers
  1, // speaker holder
  1, // nobs
  1, // feet
  1, // bottom bracket 1
  1, // bottom bracket 2
  1, // nobs spacers
  1, // bottom panel
  1, // speaker console
  1, // glass box
  1, // speaker cords
  1, // small screw/spacer
  1, // bottom bracket
  1, // square spacer???????
  1, // black square
  1, // some spacer ???????
  1, // black square???????????????
  1, // back screws
  1, // bottom screws
  1, // speaker spacers
];

// ---- Load OBJ + MTL
const mtlLoader = new MTLLoader();
mtlLoader.setPath("/assets/3d-model/speaker/");

mtlLoader.load(
  "speaker.mtl",
  (materials) => {
    materials.preload();

    for (const name in materials.materials) {
      const material = materials.materials[name];
      material.side = THREE.DoubleSide; // render both sides
      material.flatShading = false; // smooth shading
    }

    console.log("Loading MTL from:", mtlLoader.path);

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath("/assets/3d-model/speaker/");

    objLoader.load(
      "speaker.obj",
      (object) => {
        console.log("Loading OBJ from:", objLoader.path);

        model = object;

        // Model positioning and scaling
        model.position.set(-7, 0.5, 0.5);
        model.scale.set(7, 7, 7);
        model.rotation.set(0, Math.PI * 1.1, 0);

        scene.add(model);

        // Store original positions & directions for explosion
        model.children.forEach((part, i) => {
          part.userData.originalPos = part.position.clone();
          const customDir = partDirections[i] || new THREE.Vector3(0, 0, 0);
          part.userData.direction = customDir.clone().normalize();
          part.userData.distance = partDistances[i] || 0;
        });
      },
      undefined,
      (err) => console.error("OBJ load error", err)
    );
  },
  (err) => console.error("MTL load error", err)
);

// ---- Button to trigger explosion (guard existence)
const explodeBtn = document.getElementById("explode-button");
if (explodeBtn) {
  explodeBtn.addEventListener("click", () => {
    exploded = !exploded; // toggle only — animation loop will handle movement
  });
} else {
  console.warn("#explode-button not found in DOM");
}

// ---- Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    const speed = 0.03;
    explodeProgress += exploded ? speed : -speed;
    explodeProgress = THREE.MathUtils.clamp(explodeProgress, 0, 1);

    model.children.forEach((part) => {
      const original = part.userData.originalPos;
      const distance = part.userData.distance || 5;
      const target = original
        .clone()
        .add(part.userData.direction.clone().multiplyScalar(distance)); // distance
      part.position.lerpVectors(original, target, explodeProgress);
    });
  }

  renderer.render(scene, camera);
}

animate();
