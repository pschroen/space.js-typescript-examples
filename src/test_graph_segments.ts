import { GraphSegments } from '@alienkitty/space.js';

const graph = new GraphSegments({
    value: Array.from({ length: 10 }, () => Math.random()),
    precision: 2,
    lookupPrecision: 100, // per segment
    segments: [5, 5] // length of each segment (minimum length of 2)
});
graph.animateIn();
document.body.appendChild(graph.element);

function animate() {
    requestAnimationFrame(animate);

    graph.update();
}

requestAnimationFrame(animate);
