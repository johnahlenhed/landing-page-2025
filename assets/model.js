import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

// ---- Container for the 3d model
const container = document.getElementById("model-container");

const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xd8d8d8);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

// ---- Some recommended anti-aliasing thing
const composer = new EffectComposer(renderer);
composer.addPass(new FXAAPass());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  25,
  container.clientWidth / container.clientHeight,
  1,
  500
);
camera.position.set(0, 2, 30);

// ---- Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 45;
controls.target.set(0, 1, 0);

// ---- Light settings
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

// ---- Material references
const textureLoader = new THREE.TextureLoader();

const createMaterial = (part) =>
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(
      `../assets/3d-model/texturer_test1/${part}_Base_color.jpg`
    ),
    normalMap: textureLoader.load(
      `../assets/3d-model/texturer_test1/${part}_Normal.jpg`
    ),
    roughnessMap: textureLoader.load(
      `../assets/3d-model/texturer_test1/${part}_Roughness.jpg`
    ),
    metalnessMap: textureLoader.load(
      `../assets/3d-model/texturer_test1/${part}_Metallic.jpg`
    ),
    bumpMap: textureLoader.load(
      `../assets/3d-model/texturer_test1/${part}_Height.jpg`
    ),
    roughness: 1.0,
    metalness: 0.8,
  });

// ---- Material objects
const materials = {
  seat: null,
  sidor: null,
  kudde: null,
};

// ---- Loading model with textures
const objLoader = new OBJLoader();
objLoader.setPath("../assets/3d-model/");

objLoader.load("chair_uv_ek.obj", (object) => {
  object.position.set(0, -6, 0);
  object.rotation.y = -Math.PI / 1.5;

  object.traverse((child) => {
    if (!child.isMesh) return;

    const name = child.name.toLowerCase();

    if (name.includes("seat")) {
      materials.seat = createMaterial("seat");
      child.material = materials.seat;
    }

    if (name.includes("sidor")) {
      materials.sidor = createMaterial("sidor");
      child.material = materials.sidor;
    }

    if (name.includes("kudde")) {
      materials.kudde = createMaterial("kudde");
      child.material = materials.kudde;
    }
  });

  scene.add(object);
});

// ---- Apply color tint to materials
function applyColor(parts, hexColor) {
  parts.forEach((part) => {
    const mat = materials[part];
    if (!mat) return;

    mat.color = new THREE.Color(hexColor);
    mat.needsUpdate = true;
  });
}

// ---- Applies color to model depending on the value
document.querySelectorAll("#color-options button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const hex = btn.getAttribute("data-color");
    applyColor(["seat", "rygg"], hex);
  });
});
// ---- Changes the color of the button to the same color as given value
document.querySelectorAll(".swatch").forEach((btn) => {
  const color = btn.getAttribute("data-color");
  btn.style.backgroundColor = color;
});

// -------------------------------------------------------------
// Render loop
// -------------------------------------------------------------
function renderScene() {
  requestAnimationFrame(renderScene);
  controls.update();
  renderer.render(scene, camera);
}
renderScene();

// Dynamic resizing
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
