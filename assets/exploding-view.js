import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let model;
let exploded = false;
let explodeProgress = 0; // 0 = normal, 1 = exploded
let allParts = [];

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

// DIRECTIONS PER PART (in same order as model.children)
const partDirections = [
  new THREE.Vector3(1, 0, 0), // 1. speaker center x+
  new THREE.Vector3(1, 0, 0), // 2. speakers x+
  new THREE.Vector3(1, 0, 0), // 3. speaker holder x+
  new THREE.Vector3(1, 0, 0), // 4. nobs x+
  new THREE.Vector3(0, -1, 0), // 5. feet y-
  new THREE.Vector3(0, -1, 0), // 6. bottom bracket 1 y-
  new THREE.Vector3(0, -1, 0), // 7. bottom bracket 2 y-
  new THREE.Vector3(1, 0, 0), // 8. nobs spacers x+
  new THREE.Vector3(0, 0, 0), // 9. bottom panel (Only stationary part)
  new THREE.Vector3(0, 1, 0), // 10. speaker console y+
  new THREE.Vector3(0, 0, 0), // 11. glass box (Only stationary part)
  new THREE.Vector3(-1, 0, 0), // 12. speaker cords x-
  new THREE.Vector3(0, 0, 1), // 13. small screw/spacer z+
  new THREE.Vector3(0, -1, 0), // 14. bottom bracket y-
  new THREE.Vector3(0, -1, 0), // 15. square spacer y-
  new THREE.Vector3(1, 0, 0), // 16. black square x+
  new THREE.Vector3(0, -1, 0), // 17. some spacer y-
  new THREE.Vector3(1, 0, 0), // 18. black square x+
  new THREE.Vector3(-1, 0, 0), // 19. back screws x-
  new THREE.Vector3(0, -1, 0), // 20. bottom screws y-
  new THREE.Vector3(1, 0, 0), // 21. speaker spacers x+
  new THREE.Vector3(1, 0, 0), // 22. extra part if any x+
  new THREE.Vector3(0, -1, 0), // 23. extra part if any y-
];

// DISTANCES PER PART (in same order as model.children)
const partDistances = [
  1, // 1. speaker center
  1, // 2. speakers
  1, // 3. speaker holder
  1, // 4. nobs
  1, // 5. feet
  0.1, // 6. bottom bracket 1
  0.2, // 7. bottom bracket 2
  1, // 8. nobs spacers
  1, // 9. bottom panel
  0.1, // 10. speaker console
  1, // 11. glass box
  1, // 12. speaker cords
  1, // 13. small screw/spacer
  1, // 14. bottom bracket
  1, // 15. square spacer
  1, // 16. black square
  1, // 17. some spacer
  1, // 18. black square
  1, // 19. back screws
  5, // 20. bottom screws
  1, // 21. speaker spacers

  //Foreach don't loop more than parts above this line
  1, // 22. extra part if any
  1, // 23. extra part if any
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
  "/assets/3d-model/speaker/speaker.glb",
  (gltf) => {
    console.log("GLTF loaded successfully");

    model = gltf.scene;

    // Model positioning and scaling
    model.position.set(-7, 0.5, 0.5);
    model.scale.set(7, 7, 7);
    model.rotation.set(0, Math.PI * 1.1, 0);

    scene.add(model);

    // Get all parts (including nested ones)
    allParts = getAllParts(model);

    // Debug: Log all parts
    console.log("Total parts found:", allParts.length);
    allParts.forEach((part, i) => {
      console.log(`Part ${i}:`, part.name, part.type);
    });

    // Store original positions & directions for explosion
    allParts.forEach((part, i) => {
      part.userData.originalPos = part.position.clone();
      const customDir = partDirections[i] || new THREE.Vector3(0, 0, 0);
      part.userData.direction = customDir.clone().normalize();
      part.userData.distance = partDistances[i] || 0;
    });

    console.log("Model loaded with", allParts.length, "parts");
  },
  (progress) => {
    console.log(
      "Loading progress:",
      ((progress.loaded / progress.total) * 100).toFixed(2) + "%"
    );
  },
  (error) => {
    console.error("GLTF load error:", error);
  }
);

// ---- Button to trigger explosion
const explodeBtn = document.getElementById("explode-button");
if (explodeBtn) {
  explodeBtn.addEventListener("click", () => {
    exploded = !exploded;
  });
} else {
  console.warn("#explode-button not found in DOM");
}

// ---- Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    const speed = 0.0275;
    explodeProgress += exploded ? speed : -speed;
    explodeProgress = THREE.MathUtils.clamp(explodeProgress, 0, 1);

    const allParts = getAllParts(model);
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
  }

  renderer.render(scene, camera);
}

animate();
