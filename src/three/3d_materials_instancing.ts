import { Color, HemisphereLight, IcosahedronGeometry, InstancedMesh, Matrix4, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import type { BufferGeometry } from 'three';

const isDebug = /[?&]debug/.test(location.search);

const amount = parseInt(location.search.slice(1), 10) || 3;
const count = Math.pow(amount, 3);

const color = new Color();

// init

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
scene.background = new Color(0x060606);

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(amount, amount, amount);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// lights

scene.add(new HemisphereLight(0xffffff, 0x888888, 3));

// mesh

let geometry: BufferGeometry = new IcosahedronGeometry(0.5, 12);

// Convert to indexed geometry
geometry = mergeVertices(geometry);

geometry.computeTangents();

const material = new MeshPhongMaterial();

const mesh = new InstancedMesh(geometry, material, count);

let i = 0;
const offset = (amount - 1) / 2;

const matrix = new Matrix4();

for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
            matrix.setPosition(offset - x, offset - y, offset - z);

            mesh.setMatrixAt(i, matrix);
            mesh.setColorAt(i, color);

            i++;
        }
    }
}

scene.add(mesh);

// panel

import { MaterialsPanel, Point3D, UI } from '@alienkitty/space.js/three';

const ui = new UI({ fps: true });
ui.animateIn();
document.body.appendChild(ui.element);

Point3D.init(renderer, scene, camera, {
    debug: isDebug
});

const point = new Point3D(mesh);
scene.add(point);

const materialPanel = new MaterialsPanel(mesh, point);
materialPanel.animateIn(true);

point.setContent(materialPanel);

// animation

function animate(time: number) {
    requestAnimationFrame(animate);

    time = time * 0.001; // seconds

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
