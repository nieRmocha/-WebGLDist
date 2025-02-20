import * as THREE from 'three';  
import { initStats, initRenderer, initCamera, initOrbitControls, 
    initDefaultLighting } from './util.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera();
camera.position.set(3, 5, 10);
const stats = initStats();
const orbitControls = initOrbitControls(camera, renderer);

initDefaultLighting(scene);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const box = new THREE.Mesh(geometry, material);
box.name = 'box1';
box.castShadow = true;
scene.add(box);

// ground plane 추가
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;  // 바닥이 되도록 90도 회전
plane.position.y = -0.5;  // 박스 아래에 위치
plane.receiveShadow = true;  // 그림자를 받도록 설정
scene.add(plane);

// Animation track 생성
// Track의 종류 (subclass)
// 1. THREE.KeyframeTrack: 일반적인 키프레임 트랙
// 2. THREE.QuaternionKeyframeTrack: 쿼터니언 키프레임 트랙
// 3. THREE.NumberKeyframeTrack: 숫자 키프레임 트랙
// 4. THREE.ColorKeyframeTrack: 색상 키프레임 트랙
// 5. THREE.VectorKeyframeTrack: 벡터 키프레임 트랙
// 6. THREE.StringKeyframeTrack: 문자열 키프레임 트랙
// 7. THREE.BooleanKeyframeTrack: 불리언 키프레임 트랙
// 8. THREE.ObjectKeyframeTrack: 객체 키프레임 트랙
// 9. THREE.AudioKeyframeTrack: 오디오 키프레임 트랙
// 10. THREE.MorphTargetKeyframeTrack: 모프 타겟 키프레임 트랙
// 11. THREE.TextureKeyframeTrack: 텍스처 키프레임 트랙
// 12. THREE.PropertyBinding: 속성 바인딩
//
// KeyframeTrack: name, times (keyframe이 있는 time들의 array), 
// values (keyframe이 있는 time에 대응하는 value들의 array), 
// interpolation (보간 방식):
// 1. THREE.InterpolateLinear: 선형 보간 (default)
// 2. THREE.InterpolateSmooth: 부드러운 보간 (Cubic Hermite Spline)
// 3. THREE.InterpolateDiscrete: 불연속 보간 (keyframe에서 값이 갑자기 변함)

// Animation 만드는 순서
// 1) Keyframe data 준비 (time array, value array)
// 2) KeyframeTrack 생성
// 3) AnimationClip 생성
// 4) Mixer와 Action 생성
// 5) Animation Loop 실행

// Rotation animation
const rotationTimes = [0, 1, 2];
const rotationValues = [
    0,          // 0초: 0도
    Math.PI,    // 1초: 180도
    Math.PI * 2 // 2초: 360도
];

const rotationTrack = new THREE.KeyframeTrack(
    box.name + '.rotation[y]', // 회전 축을 y축으로 설정
    rotationTimes,
    rotationValues,
    THREE.InterpolateSmooth
);

// Position animation
const positionTimes = [0, 1, 2];
const positionValues = [
    0, 0, 0,           // 시작 위치
    0, 2, 0,           // 중간 위치
    0, 0, 0            // 끝 위치
];

const positionTrack = new THREE.KeyframeTrack(
    box.name + '.position',
    positionTimes,
    positionValues
);

// Animation clips: name, duration, tracks (KeyframeTrack들의 array)
const rotationClip = new THREE.AnimationClip('Rotation', 2, [rotationTrack]);
const positionClip = new THREE.AnimationClip('Position', 2, [positionTrack]);

// Mixer and actions
const mixer = new THREE.AnimationMixer(box);
const rotationAction = mixer.clipAction(rotationClip);
const positionAction = mixer.clipAction(positionClip);

// AnimationAction: 애니메이션 재생 제어: manual 참고 할 것
// AnimationAction.play(): 애니메이션 재생
// AnimationAction.stop(): 애니메이션 정지
// AnimationAction.reset(): 애니메이션 초기화
// AnimationAction.setLoop(): 애니메이션 반복 설정
//   - THREE.LoopRepeat: 반복 재생
//   - THREE.LoopOnce: 한 번만 재생
//   - THREE.LoopPingPong: 왕복 재생

const clock = new THREE.Clock();
let isPositionPlaying = true; // Track current animation
let switchTimer = 0; // Time tracker for switching animations

animate();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    switchTimer += delta;

    // Switch animations every 2 seconds
    if (switchTimer >= 2) {
        switchTimer = 0;
        if (isPositionPlaying) {
            positionAction.stop();
            rotationAction.reset().play();
        } else {
            rotationAction.stop();
            positionAction.reset().play();
        }
        isPositionPlaying = !isPositionPlaying;
    }

    mixer.update(delta);
    stats.update();
    orbitControls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

