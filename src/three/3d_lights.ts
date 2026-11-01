import { AmbientLight, BoxGeometry, Color, DirectionalLight, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, RectAreaLight, Scene, SpotLight, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

// init

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
scene.background = new Color(0x060606);

const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 10;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// lights

scene.add(new AmbientLight(0xffffff, 3));

scene.add(new HemisphereLight(0xffffff, 0x888888, 3));

const directionalLight = new DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new PointLight();
scene.add(pointLight);

const spotLight = new SpotLight();
spotLight.angle = 0.3;
spotLight.penumbra = 0.2;
spotLight.decay = 2;
spotLight.position.set(-5, 5, 5);
scene.add(spotLight);

RectAreaLightUniformsLib.init();

const rectLight1 = new RectAreaLight(0xff0000, 5, 4, 10);
rectLight1.position.set(-5, 5, -5);
rectLight1.lookAt(0, 0, 0);
scene.add(rectLight1);

const rectLight2 = new RectAreaLight(0x00ff00, 5, 4, 10);
rectLight2.position.set(0, 5, -5);
rectLight2.lookAt(0, 0, 0);
scene.add(rectLight2);

const rectLight3 = new RectAreaLight(0x0000ff, 5, 4, 10);
rectLight3.position.set(5, 5, -5);
rectLight3.lookAt(0, 0, 0);
scene.add(rectLight3);

// mesh

const geometry = new BoxGeometry();
const material = new MeshStandardMaterial({ color: 0x595959, metalness: 0.5, roughness: 0.7 });

const mesh = new Mesh(geometry, material);
scene.add(mesh);

// panel

import { LightPanelController, PanelItem, UI } from '@alienkitty/space.js/three';

const ui = new UI({ fps: true });
ui.animateIn();
document.body.appendChild(ui.element);

const items = [
    {
        name: 'FPS'
    }
];

items.forEach(data => {
    ui.addPanel(new PanelItem(data));
});

LightPanelController.init(scene, ui);

// animation

function animate(time: number) {
    requestAnimationFrame(animate);

    time = time * 0.001; // seconds

    mesh.rotation.x = time / 2;
    mesh.rotation.y = time;

    pointLight.position.x = Math.sin(time * 1.7) * 2;
    pointLight.position.y = Math.cos(time * 1.5) * 2;
    pointLight.position.z = Math.cos(time * 1.3) * 2;

    controls.update();

    renderer.render(scene, camera);

    LightPanelController.update();
    ui.update();
}

requestAnimationFrame(animate);

// resize

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
