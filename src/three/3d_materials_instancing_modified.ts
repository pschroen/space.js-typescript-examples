import { Color, HemisphereLight, IcosahedronGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshPhongMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import type { BufferGeometry, Material, Mesh, WebGLProgramParametersWithUniforms } from 'three';
import type { List } from '@alienkitty/space.js';
import type { PanelItemData } from '@alienkitty/space.js/types/panels/PanelItem.js';

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

import { InstanceOptions, MaterialPanels, MaterialPatches, MaterialsPanel, Panel, PanelItem, Point3D, UI } from '@alienkitty/space.js/three';

// Add attributes
geometry.setAttribute('instanceOpacity', new InstancedBufferAttribute(new Float32Array(mesh.instanceMatrix.count).fill(1), 1));

MaterialPatches.Phong.instanceOpacity = function (shader: WebGLProgramParametersWithUniforms) {
    shader.vertexShader = shader.vertexShader.replace(
        '#include <color_pars_vertex>',
        /* glsl */ `
        #include <color_pars_vertex>

        attribute float instanceOpacity;
        varying float vInstanceOpacity;
        `
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <color_vertex>',
        /* glsl */ `
        #include <color_vertex>

        vInstanceOpacity = instanceOpacity;
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_pars_fragment>',
        /* glsl */ `
        #include <color_pars_fragment>

        varying float vInstanceOpacity;
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        /* glsl */ `
        #include <color_fragment>

        diffuseColor.a = vInstanceOpacity * opacity;
        `
    );
};

class InstancedMeshPanel extends Panel {
    mesh: Mesh;
    ui: Point3D;
    materialItems: PanelItemData[];
    constructor(mesh: Mesh, ui: Point3D, materialItems: PanelItemData[]) {
        super();

        this.mesh = mesh;
        this.ui = ui;
        this.materialItems = materialItems;

        this.initPanel();
    }

    initPanel() {
        const mesh = this.mesh;
        const ui = this.ui;
        const materialItems = this.materialItems;

        let point: Point3D;

        if ((ui.constructor as typeof Point3D).points) {
            point = (ui.constructor as typeof Point3D).getPoint(mesh);
        }

        const items: PanelItemData[] = [
            {
                type: 'list',
                name: 'Instance',
                list: InstanceOptions,
                value: 'Mesh',
                callback: (value: string, item: List) => {
                    if (InstanceOptions.get(value)) {
                        const index = point.instances[0].index;

                        const instanceItems: PanelItemData[] = [
                            {
                                type: 'divider'
                            },
                            {
                                type: 'slider',
                                name: 'Opacity',
                                min: 0,
                                max: 1,
                                step: 0.01,
                                value: mesh.geometry.attributes.instanceOpacity.getX(index),
                                callback: (value: number) => {
                                    if (!(mesh.material as Material).transparent) {
                                        (mesh.material as Material).transparent = true;
                                        (mesh.material as Material).needsUpdate = true;
                                    }

                                    point.instances.forEach(instance => {
                                        mesh.geometry.attributes.instanceOpacity.setX(instance.index, value);
                                    });

                                    mesh.geometry.attributes.instanceOpacity.needsUpdate = true;
                                }
                            }
                        ];

                        const instancePanel = new Panel();
                        instancePanel.animateIn(true);

                        instanceItems.forEach(data => {
                            instancePanel.add(new PanelItem(data));
                        });

                        item.setContent(instancePanel);

                        (mesh.material as Material).userData.onBeforeCompile.instanceOpacity = MaterialPatches.Phong.instanceOpacity;

                        (mesh.material as Material).customProgramCacheKey = () => Object.keys(material.userData.onBeforeCompile).join('|');
                        (mesh.material as Material).needsUpdate = true;
                    } else {
                        const materialPanel = new Panel();
                        materialPanel.animateIn(true);

                        materialItems.forEach(data => {
                            materialPanel.add(new PanelItem(data));
                        });

                        item.setContent(materialPanel);
                    }
                }
            }
        ];

        items.forEach(data => {
            this.add(new PanelItem(data));
        });
    }
}

MaterialPanels.InstancedMeshPanel = InstancedMeshPanel;

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
