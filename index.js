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

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
  // Control Points:
  // P0 and P3 -fixed endpoints
  const p0 = { x: 300, y: 200 };
  const p3 = { x: 600, y: 200 };

  // P1 and P2 - dynamic and draggable
  const p1 = { x: 400, y: 200, vx: 0, vy: 0, tx: 400, ty: 200 };
  const p2 = { x: 500, y: 200, vx: 0, vy: 0, tx: 500, ty: 200 };
  const k=0.05;
  const damping=0.1;
  // Dragging State
  let draggedPoint = null;
  const controlPointRadius = 8; // Clickable radius for draggable points
  const tangentLength = 80;

  canvas.addEventListener("mousedown", (e) => {
    const pos = getMousePos(e);

    // Check if we clicked on p1 or p2
    if (isPointInCircle(pos, p1, controlPointRadius)) {
      draggedPoint = p1;
    } else if (isPointInCircle(pos, p2, controlPointRadius)) {
      draggedPoint = p2;
    }

    if (draggedPoint) {
      canvas.style.cursor = "grabbing";
    }
  });

  canvas.addEventListener("mouseup", () => {
    draggedPoint = null;
    canvas.style.cursor = "crosshair"; // Reset to default
  });

  canvas.addEventListener("mouseleave", () => {
    draggedPoint = null; // Stop dragging if mouse leaves
    canvas.style.cursor = "crosshair";
  });

  canvas.addEventListener("mousemove", (event) => {
    const pos = getMousePos(event);

    if (draggedPoint) {
      // If we are dragging a point, update its target position
      draggedPoint.tx = pos.x;
      draggedPoint.ty = pos.y;
    } else if (
      isPointInCircle(pos, p1, controlPointRadius) ||
      isPointInCircle(pos, p2, controlPointRadius)
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
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw the tangents
    for (let t = 0.2; t < 1.0; t += 0.2) {
      const m = slope(t, p0, p1, p2, p3);
      const { x, y } = cubicBezier(t, p0, p1, p2, p3);
      const u1 = (tangentLength / 2) * (1 / Math.sqrt(1 + m * m));
      const u2 = (tangentLength / 2) * (m / Math.sqrt(1 + m * m));
      ctx.beginPath();
      ctx.moveTo(x - u1, y - u2);
      ctx.lineTo(x + u1, y + u2);
      ctx.strokeStyle = "#ee224eff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Draw control point handles
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#F87171";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw control points

    // Fixed points
    ctx.fillStyle = "#F87171";
    [p0, p3].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI); // Slightly smaller
      ctx.fill();
    });

    // Dynamic points
    ctx.fillStyle = "#FB923C";
    [p1, p2].forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, controlPointRadius, 0, 2 * Math.PI); // Used clickable radius
      ctx.fill();
      //update according to spring eqaution  acceleration = -k * (position - target) - damping * velocity
      p.vx+=-k*(p.x-p.tx)-damping*p.vx;
      p.vy+=-k*(p.y-p.ty)-damping*p.vy
      p.x+=p.vx;
      p.y+=p.vy;

    });
    requestAnimationFrame(animate);
  }
  animate();
};
