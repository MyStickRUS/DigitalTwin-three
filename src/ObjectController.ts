import * as THREE from 'three';
import { GUI, GUIController } from 'dat.gui';
import { SceneObject } from './objects';

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
        if(!target) {
            return;
        }

        this.clearControllers();

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

    generateAnnotationTexture(number: number): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
    
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("Failed to get 2D context for annotation texture generation.");
        }
    
        // Draw circle
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#000000';
        context.stroke();
    
        // Draw number inside the circle
        context.font = '60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.fillText(number.toString(), canvas.width / 2, canvas.height / 2);
    
        const texture = new THREE.CanvasTexture(canvas);
    
        const annotationMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false});
        return new THREE.Sprite(annotationMaterial);

        // Adjust these values based on your desired offset and scale

    }
    

    createMarker(model: SceneObject, position: THREE.Vector3) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "";
        const map = loader.load("https://i.imgur.com/EZynrrA.png");
        map.encoding = THREE.sRGBEncoding
        
        const spriteMaterialFront = new THREE.SpriteMaterial( { map } );
        
        const spriteFront = new THREE.Sprite( spriteMaterialFront );
        spriteFront.position.copy(position) 
        
        const spriteMaterialRear = new THREE.SpriteMaterial({ 
            map,
            opacity: 0.3, 
            transparent: true, 
            depthTest: false
        });
        
        const spriteRear = new THREE.Sprite( spriteMaterialRear );
        spriteRear.position.copy(position) 
        
        // model.add(spriteFront, spriteRear)
    }

}
