import { BezierSystem } from './system.js';
import { BezierView } from './view.js';
import { BezierController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const BASE_POSITIONS = {
    p0: { x: 200, y: 200 },
    p1: { x: 100, y: 400 },
    p2: { x: 800, y: 100 },
    p3: { x: 700, y: 300 },
  };
  const canvas = document.getElementById('mycanvas');
  const container = canvas.parentElement;
  const system = new BezierSystem(BASE_POSITIONS, null);
  const view = new BezierView(canvas, system);
  const controller = new BezierController(system, view, canvas);

  const k_input = document.getElementById('k');
  const damping_input = document.getElementById('damping');
  const toggle_checkbox = document.getElementById('tangents');
  controller.bindUI(k_input, damping_input, toggle_checkbox);
  controller.handlePointerEvents();
  controller.bindResizeObserver(container);
  controller.start();


});
