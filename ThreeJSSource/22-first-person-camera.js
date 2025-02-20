import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { initStats, initRenderer, initCamera, initDefaultLighting, initDefaultDirectionalLighting } from './util.js';

const scene = new THREE.Scene();
const stats = initStats();
const renderer = initRenderer();
const camera = initCamera();
const clock = new THREE.Clock();

initDefaultLighting(scene);  
initDefaultDirectionalLighting(scene);

const fpControls = new FirstPersonControls(camera, renderer.domElement);
fpControls.lookSpeed = 0.05; // movement speed, default = 1
fpControls.lookVertical = true;  // vertical mouse look 활성화, default = true
fpControls.movementSpeed = 20; // movement speed, default = 1
fpControls.constrainVertical = true; // vertical mouse look을 
                                     //[.verticalMin, .verticalMax] 범위로 제한, default = false
fpControls.verticalMin = 0;   // vertical mouse look을 제한할 최소 각도, default = 0
fpControls.verticalMax = 2.0; // vertical mouse look을 제한할 최대 각도, default = Math.PI

const loader = new OBJLoader();
loader.load("./assets/models/city/city.obj", function (object) {
    // 랜덤 색상 설정
    function setRandomColors(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                // HSL 색상 공간을 사용하여 더 선명한 색상 생성
                const hue = Math.random();  // 색상 (0-1)
                const saturation = 0.7 + Math.random() * 0.3;  // 채도 (0.7-1)
                const lightness = 0.5 + Math.random() * 0.3;   // 명도 (0.5-0.8)

                const color = new THREE.Color().setHSL(hue, saturation, lightness);
                
                child.material = new THREE.MeshPhongMaterial({
                    color: color
                });
            }
        });
    }

    setRandomColors(object);
    const mesh = object;
    scene.add(mesh);
});

render();

function render() {
  stats.update();
  fpControls.update(clock.getDelta());
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
