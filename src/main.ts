import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// Shaders.
import OceanSurfaceVert from "./shaders/oceanVertex.glsl";
import OceanSurfaceFrag from "./shaders/oceanFragment.glsl";

let scene: THREE.Scene, camera: THREE.Camera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let clock: THREE.Clock;
let oceanMaterial: THREE.ShaderMaterial
const gui = new GUI();
const debugParams = {
    isOceanMeshWireframe: true,
    uLambda: 7.0,
    uWaveVectorX: 1.0,
    uWaveVectorY: 0.0,
    uAmplitude: 0.01,
    uOmega: 1.0,

    // TODO: potentially can be replaced with mesh grid size.
    uPositionScale: 100.0,
};

function setupScene()
{
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 256, 256);
    oceanMaterial = new THREE.ShaderMaterial({
        vertexShader: OceanSurfaceVert,
        fragmentShader: OceanSurfaceFrag,
        uniforms: {
            uT: { value: 0.01 },
            uLambda: { value: debugParams.uLambda },
            uWaveVector: { value: new Float32Array([debugParams.uWaveVectorX, debugParams.uWaveVectorY]) },
            uAmplitude: { value: debugParams.uAmplitude },
            uOmega: { value: debugParams.uOmega },
            uPositionScale: { value: debugParams.uPositionScale }
        }
    });
    oceanMaterial.wireframe = debugParams.isOceanMeshWireframe;
    const mesh = new THREE.Mesh(planeGeometry, oceanMaterial);
    mesh.rotation.set(-Math.PI * 0.5, 0, 0);
    window.exposed.oceanMesh = mesh;

    scene.add(mesh);
}

function setupCamera()
{
    camera.position.set(0, 1, 1);
}

function setupGui()
{
    gui.add(debugParams, "isOceanMeshWireframe").onChange((v) =>
        {
        window.exposed.oceanMesh.material.wireframe = v;
    });

    gui.add(debugParams, "uLambda", 0.1, 128, 0.01);
    gui.add(debugParams, "uAmplitude", 0.0, 1, 0.001);
    gui.add(debugParams, "uOmega", 0.0, 128, 0.01);
    gui.add(debugParams, "uPositionScale", 1.0, 1024.0, 1.0);
    gui.add(debugParams, "uWaveVectorX", 0, 1.0, 0.001);
    gui.add(debugParams, "uWaveVectorY", 0, 1.0, 0.001);
}

function applyUniforms()
{
    for (let i in debugParams)
    {
        if (oceanMaterial.uniforms[i])
        {
            oceanMaterial.uniforms[i].value = debugParams[i];
        }
    }

    oceanMaterial.uniforms.uWaveVector.value[0] = debugParams.uWaveVectorX;
    oceanMaterial.uniforms.uWaveVector.value[1] = debugParams.uWaveVectorY;
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
    setupGui();
}

function update(dt: number)
{
    controls.update(dt);
    oceanMaterial.uniforms.uT.value = clock.elapsedTime;
    applyUniforms();
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
