function isPointInCircle(point, circle, radius) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy < radius * radius;
}

//B(t) = ((1−t)^3)P0 + 3((1−t)^2)tP1 + 3(1−t)(t^2)P2 + (t^3)P3
function cubicBezier(t, p0, p1, p2, p3) {
  const c0 = Math.pow(1 - t, 3);
  const c1 = 3 * Math.pow(1 - t, 2) * t;
  const c2 = 3 * (1 - t) * Math.pow(t, 2);
  const c3 = Math.pow(t, 3);

  const x = c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x;
  const y = c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y;
  return { x, y };
}

//

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
  const p0 = { x: 50, y: 200 };
  const p3 = { x: 550, y: 200 };

  // P1 and P2 - dynamic and draggable
  const p1 = { x: 150, y: 200 };
  const p2 = { x: 450, y: 200 };

  // Dragging State
  let draggedPoint = null;
  const controlPointRadius = 8; // Clickable radius for draggable points

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
      // If we are dragging a point, update its position
      draggedPoint.x = pos.x;
      draggedPoint.y = pos.y;
    } else {
      if (
        isPointInCircle(pos, p1, controlPointRadius) ||
        isPointInCircle(pos, p2, controlPointRadius)
      ) {
        canvas.style.cursor = "grab";
      } else {
        canvas.style.cursor = "crosshair";
      }
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
    });
    requestAnimationFrame(animate)
  }
  animate();
};
