import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import { SCENE_OBJECTS } from './objects';
import { Tooltip } from './Tooltip';
import gsap from 'gsap';

export class SceneController {
    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;
    cameraAspect: number = window.innerWidth / window.innerHeight;

    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mouse: THREE.Vector2;
    objectController: ObjectController;
    raycaster: THREE.Raycaster;

    mousePointedObject: THREE.Object3D | null = null;
    tooltippedObject: THREE.Object3D | null = null;

    mainPlane: THREE.Mesh;

    frustumSize: number = 10;
    defaultObjectYPosition: number = 0.5;

    tooltip: Tooltip | null = null;
    tooltipUpdateInterval: number | null = null;

    htmlTooltip: HTMLDivElement;
    htmlTooltipSrc: string = 'Error loading tooltip';
    htmlTooltipUpdateInterval: number | null = null;

    constructor() {
        // Create scene
        this.scene = new THREE.Scene();

        // Initialize ObjectController
        this.objectController = new ObjectController();

        // Initialize raycaster and mouse vector
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera = this.getCamera()

        // Position camera
        this.camera.position.set(20, 20, 20);

        // Setup orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
        this.controls.enableRotate = true;  // Enable rotation
        this.controls.enablePan = true;  // Enable panning
        this.controls.target.set(0, 0, 0);
        this.controls.enableDamping = true;

        // Add resize and click event listeners
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onClick, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('dblclick', this.onDoubleClick, false);

        const htmlTooltip = document.querySelector("div#tooltip");

        if(!htmlTooltip || !(htmlTooltip instanceof HTMLDivElement)) {
            throw new Error("Tooltip element not found")
        }

        this.htmlTooltip = htmlTooltip;
        this.updateHtmlTooltipContent();

        this.mainPlane = this.addPlane();
        this.addObjects();
        this.animate();
    }

    onDoubleClick = (event: MouseEvent) => {
        event.preventDefault();
    
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        // Calculate objects intersecting the picking ray, excluding the main plane
        const intersects = this.raycaster
            .intersectObjects(this.scene.children, true)
            .filter((int) => int.object !== this.mainPlane);
    
        // If we have an intersection
        if (intersects.length > 0) {
            const closestObject = intersects[0].object;
    
            // Set the orbit control's target to the clicked object's position
            // this.controls.target.copy(closestObject.position);
            
            // Create a new desired camera position: a bit offset from the object's position
            const {x, y, z} = new THREE.Vector3().copy(closestObject.position).add(new THREE.Vector3(0, 5, 10));
            
            gsap.to(this.camera.position, {x, y, z, duration: 3});
            gsap.to(this.controls.target, {...closestObject.position, duration: 3});
            
            // Update the controls
            this.controls.update();
        } else {
            // default position
            const defPos = {x: 20, y: 20, z: 20};
            gsap.to(this.camera.position, {...defPos, duration: 3});
        }
    };
    

    onWindowResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    panCameraTo = (object: THREE.Object3D) => {
        // Implementing smooth panning to the object
        // ...
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        if (this.tooltippedObject) {
            let vector = new THREE.Vector3();
            vector.setFromMatrixPosition(this.tooltippedObject.matrixWorld);
            vector.project(this.camera);

            vector.x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            vector.y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

            let offsetx = this.htmlTooltip.offsetWidth / 2;
            let offsetY = this.htmlTooltip.offsetHeight * 1.5;

            this.htmlTooltip.style.left = `${vector.x - offsetx}px`;
            this.htmlTooltip.style.top = `${vector.y - offsetY}px`;
        }
    };

    addObjects = () => {
        SCENE_OBJECTS.forEach(obj => {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.setY(this.defaultObjectYPosition);
            cube.position.setX(obj.xPos)
            cube.position.setZ(obj.zPos)

            this.scene.add(cube);
        });
    }

    addPlane = () => {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2;  // Tilt the plane 45 degrees

        this.scene.add(plane);

        return plane;
    }

    onClick = (event: MouseEvent) => {
        event.preventDefault();

        this.objectController.setTarget(this.mousePointedObject);

        if(this.mousePointedObject) {
            this.tooltippedObject = this.mousePointedObject;
        }

        this.showHtmlTooltip();
    };

    onMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        // Update the mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray, excluding the main pane
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)
            .filter(int => int.object !== this.mainPlane);

        this.mousePointedObject = intersects[0]?.object;
    }

    getCamera = () => {
        return new THREE.PerspectiveCamera(45, this.cameraAspect, 1, 1000)
    }

    showTooltip = () => {
        if (!this.mousePointedObject) {
            return;
        }


        if (this.tooltip) {
            this.scene.remove(this.tooltip);
        }

        this.tooltip = new Tooltip(`Temp: ${Math.round(Math.random() * 100)}`);
        this.tooltip.position.copy(this.mousePointedObject.position).add(new THREE.Vector3(0, this.mousePointedObject.scale.y, 0));
        this.scene.add(this.tooltip);

        this.tooltippedObject = this.mousePointedObject;

        if (this.tooltipUpdateInterval) {
            clearInterval(this.tooltipUpdateInterval);
        }

        this.tooltipUpdateInterval = setInterval(() => {
            this.tooltip?.setText(`Temp: ${Math.round(Math.random() * 100)}`);
        }, 1000);
    }

    showHtmlTooltip = () => {
        this.htmlTooltip.hidden = false;
    }

    updateHtmlTooltipContent() {
        if (!this.htmlTooltip) {
            return;
        }

        const tooltip = this.htmlTooltip;

        const cb = () => {
            [
                [tooltip.querySelector('#tooltipEnergyMetric'), 10],
                [tooltip.querySelector('#tooltipHeatMetric'), 5],
                [tooltip.querySelector('#tooltipSteamMetric'), 1],
            ].forEach(payload => {
                const el = payload[0];
                if (!el) return;

                const multiplier = payload[1] as number;

                (el as Element).innerHTML = Math.floor(Math.random() * 1000 * multiplier).toString();
            })
        }

        setInterval(cb, 1000);
    }
}
