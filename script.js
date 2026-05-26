/* ═══════════════════════════════════════════════════════════════════════
   INTERACTIVE — Divyam Katiyar Portfolio
   ═══════════════════════════════════════════════════════════════════════ */

const sections = document.querySelectorAll('.section, .hero');
const navAnchors = document.querySelectorAll('.nav-links a');

// ── Typed Text Effect ─────────────────────────────────────────────────
const phrases = [
    'Secure Multi-Party Computation',
    'Oblivious Transfer & OLE',
    'Garbled Circuits',
    'Privacy-Preserving Protocols',
    'Applied Cryptography',
];

const typedEl = document.getElementById('typed');
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;

function typeLoop() {
    if (!typedEl) return;

    const current = phrases[phraseIdx];
    if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            window.setTimeout(typeLoop, 2200);
            return;
        }
    } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }

    window.setTimeout(typeLoop, deleting ? 35 : 65);
}

typeLoop();

// ── Navigation Scroll Effect (throttled via rAF) ─────────────────────
const nav = document.getElementById('nav');
let scrollTicking = false;

function onScroll() {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);

        let current = '';
        sections.forEach((section) => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });

        navAnchors.forEach((anchor) => {
            anchor.style.color = anchor.getAttribute('href') === `#${current}` ? '#26c6da' : '';
        });

        scrollTicking = false;
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile Nav Toggle ─────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(6,10,20,.97)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '20px 24px';
        navLinks.style.gap = '16px';
        navLinks.style.borderBottom = '1px solid rgba(38,198,218,.1)';
    });
}

// ── Scroll Reveal ─────────────────────────────────────────────────────
const reveals = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

reveals.forEach((el) => revealObserver.observe(el));

// ── Smooth Scroll for Nav Links ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        const target = href ? document.querySelector(href) : null;

        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.innerWidth <= 600 && navLinks) navLinks.style.display = 'none';
        }
    });
});

// ── Lightweight 3D Wireframe Background ──────────────────────────────
const canvas = document.getElementById('particles');

if (canvas) {
    const ctx = canvas.getContext('2d');
    const reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreenMq = window.matchMedia('(max-width: 900px)');

    let width = 0;
    let height = 0;
    let rafId = null;
    let frame = 0;
    let timeBase = 0;

    const config = {
        cols: 22,
        rows: 12,
        depth: 138,
        speed: 0.55,
        fps: 24,
    };

    function shouldDisableScene() {
        const deviceMemory = Number(navigator.deviceMemory || 8);
        return reduceMotionMq.matches || smallScreenMq.matches || deviceMemory <= 4;
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawScene(nowMs) {
        if (document.hidden) {
            rafId = null;
            return;
        }

        if (!timeBase) timeBase = nowMs;
        const interval = 1000 / config.fps;
        const elapsed = nowMs - timeBase;

        if (elapsed < interval) {
            rafId = window.requestAnimationFrame(drawScene);
            return;
        }

        timeBase = nowMs - (elapsed % interval);
        frame += 0.015 * config.speed;

        ctx.clearRect(0, 0, width, height);

        const horizon = height * 0.34;
        const topDepth = 1;
        const bottomDepth = config.depth;
        const cx = width * 0.5;
        const halfW = width * 0.37;

        for (let row = 0; row < config.rows; row++) {
            const z = row / (config.rows - 1);
            const perspective = topDepth + z * (bottomDepth - topDepth);
            const y = horizon + z * (height * 0.70);
            const alpha = 0.03 + z * 0.13;

            ctx.beginPath();
            for (let col = 0; col < config.cols; col++) {
                const xNorm = (col / (config.cols - 1)) * 2 - 1;
                const wave = Math.sin(frame * 1.85 + z * 6.2 + col * 0.30) * (13 * (1 - z));
                const x = cx + xNorm * halfW * (perspective / bottomDepth);
                const py = y + wave;

                if (col === 0) ctx.moveTo(x, py);
                else ctx.lineTo(x, py);
            }

            ctx.strokeStyle = `rgba(38,198,218,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        for (let col = 0; col < config.cols; col += 2) {
            ctx.beginPath();
            for (let row = 0; row < config.rows; row++) {
                const z = row / (config.rows - 1);
                const perspective = topDepth + z * (bottomDepth - topDepth);
                const y = horizon + z * (height * 0.70);
                const xNorm = (col / (config.cols - 1)) * 2 - 1;
                const wave = Math.sin(frame * 1.85 + z * 6.2 + col * 0.30) * (13 * (1 - z));
                const x = cx + xNorm * halfW * (perspective / bottomDepth);
                const py = y + wave;

                if (row === 0) ctx.moveTo(x, py);
                else ctx.lineTo(x, py);
            }

            const alpha = 0.02 + (col / config.cols) * 0.055;
            ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        rafId = window.requestAnimationFrame(drawScene);
    }

    function stopScene() {
        if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
        }
        ctx.clearRect(0, 0, width, height);
    }

    function startScene() {
        if (shouldDisableScene()) {
            stopScene();
            canvas.style.display = 'none';
            return;
        }

        canvas.style.display = 'block';
        resizeCanvas();

        if (rafId === null) {
            frame = 0;
            timeBase = 0;
            rafId = window.requestAnimationFrame(drawScene);
        }
    }

    window.addEventListener('resize', startScene, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopScene();
        else startScene();
    });

    reduceMotionMq.addEventListener('change', startScene);
    smallScreenMq.addEventListener('change', startScene);

    startScene();
}

onScroll();

// ── Subtle Mouse Parallax (desktop only) ─────────────────────────────
const hero = document.getElementById('hero');
const reduceMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)');
const smallScreenGlobal = window.matchMedia('(max-width: 900px)');
const coarsePointerGlobal = window.matchMedia('(pointer: coarse)');

let parallaxRaf = null;
let pointerX = 0;
let pointerY = 0;

const PARALLAX_PRESETS = {
    ultra: { sceneX: 5, sceneY: 3.5, heroX: 2.8, heroY: 1.6, defaultX: -0.04, defaultY: 0.03 },
    balanced: { sceneX: 9, sceneY: 6, heroX: 5, heroY: 3, defaultX: -0.06, defaultY: 0.04 },
    noticeable: { sceneX: 14, sceneY: 9, heroX: 8, heroY: 4.8, defaultX: -0.08, defaultY: 0.05 },
};
const ACTIVE_PARALLAX_PRESET = 'balanced';

function parallaxEnabled() {
    return !reduceMotionGlobal.matches && !smallScreenGlobal.matches && !coarsePointerGlobal.matches;
}

function setParallaxVars(xNorm, yNorm) {
    const preset = PARALLAX_PRESETS[ACTIVE_PARALLAX_PRESET] || PARALLAX_PRESETS.balanced;
    const sceneX = (xNorm * preset.sceneX).toFixed(2);
    const sceneY = (yNorm * preset.sceneY).toFixed(2);
    const heroX = (xNorm * preset.heroX).toFixed(2);
    const heroY = (yNorm * preset.heroY).toFixed(2);

    document.documentElement.style.setProperty('--scene-shift-x', `${sceneX}px`);
    document.documentElement.style.setProperty('--scene-shift-y', `${sceneY}px`);
    document.documentElement.style.setProperty('--hero-shift-x', `${heroX}px`);
    document.documentElement.style.setProperty('--hero-shift-y', `${heroY}px`);
}

function onPointerMove(event) {
    if (!parallaxEnabled()) return;

    pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerY = (event.clientY / window.innerHeight) * 2 - 1;

    if (parallaxRaf !== null) return;

    parallaxRaf = window.requestAnimationFrame(() => {
        setParallaxVars(pointerX * -1, pointerY * -1);
        parallaxRaf = null;
    });
}

function resetParallax() {
    setParallaxVars(0, 0);
}

function refreshParallaxState() {
    const preset = PARALLAX_PRESETS[ACTIVE_PARALLAX_PRESET] || PARALLAX_PRESETS.balanced;

    if (!parallaxEnabled()) {
        resetParallax();
        return;
    }

    // Set a gentle default offset so the hero has depth before first move.
    setParallaxVars(preset.defaultX, preset.defaultY);
}

if (hero) {
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', resetParallax, { passive: true });

    reduceMotionGlobal.addEventListener('change', refreshParallaxState);
    smallScreenGlobal.addEventListener('change', refreshParallaxState);
    coarsePointerGlobal.addEventListener('change', refreshParallaxState);

    refreshParallaxState();
}
