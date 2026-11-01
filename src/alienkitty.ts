import { Interface, clearTween, delayedCall, headsTails, randInt } from '@alienkitty/space.js';
import type { Tween } from '@alienkitty/space.js';

class AlienKitty extends Interface {
    eyelid1?: Interface;
    eyelid2?: Interface;
    timeout?: Tween;
    constructor() {
        super('.alienkitty');

        this.init();
    }

    init() {
        this.css({
            position: 'relative',
            width: 90,
            height: 86,
            background: 'center / contain no-repeat url(assets/images/alienkitty.svg)',
            opacity: 0
        });

        this.eyelid1 = new Interface('.eyelid1');
        this.eyelid1.css({
            position: 'absolute',
            left: 35,
            top: 25,
            width: 24,
            height: 14,
            background: 'center / contain no-repeat url(assets/images/alienkitty_eyelid.svg)',
            transformOrigin: 'top center',
            scaleX: 1.5,
            scaleY: 0.01
        });
        this.add(this.eyelid1);

        this.eyelid2 = new Interface('.eyelid2');
        this.eyelid2.css({
            position: 'absolute',
            left: 53,
            top: 26,
            width: 24,
            height: 14,
            background: 'center / contain no-repeat url(assets/images/alienkitty_eyelid.svg)',
            transformOrigin: 'top left',
            scaleX: 1,
            scaleY: 0.01
        });
        this.add(this.eyelid2);
    }

    blink() {
        this.timeout = delayedCall(randInt(0, 10000), headsTails(this.onBlink1, this.onBlink2));
    }

    // Event handlers

    onBlink1 = () => {
        this.eyelid1?.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            this.eyelid1?.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        this.eyelid2?.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
            this.eyelid2?.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                this.blink();
            });
        });
    };

    onBlink2 = () => {
        this.eyelid1?.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
            this.eyelid1?.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
        });
        this.eyelid2?.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
            this.eyelid2?.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                this.blink();
            });
        });
    };

    // Public methods

    animateIn = () => {
        this.blink();

        this.tween({ opacity: 1 }, 1000, 'easeOutSine');
    };

    animateOut = (callback: () => void) => {
        this.tween({ opacity: 0 }, 500, 'easeInOutQuad', callback);
    };

    destroy = () => {
        clearTween(this.timeout);

        return super.destroy();
    };
}

class App {
    static view?: AlienKitty | null;
    static async init() {
        this.initView();

        this.addListeners();
    }

    static initView() {
        this.view = new AlienKitty();
        this.view.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -90 / 2,
            marginTop: -86 / 2 - 65,
            cursor: 'pointer'
        });
        document.body.appendChild(this.view.element);
    }

    static addListeners() {
        this.view?.element.addEventListener('click', this.onClick);
        window.addEventListener('load', this.onLoad);
    }

    // Event handlers

    static onClick = () => {
        this.view?.element.removeEventListener('click', this.onClick);

        this.view?.animateOut(() => {
            this.view = this.view?.destroy();
        });
    };

    static onLoad = () => {
        this.view?.animateIn();
    };
}

App.init();
