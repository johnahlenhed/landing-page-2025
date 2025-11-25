import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FXAAPass } from "three/addons/postprocessing/FXAAPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

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
camera.position.set(6, 3, 15);
if(window.innerWidth < 540){
camera.position.set(6, 3, 20);

}

// ---- Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false
controls.enableDamping = true;
controls.enablePan = false;
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

let globalTextureParams = {
  kudde: {
    color: "beige",
    part: "kudde",
    meshName: "kudde",
  },
  seat: {
    color: "ek",
    part: "chair",
    meshName: "seat",
  },
  sidor: {
    color: "ek",
    part: "chair",
    meshName: "sidor",
  },
};

// ---- Textures
const textureLoader = new THREE.TextureLoader();

function loadPartMaterial(dataColor, dataPart, dataMesh) {
  const base = `../assets/3d-model/chair_texturer/${dataPart}_${dataColor}/${dataMesh}`;

  return new THREE.MeshStandardMaterial({
    name: dataMesh,
    map: textureLoader.load(`${base}_Base_color.png`),
    normalMap: textureLoader.load(`${base}_Normal.png`),
    roughnessMap: textureLoader.load(`${base}_Roughness.png`),
    metalnessMap: textureLoader.load(`${base}_Metallic.png`),
    bumpMap: textureLoader.load(`${base}_Height.png`),
    roughness: 2.0,
    metalness: 0.9,
  });
}

// ---- Assigning material to buttons clicks
function changeModelTextures(color, part, meshList) {
  meshList.forEach((meshName) => {
    globalTextureParams = {
      ...globalTextureParams,
      ...{
        [meshName]: {
          color,
          part,
          meshName,
        }
      }
    }
    setChairMaterials(scene, globalTextureParams);
  });

}

// ---- Funtionality for buttons

document.querySelectorAll(".swatch").forEach((btn) => {
  btn.style.backgroundColor = btn.getAttribute("button-color");

  btn.addEventListener("click", () => {
    const color = btn.dataset.color; // brun, ek, svart
    const part = btn.dataset.part; // chair OR kudde
    const meshList = btn.dataset.mesh.split(","); // "seat,sidor" splitting into array

    changeModelTextures(color, part, meshList);
  });
});

function setChairMaterials(
  object3d,
  textureParams = globalTextureParams,
) {
  object3d.traverse((child) => {
    if (!child.isMesh) return;

    if (!Array.isArray(child.material) && child.name === "kudde" || child.material.name === "kudde") {
      child.material = loadPartMaterial(
        textureParams.kudde.color,
        textureParams.kudde.part,
        textureParams.kudde.meshName
      );
      child.material.needsUpdate = true;
    } else {
      child.material.forEach((material, index) => {
        child.material[index] = loadPartMaterial(
          textureParams[material.name].color,
          textureParams[material.name].part,
          textureParams[material.name].meshName
        );
        child.material[index].needsUpdate = true;
      });
    }
  });
}

const objLoader = new OBJLoader();
objLoader.setPath("../assets/3d-model/");

objLoader.load("chair_uv_ek.obj", (object) => {
  object.position.set(0, -0.5, 0);
  object.rotation.x = -Math.PI / 2;
  object.rotation.z = Math.PI;

  setChairMaterials(object);

  scene.add(object);
});

// ---- Changes the color of the button to the same color as given value
document.querySelectorAll(".swatch").forEach((btn) => {
  const color = btn.getAttribute("button-color");
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
