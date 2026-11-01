import { RadialGraph } from '@alienkitty/space.js';

const graph = new RadialGraph({
    value: Array.from({ length: 10 }, () => Math.random()),
    precision: 2,
    lookupPrecision: 200
});
graph.animateIn();
document.body.appendChild(graph.element);

function animate() {
    requestAnimationFrame(animate);

    graph.update();
}

requestAnimationFrame(animate);
