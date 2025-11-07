class BezierSystem {
    constructor(basepositions, config) {
        this.p0 = basepositions.p0;
        this.p1 = basepositions.p1;
        this.p2 = basepositions.p2;
        this.p3 = basepositions.p3;
        this.k = config.k;
        this.damping = config.damping;
        this.showtangents = config.showtangents;
        this.tx = null;
        this.ty = null;
        this.vx = 0;
        this.vy = 0;
    }

    update(dt) {
        [this.p1, this.p2].forEach((point) => {
        // acceleration = -k * (position - target) - damping * velocity
        const ax = -this.k * (point.x - point.tx) - this.damping * point.vx;
        const ay = -this.k * (point.y - point.ty) - this.damping * point.vy;

        // v=v+at
        point.vx += ax * dt;
        point.vy += ay * dt;

        // s = s + vt
        point.x += point.vx * dt;
        point.y += point.vy * dt;
        });
    }
    resize(scaleFactor) {}
    setTarget(point, x, y) {}
    setParams(k, damping) {}
    toggleTangents(show) {}
    getPoints() {}
}
