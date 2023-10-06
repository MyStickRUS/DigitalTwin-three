import { Vector3 } from 'three';

export const getRandomNumber = () => {
    // Return a random number
    return Math.random();
}

export function getAnnotationScreenPosition(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
    const annotation = object.userData.annotation || object.parent?.userData.annotation;
    if(!annotation) {
        return;
    }

    var width = window.innerWidth, height = window.innerHeight;
    var widthHalf = width / 2, heightHalf = height / 2;
    
    const {x, y, z} = annotation;

    var pos = new Vector3(x, y, z);
    pos.project(camera);
    pos.x = ( pos.x * widthHalf ) + widthHalf;
    pos.y = -( pos.y * heightHalf ) + heightHalf;

    return pos;
}