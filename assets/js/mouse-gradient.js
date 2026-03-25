/**
 * Interactive Background: Simple Grid Warp
 * - Static grid lines across the page
 * - Lines warp/push away from mouse cursor
 */

(function() {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    let mouse = { x: -1000, y: -1000 };
    let targetMouse = { x: -1000, y: -1000 };
    const LAG_FACTOR = 0.06;

    let R = 78, G = 84, B = 200;

    function readThemeColors() {
        const s = getComputedStyle(document.documentElement);
        const rgb = (s.getPropertyValue('--dot-glow-rgb') || '78, 84, 200').trim();
        const parts = rgb.split(',').map(v => parseInt(v.trim()));
        if (parts.length === 3) { R = parts[0]; G = parts[1]; B = parts[2]; }
    }

    window.updateDotColors = function(rgb) { readThemeColors(); };
    window.updateDotConfig = function(cfg) {
        if (cfg.hide) { canvas.style.opacity = '0'; }
        else { canvas.style.opacity = ''; canvas.classList.add('loaded'); }
    };

    const SPACING = 30;
    const WARP_RADIUS = 200;
    const WARP_STRENGTH = 30;
    const GRID_ALPHA = 0.12;

    // Skip continuous animation on touch-only devices (mobile)
    const isTouchOnly = window.matchMedia('(hover: none)').matches;

    function init() {
        readThemeColors();
        resize();
        window.addEventListener('resize', resize);
        if (isTouchOnly) {
            // Draw static grid once, no animation loop
            drawStaticGrid();
            setTimeout(() => { canvas.classList.add('loaded'); }, 100);
            return;
        }
        document.addEventListener('mousemove', onMouseMove);
        requestAnimationFrame(animate);
        setTimeout(() => { canvas.classList.add('loaded'); }, 100);
    }

    function drawStaticGrid() {
        ctx.strokeStyle = `rgba(${R},${G},${B},${GRID_ALPHA})`;
        ctx.lineWidth = 0.7;
        for (let x = 0; x <= width; x += SPACING) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y <= height; y += SPACING) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function onMouseMove(e) {
        targetMouse.x = e.clientX;
        targetMouse.y = e.clientY;
        if (mouse.x === -1000) { mouse.x = e.clientX; mouse.y = e.clientY; }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (targetMouse.x !== -1000) {
            mouse.x += (targetMouse.x - mouse.x) * LAG_FACTOR;
            mouse.y += (targetMouse.y - mouse.y) * LAG_FACTOR;
        }

        const mx = mouse.x, my = mouse.y;

        ctx.strokeStyle = `rgba(${R},${G},${B},${GRID_ALPHA})`;
        ctx.lineWidth = 0.7;

        // Vertical lines
        for (let x = 0; x <= width; x += SPACING) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 4) {
                const dx = x - mx, dy = y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const warp = Math.max(0, 1 - dist / WARP_RADIUS) * WARP_STRENGTH;
                const ox = dist > 0 ? (dx / dist) * warp : 0;
                if (y === 0) ctx.moveTo(x + ox, y);
                else ctx.lineTo(x + ox, y);
            }
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += SPACING) {
            ctx.beginPath();
            for (let x = 0; x <= width; x += 4) {
                const dx = x - mx, dy = y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const warp = Math.max(0, 1 - dist / WARP_RADIUS) * WARP_STRENGTH;
                const oy = dist > 0 ? (dy / dist) * warp : 0;
                if (x === 0) ctx.moveTo(x, y + oy);
                else ctx.lineTo(x, y + oy);
            }
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    init();

})();
