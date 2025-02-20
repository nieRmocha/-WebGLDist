// main three.module.js library
import * as THREE from 'three';  
// addons: OrbitControls (jsm/controls), Stats (jsm/libs), GUI (jsm/libs)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.backgroundColor = 0xffffff;
// fog 효과, camera로 부터 0.0025 거리에서는 fog가 없고
// 거리 50에서는 어떤 object든 fog (white color)에 둘러싸여 보이지 않음
//scene.fog = new THREE.Fog(0xffffff, 0.0025, 50); 

// Perspective camera: fov, aspect ratio, near, far
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

// set camera position: camera.position.set(-3, 8, 2) 가 더 많이 사용됨 (약간 빠름))
camera.position.x = -3;
camera.position.y = 8;
camera.position.z = 2;

// add camera to the scene
scene.add(camera);

// setup the renderer and attch to canvas
// antialias = true: 렌더링 결과가 부드러워짐
const renderer = new THREE.WebGLRenderer({ antialias: true });

// outputColorSpace의 종류
// sRGBColorSpace: 보통 monitor에서 보이는 color로, 어두운 부분을 약간 밝게 보이게 Gamma correction을 함
// sRGBColorSpace는 PBR (Physically Based Rendering), HDR(High Dynamic Range)에서는 필수적으로 사용함
// LinearColorSpace: 모든 색상을 선형으로 보이게 함
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.shadowMap.enabled = true; // scene에서 shadow를 보이게 할 겁니다. 

// shadowMap의 종류
// BasicShadowMap: 가장 기본적인 shadow map, 쉽고 빠르지만 부드럽지 않음
// PCFShadowMap (default): Percentage-Closer Filtering, 주변의 색상을 평균내서 부드럽게 보이게 함
// PCFSoftShadowMap: 더 부드럽게 보이게 함
// VSMShadowMap: Variance Shadow Map, 더 자연스러운 블러 효과, GPU에서 더 많은 연산 필요
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 현재 열린 browser window의 width와 height에 맞게 renderer의 size를 설정
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
// attach renderer to the body of the html page
document.body.appendChild(renderer.domElement);

// add Stats: 현재 FPS를 보여줌으로써 rendering 속도 표시
const stats = new Stats();
// attach Stats to the body of the html page
document.body.appendChild(stats.dom);

// add OrbitControls: arcball-like camera control
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// add GUI: 간단한 user interface를 제작 가능
// 사용법은 https://lil-gui.georgealways.com/ 
// http://yoonbumtae.com/?p=942 참고

const gui = new GUI();
const props = {
    cubeRotSpeed: 0.01,
    torusRotSpeed: 0.01,
};
gui.add(props, 'cubeRotSpeed', -0.2, 0.2, 0.01);
gui.add(props, 'torusRotSpeed', -0.2, 0.2, 0.01);


// listen to the resize events
window.addEventListener('resize', onResize, false);
function onResize() { // resize handler
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// add ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// add directional light
const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;  // 이 light가 shadow를 만들어 낼 것임
scene.add(dirLight);

// create a cube and torus knot and add them to the scene
const cubeGeometry = new THREE.BoxGeometry();
// MeshLambertMaterial: ambient + diffuse
const cubeMaterial = new THREE.MeshLambertMaterial({ color:0x990000 });
// 하나의 mesh는 geometry와 material로 이루어짐
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -1;
cube.castShadow = true;
scene.add(cube);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100);
// MeshPhongMaterial: ambient + diffuse + specular
const torusKnotMat = new THREE.MeshPhongMaterial({
	color: 0x00ff88,
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry,torusKnotMat);
torusKnotMesh.castShadow = true; // light를 받을 떄 shadow를 만들어 냄
torusKnotMesh.position.x = 2;
scene.add(torusKnotMesh);

// add a plane: 원래 plane은 xy plane 위에 생성됨
const planeGeometry = new THREE.PlaneGeometry(15, 15); // x, y 크기
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaa00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;  // x축 기준으로 -90도 회전 (+y를 up으로 하는 plane이 됨)
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

let step = 0;

function animate() {
    requestAnimationFrame(animate);
    stats.update();
    orbitControls.update();

    step += 0.02;
    cube.position.x = 4 * Math.cos(step);
    cube.position.y = 4 * Math.abs(Math.sin(step));

    cube.rotation.x += props.cubeRotSpeed;
    cube.rotation.y += props.cubeRotSpeed;
    cube.rotation.z += props.cubeRotSpeed;

    torusKnotMesh.rotation.x -= props.torusRotSpeed;
    torusKnotMesh.rotation.y += props.torusRotSpeed;
    torusKnotMesh.rotation.z -= props.torusRotSpeed;

    renderer.render(scene, camera);
}

animate();






