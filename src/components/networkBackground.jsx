import React, { useEffect, useRef } from "react";

export default function NetworkBackground({ className = "" }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId = null;
        let isRunning = true;

        const handleResize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.clientWidth : window.innerWidth;
            canvas.height = parent ? parent.clientHeight : window.innerHeight;
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const cols = 32;
        const rows = 22;
        let time = 0;

        const render = () => {
            if (!isRunning) return;

            time += 0.012;
            const width = canvas.width || window.innerWidth;
            const height = canvas.height || 700;

            ctx.clearRect(0, 0, width, height);

            // Perspective mapping across 100% of full canvas height & width
            const points = [];
            for (let r = 0; r < rows; r++) {
                points[r] = [];
                // Depth factor t: 0 = foreground (bottom), 1 = background (top)
                const t = r / (rows - 1);

                // Scale decreases into the distance
                const scale = 1.0 - 0.78 * Math.pow(t, 0.8);

                // Y position spans from 95% (bottom) to 5% (top) of canvas height
                const baseY = height * (0.95 - 0.90 * Math.pow(t, 0.75));

                // Horizontal perspective spread
                const spreadX = width * (1.6 - 0.85 * t);

                for (let c = 0; c < cols; c++) {
                    const x = width / 2 + (c - (cols - 1) / 2) * (spreadX / (cols - 1));

                    // Subtle wave elevation animation
                    const wave = (Math.sin(c * 0.35 + time) * 16 + Math.cos(r * 0.45 + time * 0.8) * 12) * scale;
                    const y = baseY + wave;

                    points[r][c] = { x, y, scale };
                }
            }

            // Draw Connecting Net Lines
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p1 = points[r][c];

                    // Horizontal link
                    if (c < cols - 1) drawLine(ctx, p1, points[r][c + 1], width, height);
                    // Depth link
                    if (r < rows - 1) drawLine(ctx, p1, points[r + 1][c], width, height);
                    // Diagonal net link
                    if (r < rows - 1 && c < cols - 1) drawLine(ctx, p1, points[r + 1][c + 1], width, height);
                }
            }

            // Draw Yellow Nodes
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const p = points[r][c];
                    if (p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) continue;

                    const radius = Math.max(1, 4.5 * p.scale);
                    const alpha = Math.min(1, Math.max(0.25, p.scale * 1.3));

                    ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        function drawLine(ctx, p1, p2, width, height) {
            if (
                (p1.x < -100 && p2.x < -100) ||
                (p1.x > width + 100 && p2.x > width + 100) ||
                (p1.y < -100 && p2.y < -100) ||
                (p1.y > height + 100 && p2.y > height + 100)
            ) return;

            const avgScale = (p1.scale + p2.scale) / 2;
            const alpha = Math.min(0.85, Math.max(0.12, avgScale * 1.1));
            const lineWidth = Math.max(0.6, 2.0 * avgScale);

            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        const startAnimation = () => {
            if (!isRunning) {
                isRunning = true;
                render();
            }
        };

        const stopAnimation = () => {
            isRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };

        // Pause canvas rendering when the user switches tabs or minimizes the window
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Initial start
        render();

        return () => {
            stopAnimation();
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        /* Added opacity-25 to soften the canvas transparency */
        <div className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-25 ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}