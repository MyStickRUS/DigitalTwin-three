import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class SceneController {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    frustumSize: number = 10;

    constructor() {
        // Create scene
        this.scene = new THREE.Scene();

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            this.frustumSize * aspect / - 2, 
            this.frustumSize * aspect / 2, 
            this.frustumSize / 2, 
            this.frustumSize / - 2, 
            0.1, 
            1000
        );

        // Position camera and tilt it 45 degrees
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.z = -Math.PI / 4;  // Tilt 45 degrees

        // Setup orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
        this.controls.enableRotate = false;  // Disable rotation
        this.controls.enablePan = true;  // Enable panning

        // Add resize event listener
        window.addEventListener('resize', this.onWindowResize, false);

        this.addPlane();
        this.addObjects();
        this.animate();
    }

    onWindowResize = () => {
        const aspect = window.innerWidth / window.innerHeight;

        // Update camera
        this.camera.left = (this.frustumSize * aspect) / -2;
        this.camera.right = (this.frustumSize * aspect) / 2;
        this.camera.top = this.frustumSize / 2;
        this.camera.bottom = this.frustumSize / -2;
        // ...
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.camera.aspect = window.innerWidth / window.innerHeight;
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
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }

    addPlane = () => {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);
    }
}
