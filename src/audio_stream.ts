import { Panel, PanelItem, UI, WebAudio } from '@alienkitty/space.js';
import type { Sound } from '@alienkitty/space.js';
import type { PanelItemData } from '@alienkitty/space.js/types/panels/PanelItem.js';

class AudioController {
    static ui: UI;
    static cyberspace: Sound;
    static init(ui: UI) {
        this.ui = ui;

        this.initSounds();

        this.addListeners();
    }

    static initSounds() {
        this.cyberspace = WebAudio.get('cyberspace');
        this.cyberspace.gain.set(1);
    }

    static addListeners() {
        document.addEventListener('visibilitychange', this.onVisibility);
        document.addEventListener('click', this.onClick);

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

    static onClick = () => {
        document.removeEventListener('click', this.onClick);

        WebAudio.resume();

        this.ui.instructions?.animateOut();

        this.cyberspace.play();
    };
}

class PanelController {
    static ui: UI;
    static init(ui: UI) {
        this.ui = ui;

        this.initPanel();
    }

    static initPanel() {
        const { cyberspace } = AudioController;

        const panel = new Panel();
        panel.animateIn();
        this.ui.add(panel);

        const items: PanelItemData[] = [
            {
                name: 'Cyberspace'
            },
            {
                type: 'divider'
            },
            {
                type: 'slider',
                name: 'Volume',
                min: 0,
                max: 1,
                step: 0.01,
                value: cyberspace.gain.value,
                callback: (value: number) => {
                    cyberspace.gain.value = value;
                }
            },
            {
                type: 'slider',
                name: 'Pan',
                min: -1,
                max: 1,
                step: 0.01,
                value: cyberspace.stereoPan.value,
                callback: (value: number) => {
                    cyberspace.stereoPan.value = value;
                }
            }
        ];

        items.forEach(data => {
            panel.add(new PanelItem(data));
        });
    }
}

class App {
    static ui: UI;
    static async init() {
        this.initViews();
        this.initAudio();
        this.initPanel();
    }

    static initViews() {
        this.ui = new UI({
            instructions: {
                content: `${navigator.maxTouchPoints ? 'Tap' : 'Click'} for sound`
            }
        });
        this.ui.css({
            minHeight: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '55px 0 125px'
        });
        document.body.appendChild(this.ui.element);
    }

    static initAudio() {
        WebAudio.init({ sampleRate: 48000 });
        WebAudio.load({ cyberspace: 'https://icecast.cyberspace.app/dive.ogg' });

        AudioController.init(this.ui);
    }

    static initPanel() {
        PanelController.init(this.ui);
    }
}

App.init();
