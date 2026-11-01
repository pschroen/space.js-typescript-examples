import { SVGPathProperties } from '@alienkitty/space.js';

// https://github.com/rveciana/svg-path-properties
const properties = new SVGPathProperties('M0,100 Q50,-50 100,100 T200,100');
const length = properties.getTotalLength();
const point = properties.getPointAtLength(200);
const tangent = properties.getTangentAtLength(200);
const allProperties = properties.getPropertiesAtLength(200);
const parts = properties.getParts();

console.log(length, point, tangent, allProperties, parts);
