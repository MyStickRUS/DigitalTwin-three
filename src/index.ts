import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let controls: OrbitControls;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer;
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2;
let tooltipMesh: THREE.Mesh | null = null;
let loadedFont: Font | null = null;

let clickTimeout: number | null = null;
let mouseDown = false;
let pointerMovedSinceMouseDown = false;

let cameraTargetTo: THREE.Vector3 | null = null;

const lerpSpeed = 0.05; // smooth transition speed

const fontLoader = new FontLoader();
const modelLoader = new GLTFLoader();

const objects: (THREE.Mesh | THREE.Group)[] = [];

fontLoader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  loadedFont = font
  init();
  animate();
});

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener("click", onMouseClick, false);
window.addEventListener("dblclick", onMouseDoubleClick, false);

function onMouseDown(event: MouseEvent) {
  mouseDown = true;
  pointerMovedSinceMouseDown = false;
}

function onMouseMove(event: MouseEvent) {
  if (mouseDown) {
    pointerMovedSinceMouseDown = true;
  }
}

function onMouseUp(event: MouseEvent) {
  mouseDown = false;
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  addPlane();
  addTruck();
  addBoxes();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; 
  controls.target.set(0, 0, 0);
  camera.rotateX(0.5);
  controls.update();

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

function addTruck() {
  return modelLoader.load('cyber.glb', function (gltf) {
    const modelGroup = new THREE.Group();
    modelGroup.add(gltf.scene);

    scene.add(modelGroup);
    objects.push(modelGroup);

    modelGroup.position.set(0, -0.4, -10);
  },
    undefined,
    function (error) {
      console.error(error);
    });
}

function addBoxes() {
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 'red' });

  const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
  box2.position.set(2, 0.5, 0);
  scene.add(box2);
  objects.push(box2);
}

function onMouseDoubleClick(event: MouseEvent) {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const firstIntersection = intersects[0];

    cameraTargetTo = firstIntersection.point.clone();
  }
}

function onMouseClick(event: MouseEvent) {
  if (pointerMovedSinceMouseDown) {
    return;
  }

  clickTimeout = setTimeout(() => {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length) {
      const firstIntersection = intersects[0];
      createTooltip('Tooltip text', firstIntersection.object.position);

      return;
    }

    tooltipMesh && scene.remove(tooltipMesh);
  }, 250)
}

function onPointerMove(event: PointerEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function createTooltip(text: string, position: any) {
  // FIXME: position is THREE.Vector3 | THREE.Group
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

  if (position?.object) {
    // object is a group
    const box = new THREE.Box3().setFromObject(position.object);
    const boxCenter = box.getCenter(new THREE.Vector3());
    const boxSize = box.getSize(new THREE.Vector3());

    tooltipMesh.position.copy(boxCenter);
    tooltipMesh.position.y += boxSize.y / 2 + 0.5; // position it above the bounding box

    scene.add(tooltipMesh);
    return;
  }

  // object is a mesh 
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

    controls.update();
  }
}

function animate() {
  requestAnimationFrame(animate);
  animateLerp();

  renderer.render(scene, camera);
}
