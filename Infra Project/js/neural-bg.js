/**
 * Infrastructure Blueprint Background Animation
 * A bespoke, enterprise-grade architecture visualization.
 */
class InfrastructureBlueprint {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.bursts = [];
        this.mouse = { x: null, y: null, radius: 200 };
        this.config = {
            nodeCount: 80,
            connectionDist: 200,
            nodeSpeed: 0.3,
            burstFrequency: 0.015,
            colors: {
                node: '#3B82F6',
                line: 'rgba(59, 130, 246, 0.1)',
                pulse: '#00D4FF',
                text: 'rgba(59, 130, 246, 0.4)'
            },
            tags: ['0xFC', 'ACK_OK', 'P_OUT', 'MTU_1500', 'UDP', 'SYNC', 'LOAD_BAL', 'SEC_UP']
        };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.nodes = [];
        for (let i = 0; i < this.config.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.nodeSpeed,
                vy: (Math.random() - 0.5) * this.config.nodeSpeed,
                size: Math.random() * 3 + 1,
                tag: Math.random() > 0.85 ? this.config.tags[Math.floor(Math.random() * this.config.tags.length)] : null,
                tagAlpha: Math.random(),
                tagDir: 1
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.init());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Digital Grid (Static Blueprint)
        this.drawStaticGrid();

        // Update and draw technical nodes (Small Squares/Crosses)
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Draw Square Node
            this.ctx.fillStyle = this.config.colors.node;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);

            // Draw System Tag
            if (node.tag) {
                node.tagAlpha += 0.005 * node.tagDir;
                if (node.tagAlpha > 0.6 || node.tagAlpha < 0.1) node.tagDir *= -1;

                this.ctx.font = '8px "Fira Code", monospace';
                this.ctx.fillStyle = this.config.colors.node;
                this.ctx.globalAlpha = node.tagAlpha;
                this.ctx.fillText(node.tag, node.x + 8, node.y + 3);
            }
            this.ctx.globalAlpha = 1;
        });

        // Draw Geometric Connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[j];
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.config.connectionDist) {
                    const alpha = (1 - (dist / this.config.connectionDist)) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(n1.x, n1.y);
                    this.ctx.lineTo(n2.x, n2.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Trigger Circuit Bursts
                    if (Math.random() < 0.0001) {
                        this.bursts.push({
                            p1: n1,
                            p2: n2,
                            progress: 0,
                            speed: 0.005 + Math.random() * 0.01
                        });
                    }
                }
            }
        }

        // Draw Circuit Bursts (Moving Data Lines)
        this.bursts.forEach((burst, index) => {
            burst.progress += burst.speed;
            if (burst.progress >= 1) {
                this.bursts.splice(index, 1);
                return;
            }

            this.ctx.beginPath();
            const startX = burst.p1.x + (burst.p2.x - burst.p1.x) * Math.max(0, burst.progress - 0.2);
            const startY = burst.p1.y + (burst.p2.y - burst.p1.y) * Math.max(0, burst.progress - 0.2);
            const endX = burst.p1.x + (burst.p2.x - burst.p1.x) * burst.progress;
            const endY = burst.p1.y + (burst.p2.y - burst.p1.y) * burst.progress;

            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.strokeStyle = this.config.colors.pulse;
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = this.config.colors.pulse;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            this.ctx.lineWidth = 1;
        });

        // Mouse Interactivity - Radial Scan
        if (this.mouse.x) {
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
            const grad = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, this.mouse.radius);
            grad.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
            grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
            this.ctx.fillStyle = grad;
            this.ctx.fill();
        }
    }

    drawStaticGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
        this.ctx.lineWidth = 1;
        const size = 100;
        for (let x = 0; x < this.canvas.width; x += size) {
            this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y < this.canvas.height; y += size) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new InfrastructureBlueprint('neural-canvas');
});
