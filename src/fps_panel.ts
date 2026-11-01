import { Panel, PanelItem, UI, brightness, getKeyByValue } from '@alienkitty/space.js';
import type { Color, Content, List, Slider, Toggle } from '@alienkitty/space.js';
import type { PanelItemData } from '@alienkitty/space.js/types/panels/PanelItem.js';

// init

const ui = new UI({
    fps: true,      // Hover or tap to open
    fpsOpen: true   // Always open
});
ui.animateIn();
document.body.appendChild(ui.element);

const backgroundColor = getComputedStyle(document.querySelector(':root')!).getPropertyValue('--bg-color').trim();

const toggleOptions = new Map([
    ['Dark', false],
    ['Light', true]
]);

const selectOptions = new Map([
    ['Never', 1],
    ['Gonna', 2],
    ['Give', 3],
    ['You', 4],
    ['Up', 5]
]);

const contentOptions = new Map([
    ['Content A', 1],
    ['Content B', 2],
    ['Empty', 3]
]);

const image = new Image();
image.crossOrigin = 'anonymous';
image.src = 'https://space.js.org/assets/meta/share.png';

const items: PanelItemData[] = [
    {
        name: 'FPS'
    },
    {
        type: 'divider'
    },
    {
        type: 'color',
        name: 'Color',
        value: backgroundColor,
        callback: (value: Color) => {
            document.body.style.backgroundColor = `#${value.getHexString()}`;

            // Light colour is inverted
            ui.invert(brightness(value) > 0.6);
        }
    },
    {
        type: 'list',
        name: 'List Toggle',
        list: toggleOptions,
        value: getKeyByValue(toggleOptions, false),
        callback: (value: string) => {
            console.log('ListToggle callback:', value);

            const light = toggleOptions.get(value);

            if (light) {
                ui.setPanelValue('Color', 0xffffff);
            } else {
                ui.setPanelValue('Color', backgroundColor);
            }
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'list',
        name: 'List Select',
        list: selectOptions,
        value: 'Never',
        callback: (value: string) => {
            console.log('ListSelect callback:', value);

            const roll = selectOptions.get(value);

            if (roll === 5) {
                open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
            }
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'list',
        name: 'List Content',
        list: contentOptions,
        value: 'Content A',
        callback: (value: string, item: List) => {
            console.log('ListSelect with content callback:', value);

            switch (value) {
                case 'Content A': {
                    const nestedPanel = new Panel();
                    nestedPanel.animateIn(true);

                    ([
                        {
                            type: 'divider'
                        },
                        {
                            type: 'color',
                            name: 'Nested Color 1',
                            value: backgroundColor,
                            callback: (value: Color) => {
                                document.body.style.backgroundColor = `#${value.getHexString()}`;

                                // Light colour is inverted
                                ui.invert(brightness(value) > 0.6);
                            }
                        }
                    ] as PanelItemData[]).forEach(data => {
                        nestedPanel.add(new PanelItem(data));
                    });

                    item.setContent(nestedPanel);
                    item.toggleContent(true);
                    break;
                }
                case 'Content B': {
                    const nestedPanel = new Panel();
                    nestedPanel.animateIn(true);

                    ([
                        {
                            type: 'divider'
                        },
                        {
                            type: 'slider',
                            name: 'Nested',
                            min: 0,
                            max: 1,
                            step: 0.01,
                            value: 0.5,
                            callback: (value: number) => {
                                console.log('Slider callback:', value);
                            }
                        }
                    ] as PanelItemData[]).forEach(data => {
                        nestedPanel.add(new PanelItem(data));
                    });

                    item.setContent(nestedPanel);
                    item.toggleContent(true);
                    break;
                }
                default: {
                    item.toggleContent(false);
                    break;
                }
            }
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'slider',
        name: 'Slider',
        min: 0,
        max: 1,
        step: 0.01,
        value: 0,
        callback: (value: number, item: Slider) => {
            console.log('Slider with content callback:', value);

            if (!item.hasContent()) {
                const nestedPanel = new Panel();
                nestedPanel.animateIn(true);

                ([
                    {
                        type: 'divider'
                    },
                    {
                        type: 'color',
                        name: 'Nested Color 2',
                        value: backgroundColor,
                        callback: (value: Color) => {
                            document.body.style.backgroundColor = `#${value.getHexString()}`;

                            // Light colour is inverted
                            ui.invert(brightness(value) > 0.6);
                        }
                    }
                ] as PanelItemData[]).forEach(data => {
                    nestedPanel.add(new PanelItem(data));
                });

                item.setContent(nestedPanel);
            }

            if (value > 0) {
                item.toggleContent(true);
            } else {
                item.toggleContent(false);
            }
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'toggle',
        name: 'Toggle',
        value: false,
        callback: (value: boolean, item: Toggle) => {
            console.log('Toggle with content callback:', value);

            if (!item.hasContent()) {
                const nestedPanel = new Panel();
                nestedPanel.animateIn(true);

                ([
                    {
                        type: 'divider'
                    },
                    {
                        type: 'color',
                        name: 'Nested Color 3',
                        value: backgroundColor,
                        callback: (value: Color) => {
                            document.body.style.backgroundColor = `#${value.getHexString()}`;

                            // Light colour is inverted
                            ui.invert(brightness(value) > 0.6);
                        }
                    }
                ] as PanelItemData[]).forEach(data => {
                    nestedPanel.add(new PanelItem(data));
                });

                item.setContent(nestedPanel);
            }

            if (value) {
                item.toggleContent(true);
            } else {
                item.toggleContent(false);
            }
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'content',
        callback: (value: undefined, item: Content) => {
            const nestedPanel = new Panel();
            nestedPanel.animateIn(true);

            ([
                {
                    type: 'color',
                    name: 'Nested Color 4',
                    value: backgroundColor,
                    callback: (value: Color) => {
                        document.body.style.backgroundColor = `#${value.getHexString()}`;

                        // Light colour is inverted
                        ui.invert(brightness(value) > 0.6);
                    }
                }
            ] as PanelItemData[]).forEach(data => {
                nestedPanel.add(new PanelItem(data));
            });

            item.setContent(nestedPanel);
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'thumbnail',
        name: 'Thumbnail',
        value: image,
        callback: (value: HTMLImageElement) => {
            console.log('Thumbnail callback:', value);
        }
    },
    {
        type: 'divider'
    },
    {
        type: 'info',
        name: 'Mouse X',
        value: 0
    },
    {
        type: 'info',
        name: 'Mouse Y',
        value: 0
    },
    {
        type: 'info',
        name: 'Time',
        value: '0s'
    },
    {
        type: 'spacer'
    },
    {
        type: 'link',
        value: 'Reset',
        callback: (value: string) => {
            console.log('Link callback:', value);

            ui.setPanelValue('Color', backgroundColor);
            ui.setPanelValue('List Toggle', false);
            ui.setPanelValue('List Select', 1);
            ui.setPanelValue('List Content', 1);
            ui.setPanelValue('Nested Color 1', backgroundColor);
            ui.setPanelValue('Nested', 0.5);
            ui.setPanelValue('Slider', 0);
            ui.setPanelValue('Nested Color 2', backgroundColor);
            ui.setPanelValue('Toggle', false);
            ui.setPanelValue('Nested Color 3', backgroundColor);
            ui.setPanelValue('Nested Color 4', backgroundColor);
            ui.setPanelValue('Thumbnail', image);
            // ui.setPanelValue('Thumbnail', null);
        }
    }
];

items.forEach(data => {
    ui.addPanel(new PanelItem(data));
});

// Call after adding to show the fps panel right away
// ui.animateIn();
ui.header?.info?.animateIn();

// animation

function animate() {
    requestAnimationFrame(animate);

    ui.update();

    ui.setPanelValue('Time', `${(performance.now() / 1000).toFixed(1)}s`);
}

requestAnimationFrame(animate);

// mouse

window.addEventListener('pointermove', onPointerMove);

function onPointerMove({ clientX, clientY }: PointerEvent) {
    ui.setPanelValue('Mouse X', clientX.toFixed());
    ui.setPanelValue('Mouse Y', clientY.toFixed());
}
