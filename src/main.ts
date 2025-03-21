import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// Shaders.
import OceanSurfaceVert from "./shaders/oceanVertex.glsl";
import OceanSurfaceFrag from "./shaders/oceanFragment.glsl";

let scene: THREE.Scene, camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let clock: THREE.Clock;
let oceanMaterial: THREE.ShaderMaterial

function setupScene()
{
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 256, 256);
    oceanMaterial = new THREE.ShaderMaterial({
        vertexShader: OceanSurfaceVert,
        fragmentShader: OceanSurfaceFrag,
        uniforms: {
            uT: { value: 0.01 }
        }
    });
    const mesh = new THREE.Mesh(planeGeometry, oceanMaterial);
    window.exposed.oceanMesh = mesh;

    scene.add(mesh);
}

function setupCamera()
{
    camera.position.set(0, 0, 1);
}

function handleResize()
{
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    console.log("Setting pixel ratio to:", pixelRatio);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addEventListeners()
{
    window.addEventListener("resize", handleResize);
}

function init()
{
    window.exposed = {};
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.01, 100);
    const canvas = document.querySelector("#main-canvas")!;
    renderer = new THREE.WebGLRenderer({
        canvas
    });
    clock = new THREE.Clock(true);
    handleResize();
    addEventListeners();
    setupScene();
    setupCamera();
    controls = new OrbitControls(camera, renderer.domElement);
}

function update(dt: number)
{
    controls.update(dt);
    oceanMaterial.uniforms.uT.value = clock.elapsedTime;
}

function render()
{
    requestAnimationFrame(render);
    const dt = clock.getDelta();
    update(dt);
    renderer.render(scene, camera);
}

window.onload = function ()
{
    init();
    render();
}
