import { Stage, UI, ticker } from '@alienkitty/space.js';
import { UIOpenEvent } from '@alienkitty/space.js/types/ui/UI.js';
import { AudioButtonUpdateEvent } from '@alienkitty/space.js/types/ui/AudioButton.js';

const store = {
    sound: true
};

class App {
    static image: HTMLImageElement;
    static ui: UI;
    static async init() {
        const sound = localStorage.getItem('sound');
        store.sound = sound ? JSON.parse(sound) : true;

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = 'https://space.js.org/assets/meta/share.png';

        this.image = image;

        this.initViews();

        this.addListeners();
    }

    static initViews() {
        this.ui = new UI({
            audioButton: {
                sound: store.sound,
                callback: value => {
                    console.log('AudioButton callback:', value);
                }
            }
        });
        document.body.appendChild(this.ui.element);

        this.ui.audioButton?.setData({
            image: this.image,
            name: '127.0.0.1',
            title: 'localhost'
        });
    }

    static addListeners() {
        Stage.events.on('ui', this.onUI);
        this.ui.audioButton?.events.on('update', this.onAudio);
        document.body.addEventListener('click', this.onClick);
        window.addEventListener('load', this.onLoad);
        ticker.add(this.onUpdate);
        ticker.start();
    }

    // Event handlers

    static onUI = (e: UIOpenEvent) => {
        console.log('UI event:', e);
    };

    static onAudio = (e: AudioButtonUpdateEvent) => {
        console.log('AudioButton event:', e);

        localStorage.setItem('sound', JSON.stringify(e.sound));

        store.sound = e.sound;
    };

    static onClick = ({ clientX, clientY }: PointerEvent) => {
        if (document.elementFromPoint(clientX, clientY) === document.body) {
            this.ui.audioButton?.setData({
                image: this.image,
                name: '127.0.0.1',
                title: 'localhost',
                link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            });
        }
    };

    static onUpdate = () => {
        this.ui.update();
    };

    static onLoad = () => {
        this.ui.animateIn();
    };
}

App.init();
