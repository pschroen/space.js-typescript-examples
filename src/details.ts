import { UI } from '@alienkitty/space.js';

class App {
    static ui: UI;
    static async init() {
        this.initViews();

        this.addListeners();
    }

    static initViews() {
        this.ui = new UI({
            details: {
                // background: true,
                // dividerLine: true,
                // width: 'max(50vw, 250px)',
                title: 'Mars',
                /* content: '<p>Mars is the fourth planet from the Sun. The surface of Mars is orange-red because it is covered in iron(III) oxide dust, giving it the nickname "the Red Planet". It is classified as a terrestrial planet and is the second smallest of the Solar System\'s planets with a diameter of 6,779 km.</p>',
                links: [
                    {
                        title: 'Wikipedia',
                        link: 'https://en.wikipedia.org/wiki/Mars'
                    }
                ], */
                content: [
                    // '<p>Mars is the fourth planet from the Sun. The surface of Mars is orange-red because it is covered in iron(III) oxide dust, giving it the nickname "the Red Planet". It is classified as a terrestrial planet and is the second smallest of the Solar System\'s planets with a diameter of 6,779 km.</p>',
                    {
                        content: /* html */ `
<p>Mars is the fourth planet from the Sun. The surface of Mars is orange-red because it is covered in iron(III) oxide dust, giving it the nickname "the Red Planet". It is classified as a terrestrial planet and is the second smallest of the Solar System's planets with a diameter of 6,779 km.</p>
                        `,
                        links: [
                            {
                                title: 'Wikipedia',
                                link: 'https://en.wikipedia.org/wiki/Mars'
                            }
                        ]
                    },
                    {
                        title: 'Distance from Sun',
                        content: '230 million km'
                    },
                    {
                        title: 'Mass',
                        content: '0.107 Earths'
                    },
                    {
                        title: 'Surface gravity',
                        content: '0.3794 Earths'
                    }
                ]
            }
        });
        this.ui.css({ position: 'static' });
        this.ui.toggleDetails(true);
        document.body.appendChild(this.ui.element);
    }

    static addListeners() {
        window.addEventListener('load', this.onLoad);
    }

    // Event handlers

    static onLoad = () => {
        this.ui.animateIn();
    };
}

App.init();
