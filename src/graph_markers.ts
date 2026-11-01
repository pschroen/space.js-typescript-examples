import { Graph, RadialGraph, Stage, UI, clamp, mapLinear, ticker } from '@alienkitty/space.js';
import { GraphMarkerEvent } from '@alienkitty/space.js/types/ui/GraphMarker.js';

class App {
    static instructionsCounter: number;
    static graph: RadialGraph;
    static graph2: RadialGraph;
    static graph3: Graph;
    static ui: UI;
    static async init() {
        this.instructionsCounter = 0;

        this.initViews();

        this.addListeners();
        this.onResize();
    }

    static initViews() {
        this.graph = new RadialGraph({
            value: Array.from({ length: 10 }, () => Math.random()),
            precision: 2,
            lookupPrecision: 200,
            markers: [ // An array of normalized positions
                [0.5, 'Marker 1'],
                [1, 'Drag me']
            ]
        });
        document.body.appendChild(this.graph.element);

        this.graph2 = new RadialGraph({
            value: Array.from({ length: 10 }, () => Math.random()),
            precision: 2,
            lookupPrecision: 200,
            markers: [ // An array of normalized positions
                [0.5, 'Not me'],
                [1, 'Marker 2']
            ],
            // noMarker: true,
            noMarkerDrag: true
        });
        document.body.appendChild(this.graph2.element);

        this.graph3 = new Graph({
            value: Array.from({ length: 10 }, () => Math.random()),
            precision: 2,
            lookupPrecision: 200
        });
        // An array of normalized positions
        this.graph3.setMarkers([
            [0.5, 'Marker 1'],
            [1, 'Drag me']
        ]);
        document.body.appendChild(this.graph3.element);

        this.ui = new UI({
            instructions: {
                content: `${navigator.maxTouchPoints ? 'Tap' : 'Click'} graph to add marker`
            }
        });
        this.ui.instructions?.animateIn();
        document.body.appendChild(this.ui.element);
    }

    static addListeners() {
        Stage.events.on('marker', this.onMarker);
        document.addEventListener('dblclick', this.preventZoom);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('load', this.onLoad);
        ticker.add(this.onUpdate);
        ticker.start();
    }

    // Event handlers

    static preventZoom = (e: MouseEvent) => {
        e.preventDefault();
    };

    static onMarker = (e: GraphMarkerEvent) => {
        console.log('Marker event:', e);

        if (e.type === 'add') {
            if (this.instructionsCounter === 0) {
                this.ui.instructions?.animateOut(() => {
                    this.ui.instructions?.setContent('Drag away marker to remove');
                    this.ui.instructions?.animateIn();
                });

                this.instructionsCounter++;
            }
        } else {
            if (this.instructionsCounter === 1) {
                this.ui.instructions?.animateOut();
                this.instructionsCounter++;
            }
        }
    };

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (width < height) {
            this.graph.setSize(250, 250);
        } else {
            this.graph.setSize(300, 300);
        }

        if (width < height) {
            this.graph2.setSize(250, 250);
        } else {
            this.graph2.setSize(300, 300);
        }

        this.graph3.setSize(width * 0.74, clamp(mapLinear(height, 600, 1000, 40, 80), 40, 80));
    };

    static onUpdate = () => {
        this.graph.update();
        this.graph2.update();
        this.graph3.update();
        this.ui.update();
    };

    static onLoad = () => {
        this.graph.animateIn();
        this.graph2.animateIn();
        this.graph3.animateIn();
        this.ui.animateIn();
    };
}

App.init();
