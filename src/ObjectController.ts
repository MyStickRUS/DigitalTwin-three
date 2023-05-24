// src/ObjectController.ts
import * as THREE from 'three';
import { GUI } from 'dat.gui';

interface Position {
    x: number;
    y: number;
    z: number;
}

export class ObjectController {
    private gui: GUI;
    private target: THREE.Object3D | null = null;
    private position: Position = { x: 0, y: 0, z: 0 };

    constructor() {
        this.gui = new GUI();
        this.gui.add(this.position, 'x').listen().onChange(this.updateTargetPosition);
        this.gui.add(this.position, 'y').listen().onChange(this.updateTargetPosition);
        this.gui.add(this.position, 'z').listen().onChange(this.updateTargetPosition);
    }

    setTarget(target: THREE.Object3D | null) {
        this.target = target;

        if (target) {
            this.position.x = target.position.x;
            this.position.y = target.position.y;
            this.position.z = target.position.z;
        }
    }

    private updateTargetPosition = () => {
        if (this.target) {
            this.target.position.x = this.position.x;
            this.target.position.y = this.position.y;
            this.target.position.z = this.position.z;
        }
    };
}
