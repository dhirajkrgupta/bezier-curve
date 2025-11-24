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

  const sidebar = document.querySelector('.sidebar');
  let sidebarState = {
    top: 0,
    right: 0,
    isDragged: false,
    x:0,
    y:0
  }
  sidebar.addEventListener("pointerdown", (e) => {
    sidebarState.isDragged = true;
    sidebarState.x = e.touches ? e.touches[0].clientX : e.clientX;
    sidebarState.y = e.touches ? e.touches[0].clientY : e.clientY;
    sidebar.style.cursor = "grabbing";
    sidebar.setPointerCapture(e.pointerId);
  });

  sidebar.addEventListener("pointermove", (e) => {
    if (sidebarState.isDragged) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx=clientX-sidebarState.x;
      const dy=clientY-sidebarState.y;
      sidebarState.top+=dy;
      sidebarState.right-=dx;
      e.target.style.top=`${sidebarState.top}px`;
      e.target.style.right=`${sidebarState.right}px`;
      sidebarState.x=clientX;
      sidebarState.y=clientY;
    }else{
      sidebar.style.cursor = "grab";
    }
  });

  sidebar.addEventListener("pointerup", (e) => {
    sidebarState.isDragged = false;
    sidebar.style.cursor = "grab";
    sidebar.releasePointerCapture(e.pointerId);
  });
  controller.start();
});

