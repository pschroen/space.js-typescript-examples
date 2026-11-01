import { LinkedList } from '@alienkitty/space.js';

const list = new LinkedList();

for (let i = 0; i < 4; i++) {
    list.push(i);
}

console.log(list.length); // 4

let object = list.start();
console.log(object); // 0

while (object !== undefined) {
    console.log(object); // 0, 1, 2, 3

    object = list.next();
}

object = list.find(object => object === 1);
console.log(object); // 1
