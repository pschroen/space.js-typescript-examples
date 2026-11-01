import { Interface, clearTween, degToRad, ticker, tween } from '@alienkitty/space.js';
import type { LoaderProgressEvent } from '@alienkitty/space.js/types/loaders/Loader.js';

class ProgressCanvas extends Interface<HTMLCanvasElement> {
    width: number;
    height: number;
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    progress: number;
    needsUpdate: boolean;
    context?: CanvasRenderingContext2D | null;
    constructor() {
        super(null, 'canvas');

        const size = 90;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.radius = size * 0.4;
        this.startAngle = degToRad(-90);
        this.progress = 0;
        this.needsUpdate = false;

        this.initCanvas();

        this.addListeners();
        this.resize();
    }

    initCanvas() {
        this.context = this.element.getContext('2d');
    }

    addListeners() {
        ticker.add(this.onUpdate);
    }

    removeListeners() {
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    onUpdate = () => {
        if (this.needsUpdate) {
            this.update();
        }
    };

    onProgress = ({ progress }: LoaderProgressEvent) => {
        clearTween(this);

        this.needsUpdate = true;

        tween(this, { progress }, 500, 'easeOutCubic', () => {
            this.needsUpdate = false;

            if (this.progress >= 1) {
                this.onComplete();
            }
        });
    };

    onComplete = () => {
        this.removeListeners();

        this.events.emit('complete');
    };

    // Public methods

    resize = () => {
        const dpr = 2; // Always 2

        this.element.width = Math.round(this.width * dpr);
        this.element.height = Math.round(this.height * dpr);
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;

        const context = this.context;

        if (context) {
            context.scale(dpr, dpr);

            // Context properties need to be reassigned after resize
            context.lineWidth = 1.5;
            context.strokeStyle = getComputedStyle(document.querySelector(':root')!).getPropertyValue('--ui-color').trim();
        }

        this.update();
    };

    update = () => {
        const context = this.context;

        if (context) {
            context.clearRect(0, 0, this.element.width, this.element.height);
            context.beginPath();
            context.arc(this.x, this.y, this.radius, this.startAngle, this.startAngle + degToRad(360 * this.progress));
            context.stroke();
        }
    };

    animateOut = (callback: () => void) => {
        this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
    };

    destroy = () => {
        this.removeListeners();

        clearTween(this);

        return super.destroy();
    };
}

class App {
    static view?: ProgressCanvas | null;
    static async init() {
        this.initView();

        this.addListeners();
    }

    static initView() {
        this.view = new ProgressCanvas();
        this.view.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -this.view.width / 2,
            marginTop: -this.view.height / 2,
            cursor: 'pointer'
        });
        document.body.appendChild(this.view.element);

        this.view.onProgress({ progress: 1 });
    }

    static addListeners() {
        this.view?.element.addEventListener('click', this.onClick);
        ticker.start();
    }

    // Event handlers

    static onClick = () => {
        this.view?.element.removeEventListener('click', this.onClick);

        this.view?.animateOut(() => {
            this.view = this.view?.destroy();
        });
    };
}

App.init();
