export function isPointInCircle(point, circle, radius) {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy < radius * radius;
}

//B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃
export function cubicBezier(t, p0, p1, p2, p3) {
  const c0 = Math.pow(1 - t, 3);
  const c1 = 3 * Math.pow(1 - t, 2) * t;
  const c2 = 3 * (1 - t) * Math.pow(t, 2);
  const c3 = Math.pow(t, 3);

  const x = c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x;
  const y = c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y;
  return { x, y };
}

//B'(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)
export function slope(t, p0, p1, p2, p3) {
  const c0 = 3 * Math.pow(1 - t, 2);
  const c1 = 6 * (1 - t) * t;
  const c2 = 3 * Math.pow(t, 2);
  const dx = c0 * (p1.x - p0.x) + c1 * (p2.x - p1.x) + c2 * (p3.x - p2.x);
  const dy = c0 * (p1.y - p0.y) + c1 * (p2.y - p1.y) + c2 * (p3.y - p2.y);
  return dy / dx;
}