import { Interface, UI, ticker } from '@alienkitty/space.js';
import type { ThumbnailClickEvent, ThumbnailUpdateEvent } from '@alienkitty/space.js/types/ui/Thumbnail.js';

interface CanvasNoiseParams {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    tileSize: number;
    monochrome: boolean;
}

// Based on https://codepen.io/zepha/pen/VpXvBJ

class CanvasNoise extends Interface<HTMLCanvasElement> {
    params: CanvasNoiseParams;
    context?: CanvasRenderingContext2D | null;
    tile?: HTMLCanvasElement | OffscreenCanvas;
    tileContext?: CanvasRenderingContext2D | null;
    width?: number;
    height?: number;
    constructor(params: Partial<CanvasNoiseParams>) {
        super(null, 'canvas');

        const defaults = {
            width: 1,
            height: 1,
            tileSize: 250,
            monochrome: true
        };

        this.params = Object.assign(defaults, params) as CanvasNoiseParams;

        this.initCanvas();
    }

    initCanvas() {
        this.context = this.element.getContext('2d');

        this.tile = document.createElement('canvas');
        this.tileContext = this.tile.getContext('2d');
    }

    // Public methods

    resize = (width: number, height: number, dpr: number) => {
        if (this.tile) {
            this.element.width = Math.round(width * dpr);
            this.element.height = Math.round(height * dpr);
            this.element.style.width = `${width}px`;
            this.element.style.height = `${height}px`;

            this.tile.width = Math.round(this.params.tileSize * dpr);
            this.tile.height = Math.round(this.params.tileSize * dpr);

            this.width = this.element.width / this.tile.width + 1; // One extra tile for row offset
            this.height = this.element.height / this.tile.height;

            this.update();
        }
    };

    update = () => {
        if (this.context && this.tile && this.tileContext && this.width && this.height) {
            const pixels = new ImageData(this.tile.width, this.tile.height);

            for (let i = 0, l = pixels.data.length; i < l; i += 4) {
                const rand = 255 * Math.random();

                pixels.data[i] = this.params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 1] = this.params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 2] = this.params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 3] = 255;
            }

            this.tileContext.putImageData(pixels, 0, 0);

            for (let x = 0, xl = this.width; x < xl; x++) {
                for (let y = 0, yl = this.height; y < yl; y++) {
                    this.context.drawImage(this.tile, x * this.tile.width - (y % 2 === 0 ? this.tile.width / 2 : 0), y * this.tile.height, this.tile.width, this.tile.height);
                }
            }
        }
    };
}

class App {
    static noise: CanvasNoise;
    static ui: UI;
    static async init() {
        this.initViews();

        this.addListeners();
        this.onResize();
    }

    static initViews() {
        this.noise = new CanvasNoise({
            monochrome: false
        });
        document.body.appendChild(this.noise.element);

        this.ui = new UI({
            fps: true,
            // thumbnail: this.noise.element,
            thumbnail: {
                image: this.noise.element,
                width: 150,
                height: 100,
                snapMargin: 20,
                position: 'bl', // tl, bl, br, tr
                noCanvas: false,
                callback: value => {
                    console.log('Thumbnail callback:', value);
                }
            }
        });
        this.ui.animateIn();
        document.body.appendChild(this.ui.element);
    }

    static addListeners() {
        this.ui.thumbnail?.events.on('update', this.onThumbnail);
        this.ui.thumbnail?.events.on('click', this.onThumbnailClick);
        window.addEventListener('resize', this.onResize);
        ticker.add(this.onUpdate, 20);
        ticker.start();
    }

    // Event handlers

    static onThumbnail = (e: ThumbnailUpdateEvent) => {
        console.log('Thumbnail event:', e);
    };

    static onThumbnailClick = (e: ThumbnailClickEvent) => {
        console.log('Thumbnail click event:', e);

        open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    };

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        this.noise.resize(width, height, dpr);
    };

    static onUpdate = () => {
        this.noise.update();
        this.ui.update();
    };
}

App.init();
