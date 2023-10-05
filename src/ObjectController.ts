import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BOUNDING_BOXES } from "./objects";

const SCENE_MODEL_FILENAME = "Zavod_v3.glb";

export class ObjectController {
    generateAnnotations() {
        BOUNDING_BOXES.forEach((box) => {
            const cls = box.annotation.type;

            const div = document.createElement("div");
            div.classList.add("annotation");
            div.classList.add(cls);
            div.id = `${box.fileName}-annotation`;

            if (cls === "red") {
                const span = document.createElement("span");
                span.style.display = "flex";
                span.style.justifyContent = "center";

                span.innerText = "!";
                div.appendChild(span);
            }

            document.body.appendChild(div);
        });
    }

    loadGlbFactory(scene: THREE.Scene) {
        const loader = new GLTFLoader();

        loader.load(
            SCENE_MODEL_FILENAME,
            (gltf) => {
                const model = gltf.scene;
                console.log(gltf.scene);
                model.position.set(0, 0, 0);
                model.userData.isClickable = false;
                scene.add(model);

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

    addBoundingBoxes(scene: THREE.Scene) {
        const loader = new GLTFLoader();
        const res: THREE.Group[] = [];
        const transparentMaterial = new THREE.MeshStandardMaterial({ color: "black", opacity: 0.1, transparent: true });

        BOUNDING_BOXES.forEach((obj) => {
            loader.load(
                obj.fileName,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, 0);
                    model.userData.isClickable = true;
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

    static isObjectBoundingBox(obj: THREE.Object3D): boolean {
        return BOUNDING_BOXES.map(b => b.fileName.split('.')[0]).includes(obj.userData.name);
    }
}
