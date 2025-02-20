import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initStats, initRenderer, initCamera, initOrbitControls, 
         initDefaultLighting, addGeometryWithMaterial } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 20, 40));
const orbitControls = initOrbitControls(camera, renderer);
const clock = new THREE.Clock();
const stats = initStats();

// create a scene, that will hold all our elements such as objects, cameras and lights.
// and add some simple default lights

initDefaultLighting(scene);

const gui = new GUI();
const controls = {
  normalScaleX: 1,
  normalScaleY: 1
};
const textureLoader = new THREE.TextureLoader();

const urls = [
    './assets/textures/cubemap/flowers/right.png',
    './assets/textures/cubemap/flowers/left.png',
    './assets/textures/cubemap/flowers/top.png',
    './assets/textures/cubemap/flowers/bottom.png',
    './assets/textures/cubemap/flowers/front.png',
    './assets/textures/cubemap/flowers/back.png'
];

var cubeLoader = new THREE.CubeTextureLoader();
scene.background = cubeLoader.load(urls);

var cubeMaterial = new THREE.MeshStandardMaterial({
    envMap: scene.background,
    color: 0xffffff,
    metalness: 1,
    roughness: 0,
});

var sphereMaterial = cubeMaterial.clone();
sphereMaterial.normalMap = textureLoader.load("./assets/textures/engraved/Engraved_Metal_003_NORM.jpg");

const cube = new THREE.BoxGeometry(16, 12, 12)
const cube1 = addGeometryWithMaterial(scene, cube, 'cube', gui, controls, cubeMaterial);
cube1.position.x = -15;
cube1.rotation.y = -1/3*Math.PI;

const sphere = new THREE.SphereGeometry(10, 50, 50)
const sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);
sphere1.position.x = 15;

/*
gui.add({refraction: false}, "refraction").onChange(function(e) {
  if (e) {
    scene.background.mapping = THREE.CubeRefractionMapping;
  } else {
    scene.background.mapping = THREE.CubeReflectionMapping;
  }
  cube1.material.needsUpdate = true;
  sphere1.material.needsUpdate = true;
});
*/

render(); 
function render() {
  stats.update();
  orbitControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  //cube1.rotation.y += 0.005;
  //sphere1.rotation.y -= 0.01;
}

