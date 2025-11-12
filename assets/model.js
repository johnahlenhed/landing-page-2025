import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.0/build/three.module.js';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"

// ---- Container for the 3d model
const container = document.getElementById("model-container");

const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
	antialias: true,
});

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xd8d8d8);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const fxaapass = new FXAAPass();
const composer = new EffectComposer(renderer);
composer.addPass(fxaapass);

// ---- Scene and camera options
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  25,
  container.clientWidth / container.clientHeight,
  1,
  500
);
camera.position.set(0, 2, 30);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 45;
controls.minPolarAngle = 0;
controls.maxPolarAngle = 2;
controls.autoRotate = false;
controls.target.set(0, 1, 0);
controls.update();

// // ---- Lighting settings
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.physicallyCorrectLights = true;
// --- Studio lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
// Key light (main)
const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill light (softens shadows)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 4, 3);
scene.add(fillLight);

// Rim light (adds pop on edges)
const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
rimLight.position.set(-3, 5, -5);
scene.add(rimLight);

const textureLoader = new THREE.TextureLoader();

// ---- Variables for different parts of the model
let seatMaterial, ryggMaterial, benMaterial;

applyTexture("rygg", "rygg_Base_color.jpg");
applyTexture("seat", "seat_Base_color.jpg");
applyTexture("ben", "ben_Base_color.jpg");
const mtlLoader = new MTLLoader();
mtlLoader.setPath("../assets/3d-model/");
mtlLoader.load("stol_preview_texturtest1.mtl", (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  // objLoader.setMaterials(materials);
  objLoader.setPath("../assets/3d-model/");
  objLoader.load("stol_preview_texturtest1.obj", (object) => {
    object.position.set(0, -6, 0);
    object.rotation.y = Math.PI / -1.5;

 object.traverse((child) => {
    if (child.isMesh) {
      const name = child.name.toLowerCase();

      // Function to make a PBR material from base, normal, roughness, etc.
      const makeMaterial = (part) => {
        return new THREE.MeshStandardMaterial({
          map: textureLoader.load(`../assets/3d-model/texturer_test1/${part}_Base_color.jpg`),
          normalMap: textureLoader.load(`../assets/3d-model/texturer_test1/${part}_Normal.jpg`),
          roughnessMap: textureLoader.load(`../assets/3d-model/texturer_test1/${part}_Roughness.jpg`),
          metalnessMap: textureLoader.load(`../assets/3d-model/texturer_test1/${part}_Metallic.jpg`),
          bumpMap: textureLoader.load(`../assets/3d-model/texturer_test1/${part}_Height.jpg`),
          roughness: 1.0,
          metalness: 0.8,
        });
      };

      // Assign materials based on part name
      if (name.includes("seat")) {
        seatMaterial = makeMaterial("seat");
        child.material = seatMaterial;
      }
      if (name.includes("rygg")) {
        ryggMaterial = makeMaterial("rygg");
        child.material = ryggMaterial;
      }
      if (name.includes("ben")) {
        benMaterial = makeMaterial("ben");
        child.material = benMaterial;
      }
    }
  });

    scene.add(object);
    swapTexture();
  });
});

// ---- Functionality for the buttons
function swapTexture() {
  document.querySelectorAll(".part-textures button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const part = btn.getAttribute("data-part");
      const textureFile = btn.getAttribute("data-texture");
      applyTexture(part, textureFile);
    });
  });
}

// ---- Swap texture for a specific part
function applyTexture(part, textureFile) {
  const texture = textureLoader.load("../assets/3d-model/texturer_test1/" + textureFile);
  console.log(texture);
  let material;
  if (part === "seat") material = seatMaterial;
  if (part === "rygg") material = ryggMaterial;
  if (part === "ben") material = benMaterial;

  if (material) {
    material.color = 0x000000;
    material.map = texture;
    material.needsUpdate = true;
  }
}

// ---- Render loop
function renderScene() {
  requestAnimationFrame(renderScene);
  controls.update();
  renderer.render(scene, camera);
}
renderScene();

// ---- Dynamic resizing
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});