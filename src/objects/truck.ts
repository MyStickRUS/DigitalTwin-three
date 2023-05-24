import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const modelLoader = new GLTFLoader();

export function addTruck(scene: THREE.Scene, objects: THREE.Object3D[]) {
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