import { BufferLoader, WebAudio } from '@alienkitty/space.js';

const loader = new BufferLoader();
await loader.loadAllAsync(['assets/sounds/gong.mp3']);
WebAudio.init({ sampleRate: 48000 });
WebAudio.load(loader.files);

const gong = WebAudio.get('gong');
gong.gain.set(0.5);

document.addEventListener('pointerdown', () => {
    gong.play();
});
