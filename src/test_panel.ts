import { Panel, PanelItem } from '@alienkitty/space.js';

const panel = new Panel();
const item = new PanelItem({
    // name: 'FPS'
    // type: 'spacer'
    // type: 'divider'
    // type: 'info'
    // type: 'link'
    // type: 'thumbnail'
    // type: 'graph'
    // type: 'meter'
    // type: 'list'
    // type: 'slider'
    // type: 'toggle'
    // type: 'content'
    type: 'color'
});
panel.add(item);
panel.animateIn();
document.body.appendChild(panel.element);

function animate() {
    requestAnimationFrame(animate);

    panel.update();
}

requestAnimationFrame(animate);
