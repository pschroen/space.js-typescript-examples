import { BufferLoader, UI, WebAudio, clamp, delayedCall } from '@alienkitty/space.js';

let _id = 0;

class AudioController {
    static ui: UI;
    static init(ui: UI) {
        this.ui = ui;

        this.addListeners();
    }

    static addListeners() {
        document.addEventListener('visibilitychange', this.onVisibility);
        document.addEventListener('pointerdown', this.onPointerDown);

        this.ui.instructions?.animateIn();
    }

    // Event handlers

    static onVisibility = () => {
        if (document.hidden) {
            WebAudio.mute();
        } else {
            WebAudio.unmute();
        }
    };

    static onPointerDown = ({ clientX, clientY }: PointerEvent) => {
        // this.ui.instructions.animateOut();

        const normalX = clientX / document.documentElement.clientWidth;
        const normalY = clientY / document.documentElement.clientHeight;
        const pan = clamp(((normalX * 2) - 1) * 0.8, -1, 1);
        const rate = clamp(0.8 + (1 - normalY) * 0.4, 0.8, 1.2);

        const gong = WebAudio.clone('gong', String(++_id));
        gong.gain.set(0.5);
        gong.stereoPan.set(pan);
        gong.playbackRate.set(rate);
        gong.play();

        delayedCall(6000, () => {
            gong.destroy();
        });
    };
}

class App {
    static loader: BufferLoader;
    static ui: UI;
    static async init() {
        this.initLoader();
        this.initViews();

        await this.loader.ready();

        this.initAudio();
    }

    static initLoader() {
        this.loader = new BufferLoader();
        this.loader.setPath('assets/sounds/');
        this.loader.loadAll(['gong.mp3']);
    }

    static initViews() {
        this.ui = new UI({
            instructions: {
                content: `${navigator.maxTouchPoints ? 'Tap' : 'Click'} for sound`
            }
        });
        document.body.appendChild(this.ui.element);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load(this.loader.files);

        AudioController.init(this.ui);
    }
}

App.init();
