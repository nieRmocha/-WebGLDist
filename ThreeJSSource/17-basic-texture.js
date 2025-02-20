import * as THREE from 'three';  
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initRenderer, initCamera, initStats, initOrbitControls, 
         initDefaultLighting, addLargeGroundPlane, addGeometry } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 20, 40));

const orbitControls = initOrbitControls(camera, renderer);
const stats = initStats();

const groundPlane = addLargeGroundPlane(scene)
groundPlane.position.y = -10;
groundPlane.receiveShadow = true;
initDefaultLighting(scene);
scene.add(new THREE.AmbientLight(0x444444));

const controls = {};
const gui = new GUI();

const textureLoader = new THREE.TextureLoader();

const polyhedron = new THREE.IcosahedronGeometry(8, 0); 
const polyhedronMesh = addGeometry(scene, polyhedron, 'polyhedron', 
                        textureLoader.load('./assets/textures/metal-rust.jpg'), gui, controls);
polyhedronMesh.position.x = 20;
polyhedronMesh.castShadow = true;

const sphere = new THREE.SphereGeometry(5, 20, 20)
const sphereMesh = addGeometry(scene, sphere, 'sphere', 
                        textureLoader.load('./assets/textures/floor-wood.jpg'), gui, controls);
sphereMesh.castShadow = true;

const cube = new THREE.BoxGeometry(10, 10, 10)
const cubeMesh = addGeometry(scene, cube, 'cube', 
                        textureLoader.load('./assets/textures/brick-wall.jpg'), gui, controls);
cubeMesh.position.x = -20;
cubeMesh.castShadow = true;

render();

function render() {
  stats.update();
  orbitControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  polyhedronMesh.rotation.x += 0.01;
  sphereMesh.rotation.y += 0.01;
  cubeMesh.rotation.z += 0.01;
}

