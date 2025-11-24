import { isPointInCircle } from "./math.js";
export class BezierController {
  constructor(system, view, canvas) {
    this.system = system;
    this.view = view;
    this.canvas = canvas;
    this.lastTime = 0;
    this.rafId = null;
    this.draggedPointId = null;
  }

  bindUI(kInput, dampingInput, toggleCheckbox) {

    toggleCheckbox.addEventListener("input", (e) => {
      this.system.toggleTangents(e.target.checked);
    });

    kInput.addEventListener("input", (e) => {
      this.system.setParams(parseFloat(e.target.value), null);
    });
    dampingInput.addEventListener("input", (e) => {
      this.system.setParams(null, parseFloat(e.target.value));
    });
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return this.view.screenToWorld(clientX - rect.left, clientY - rect.top);
  }

  handlePointerEvents() {
    this.canvas.addEventListener("pointerdown", (e) => {
      const pos = this.getPointerPos(e);
      // Check if we clicked/touched on p1 or p2
      const { p1, p2 } = this.system.getPoints();
      if (isPointInCircle(pos, p1, this.system.getControlRadius() * 2)) {
        this.draggedPointId = 1;
      } else if (isPointInCircle(pos, p2, this.system.getControlRadius() * 2)) {
        this.draggedPointId = 2;
      }

      if (this.draggedPointId) {
        this.canvas.style.cursor = "grabbing";
        this.canvas.setPointerCapture(e.pointerId);
      }
    });

    this.canvas.addEventListener("pointermove", (event) => {
      const pos = this.getPointerPos(event);
      const { p1, p2 } = this.system.getPoints();
      if (this.draggedPointId) {
        this.system.setTarget(this.draggedPointId, pos.x, pos.y);
      }
      else if (isPointInCircle(pos, p1, this.system.getControlRadius() * 2) || isPointInCircle(pos, p2, this.system.getControlRadius() * 2)) {
        this.canvas.style.cursor = "grab";
      }
      else {
        this.canvas.style.cursor = "crosshair";
      }
    });

    this.canvas.addEventListener("pointerup", (e) => {
      const pos = this.getPointerPos(e);
      const { p1, p2 } = this.system.getPoints();
      if (this.draggedPointId) {
        this.canvas.releasePointerCapture(e.pointerId);
      }
      this.draggedPointId = null;
      if (isPointInCircle(pos, p1, this.system.getControlRadius() * 2) || isPointInCircle(pos, p2, this.system.getControlRadius() * 2)) {

        this.canvas.style.cursor = "grab";
      }
      else {
        this.canvas.style.cursor = "crosshair";
      }
    });

    this.canvas.addEventListener("pointerleave", () => {
      this.draggedPointId = null; // Stop dragging if pointer leaves
      this.canvas.style.cursor = "crosshair";
    });

  }

  handleResize(container) {
    const newWidth = container.clientWidth
    const scale = newWidth / 900;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = 500 * scale * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${500 * scale}px`;

    this.view.render();
  }

  bindResizeObserver(container) {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize(container);
    });
    this.resizeObserver.observe(container);
  }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 16.67;
    this.lastTime = now;

    this.system.update(dt);
    this.view.render();
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }

  start() {
    this.lastTime = performance.now();
    this.animate();
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
