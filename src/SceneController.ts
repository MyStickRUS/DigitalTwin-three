import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import gsap from 'gsap';
import { generateTooltipTable, getHtmlTooltip } from './Tooltip';
import { GUI } from 'dat.gui';

const IS_DEBUG = true;
const CAMERA_DEFAULT_POSITION = {
    x: 15,
    y: 27.5,
    z: 40
}

const CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS = 1;

export class SceneController {
    debug = IS_DEBUG;

    /**THREE.Scene & Partial<{userData?: any[]}> */
    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;
    cameraAspect: number = window.innerWidth / window.innerHeight;

    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mouse: THREE.Vector2;
    objectController: ObjectController;
    raycaster: THREE.Raycaster;

    clock: THREE.Clock;

    mousePointedObject: THREE.Object3D | null = null;
    tooltippedObject: THREE.Object3D | null = null;

    frustumSize: number = 10;
    defaultObjectYPosition: number = 0.5;

    htmlTooltip: HTMLDivElement;
    htmlTooltipSrc: string = 'Error loading tooltip';
    htmlTooltipUpdateIntervals: number[] = [];

    boundingBoxes: any[];

    annotationSprites: THREE.Sprite[] = [];

    annotationsRendered = false;

    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('lightgray');
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
        this.scene.add( directionalLight );

        // Initialize ObjectController
        this.objectController = new ObjectController();

        // Initialize raycaster and mouse vector
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.clock = new THREE.Clock();

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

        this.objectController.loadGlbFactory(this.scene);
        this.boundingBoxes = this.objectController.addBoundingBoxes(this.scene);
        this.animate();

        if(this.debug) {
            this.addCameraControl();
        }
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
    
        const closestIntersection = this.raycaster.intersectObjects(this.scene.children.filter(obj => obj.userData.isClickable))[0]
        closestIntersection && console.log('intersection object', closestIntersection)
        closestIntersection?.object?.userData && console.log('object userdata', closestIntersection?.object?.userData)
        closestIntersection?.point && console.log('point', closestIntersection?.point)
    
        if(!this.mousePointedObject) {
            return
        }
        
        this.tooltippedObject = this.mousePointedObject;
    
        if (closestIntersection) {
            gsap.to(this.camera.position, {
                x: closestIntersection.object.parent?.userData.cameraPosition.x,
                y: closestIntersection.object.parent?.userData.cameraPosition.y,
                z: closestIntersection.object.parent?.userData.cameraPosition.z,
                duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS
            });
        
            // // Move the camera's look-at target to the object's position
            gsap.to(this.controls.target, {
                x: closestIntersection.point.x,
                y: closestIntersection.point.y,
                z: closestIntersection.point.z,
                duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS
            });
        }

        if (closestIntersection && closestIntersection.object?.parent?.userData?.data) {
            const {displayName, data } = closestIntersection.object?.parent?.userData;
            this.updateTooltipWithTableData(displayName, data);
            this.showHtmlTooltip();
        }

        this.controls.update();
    };
    

    addCameraControl() {
        const gui = new GUI();

        gui.add( this.camera.position , 'x', -50, 50 ).step(0.5).listen()
        gui.add( this.camera.position , 'y', 0, 50 ).step(0.5).listen()
        gui.add( this.camera.position , 'z', -50, 50 ).step(0.5).listen()
    }

    onDoubleClick = (event: MouseEvent) => {
        event.preventDefault();

        if(this.mousePointedObject && !ObjectController.isObjectBoundingBox(this.mousePointedObject)) {
            this.hideHtmlTooltip();

            gsap.to(this.camera.position, {...CAMERA_DEFAULT_POSITION, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
            return gsap.to(this.controls.target, {...this.scene.position, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
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

        positionAnnotations(this.boundingBoxes, this.camera);

        if(!this.annotationsRendered) {
            this.objectController.generateAnnotations();
            this.annotationsRendered = true;
        }

        const delta = this.clock.getDelta();
        for (const mixer of this.scene.userData.animationMixers) {
            mixer.update(delta);
        }
    };

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
        camera.fov = 35;

        camera.updateProjectionMatrix();
        return camera;
    }

    showHtmlTooltip = () => {
        this.htmlTooltip.hidden = false;
    }

    hideHtmlTooltip = () => {
        this.htmlTooltip.hidden = true;
    }

    updateTooltipWithTableData(displayName: string, data: any) {
        // Clear current tooltip content
        while (this.htmlTooltip.firstChild) {
            this.htmlTooltip.removeChild(this.htmlTooltip.firstChild);
        }
    
        // Add the generated table to the tooltip
        const [tableElement, updateTimeouts] = generateTooltipTable(displayName, data); 
        this.htmlTooltip.appendChild(tableElement);
        this.htmlTooltipUpdateIntervals.forEach(clearInterval);
        this.htmlTooltipUpdateIntervals = updateTimeouts;
    }

}

function getScreenPosition(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
    var width = window.innerWidth, height = window.innerHeight;
    var widthHalf = width / 2, heightHalf = height / 2;
    
    const {x, y, z} = object.userData.annotation;

    var pos = new THREE.Vector3(x, y, z);
    pos.project(camera);
    pos.x = ( pos.x * widthHalf ) + widthHalf;
    pos.y = -( pos.y * heightHalf ) + heightHalf;

    return pos;
}

function positionAnnotations(boxes: THREE.Group[], camera: THREE.PerspectiveCamera) {
    boxes.forEach(box => {
        const pos = getScreenPosition(box, camera);
        const annotation = document.getElementById(`${box.userData.fileName}-annotation`);

        if(!annotation) return;

        annotation.style.left = `${pos.x}px`;
        annotation.style.top = `${pos.y}px`;
        annotation.style.display = 'block';
    });
}
