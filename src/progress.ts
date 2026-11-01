import { Interface, clearTween, ticker, tween } from '@alienkitty/space.js';
import type { InterfaceProgress } from '@alienkitty/space.js/types/utils/Interface.js';
import type { LoaderProgressEvent } from '@alienkitty/space.js/types/loaders/Loader.js';

class Progress extends Interface {
    width: number;
    height: number;
    x: number;
    y: number;
    radius: number;
    startOffset: number;
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
        this.radius = size * 0.4;
        this.startOffset = -0.25;
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
            r: this.radius
        });
        this.circle.css({
            fill: 'none',
            stroke: 'var(--ui-color)',
            strokeWidth: 1.5
        });
        this.circle.start = 0;
        this.circle.offset = this.startOffset;
        this.circle.progress = 0;
        this.add(this.circle);
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

    update = () => {
        this.circle?.drawLine(this.progress);
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
    static view?: Progress | null;
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
