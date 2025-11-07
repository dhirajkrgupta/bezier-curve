import { cubicBezier, cubicBezierTangentEndPoints } from "./math.js";
export class BezierView {

    constructor(canvas, system) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.system = system;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCurve() {
        
        const { p0, p1, p2, p3 } = this.system.getPoints();
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        for (let t = 0; t <= 1; t += 0.01) {
            const { x, y } = cubicBezier(t, p0, p1, p2, p3);
            this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = "#22D3EE";
        this.ctx.lineWidth = 10 * Math.max(0.5, Math.min(1, this.system.getScale()));;
        this.ctx.lineCap = "round";
        this.ctx.stroke();
    }

    drawTangents() {
        const { p0, p1, p2, p3 } = this.system.getPoints();
        for (let n = 1; n < 10; n += 1) {
            const t = n * 0.1;
            const { start, end } = cubicBezierTangentEndPoints(t, p0, p1, p2, p3, this.system.getTangentLength());
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.strokeStyle = "#161616e5";
            this.ctx.lineWidth = 4 * Math.max(0.5, Math.min(1, this.system.getScale()));;
            this.ctx.lineCap = "round";
            this.ctx.stroke();
        }
    }

    drawHandles() {
        const { p0, p1, p2, p3 } = this.system.getPoints();
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.moveTo(p3.x, p3.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = "#F87171";
        this.ctx.lineWidth = 5 * Math.max(0.5, Math.min(1, this.system.getScale()));;
        this.ctx.lineCap = "round";
        this.ctx.stroke();
    }
    drawPoints() {
        const { p0, p3 } = this.system.getPoints();
        this.ctx.fillStyle = "#df1f1fff";
        [p0, p3].forEach((p) => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 6 * Math.max(0.5, Math.min(1, this.system.getScale())), 0, 2 * Math.PI);
            this.ctx.fill();
        });

        const { p1, p2 } = this.system.getPoints();
        this.ctx.fillStyle = "#1fdf1fff";
        [p1,p2].forEach((p) => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 20 * Math.max(0.5, Math.min(1, this.system.getScale())), 0, 2 * Math.PI);
            this.ctx.fill();
        });

    }
    render() {
        this.clear();
        
        this.drawCurve();
        if (this.system.shouldShowTangents()) {
            this.drawTangents();
        }
        this.drawHandles();
        this.drawPoints();
    }
}