import * as THREE from 'three';
import { GUI, GUIController } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type SceneObject = {
    fileName: string,
    cameraPosition: {
        x: number,
        y: number,
        z: number,
    }
}

const BOUNDING_BOXES: SceneObject[] = [
    {
        fileName: '01.glb',
        cameraPosition: {
            x: 6.5,
            y: 3.5,
            z: 16,
        }
    },
    {
        fileName: '02.glb',
        cameraPosition: {
            x: 1,
            y: 3.5,
            z: 18.5,
        }
    },
    {
        fileName: '03.glb',
        cameraPosition: {
            x: -7.5,
            y: 4.5,
            z: 17,
        }
    },
    {
        fileName: '04.glb',
        cameraPosition: {
            x: -7.5,
            y: 2.5,
            z: 9.5,
        }
    },
    {
        fileName: '05.glb',
        cameraPosition: {
            x: -4.5,
            y: 9,
            z: 10.5,
        }
    },
    {
        fileName: '06.glb',
        cameraPosition: {
            x: -2.5,
            y: 7,
            z: 0,
        }
    },
    {
        fileName: '07.glb',
        cameraPosition: {
            x: -3.5,
            y: 15,
            z: 2,
        }
    },
    {
        fileName: '08.glb',
        cameraPosition: {
            x: -2.5,
            y: 7.5,
            z: -2.5,
        }
    },
    {
        fileName: '09.glb',
        cameraPosition: {
            x: -2.5,
            y: 4,
            z: -7.5,
        }
    },
    {
        fileName: '10.glb',
        cameraPosition: {
            x: 0,
            y: 4.5,
            z: -4.5,
        }
    },
    {
        fileName: '11.glb',
        cameraPosition: {
            x: 6.5,
            y: 4.5,
            z: -2.5,
        }
    },
    {
        fileName: '12.glb',
        cameraPosition: {
            x: 10,
            y: 4,
            z: -5.5,
        }
    },
    {
        fileName: '13.glb',
        cameraPosition: {
            x: 23.5,
            y: 4,
            z: 9.5,
        }
    },
    {
        fileName: '14.glb',
        cameraPosition: {
            x: 23.5,
            y: 6.5,
            z: 0,
        }
    },
    {
        fileName: '15.glb',
        cameraPosition: {
            x: 28,
            y: 6.5,
            z: 2,
        }
    },
    {
        fileName: '16.glb',
        cameraPosition: {
            x: 6.5,
            y: 2.5,
            z: 6.5,
        }
    },
];

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
            undefined,
            (error) => console.error('An error occurred while loading the model:', error)
        )
    };

    addBoundingBoxes(scene: THREE.Scene) {
        const loader = new GLTFLoader();

        const transparentMaterial = new THREE.MeshStandardMaterial({ color: 'black', opacity: 0.1, transparent: true });

        BOUNDING_BOXES.forEach(obj => {
            loader.load(
                obj.fileName,
                (gltf) => {
                    const model = gltf.scene;
                    // model.position.set(obj.xPos, 0, obj.zPos);
                    model.position.set(0, 0, 0)
                    model.userData.isClickable = true;
                    Object.assign(model.userData, obj)
                    model.traverse((child) => {
                        if ('material' in child) {
                            child.material = transparentMaterial;
                        }
                    });
                    scene.add(model);
                    model.parent?.updateMatrixWorld()
                },
                undefined,
                (error) => console.error('An error occurred while loading the model:', error)
            )
        })
    }
}
