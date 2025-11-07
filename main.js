import { BezierSystem } from './system.js';
import { BezierView } from './view.js';

document.addEventListener('DOMContentLoaded', () => {
  const BASE_POSITIONS = {
    p0: { x: 200, y: 200 },
    p1: { x: 100, y: 400 },
    p2: { x: 800, y: 100 },
    p3: { x: 700, y: 300 },
  };
  const canvas = document.getElementById('mycanvas');
  const system = new BezierSystem(BASE_POSITIONS,null);
  const view = new BezierView(canvas, system);
  view.render();
});
