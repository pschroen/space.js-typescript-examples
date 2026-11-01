import { Interface, clearTween, ticker, tween } from '@alienkitty/space.js';
import type { InterfaceProgress } from '@alienkitty/space.js/types/utils/Interface.js';
import type { LoaderProgressEvent } from '@alienkitty/space.js/types/loaders/Loader.js';

class Progress extends Interface {
    width: number;
    height: number;
    x: number;
    y: number;
    r: number;
    radius: number;
    progress: number;
    needsUpdate: boolean;
    circle?: InterfaceProgress;
    constructor() {
        super(null, 'svg');

        const size = 90;

        this.width = size;
        this.height = size;
        this.x = size / 2;
        this.y = size / 2;
        this.r = size * 0.4;
        this.radius = this.r;
        this.progress = 0;
        this.needsUpdate = false;

        this.initSVG();

        this.addListeners();
    }

    initSVG() {
        this.attr({
            width: this.width,
            height: this.height
        });

        this.circle = new Interface(null, 'svg', 'circle') as InterfaceProgress;
        this.circle.attr({
            cx: this.x,
            cy: this.y,
            r: this.r
        });
        this.circle.css({
            fill: 'none',
            stroke: 'var(--ui-color)',
            strokeWidth: 1.5
        });
        this.circle.start = 0;
        this.circle.offset = -0.25;
        this.add(this.circle);
    }

    addListeners() {
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointerup', this.onPointerUp);
        ticker.add(this.onUpdate);
    }

    // Event handlers

    onPointerDown = () => {
        clearTween(this);

        this.needsUpdate = true;

        tween(this, { radius: this.r * 0.5 }, 500, 'easeOutCubic', () => {
            this.needsUpdate = false;
        });
    };

    onPointerUp = () => {
        clearTween(this);

        this.needsUpdate = true;

        tween(this, { radius: this.r, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic', () => {
            this.needsUpdate = false;
        });
    };

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
        });
    };

    // Public methods

    update = () => {
        this.circle?.attr({ r: this.radius });
        this.circle?.drawLine(this.progress);
    };
}

class App {
    static view: Progress;
    static async init() {
        this.initView();

        this.addListeners();
    }

    static initView() {
        this.view = new Progress();
        this.view.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -this.view.width / 2,
            marginTop: -this.view.height / 2,
            cursor: 'pointer',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
        document.body.appendChild(this.view.element);

        this.view.onProgress({ progress: 1 });
    }

    static addListeners() {
        ticker.start();
    }
}

App.init();
