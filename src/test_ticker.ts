import { ticker } from '@alienkitty/space.js';

ticker.add(onUpdate);
ticker.start();

function onUpdate(time: number, delta: number, frame: number) {
    console.log(time, delta, frame);
}

setTimeout(() => {
    ticker.remove(onUpdate);
}, 1000);
