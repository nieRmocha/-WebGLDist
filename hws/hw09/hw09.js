import * as THREE from 'three';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

// Camera를 perspective와 orthographic 두 가지로 switching 해야 해서 const가 아닌 let으로 선언
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 120;
camera.position.y = 60;
camera.position.z = 180;
camera.lookAt(scene.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

// Camera가 바뀔 때 orbitControls도 바뀌어야 해서 let으로 선언
let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// add geometries
const animatePlanets = addSpheres(scene);
addSun(scene);


function addSun(scene) {
    // 태양 구체 생성 (빛나는 느낌을 위해 emissive 사용)
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffcc00 // 밝게 빛나는 효과
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(0, 0, 0);
    scene.add(sunMesh);

    // 태양 역할을 할 광원 (포인트 라이트)
    const light = new THREE.PointLight(0xffffff, 2, 1000);
    light.position.set(0, 0, 0);
    scene.add(light);
}


function addSpheres(scene) {

    const planets = [
        { name: 'Mercury', radius: 1.5, distance: 20, color: '#a6a6a6', rotationSpeed: 0.02, orbitSpeed: 0.02 },
        { name: 'Venus', radius: 3, distance: 35, color: '#e39e1c', rotationSpeed: 0.015, orbitSpeed: 0.015 },
        { name: 'Earth', radius: 3.5, distance: 50, color: '#3498db', rotationSpeed: 0.01, orbitSpeed: 0.01 },
        { name: 'Mars', radius: 2.5, distance: 65, color: '#c0392b', rotationSpeed: 0.008, orbitSpeed: 0.008 }
    ];

    for (let planet of planets) {

        const geometry = new THREE.SphereGeometry(planet.radius);
        const materials = new THREE.MeshLambertMaterial({ color: planet.color });
        const mesh = new THREE.mesh(geometry, materials);

        //const mesh = new THREE.Mesh(geoms[i],materials[i]);
        const orbitGroup = new THREE.Object3D();  // 공전을 위한 중심 그룹
        orbitGroup.add(mesh);
        mesh.position.x = planet.distance;  // 중심으로부터 거리 설정

        scene.add(orbitGroup);

        planets.push({
            mesh,
            orbitGroup,
            speed: planet.orbitSpeed
        });
    }

        return function animatePlanets() {
        for (let planet of planets) {
            planet.orbitGroup.rotation.y += planet.orbitSpeed;
        }
    };

}

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(-20, 40, 60);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x292929);
scene.add(ambientLight);

let step = 0;

// GUI
const gui = new GUI();
const controls = new function () {
    this.perspective = "Perspective";
    this.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; // 기존의 camera 제거    
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 120;
            camera.position.y = 60;
            camera.position.z = 180;
            camera.lookAt(scene.position);
            orbitControls.dispose();
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Perspective";
        }
    };
};
gui.add(controls, 'switchCamera');
gui.add(controls, 'perspective').listen();

const clock = new THREE.Clock();

render();

function render() {
    orbitControls.update();
    stats.update();

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    animatePlanets();  // 공전 업데이트
    renderer.render(scene, camera);
}
animate();
    
