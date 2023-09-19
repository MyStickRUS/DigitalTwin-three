import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import { SCENE_OBJECTS } from './objects';
import gsap from 'gsap';
import { getHtmlTooltip, updateHtmlTooltipContent } from './Tooltip';

const CAMERA_DEFAULT_POSITION = {
    x: 20,
    y: 20,
    z: 20
}

const CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS = 3;

const TOOLTIP_UPDATE_INTERVAL_MS = 1000;
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

    htmlTooltip: HTMLDivElement;
    htmlTooltipSrc: string = 'Error loading tooltip';
    htmlTooltipUpdateInterval: number | null = null;

    annotationSprites: THREE.Sprite[] = [];

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

        this.camera = this.getCamera(CAMERA_DEFAULT_POSITION)
        this.controls = this.setupControls();

        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onClick, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('dblclick', this.onDoubleClick, false);

        this.htmlTooltip = getHtmlTooltip();
        setInterval(() => updateHtmlTooltipContent(this.htmlTooltip), TOOLTIP_UPDATE_INTERVAL_MS);

        this.mainPlane = this.addPlane();
        this.addObjects();
        this.animate();
    }

    setupControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;

        return controls;
    }

    findCursorIntersectingObjects() {
        return this.raycaster
            .intersectObjects(this.scene.children, true)
            .filter((int) => int.object !== this.mainPlane);
    }

    onClick = (event: MouseEvent) => {
        event.preventDefault();

        this.objectController.setTarget(this.mousePointedObject);

        if(this.mousePointedObject) {
            this.tooltippedObject = this.mousePointedObject;
        }

        if(this.mousePointedObject) {
            const {x, y, z} = new THREE.Vector3().copy(this.mousePointedObject.position).add(new THREE.Vector3(0, 5, 10));
            
            gsap.to(this.camera.position, {x, y, z, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
            gsap.to(this.controls.target, {...this.mousePointedObject.position, duration: 3});
            
            this.controls.update();
        }

        this.showHtmlTooltip();
    };

    onDoubleClick = (event: MouseEvent) => {
        event.preventDefault();
    
        if(!this.mousePointedObject) {
            gsap.to(this.camera.position, {...CAMERA_DEFAULT_POSITION, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
        }
    };

    onWindowResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
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

        this.highlightPointedAnnotation();
    };

    highlightPointedAnnotation() {
        if (this.mousePointedObject?.userData.isAnnotation && this.mousePointedObject instanceof THREE.Sprite) {
            this.mousePointedObject.material.color.set(0x0000ff);
            return;
        }
        
        if (this.mousePointedObject?.userData.annotationSprite) {
            this.mousePointedObject.userData.annotationSprite.material.color.set(0x0000ff);
            return;
        }

        this.annotationSprites.forEach(s => s.material.color.set(0xffffff));
    }

    addObjects = () => {
        SCENE_OBJECTS.forEach(obj => {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.setY(this.defaultObjectYPosition);
            cube.position.setX(obj.xPos)
            cube.position.setZ(obj.zPos)

            this.scene.add(cube);

            const annotationSprite = this.objectController.generateAnnotationTexture(1);

            annotationSprite.position.set(0, cube.geometry.parameters.height / 2, 0);
            annotationSprite.scale.set(1, 1, 1);
    
            cube.add(annotationSprite);
            cube.userData.annotationSprite = annotationSprite;
            annotationSprite.userData.isAnnotation = true;
            this.annotationSprites.push(annotationSprite)
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

    onMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        // Update the mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.findCursorIntersectingObjects()

        this.mousePointedObject = intersects[0]?.object;
    }

    getCamera = (position: typeof CAMERA_DEFAULT_POSITION) => {
        const camera = new THREE.PerspectiveCamera(45, this.cameraAspect, 1, 1000)
        camera.position.set(position.x, position.y, position.z);

        return camera;
    }

    showHtmlTooltip = () => {
        this.htmlTooltip.hidden = false;
    }

}
