import { canvas, ctx, mouse } from './world-map.js';

const pinImg = new Image();
pinImg.src = "/assets/pin-icon.jpeg"

export default class MapPoint {
    static ALL = [];
    static PIN_SIZE = 40;

    constructor(project) {
        this.project = project;
        this.x = project.position.x;
        this.y = project.position.y;
        this._hoverEffect = 0;
        this._shouldShowHover = false;

        MapPoint.ALL.push(this);
    }

    update() {
        this.draw();
    }

    draw() {
        if (this._shouldShowHover) {
            this._hoverEffect = Math.min(1, this._hoverEffect + 0.2);
        } else {
            this._hoverEffect = Math.max(0, this._hoverEffect - 0.2);
        }

        ctx.fillStyle = "#00000022";
        ctx.globalAlpha = this._hoverEffect;
        ctx.beginPath();
        ctx.arc(this.x, this.y, MapPoint.PIN_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.drawImage(pinImg, this.x - MapPoint.PIN_SIZE / 2, this.y - MapPoint.PIN_SIZE / 2, MapPoint.PIN_SIZE, MapPoint.PIN_SIZE);
    }

    mouseOver() {
        return Math.hypot(this.x - mouse.x, this.y - mouse.y) < MapPoint.PIN_SIZE;
    }
    
    onClick() {
        
    }
}