import * as THREE from 'three';

const TOOLTIP_SIZE = {
    x: 400,
    y: 200,
}

export class Tooltip extends THREE.Sprite {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(text: string) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Failed to get canvas context for label');
        }

        super(new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvas),
        }));

        this.canvas = canvas;
        this.context = context;
        this.scale.set(1, 0.5, 1);

        this.setText(text);
    }

    setText(text: string) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = '40px Arial';
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, TOOLTIP_SIZE.x, TOOLTIP_SIZE.y);
        this.context.fillStyle = 'black';
        this.context.fillText(text, 0, 30);
        (this.material.map as THREE.CanvasTexture).needsUpdate = true;
    }
}
