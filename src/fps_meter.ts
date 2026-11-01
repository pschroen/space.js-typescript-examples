import { PanelItem, UI } from '@alienkitty/space.js';
import type { PanelMeter } from '@alienkitty/space.js';
import type { PanelItemData } from '@alienkitty/space.js/types/panels/PanelItem.js';

// init

const ui = new UI({
    fps: true,      // Hover or tap to open
    fpsOpen: true   // Always open
});
ui.animateIn();
document.body.appendChild(ui.element);

let needsUpdate = true;

const items: PanelItemData[] = [
    {
        name: 'FPS'
    },
    {
        type: 'divider'
    },
    {
        type: 'meter',
        name: 'FPS',
        noText: true,
        noGradient: true
    },
    {
        type: 'meter',
        name: 'FPS'
    },
    {
        type: 'meter',
        name: 'Random',
        value: Math.random(),
        noText: true,
        noGradient: true
    },
    {
        type: 'meter',
        name: 'Random',
        value: Math.random(),
        noText: true
    },
    {
        type: 'meter',
        name: 'Random',
        precision: 2,
        value: Math.random()
    },
    {
        type: 'meter',
        name: 'Random',
        suffix: 'ms',
        range: 150,
        value: 150 * Math.random()
    },
    {
        type: 'meter',
        name: 'Ghost',
        suffix: 'ms',
        range: 150,
        value: 150 * Math.random(),
        ghost: 150 * Math.random(),
        noText: true
    },
    {
        type: 'meter',
        name: 'Ghost',
        suffix: 'ms',
        range: 150,
        value: 150 * Math.random(),
        ghost: 150 * Math.random()
    },
    {
        type: 'meter',
        value: Math.random(),
        noText: true,
        noGradient: true
    },
    {
        type: 'meter',
        suffix: 'ms',
        range: 150,
        value: 150 * Math.random()
    },
    {
        type: 'meter',
        name: 'Sine',
        precision: 2,
        value: -180,
        noText: true,
        noGradient: true,
        callback: (value: number, item: PanelMeter) => {
            // console.log('Sine callback:', value);

            const x = 0.5 + 0.5 * Math.sin(value++ / 100);
            item.update(x);

            // The return value is passed back in the next frame
            return value;
        }
    },
    {
        type: 'meter',
        name: 'Sine',
        precision: 2,
        value: -180,
        callback: (value: number, item: PanelMeter) => {
            // console.log('Sine callback:', value);

            const x = 0.5 + 0.5 * Math.sin(value++ / 100);
            item.update(x);

            // The return value is passed back in the next frame
            return value;
        }
    },
    {
        type: 'meter',
        name: 'Random',
        precision: 2,
        value: performance.now() - 1000,
        callback: (value: number, item: PanelMeter) => {
            // console.log('Random callback:', value);

            const time = performance.now();

            // Update once per second
            if (time - 1000 > value) {
                value = time;

                item.update(Math.random());
            } else {
                item.update();
            }

            // The return value is passed back in the next frame
            return value;
        }
    },
    {
        type: 'meter',
        name: 'Meter',
        precision: 2,
        value: Math.random(),
        callback: (value: number, item: PanelMeter) => {
            // console.log('Graph callback:', value);

            if (needsUpdate) {
                needsUpdate = false;

                item.update(Math.random());
            } else {
                item.update();
            }

            // The return value is passed back in the next frame
            return value;
        }
    },
    {
        type: 'link',
        value: 'Update',
        callback: (value: string) => {
            console.log('Update callback:', value);

            needsUpdate = true;
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
}

requestAnimationFrame(animate);
