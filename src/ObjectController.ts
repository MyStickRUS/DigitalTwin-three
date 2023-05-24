import * as THREE from 'three';
import { GUI, GUIController } from 'dat.gui';

interface Position {
    x: number;
    y: number;
    z: number;
}

export class ObjectController {
    private gui: GUI;
    private target: THREE.Object3D | null = null;

    private controllers: GUIController[] = [];

    constructor() {
        this.gui = new GUI();
    }

    setTarget(target: THREE.Object3D | null) {
        if(!!target) {
            this.clearControllers();
        }

        this.target = target;

        this.showControllers()
    }

    private clearControllers = () => {
        for (let i = 0; i< this.controllers.length; ++i) {
            this.controllers[i].remove();
        }

        this.controllers = [];
    }

    private showControllers = () => {
        if(!this.target) {
            return;
        }

        const posMin = -20;
        const posMax = 20;
        const posStep = 0.01;

    
        const controllers = [
            this.gui.add(this.target.position, 'x', posMin, posMax, posStep),
            this.gui.add(this.target.position, 'y', posMin, posMax, posStep),
            this.gui.add(this.target.position, 'z', posMin, posMax, posStep),
        ]

        this.controllers.push(...controllers);
    }

}
