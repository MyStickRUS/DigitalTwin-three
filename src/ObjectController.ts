import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { SceneController } from './SceneController';

export class ObjectController {
    sceneController: SceneController;
    gui: GUI;
    selectedObject: THREE.Object3D | null = null;

    constructor(sceneController: SceneController) {
        this.sceneController = sceneController;
        this.gui = new GUI();

        // Implementing click and double-click listeners
        // ...
    }

    onObjectClicked = (object: THREE.Object3D) => {
        // Implementing tooltip showing and dat.GUI section opening
        // ...
    }

    onObjectDoubleClicked = (object: THREE.Object3D) => {
        this.sceneController.panCameraTo(object);
    }
}
