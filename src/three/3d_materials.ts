import { BoxGeometry, Color, HemisphereLight, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

scene.add(new HemisphereLight(0xffffff, 0x888888, 3));

// mesh

const geometry = new BoxGeometry();
geometry.computeTangents();

const material = new MeshNormalMaterial();

const mesh = new Mesh(geometry, material);
scene.add(mesh);

// panel

import { MaterialsPanel, Point3D, UI } from '@alienkitty/space.js/three';

const ui = new UI({ fps: true });
ui.animateIn();
document.body.appendChild(ui.element);

Point3D.init(renderer, scene, camera);

const point = new Point3D(mesh);
scene.add(point);

const materialPanel = new MaterialsPanel(mesh, point);
materialPanel.animateIn(true);

point.setContent(materialPanel);

// animation

function animate(time: number) {
    requestAnimationFrame(animate);

    time = time * 0.001; // seconds

    mesh.rotation.x = time / 2;
    mesh.rotation.y = time;

    controls.update();

    renderer.render(scene, camera);

    Point3D.update(time);
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
