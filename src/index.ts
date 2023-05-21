import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

let controls: OrbitControls;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer;
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2;
let tooltipMesh: THREE.Mesh | null = null;
let loadedFont: Font | null = null;

let cameraTargetTo: THREE.Vector3 | null = null;

const lerpSpeed = 0.05; // camera transition speed

const loader = new FontLoader();

const objects: THREE.Mesh[] = [];

loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  loadedFont = font
  init();
  animate();
});

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

  addPlane();

  addBoxes();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  camera.rotateX(0.5);

  window.addEventListener("click", onMouseClick, false);
  window.addEventListener("dblclick", onMouseDoubleClick, false);

  camera.position.z = 5;
}

function addPlane() {
  const planeGeometry = new THREE.PlaneGeometry(15, 15);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 'grey',
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);
}

function addBoxes() {
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 'red' });

  const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
  box1.position.set(-2, 0.5, 0);
  scene.add(box1);
  objects.push(box1);

  const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
  box2.position.set(2, 0.5, 0);
  scene.add(box2);
  objects.push(box2);
}

function onMouseDoubleClick(event: MouseEvent) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const firstIntersection = intersects[0];

    cameraTargetTo = firstIntersection.point.clone();
  }
}

function onMouseClick(event: MouseEvent) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length) {
    const firstIntersection = intersects[0];
    createTooltip('Tooltip text', firstIntersection.object.position);

    return;
  }

  tooltipMesh && scene.remove(tooltipMesh);
}

function onPointerMove(event: PointerEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function createTooltip(text: string, position: THREE.Vector3) {
  if (!loadedFont) {
    return console.error("No font detected!")
  }

  if (tooltipMesh) scene.remove(tooltipMesh); // remove old tooltip if exists

  const geometry = new THREE.PlaneGeometry(1, 0.5);
  const material = new THREE.MeshBasicMaterial({
    color: 'blue',
    side: THREE.DoubleSide
  });

  tooltipMesh = new THREE.Mesh(geometry, material);
  tooltipMesh.position.copy(position);
  tooltipMesh.position.y += 1;

  const textGeometry = new TextGeometry(text, {
    font: loadedFont,
    size: 0.1,
    height: 0.01,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-0.5, 0, 0);

  tooltipMesh.add(textMesh);

  scene.add(tooltipMesh);
}

function animateLerp() {
  if (cameraTargetTo !== null) {
    controls.target.lerp(cameraTargetTo, lerpSpeed);

    // Stop the lerp if the target is close enough
    if (controls.target.distanceTo(cameraTargetTo) < 0.01) {
      controls.target.copy(cameraTargetTo);
      cameraTargetTo = null;
    }

    controls.update();
  }
}

function animate() {
  requestAnimationFrame(animate);
  animateLerp();

  renderer.render(scene, camera);
}
