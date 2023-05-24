import * as THREE from "three";

export function addBox(scene: THREE.Scene, objects: THREE.Object3D[]) {
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 'red' });

  const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
  box2.position.set(2, 0.5, 0);
  scene.add(box2);
  objects.push(box2);
}