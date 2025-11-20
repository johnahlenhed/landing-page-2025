import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

let model;
let exploded = false;
let explodeProgress = 0; // 0 = normal, 1 = exploded

// ---- Container for the 3d model
const container = document.getElementById("speaker-3d");

// Renderer
const renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xd8d8d8);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

// Scene + Camera
const scene = new THREE.Scene();
// Put camera closer (or bump maxDistance)
const camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 1, 500);
camera.position.set(40, 30, 40); // <- within reasonable distance

// ---- Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 200; // make sure > camera distance
controls.target.set(0, 1, 0);

// ---- Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 0.9); keyLight.position.set(5, 8, 5); scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5); fillLight.position.set(-5, 4, 3); scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 0.9); rimLight.position.set(-3, 5, -5); scene.add(rimLight);


// CUSTOM DIRECTIONS PER PART (in same order as model.children)
const partDirections = [
    new THREE.Vector3( 0, 0, 0),  // part 0
    new THREE.Vector3(0, 10, 0),  // part 1
    new THREE.Vector3( 0, -10, 0),  // part 2
    new THREE.Vector3( 0, 0, 0),  // part 3
    new THREE.Vector3( 0, 0, 0),  // part 4
    new THREE.Vector3( 0, 0, 0),  // part 5
    // ...add more depending on number of child meshes
];



// ---- Load the 3D model
const objLoader = new OBJLoader();
objLoader.load('/assets/3d-model/stol_preview_texturtest1.obj', (object) => {

    model = object;

    //Model positioning and scaling
    model.position.set(0.5, 0.5, 0.5); // x, y, z
    model.scale.set(0.5, 0.5, 0.5); // x, y, z
    model.rotation.set(0, Math.PI, 0); // x, y, z

    scene.add(model);

    // Apply simple material and add to scene
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        }
    });

    model.children.forEach((part, i) => {
    part.userData.originalPos = part.position.clone();

    // If a direction is provided for this index, use it.
    // Otherwise default to no movement.
    const customDir = partDirections[i] || new THREE.Vector3(0, 0, 0);

    part.userData.direction = customDir.clone().normalize();
    });


    scene.add(object);
}, undefined, (err) => console.error('OBJ load error', err));

// ---- Button to trigger explosion (guard existence)
const explodeBtn = document.getElementById("explode-button");
if (explodeBtn) {
    explodeBtn.addEventListener("click", () => {
        exploded = !exploded; // toggle only — animation loop will handle movement
    });
} else {
    console.warn('#explode-button not found in DOM');
}

// ---- Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (model) {
        const speed = 0.03;
        explodeProgress += exploded ? speed : -speed;
        explodeProgress = THREE.MathUtils.clamp(explodeProgress, 0, 1);

        model.children.forEach(part => {
            const original = part.userData.originalPos;
            const target = original.clone().add(part.userData.direction.clone().multiplyScalar(5)); // distance
            part.position.lerpVectors(original, target, explodeProgress);
        });
    }

    renderer.render(scene, camera);
}

animate();