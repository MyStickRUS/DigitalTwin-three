import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
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
    debug = true;
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

    frustumSize: number = 10;
    defaultObjectYPosition: number = 0.5;

    htmlTooltip: HTMLDivElement;
    htmlTooltipSrc: string = 'Error loading tooltip';
    htmlTooltipUpdateInterval: number | null = null;

    annotationSprites: THREE.Sprite[] = [];

    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xfafafa);

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

        this.objectController.addFactory(this.scene);
        this.objectController.addBoundingBoxes(this.scene);
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
    }

    onClick = (event: MouseEvent) => {
        event.preventDefault();

        if(this.debug) {
            console.log(
                this.raycaster.intersectObjects(this.scene.children.filter(obj => obj.userData.isClickable))
            )
        }

        if(!this.mousePointedObject) {
            return
        }
        
        this.tooltippedObject = this.mousePointedObject;
        debugger;
        const {x, y, z} = new THREE.Vector3().copy(this.mousePointedObject.position).add(new THREE.Vector3(0, 5, 10));

        gsap.to(this.camera.position, {x, y, z, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
        gsap.to(this.controls.target, {...this.mousePointedObject.position, duration: 3});

        this.controls.update();
        this.showHtmlTooltip();
    };

    onDoubleClick = (event: MouseEvent) => {
        event.preventDefault();

        if(!this.mousePointedObject) {
            this.hideHtmlTooltip();

            return gsap.to(this.camera.position, {...CAMERA_DEFAULT_POSITION, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
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

    onMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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

    hideHtmlTooltip = () => {
        this.htmlTooltip.hidden = true;
    }

}
