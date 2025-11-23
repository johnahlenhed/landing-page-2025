import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

const hdrLoader = new HDRLoader();
hdrLoader.load("/assets/3d-model/speaker/studio_small_03_4k.hdr", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = hdr;
  scene.background = null;
});

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
  new THREE.Vector3(1, 0, 0), // 22. speaker magnet x+
  new THREE.Vector3(1, 0, 0), // 23. speaker muffler x+
];

// DISTANCES PER PART (in same order as model.children)
const partDistances = [
  1.5, // 1. speaker center x+
  1.3, // 2. speakers x+
  1, // 3. speaker holder x+
  1, // 4. nobs x+
  1, // 5. feet y-
  0.1, // 6. bottom bracket 1 y-
  0.2, // 7. bottom bracket 2 y-
  1, // 8. nobs spacers x+
  0, // 9. bottom panel (stationary)
  0.1, // 10. speaker console y+
  0, // 11. glass box (stationary)
  0.5, // 12. speaker cords x-
  0.5, // 13. small screw/spacer z+
  1, // 14. bottom bracket y-
  1, // 15. square spacer y-
  1, // 16. black square x+
  1, // 17. some spacer y-
  1, // 18. black square x+
  1, // 19. back screws x-
  1, // 20. bottom screws y-
  1, // 21. speaker spacers x+
  1, // 22. speaker magnet x+
  1, // 23. speaker muffler x+
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

    // Check materials and colors
    console.log("Checking materials...");
    model.traverse((node) => {
      if (node.isMesh) {
        const mats = Array.isArray(node.material)
          ? node.material
          : [node.material];
        mats.forEach((mat, idx) => {
          console.log("Mesh:", node.name, "Material:", mat?.name, {
            type: mat?.type,
            hasMap: !!mat?.map,
            mapUrl: mat?.map?.source?.data?.currentSrc || "embedded",
            color: mat?.color?.getHexString(),
            metalness: mat?.metalness,
            roughness: mat?.roughness,
          });
        });
      }
    });

    // Model positioning and scaling (adjusted starting position)
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, 0, 0);

    scene.add(model);

    // ---- Auto-center camera on the loaded model ----
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
      center.x + cameraZ * 0.3,
      center.y + cameraZ * 0.3,
      center.z + cameraZ * 1.2
    );

    camera.lookAt(center);
    controls.update();

    // Get all parts (including nested ones)
    allParts = getAllParts(model);

    // Give each part its own color

    // Alluminium, screws, speaker basket: 555555

    const blackPlastic = 0x3c3c3c;
    const alluminium = 0x555555;
    const glass = 0xffffff;
    const metal = 0x9d9d9d;
    const rubber = 0x303030;
    const speakerInside = 0xbcbcbc;

    const partColors = [
      speakerInside, // 1. speaker center
      speakerInside, // 2. speakers
      speakerInside, // 3. speaker holder
      metal, // 4. nobs
      blackPlastic, // 5. feet
      metal, // 6. bottom bracket 1
      metal, // 7. bottom bracket 2
      blackPlastic, // 8. nobs spacers
      metal, // 9. bottom panel
      metal, // 10. speaker console
      glass, // 11. glass box
      speakerInside, // 12. speaker cords
      metal, // 13. small screw/spacer
      metal, // 14. bottom bracket
      metal, // 15. square spacer
      blackPlastic, // 16. black square
      metal, // 17. some spacer
      blackPlastic, // 18. black square
      metal, // 19. back screws
      metal, // 20. bottom screws
      speakerInside, // 21. speaker spacers
      blackPlastic, // 22. extra part if any
      blackPlastic, // 23. extra part if any
    ];

    allParts.forEach((part, i) => {
      if (part.isMesh && part.material) {
        // Always clone to make each mesh independent
        part.material = part.material.clone();

        // Base color
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

          // Set proper color space for textures
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }

          // Brighten material if it's too dark
          if (mat.color) {
            mat.color.multiplyScalar(1.5);
          }

          // Improve visibility
          if (mat.isMeshPhysicalMaterial) {
            mat.metalness = Math.max(mat.metalness * 0.8, 0);
            mat.roughness = Math.min(mat.roughness, 0.8);
            mat.envMapIntensity = 1.2;
          }
        });
      }
    });

    // Debug: Log all parts and materials
    console.log("Total parts found:", allParts.length);
    allParts.forEach((part, i) => {
      console.log(`Part ${i}:`, part.name, part.type);
      if (part.isMesh && part.material) {
        console.log(`  Material:`, {
          name: part.material.name,
          type: part.material.type,
          hasMap: !!part.material.map,
          color: part.material.color?.getHexString(),
        });
      }
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

  if (model && allParts.length > 0) {
    const speed = 0.0275;
    explodeProgress += exploded ? speed : -speed;
    explodeProgress = THREE.MathUtils.clamp(explodeProgress, 0, 1);

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
