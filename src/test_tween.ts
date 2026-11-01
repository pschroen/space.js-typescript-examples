import { ticker, tween } from '@alienkitty/space.js';

ticker.start();

const data = {
    radius: 0
};

tween(data, { radius: 24, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic', null, () => {
    console.log(data.radius);
});
