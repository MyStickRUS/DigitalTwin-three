import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import { SCENE_OBJECTS } from './objects';

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

    mainPlane: THREE.Mesh;

    frustumSize: number = 10;
    defaultObjectYPosition: number = 0.5;

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
        this.controls.enableRotate = false;  // Disable rotation
        this.controls.enablePan = true;  // Enable panning
        this.controls.target.set(0, 0, 0);

        // Add resize and click event listeners
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onClick, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('dblclick', this.onDoubleClick, false);

        this.mainPlane = this.addPlane();
        this.addObjects();
        this.animate();
    }

    onDoubleClick = () => {
        throw new Error('Method not implemented.');
    }

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
}
