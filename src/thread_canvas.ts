import { Thread, ticker } from '@alienkitty/space.js';

interface CanvasNoiseParams {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    width: number;
    height: number;
    tileSize: number;
    monochrome: boolean;
}

// Based on https://codepen.io/zepha/pen/VpXvBJ

class CanvasNoise {
    params: CanvasNoiseParams;
    canvas?: HTMLCanvasElement | OffscreenCanvas;
    context?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    tile?: HTMLCanvasElement | OffscreenCanvas;
    tileContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    width?: number;
    height?: number;
    constructor(params: Partial<CanvasNoiseParams>) {
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
        this.canvas = this.params.canvas;
        this.canvas.width = this.params.width;
        this.canvas.height = this.params.height;
        this.context = this.canvas.getContext('2d');

        this.tile = typeof window === 'undefined' ? new OffscreenCanvas(this.params.tileSize, this.params.tileSize) : document.createElement('canvas');
        this.tile.width = this.params.tileSize;
        this.tile.height = this.params.tileSize;
        this.tileContext = this.tile.getContext('2d');
    }

    // Public methods

    resize = (width: number, height: number, dpr: number) => {
        if (this.canvas && this.tile) {
            this.canvas.width = Math.round(width * dpr);
            this.canvas.height = Math.round(height * dpr);

            this.tile.width = Math.round(this.params.tileSize * dpr);
            this.tile.height = Math.round(this.params.tileSize * dpr);

            this.width = this.canvas.width / this.tile.width + 1; // One extra tile for row offset
            this.height = this.canvas.height / this.tile.height;

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

class CanvasNoiseThread {
    noise?: CanvasNoise;
    constructor() {
        this.addListeners();
    }

    addListeners() {
        addEventListener('message', this.onMessage);
        ticker.start();
    }

    // Event handlers

    onMessage = ({ data }: MessageEvent) => {
        this[data.message.fn as ('init' | 'resize' | 'start' | 'stop')].call(this, data.message);
    };

    onUpdate = () => {
        this.noise?.update();
    };

    // Public methods

    init = ({ params }: { params: Partial<CanvasNoiseParams>, buffer: Array<OffscreenCanvas> }) => {
        this.noise = new CanvasNoise(params);
    };

    resize = ({ width, height, dpr }: { width: number, height: number, dpr: number }) => {
        this.noise?.resize(width, height, dpr);
    };

    start = ({ fps }: { fps: number }) => {
        ticker.add(this.onUpdate, fps);
    };

    stop = () => {
        ticker.remove(this.onUpdate);
    };
}

class CanvasNoiseController {
    static params: Partial<CanvasNoiseParams>;
    static thread: Thread;
    static element: HTMLCanvasElement;
    static init(params: Partial<CanvasNoiseParams>) {
        this.params = params;

        this.initThread();
    }

    static initThread() {
        this.thread = new Thread({
            imports: [
                ['./index.js', 'ticker']
            ],
            classes: [CanvasNoise],
            controller: [CanvasNoiseThread, 'void init', 'void resize', 'void start', 'void stop']
        });

        this.element = this.params.canvas as HTMLCanvasElement;
        this.params.canvas = this.element.transferControlToOffscreen();

        this.thread.init({ params: this.params, buffer: [this.params.canvas] });
    }

    // Public methods

    static resize = (width: number, height: number, dpr: number) => {
        this.thread.resize({ width, height, dpr });
    };

    static start = () => {
        this.thread.start({ fps: 20 });
    };

    static stop = () => {
        this.thread.stop();
    };
}

class App {
    static canvas: HTMLCanvasElement;
    static async init() {
        this.initCanvas();
        this.initControllers();

        this.addListeners();
        this.onResize();
    }

    static initCanvas() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
    }

    static initControllers() {
        CanvasNoiseController.init({ canvas: this.canvas });
    }

    static addListeners() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('load', this.onLoad);
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        CanvasNoiseController.resize(width, height, dpr);
    };

    static onLoad = () => {
        CanvasNoiseController.start();
    };
}

App.init();
