import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let controls: OrbitControls;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer;
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2;

let cameraTargetTo: THREE.Vector3 | null = null;

const lerpSpeed = 0.05; // camera transition speed

const objects: THREE.Mesh[] = [];

init();
animate();

window.addEventListener('pointermove', onPointerMove);

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  addBoxes();

  // Add a plane
  const planeGeometry = new THREE.PlaneGeometry(15, 15);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  camera.rotateX(0.5);

  window.addEventListener("click", onMouseClick, false);

  camera.position.z = 5;
}

function addBoxes() {
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
  box1.position.set(-2, 0.5, 0);
  scene.add(box1);
  objects.push(box1);

  const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
  box2.position.set(2, 0.5, 0);
  scene.add(box2);
  objects.push(box2);
}

function onMouseClick(event: any) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const firstIntersection = intersects[0];

    cameraTargetTo = firstIntersection.point.clone();
  }
}

function onPointerMove(event: PointerEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  if (cameraTargetTo !== null) {
    controls.target.lerp(cameraTargetTo, lerpSpeed);

    // Stop the lerp if the target is close enough
    if (controls.target.distanceTo(cameraTargetTo) < 0.01) {
      controls.target.copy(cameraTargetTo);
      cameraTargetTo = null;
    }

    controls.update();
  }

  renderer.render(scene, camera);
}
