import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ---- Container for the 3d model
const container = document.getElementById("model-container");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xd8d8d8);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// ---- Scene and camera options
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
camera.position.set(0, 3, 12);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 9;
controls.maxDistance = 15;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target.set(0, 1, 0);
controls.update();

// ---- Lights for the scene
scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 0.2));
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const key = new THREE.DirectionalLight(0xffffff, 0.2);
key.position.set(5, 5, 5);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.2);
rim.position.set(-5, 3, -5);
scene.add(rim);

const textureLoader = new THREE.TextureLoader();

// ---- Variables for different parts of the model
let seatMaterial, ryggMaterial, benMaterial;

const mtlLoader = new MTLLoader();
mtlLoader.setPath("../assets/3d-model/");
mtlLoader.load("stol_preview_texturtest1.mtl", (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  // objLoader.setMaterials(materials);
  objLoader.setPath("../assets/3d-model/");
  objLoader.load("stol_preview_texturtest1.obj", (object) => {
    object.position.set(0, -4, 0);
    object.rotation.y = Math.PI / -1.5;

    object.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        if (name.includes("seat")) seatMaterial = child.material;
        if (name.includes("rygg")) ryggMaterial = child.material;
        if (name.includes("ben")) benMaterial = child.material;
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