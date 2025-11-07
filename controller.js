class BezierController {
  constructor(system, view, canvas) {
    this.system = system;
    this.view = view;
    this.canvas = canvas;
    this.lastTime = 0;
    this.rafId = null;
    this.draggedPoint = null;
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

  handlePointerEvents() {
    
  }

  handleResize() { }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 16.67;
    this.lastTime = now;

    this.system.update(dt);
    this.view.render(this.system);
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
