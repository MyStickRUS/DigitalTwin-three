import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import { SCENE_OBJECTS } from './objects';

export class SceneController {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mouse: THREE.Vector2;
    objectController: ObjectController;
    raycaster: THREE.Raycaster;
    
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
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            this.frustumSize * aspect / - 2, 
            this.frustumSize * aspect / 2, 
            this.frustumSize / 2, 
            this.frustumSize / - 2, 
            0.1, 
            1000
        );

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
    }

    onClick = (event: MouseEvent) => {
        event.preventDefault();
    
        // Update the mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
    
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
        for (let i = 0; i < intersects.length; i++) {
          const object = intersects[i].object;
          if (object instanceof THREE.Mesh && !(object.geometry instanceof THREE.PlaneGeometry)) {
            console.log(object);
            this.objectController.setTarget(object);
            return;
          }
        }
    
        // If no object was selected, clear the current target
        this.objectController.setTarget(null);
      };
}
