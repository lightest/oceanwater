import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// Shaders.
import OceanSurfaceVert from "./shaders/oceanVertex.glsl";
import OceanSurfaceFrag from "./shaders/oceanFragment.glsl";
import { GerstnerWaveParams } from "./interfaces";

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

let gerstnerWaveParams: GerstnerWaveParams[] = [];
let gerstnerWaveParamsBuffer: Float32Array;

function generateGerstnerWaveParams(amount: number = 1)
{
    const params:GerstnerWaveParams[] = [];

    for (let i = 0; i < amount; i++)
    {
        params.push(new GerstnerWaveParams());
    }

    return params;
}

function getGerstnerWaveParamsAsFloat32Array(params: GerstnerWaveParams[], buffer: Float32Array)
{
    let offset = 0;

    for (let i = 0; i < params.length; i++)
    {
        // Order has to match the one defined in the shader.
        buffer[offset] = params[i].lambda;
        buffer[offset + 1] = params[i].waveVectorX;
        buffer[offset + 2] = params[i].waveVectorY;
        buffer[offset + 3] = params[i].amplitude;
        buffer[offset + 4] = params[i].omega;
        buffer[offset + 5] = params[i].phase;
        offset += 6;
    }

    return buffer;
}

function setupScene()
{
    // Amount has to match the one defined in the shader.
    const paramsAmount = 5;
    gerstnerWaveParams = generateGerstnerWaveParams(paramsAmount);
    gerstnerWaveParamsBuffer = new Float32Array(paramsAmount * GerstnerWaveParams.FLOAT_PARAMS);
    getGerstnerWaveParamsAsFloat32Array(gerstnerWaveParams, gerstnerWaveParamsBuffer);
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
            uPositionScale: { value: debugParams.uPositionScale },
            uGerstnerWaveParams: { value: gerstnerWaveParamsBuffer }
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

    gui.add(debugParams, "uPositionScale", 1.0, 1024.0, 1.0);

    for (let i = 0; i < gerstnerWaveParams.length; i++)
    {
        const f = gui.addFolder(`Gerstner Wave ${i}`);
        f.add(gerstnerWaveParams[i], "lambda", 0.1, 128, 0.001);
        f.add(gerstnerWaveParams[i], "waveVectorX", 0, 1.0, 0.001);
        f.add(gerstnerWaveParams[i], "waveVectorY", 0, 1.0, 0.001);
        f.add(gerstnerWaveParams[i], "amplitude", 0.0, 1, 0.001);
        f.add(gerstnerWaveParams[i], "omega", 0.0, 128, 0.001);
        f.add(gerstnerWaveParams[i], "phase", 0.0, 128, 0.001);
    }

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
    getGerstnerWaveParamsAsFloat32Array(gerstnerWaveParams, gerstnerWaveParamsBuffer);
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
