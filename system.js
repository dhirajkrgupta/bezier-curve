export class BezierSystem {

    constructor(basepositions, config) {
        this.p0 = basepositions.p0;
        this.p3 = basepositions.p3;
        this.p1 = {
            ...basepositions.p1,
            vx: 0,
            vy: 0,
            tx: basepositions.p1.x,
            ty: basepositions.p1.y,
        };
        this.p2 = {
            ...basepositions.p2,
            vx: 0,
            vy: 0,
            tx: basepositions.p2.x,
            ty: basepositions.p2.y,
        };
        this.k = config?.k || 0.1;
        this.damping = config?.damping || 0.25;
        this.showtangents = config?.showtangents || false;
        this.scaleFactor = 1;
        this.BASE_RADIUS = config?.baseRadius || 20;
        this.BASE_TANGENT_LENGTH = config?.baseTangent || 200;
        this.INITIAL_WIDTH = config?.initialWidth || 900;
        this.INITIAL_HEIGHT = config?.initialHeight || 500;
    }

    update(dt = 1) {
        [this.p1, this.p2].forEach((point) => {
            // acceleration = -k * (position - target) - damping * velocity
            const ax = -this.k * (point.x - point.tx) - this.damping * point.vx;
            const ay = -this.k * (point.y - point.ty) - this.damping * point.vy;

            // v=v+at
            point.vx += ax * dt;
            point.vy += ay * dt;

            let nextX = point.x + point.vx * dt;
            let nextY = point.y + point.vy * dt;

            const r = this.getControlRadius();
            const W = this.INITIAL_WIDTH;
            const H = this.INITIAL_HEIGHT;

            if (nextX + r > W) {
                nextX = W - r;
                point.vx *= -0.8;
            } else if (nextX - r < 0) {
                nextX = r;
                point.vx *= -0.8;
            }

            if (nextY + r > H) {
                nextY = H - r;
                point.vy *= -0.8;
            } else if (nextY - r < 0) {
                nextY = r;
                point.vy *= -0.8;
            }

            // s = s + vt
            point.x = nextX;
            point.y = nextY;
        });
    }

    scale(newScaleFactor) {

        const scaleRatio = newScaleFactor / this.scaleFactor;
        this.scaleFactor = newScaleFactor;
        // Adjust control points based on scale ratio

        [this.p0, this.p3].forEach(p => {
            p.x *= scaleRatio;
            p.y *= scaleRatio;
        });

        [this.p1, this.p2].forEach(p => {
            p.x *= scaleRatio;
            p.y *= scaleRatio;
            p.tx *= scaleRatio;
            p.ty *= scaleRatio;
        });

    }

    //GETTERS:
    shouldShowTangents() {
        return this.showtangents;
    }

    getScale() {
        return this.scaleFactor;
    }

    getControlRadius() {
        return this.BASE_RADIUS * Math.max(0.5, Math.min(1, this.scaleFactor));
    }
    getPoints() {
        return {
            p0: this.p0,
            p1: this.p1,
            p2: this.p2,
            p3: this.p3,
        };
    }

    getTangentLength() {
        return this.BASE_TANGENT_LENGTH * Math.max(0.5, Math.min(1, this.scaleFactor));
    }

    //SETTERS
    setTarget(id, x, y) {
        if (id === 1) {
            this.p1.tx = x;
            this.p1.ty = y;
        } else if (id === 2) {
            this.p2.tx = x;
            this.p2.ty = y;
        }
    }
    setScaleFactor(scale) {
        this.scaleFactor = scale;
    }
    setParams(k, damping) {
        this.k = k ? k : this.k;
        this.damping = damping ? damping : this.damping;
    }

    toggleTangents(show) {
        this.showtangents = show;
    }
}
