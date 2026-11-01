import { Meter } from '@alienkitty/space.js';

const meter = new Meter({
    value: Math.random(),
    precision: 2
});
meter.animateIn();
document.body.appendChild(meter.element);

function animate() {
    requestAnimationFrame(animate);

    meter.update();
}

requestAnimationFrame(animate);
