import * as THREE from 'three';
import { GUI, GUIController } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type SceneObject = {
    xPos: number,
    zPos: number,
    fileName: string,
}

const boundingBoxesFileNames = ["01.glb", "02.glb", "03.glb", "04.glb", "05.glb", "06.glb", "07.glb", "08.glb", "09.glb", "10.glb", "11.glb", "12.glb", "13.glb", "14.glb", "15.glb", "16.glb"];


export const SCENE_OBJECTS: SceneObject[] = [
    {
        xPos: -12.4,
        zPos: -0.538,
        fileName: '05.glb'
    }

];

interface Position {
    x: number;
    y: number;
    z: number;
}

export class ObjectController {
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
    }

    addFactory (scene: THREE.Scene) {
        const loader = new GLTFLoader();

        loader.load(
            `Zavod.glb`,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, 0, 0);
                model.userData.isClickable = false;
                scene.add(model);
            },
            undefined,  // onProgress can be used for loading progress
            (error) => console.error('An error occurred while loading the model:', error)
        )
    };

    addBoundingBoxes(scene: THREE.Scene) {
        const loader = new GLTFLoader();

        const transparentMaterial = new THREE.MeshStandardMaterial({ color: 'black', opacity: 0.1, transparent: true });

        boundingBoxesFileNames.forEach(fileName => {
            loader.load(
                fileName,
                (gltf) => {
                    const model = gltf.scene;
                    // model.position.set(obj.xPos, 0, obj.zPos);
                    model.position.set(0, 0, 0)
                    model.userData.isClickable = true;
                    model.traverse((child) => {
                        if ('material' in child) {
                            child.material = transparentMaterial;
                        }
                    });
                    scene.add(model);
                },
                undefined,  // onProgress can be used for loading progress
                (error) => console.error('An error occurred while loading the model:', error)
            )
        })
    }
}
