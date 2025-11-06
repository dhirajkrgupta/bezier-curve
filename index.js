function isPointInCircle(point, circle, radius) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy < radius * radius;
}

//B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃
function cubicBezier(t, p0, p1, p2, p3) {
  const c0 = Math.pow(1 - t, 3);
  const c1 = 3 * Math.pow(1 - t, 2) * t;
  const c2 = 3 * (1 - t) * Math.pow(t, 2);
  const c3 = Math.pow(t, 3);

  const x = c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x;
  const y = c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y;
  return { x, y };
}

//B'(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)
function slope(t, p0, p1, p2, p3) {
  const c0 = 3 * Math.pow(1 - t, 2);
  const c1 = 6 * (1 - t) * t;
  const c2 = 3 * Math.pow(t, 2);
  const dx = c0 * (p1.x - p0.x) + c1 * (p2.x - p1.x) + c2 * (p3.x - p2.x);
  const dy = c0 * (p1.y - p0.y) + c1 * (p2.y - p1.y) + c2 * (p3.y - p2.y);
  return dy / dx;
}

window.onload = () => {
  const canvas = document.getElementById("mycanvas");
  const ctx = canvas.getContext("2d");

  // Initial dimensions and positions
  const INITIAL_WIDTH = 900;
  const INITIAL_HEIGHT = 500;

  // Base positions (unscaled)
  const BASE_POSITIONS = {
    p0: { x: 100, y: 100 },
    p1: { x: 400, y: 200 },
    p2: { x: 500, y: 200 },
    p3: { x: 800, y: 400 }
  };

  // Scale factor to maintain proportions
  let scaleFactor = 1;
  function updateCanvasSize() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const newScaleFactor = containerWidth / INITIAL_WIDTH;

    // Only update positions if scale factor changed
    if (newScaleFactor !== scaleFactor) {
      const scaleRatio = newScaleFactor / scaleFactor;
      scaleFactor = newScaleFactor;
      canvas.width = containerWidth;
      canvas.height = INITIAL_HEIGHT * scaleFactor;

      // Update positions using base positions
      p0.x = BASE_POSITIONS.p0.x * scaleFactor;
      p0.y = BASE_POSITIONS.p0.y * scaleFactor;
      p3.x = BASE_POSITIONS.p3.x * scaleFactor;
      p3.y = BASE_POSITIONS.p3.y * scaleFactor;

      // Scale control points from their current positions !!imp
      [p1, p2].forEach(p => {
        p.x *= scaleRatio;
        p.y *= scaleRatio;
        p.tx *= scaleRatio;
        p.ty *= scaleRatio;
      });
    }

  }

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    updateCanvasSize();
  });
  resizeObserver.observe(canvas.parentElement);

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }
  // Control Points:
  // P0 and P3 - fixed endpoints
  const p0 = { x: BASE_POSITIONS.p0.x, y: BASE_POSITIONS.p0.y };
  const p3 = { x: BASE_POSITIONS.p3.x, y: BASE_POSITIONS.p3.y };

  // P1 and P2 - dynamic and draggable
  const p1 = {
    x: BASE_POSITIONS.p1.x,
    y: BASE_POSITIONS.p1.y,
    vx: 0, vy: 0,
    tx: BASE_POSITIONS.p1.x,
    ty: BASE_POSITIONS.p1.y
  };
  const p2 = {
    x: BASE_POSITIONS.p2.x,
    y: BASE_POSITIONS.p2.y,
    vx: 0, vy: 0,
    tx: BASE_POSITIONS.p2.x,
    ty: BASE_POSITIONS.p2.y
  };

  // Physics parameters
  const k = 0.1;
  const damping = 0.25;
  // Dragging State
  let draggedPoint = null;
  const BASE_CONTROL_POINT_RADIUS = 10;
  const BASE_TANGENT_LENGTH = 150;
  let hue=0;

  // Dynamic sizes that scale with canvas
  function getControlPointRadius() {
    return BASE_CONTROL_POINT_RADIUS * Math.max(0.5, Math.min(1, scaleFactor));
  }

  function getTangentLength() {
    return BASE_TANGENT_LENGTH * scaleFactor;
  }


  canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  canvas.addEventListener("pointerdown", (e) => {
    const pos = getPointerPos(e);

    // Check if we clicked/touched on p1 or p2
    if (isPointInCircle(pos, p1, getControlPointRadius()*2)) {
      draggedPoint = p1;
    } else if (isPointInCircle(pos, p2, getControlPointRadius()*2)) {
      draggedPoint = p2;
    }

    if (draggedPoint) {
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    }
  });

  canvas.addEventListener("pointerup", (e) => {
    if (draggedPoint) {
      canvas.releasePointerCapture(e.pointerId);
    }
    draggedPoint = null;
    canvas.style.cursor = "crosshair"; // Reset to default
  });

  canvas.addEventListener("pointerleave", () => {
    draggedPoint = null; // Stop dragging if pointer leaves
    canvas.style.cursor = "crosshair";
  });

  canvas.addEventListener("pointermove", (event) => {
    const pos = getPointerPos(event);

    if (draggedPoint) {
      // If we are dragging a point, update its target position
      draggedPoint.tx = pos.x;
      draggedPoint.ty = pos.y;
    } else if (
      isPointInCircle(pos, p1, getControlPointRadius()*2) ||
      isPointInCircle(pos, p2, getControlPointRadius()*2)
    ) {
      canvas.style.cursor = "grab";
    } else {
      canvas.style.cursor = "crosshair";
    }
  });

  //Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the main Bezier curve
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    for (let t = 0.01; t <= 1.0; t += 0.01) {
      const point = cubicBezier(t, p0, p1, p2, p3);
      ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "#22D3EE";
    ctx.lineWidth = 10 * Math.max(0.5, Math.min(1, scaleFactor));
    ctx.lineCap="round";
    ctx.stroke();

    // Draw the tangents
    for (let n = 1; n<10; n+=1) {
      const m = slope(n*0.1, p0, p1, p2, p3);
      const { x, y } = cubicBezier(n*0.1, p0, p1, p2, p3);
      const tangentLen = getTangentLength();
      const u1 = (tangentLen / 2) * (1 / Math.sqrt(1 + m * m));
      const u2 = (tangentLen / 2) * (m / Math.sqrt(1 + m * m));

      

      ctx.beginPath();
      ctx.moveTo(x - u1, y - u2);
      ctx.lineTo(x + u1, y + u2);
      ctx.strokeStyle = "#000000a8";
      ctx.lineWidth = 4;
      ctx.lineCap="round";
      ctx.stroke();
    }
    // Draw control point handles
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#F87171";
    ctx.lineWidth = 5;
    ctx.lineCap="round";
    ctx.stroke();

    // Draw control points

    // Fixed points
    ctx.fillStyle = "#df1f1fff";
    [p0, p3].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6 * Math.max(0.5, Math.min(1, scaleFactor)), 0, 2 * Math.PI);
      ctx.fill();
    });

    // Dynamic points (color changes each frame)
    [p1, p2].forEach((p, i) => {
      hue+=1;
      ctx.fillStyle = `hsl(${Math.round(hue)}, 85%, 50%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, getControlPointRadius(), 0, 2 * Math.PI);
      ctx.fill();
      // Update with improved spring physics
      if (!draggedPoint || p !== draggedPoint) {
        // Only apply physics when not being dragged
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0.01) {  // Only update if there's significant movement needed
          p.vx += -k * (p.x - p.tx);
          p.vy += -k * (p.y - p.ty);
          
          // Apply damping
          p.vx *= (1 - damping);
          p.vy *= (1 - damping);
          
          // Update position
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Reset velocities when nearly stopped
          p.vx = 0;
          p.vy = 0;
        }
      }

    });
    requestAnimationFrame(animate);
  }
  animate();
};
