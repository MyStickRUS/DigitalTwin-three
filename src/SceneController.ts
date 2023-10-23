import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ObjectController } from './ObjectController';
import gsap from 'gsap';
import { generateTooltipTable, getHtmlTooltip } from './Tooltip';
import { GUI } from 'dat.gui';
import { getAnnotationScreenPosition, isUserAgentMobile } from './Utils';

const IS_DEBUG = false;
const SHOW_CAMERA_CONTROLS = false;
const CAMERA_INITIAL_POSITION = {
    x: 2,
    y: 6.5,
    z: 7.5
}
const LIGHT_MAP_SIZE = 2048;

const TOOLTIP_OFFSET_07 = 15; //px

const CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS = 1;

export class SceneController {
    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;
    cameraAspect: number = window.innerWidth / window.innerHeight;

    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mouse: THREE.Vector2;
    objectController: ObjectController;
    raycaster: THREE.Raycaster;
    cameraHelper?: THREE.CameraHelper

    clock: THREE.Clock;

    tooltippedObject: THREE.Object3D | null = null;

    frustumSize: number = 10;
    defaultObjectYPosition: number = 0.5;

    htmlTooltip: HTMLDivElement;
    htmlTooltipSrc: string = 'Error loading tooltip';
    htmlTooltipUpdateIntervals: number[] = [];

    boundingBoxes: any[];

    annotationSprites: THREE.Sprite[] = [];

    annotationsRendered = false;
    isCameraFlying = false;
    isCameraZoomedInToObject = false;

    isMobileUserAgent: boolean;

    constructor() {
        this.isMobileUserAgent = isUserAgentMobile();
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('lightgray');
        
        // Add Light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
        directionalLight.position.set (-10, 10, 10);
        directionalLight.castShadow = true;

        directionalLight.shadow.mapSize = new THREE.Vector2(LIGHT_MAP_SIZE, LIGHT_MAP_SIZE);
        directionalLight.shadow.camera.top = 4;
        directionalLight.shadow.camera.bottom = - 4;
        directionalLight.shadow.camera.left = - 4;
        directionalLight.shadow.camera.right = 4;
        directionalLight.shadow.camera.near = 0.5; // default
        directionalLight.shadow.camera.far = 50; // default

        this.scene.add( directionalLight );
        
        if(IS_DEBUG) {
            //Helper
            const shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
            this.cameraHelper = shadowHelper;
            this.scene.add( shadowHelper );
        }

        //Set Envmap
        const textureLoader = new THREE.TextureLoader();
        const textureEquirec = textureLoader.load( '3 Point Beige-min.png' );
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureEquirec.colorSpace = THREE.SRGBColorSpace;

        this.scene.environment = textureEquirec;

        // Initialize ObjectController
        this.objectController = new ObjectController();

        // Initialize raycaster and mouse vector
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.clock = new THREE.Clock();

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        if(!this.isMobileUserAgent) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        } 
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
        document.body.appendChild(this.renderer.domElement);

        this.camera = this.getCamera(CAMERA_INITIAL_POSITION)
        this.controls = this.setupControls();

        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('orientationchange', this.onWindowResize);
        window.addEventListener('click', this.onClick, false);
        window.addEventListener('dblclick', this.onDoubleClick, false);

        this.htmlTooltip = getHtmlTooltip();

        this.objectController.loadGlbFactory(this.scene);

        this.boundingBoxes = this.objectController.loadBoundingBoxes(this.scene);
        this.animate();

        if(SHOW_CAMERA_CONTROLS) {
            this.addCameraControl();
        }
    }

    private setupControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.mouseButtons = { RIGHT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, LEFT: THREE.MOUSE.ROTATE };
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.target.set(0, 0, 0);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.02
        controls.maxPolarAngle = Math.PI / 2 - 0.15

        // TODO: Limit pan distance
        // controls.addEventListener("change", this.limitCameraPanning);

        return controls;
    }

    private findCursorIntersectingObjects() {
        const interactibleObjects = this.scene.children.filter(obj => obj.userData.isClickable)

        return this.raycaster
            .intersectObjects(interactibleObjects, true)
    }

    private onClick = (event: MouseEvent) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const closestIntersection = this.findCursorIntersectingObjects()[0]
        
        // const interactibleObjects = this.scene.children.filter(obj => obj.userData.isClickable)
        // const closestIntersection = this.raycaster.intersectObjects(interactibleObjects)[0]
        // closestIntersection && console.log('intersection object', closestIntersection)
        // closestIntersection?.object?.userData && console.log('object userdata', closestIntersection?.object?.userData)
        // closestIntersection?.point && console.log('point', closestIntersection?.point)
    
        // if(!this.mousePointedObject) {
        //     return
        // }

        if(this.isMobileUserAgent && this.isCameraZoomedInToObject) {
            return this.resetCamera()
        }

        if(!closestIntersection?.object || this.isCameraZoomedInToObject) {
            return;
        }

        this.tooltippedObject = closestIntersection?.object;

        console.log(this.tooltippedObject)
    
        if (closestIntersection) {
            setTimeout(() => this.isCameraFlying = false, CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS * 1000 + 100)
            this.isCameraZoomedInToObject = true;
            this.isCameraFlying = true;
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
    

    private addCameraControl() {
        const gui = new GUI();

        gui.add( this.camera.position , 'x', -50, 50 ).step(0.5).listen()
        gui.add( this.camera.position , 'y', 0, 50 ).step(0.5).listen()
        gui.add( this.camera.position , 'z', -50, 50 ).step(0.5).listen()
    }

    private onDoubleClick = (event: MouseEvent) => {
        event.preventDefault();

        return this.resetCamera()
    };

    private resetCamera() {
        this.hideHtmlTooltip();
        this.isCameraZoomedInToObject = false;

        gsap.to(this.camera.position, {...CAMERA_INITIAL_POSITION, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
        return gsap.to(this.controls.target, {...this.scene.position, duration: CAMERA_SMOOTH_ANIMATION_DURATION_SECONDS});
    }

    private onWindowResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        this.positionAnnotations();
        if(!this.htmlTooltip.hidden) {
            this.positionTable()
        }

        if(!this.annotationsRendered) {
            this.objectController.generateAnnotations();
            this.annotationsRendered = true;
        }

        const delta = this.clock.getDelta();
        for (const mixer of this.scene.userData.animationMixers || []) {
            mixer.update(delta);
        }
    };

    getCamera = (position: typeof CAMERA_INITIAL_POSITION) => {
        const camera = new THREE.PerspectiveCamera(45, this.cameraAspect, 0.1, 1000)
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

    private positionTable() {
        if(!this.tooltippedObject) {
            return;
        }

        const pos = getAnnotationScreenPosition(this.tooltippedObject, this.camera)
        if(pos) {
            this.htmlTooltip.style.left = `${pos.x-12}px`;
            this.htmlTooltip.style.top = this.tooltippedObject.name === '07' ? `${pos.y - 12 - TOOLTIP_OFFSET_07}px` : `${pos.y - 12}px`;
        }
    }

    private positionAnnotations() {
        this.boundingBoxes.forEach(box => {
            const pos = getAnnotationScreenPosition(box, this.camera);
            const annotation = document.getElementById(`${box.userData.fileName}-annotation`);

            if(!annotation || !pos) {
                return;
            }

            annotation.style.display = 'block';
            annotation.style.left = `${pos.x}px`;
            annotation.style.top = box.userData.fileName === '07.glb' ? `${pos.y - TOOLTIP_OFFSET_07}px` : `${pos.y}px`;
        });
    }

    private limitCameraPanning(_: any) {
        // FIXME: this causes camera to jump if we pan when zoomed in to an object
        const minPan = new THREE.Vector3(-1, 0, -1);
        const maxPan = new THREE.Vector3(3, 0, 1);
        const _v = new THREE.Vector3();
        if (this.isCameraFlying) {
            return;
        }
        _v.copy(this.controls.target);
        this.controls.target.clamp(minPan, maxPan);
        _v.sub(this.controls.target);
        this.camera.position.sub(_v);
    }
}

