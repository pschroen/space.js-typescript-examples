import { WebAudio } from '@alienkitty/space.js';

WebAudio.init({ sampleRate: 48000 });
WebAudio.load({ cyberspace: 'https://icecast.cyberspace.app/dive.ogg' });

const cyberspace = WebAudio.get('cyberspace');
cyberspace.gain.set(1);

document.addEventListener('pointerdown', () => {
    cyberspace.play();
});
