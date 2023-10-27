import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BOUNDING_BOXES } from "./objects";

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { getAnnotationIdByFileName } from "./Utils";

// Initialize Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

const SCENE_MODEL_FILENAME = "Zavod_v5_compressed.glb";
const SCENE_U_ANIMATE_MATERIAL_NAMES = ['Wire', 'Tube'];
const SCENE_U_ANIMATION_SPEED = 0.003;
const SCENE_SCALE = 0.15;

export class ObjectController {
    generateAnnotations() {
        BOUNDING_BOXES.forEach((box) => {
            const status = box.annotation.type;

            const div = document.createElement("div");
            div.classList.add("annotation");
            div.classList.add("m-auto");
            div.classList.add("d-flex");
            div.classList.add(status);
            div.id = getAnnotationIdByFileName(box.fileName);

            if (status === "red") {
                const span = document.createElement("span");

                span.innerText = "!";
                div.appendChild(span);
            }

            document.body.appendChild(div);
        });
    }

    loadGlbFactory(scene: THREE.Scene) {
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader)

        loader.load(
            SCENE_MODEL_FILENAME,
            (gltf) => {
                const model = gltf.scene;
                console.log(gltf.scene);
                model.position.set(0, 0, 0);
                model.userData.isClickable = false;
                model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE)
                
                //Shadows enable
                gltf.scene.traverse ( function ( child )
                    {
                        if ( child.name != 'Grid' && child.name != 'Scheme' && child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                        if(child.name === 'Floor' && child instanceof THREE.Mesh) {
                            const shadMaterial = new THREE.ShadowMaterial();
                            shadMaterial.opacity = 0.4;
                            child.material = shadMaterial
                        }
                         if(child.name === 'Scheme' && child instanceof THREE.Mesh) {
                            const schemeMaterial = new THREE.MeshBasicMaterial({color: 0xff868a});
                            schemeMaterial.transparent = true;
                            schemeMaterial.opacity = 0.5;
                            child.material = schemeMaterial
                        }
                        
                    });
                scene.add(model);
                this.animateMaterialsOffset(scene);

                // Animation handling
                if (gltf.animations && gltf.animations.length) {
                    const mixer = new THREE.AnimationMixer(model);
                    for (let i = 0; i < gltf.animations.length; i++) {
                        const animation = gltf.animations[i];
                        mixer.clipAction(animation).play();
                    }

                    // Update the mixer on every frame
                    scene.userData.animationMixers = scene.userData.animationMixers || [];
                    scene.userData.animationMixers.push(mixer);
                    
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => console.error("An error occurred while loading the model:", error)
        );
    }

    private animateMaterialsOffset(object: THREE.Scene) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                if (SCENE_U_ANIMATE_MATERIAL_NAMES.includes(child.material.name)) {
                    if (child.material.map) {
                        // Setting the initial offset
                        child.material.map.offset.set(0, 0);
    
                        // Creating an animation
                        let animateOffset = function() {
                            child.material.map.offset.x += SCENE_U_ANIMATION_SPEED;
                            
                            // Reset offset if it goes beyond 1 for continuous motion
                            if (child.material.map.offset.x > 1) {
                                child.material.map.offset.x -= 1;
                            }
                            requestAnimationFrame(animateOffset);
                        };
    
                        animateOffset();
                    }
                }
            }
        });
    }

    loadBoundingBoxes(scene: THREE.Scene) {
        const loader = new GLTFLoader();
        const res: THREE.Group[] = [];
        const transparentMaterial = new THREE.MeshStandardMaterial({ color: "black", opacity: 0.0, transparent: true });

        BOUNDING_BOXES.forEach((obj) => {
            loader.load(
                obj.fileName,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, 0);
                    model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE)
                    model.userData.isClickable = true;
                    model.visible = false;
                    Object.assign(model.userData, obj);
                    model.traverse((child) => {
                        if ("material" in child) {
                            child.material = transparentMaterial;
                        }
                    });
                    scene.add(model);
                    model.parent?.updateMatrixWorld();
                    res.push(model);
                },
                undefined,
                (error) => console.error("An error occurred while loading the model:", error)
            );
        });
        return res;
    }

    isObjectBoundingBox(obj: THREE.Object3D): boolean {
        return BOUNDING_BOXES.map(b => b.fileName.split('.')[0]).includes(obj.userData.name);
    }
}
