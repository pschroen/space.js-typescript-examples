import { UI } from '@alienkitty/space.js';

const ui = new UI({ fps: true });
ui.animateIn();
document.body.appendChild(ui.element);

function animate() {
    requestAnimationFrame(animate);

    ui.update();
}

requestAnimationFrame(animate);
