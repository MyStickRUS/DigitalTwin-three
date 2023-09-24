import * as THREE from 'three';
import { GUI, GUIController } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type SceneObject = {
    fileName: string,
    cameraPosition: Coordinates,
    annotationPosition: Coordinates
}

interface Coordinates {
    x: number,
    y: number,
    z: number,
}

const BOUNDING_BOXES: SceneObject[] = [
    {
        fileName: '01.glb',
        cameraPosition: {
            x: 6.5,
            y: 3.5,
            z: 16,
        },
        annotationPosition: {x: 1.7658803264766725, y: 1.5499998331069982, z: 12.087477606483148}
    },
    {
        fileName: '02.glb',
        cameraPosition: {
            x: 1,
            y: 3.5,
            z: 18.5,
        },
        annotationPosition: {x: -2.7750866375646144, y: 1.412572919126717, z: 12.202375411987305}
    },
    {
        fileName: '03.glb',
        cameraPosition: {
            x: -7.5,
            y: 4.5,
            z: 17,
        },
        annotationPosition: {x: -11.250720977783205, y: 1.8449593975044962, z: 13.014999526387424}
    },
    {
        fileName: '04.glb',
        cameraPosition: {
            x: -7.5,
            y: 2.5,
            z: 9.5,
        },
        annotationPosition: {x: -11.72751978706721, y: 1.369999885559082, z: 6.945446020583546}
    },
    {
        fileName: '05.glb',
        cameraPosition: {
            x: -4.5,
            y: 9,
            z: 10.5,
        },
        annotationPosition: {x: -10.903325418032312, y: 2.4440106147665226, z: 1.748719136415069}
    },
    {
        fileName: '06.glb',
        cameraPosition: {
            x: -2.5,
            y: 7,
            z: 0,
        },
        annotationPosition: {x: -10.190260049842914, y: 2.731184989639609, z: -4.920000076293945}
    },
    {
        fileName: '07.glb',
        cameraPosition: {
            x: -3.5,
            y: 15,
            z: 2,
        },
        annotationPosition: {x: -8.887441635131838, y: 8.213585219913078, z: -7.417965260923289}
    },
    {
        fileName: '08.glb',
        cameraPosition: {
            x: -2.5,
            y: 7.5,
            z: -2.5,
        },
        annotationPosition: {x: -8.66512438166719, y: 4.263289826248133, z: -8.393738746643066}
    },
    {
        fileName: '09.glb',
        cameraPosition: {
            x: -2.5,
            y: 4,
            z: -7.5,
        },
        annotationPosition: {x: -8.419270338994462, y: 1.600000023841858, z: -12.896779986304836}
    },
    {
        fileName: '10.glb',
        cameraPosition: {
            x: 0,
            y: 4.5,
            z: -4.5,
        },
        annotationPosition: {x: -3.3676969579533154, y: 1.540284932311117, z: -8.035249710083008}
    },
    {
        fileName: '11.glb',
        cameraPosition: {
            x: 6.5,
            y: 4.5,
            z: -2.5,
        },
        annotationPosition: {x: 2.4365751282808965, y: 2.5701724218052178, z: -8.486614227294929}
    },
    {
        fileName: '12.glb',
        cameraPosition: {
            x: 10,
            y: 4,
            z: -5.5,
        },
        annotationPosition: {x: 8.08342431665805, y: 1.33854403235717, z: -8.035249710083008}
    },
    {
        fileName: '13.glb',
        cameraPosition: {
            x: 23.5,
            y: 4,
            z: 9.5,
        },
        annotationPosition: {x: 18.31440051123633, y: 0.9086602403226962, z: 4.3585557937622}
    },
    {
        fileName: '14.glb',
        cameraPosition: {
            x: 23.5,
            y: 6.5,
            z: 0,
        },
        annotationPosition: {x: 18.015738643135673, y: 3.220761165885927, z: -5.489129066467285}
    },
    {
        fileName: '15.glb',
        cameraPosition: {
            x: 28,
            y: 6.5,
            z: 2,
        },
        annotationPosition: {x: 20.70567371746629, y: 0.8496483235902446, z: -6.751444339752197}
    },
    {
        fileName: '16.glb',
        cameraPosition: {
            x: 6.5,
            y: 2.5,
            z: 6.5,
        },
        annotationPosition: {x: 3.6088594628314645, y: 1.3102364320540687, z: 3.517393112182617}
    },
];

export class ObjectController {
    generateAnnotation(scene: THREE.Scene) {
        BOUNDING_BOXES.forEach(box => {
            const annotationSprite = generateAnnotationTexture(box.fileName.split('.')[0]);

            const {x, y, z} = box.annotationPosition
            annotationSprite.position.set(x, y, z);
            annotationSprite.scale.set(2, 2, 2);

            scene.add(annotationSprite);
        })
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
        const res: THREE.Group[] = [];
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
                    res.push(model)
                },
                undefined,
                (error) => console.error('An error occurred while loading the model:', error)
            )
        })
        // TODO: this returns immediately, but loader.load is async
        return res;
    }
}

function generateAnnotationTexture(number: string): THREE.Sprite {
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
