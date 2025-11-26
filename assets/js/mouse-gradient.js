/**
 * Interactive Background with Canvas
 * - Background: White (default page bg)
 * - Mouse Effect: Blue glow follows mouse with inertia (lag)
 * - Dots: White dots appear on top of the blue glow (visible only on contrast)
 * - Distortion: "Anti-gravity" effect pushes dots away
 */

(function() {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Disable on post pages - REMOVED as requested
    // if (document.body.classList.contains('layout-post')) {
    //     canvas.style.display = 'none';
    //     return;
    // }

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Current mouse position (interpolated for smooth lag)
    let mouse = { x: -1000, y: -1000 };
    // Actual target mouse position
    let targetMouse = { x: -1000, y: -1000 };

    // Configuration
    const DOT_SPACING = 6;       // Much tighter spacing (denser dots)
    const DOT_RADIUS = 2;        // Slightly smaller dots to balance density
    const REVEAL_RADIUS = 600;   // Radius of the blue glow
    const REPULSION_RADIUS = 400; // Radius where dots are pushed away
    const REPULSION_FORCE = 0.01;   // Strength of repulsion
    const LAG_FACTOR = 0.04;     // Lower = more lag/inertia (Stronger delay)
    
    // Colors
    // The glow color (Blue/Purple)
    const GLOW_START = 'rgb(153, 155, 213, 0.2)';
    const GLOW_MID   = 'rgba(169, 171, 214, 0.1)';
    const GLOW_END   = 'rgba(153, 155, 213, 0)';
    
    const DOT_COLOR  = '#ffffff'; // White dots

    let dots = [];

    function init() {
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        requestAnimationFrame(animate);
        
        // Smooth fade-in
        setTimeout(() => {
            canvas.classList.add('loaded');
        }, 100);
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createDots();
    }

    function createDots() {
        dots = [];
        // Create grid slightly larger than screen to handle distortion at edges
        for (let x = -DOT_SPACING; x < width + DOT_SPACING; x += DOT_SPACING) {
            for (let y = -DOT_SPACING; y < height + DOT_SPACING; y += DOT_SPACING) {
                dots.push({
                    baseX: x,
                    baseY: y,
                    x: x,
                    y: y
                });
            }
        }
    }

    function onMouseMove(e) {
        targetMouse.x = e.clientX;
        targetMouse.y = e.clientY;
        
        // Initial jump if first entry to avoid flying in from corner
        if (mouse.x === -1000) {
            mouse.x = targetMouse.x;
            mouse.y = targetMouse.y;
        }
    }

    function onMouseLeave() {
        // Do NOT reset position when leaving. 
        // Keep it at the last known position so the gradient doesn't disappear.
        // targetMouse.x = -1000;
        // targetMouse.y = -1000;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Smoothly interpolate 'mouse' towards 'targetMouse'
        // Standard Lerp: current += (target - current) * factor
        if (targetMouse.x !== -1000) {
            mouse.x += (targetMouse.x - mouse.x) * LAG_FACTOR;
            mouse.y += (targetMouse.y - mouse.y) * LAG_FACTOR;
        }
        // Removed the 'else' block that resets mouse when targetMouse is -1000
        // This allows the gradient to persist at the last location even if mouse leaves (or stays still).

        // 1. Draw Blue Glow (Background behind dots)
        if (mouse.x > -500) {
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REVEAL_RADIUS);
            gradient.addColorStop(0, GLOW_START);
            gradient.addColorStop(0.5, GLOW_MID);
            gradient.addColorStop(1, GLOW_END);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, REVEAL_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Update and Draw Dots (White)
        ctx.fillStyle = DOT_COLOR;
        
        dots.forEach(dot => {
            const dx = mouse.x - dot.baseX;
            const dy = mouse.y - dot.baseY;
            const distSq = dx * dx + dy * dy; 
            
            // Only process if within interaction range
            if (distSq < REVEAL_RADIUS * REVEAL_RADIUS) {
                const distance = Math.sqrt(distSq);
                
                // Anti-gravity / Repulsion Effect
                let shiftX = 0;
                let shiftY = 0;

                if (distance < REPULSION_RADIUS) {
                    const angle = Math.atan2(dy, dx);
                    const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                    const repulsion = force * REPULSION_FORCE;

                    shiftX = -Math.cos(angle) * repulsion;
                    shiftY = -Math.sin(angle) * repulsion;
                }

                dot.x = dot.baseX + shiftX;
                dot.y = dot.baseY + shiftY;

                // Draw Dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    init();

})();
