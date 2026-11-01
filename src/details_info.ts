import { UI } from '@alienkitty/space.js';

class App {
    static animatedIn: boolean;
    static ui: UI;
    static async init() {
        this.animatedIn = false;

        this.initViews();

        this.addListeners();
    }

    static initViews() {
        this.ui = new UI({
            detailsInfo: {
                title: 'Mars',
                content: /* html */ `
Distance from Sun: 230 million km
<br>Mass: 0.107 Earths
<br>Surface gravity: 0.3794 Earths
                `
            }
        });
        this.ui.detailsInfo?.animateIn();
        document.body.appendChild(this.ui.element);
    }

    static addListeners() {
        document.body.addEventListener('click', this.onClick);
        window.addEventListener('load', this.onLoad);
    }

    // Event handlers

    static onClick = () => {
        if (this.animatedIn) {
            this.ui.detailsInfo?.animateOut();
            this.animatedIn = false;
        } else {
            this.ui.detailsInfo?.animateIn();
            this.animatedIn = true;
        }
    };

    static onLoad = () => {
        this.animatedIn = true;

        this.ui.animateIn();
    };
}

App.init();
