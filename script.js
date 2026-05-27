/* ═══════════════════════════════════════════════════════
   Portfolio Interactions — Premium
   ═══════════════════════════════════════════════════════ */

/* ── Set data-text on accent name span ── */
document.querySelectorAll('.name-line-accent').forEach(el => {
    el.setAttribute('data-text', el.textContent);
});

/* ── Typing animation ── */
const phrases = [
    'Secure Multi-Party Computation',
    'Lattice Cryptography · RLWE / Ring-SIS',
    'Privacy-Preserving Protocols',
    'Trusted Execution Environments',
    'Applied Cryptography Systems',
];
const typedEl = document.getElementById('typed');
let phraseIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
    if (!typedEl) return;
    const cur = phrases[phraseIdx];
    if (!deleting) {
        typedEl.textContent = cur.slice(0, ++charIdx);
        if (charIdx === cur.length) { deleting = true; window.setTimeout(typeLoop, 2000); return; }
    } else {
        typedEl.textContent = cur.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    window.setTimeout(typeLoop, deleting ? 28 : 55);
}
typeLoop();

/* ── Custom cursor ── */
const cursorEl    = document.getElementById('cursor');
const cursorDot   = cursorEl?.querySelector('.cursor-dot');
const cursorRing  = cursorEl?.querySelector('.cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
    if (cursorDot)  { cursorDot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`; }
    if (cursorRing) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();
document.addEventListener('mouseleave', () => { if (cursorEl) cursorEl.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { if (cursorEl) cursorEl.style.opacity = '1'; });

/* ── Nav scroll ── */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section, .hero');
let ticking = false;
function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s.id; });
        navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${current}` ? '#00e5ff' : '';
        });
        ticking = false;
    });
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile nav toggle ── */
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.querySelector('.nav-links');
if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
        const open = navLinksEl.style.display === 'flex';
        Object.assign(navLinksEl.style, {
            display: open ? 'none' : 'flex',
            position: 'absolute', top: '100%', left: '0', right: '0',
            background: 'rgba(4,6,15,.97)', flexDirection: 'column',
            padding: '20px 24px', gap: '16px',
            borderBottom: '1px solid rgba(0,229,255,.1)',
        });
    });
}

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href') || '');
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* ── Research row hover expand ── */
document.querySelectorAll('.research-row').forEach(row => {
    row.addEventListener('mouseenter', () => { row.style.paddingLeft = '32px'; row.style.paddingRight = '32px'; row.style.margin = '0 -32px'; });
    row.addEventListener('mouseleave', () => { row.style.paddingLeft = ''; row.style.paddingRight = ''; row.style.margin = ''; });
});

/* ── Hero entrance ── */
function heroEntrance() {
    const heroRight = document.querySelector('.hero-right');
    const heroLeft  = document.querySelector('.hero-left');
    if (heroRight) {
        heroRight.style.opacity = '0';
        heroRight.style.transform = 'translateY(32px)';
        heroRight.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1), transform 1s cubic-bezier(.16,1,.3,1)';
        requestAnimationFrame(() => {
            setTimeout(() => {
                heroRight.style.opacity = '1';
                heroRight.style.transform = 'translateY(0)';
            }, 200);
        });
    }
    if (heroLeft) {
        heroLeft.style.opacity = '0';
        heroLeft.style.transform = 'translateY(32px)';
        heroLeft.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1) .15s, transform 1s cubic-bezier(.16,1,.3,1) .15s';
        requestAnimationFrame(() => {
            setTimeout(() => {
                heroLeft.style.opacity = '1';
                heroLeft.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

/* ── Lenis smooth scroll ── */
function initLenis() {
    if (!window.Lenis) return;
    const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
}

/* ── Three.js background ── */
function initScene() {
    const canvas = document.getElementById('particles');
    if (!canvas || !window.THREE) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small   = window.matchMedia('(max-width: 900px)').matches;
    if (reduced || small) { canvas.style.display = 'none'; return; }

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060f, 0.085);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0.2, 14);

    scene.add(new THREE.AmbientLight(0x8fcfff, 0.6));
    const key = new THREE.DirectionalLight(0x6ff0ff, 0.8);
    key.position.set(6, 7, 8);
    scene.add(key);

    /* Particle field */
    const COUNT = 3000;
    const geom  = new THREE.BufferGeometry();
    const pos   = new Float32Array(COUNT * 3);
    const tgt   = new Float32Array(COUNT * 3);
    const chaos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const gx = (i % 30) - 15, gy = (Math.floor(i / 30) % 20) - 10, gz = Math.floor(i / 600) - 3;
        tgt[ix] = gx * 0.24; tgt[ix+1] = gy * 0.24; tgt[ix+2] = gz * 0.34;
        chaos[ix] = (Math.random()-.5)*10; chaos[ix+1] = (Math.random()-.5)*7; chaos[ix+2] = (Math.random()-.5)*6;
        pos[ix] = chaos[ix]; pos[ix+1] = chaos[ix+1]; pos[ix+2] = chaos[ix+2];
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.038, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geom, mat);
    scene.add(points);

    let align = 0;
    let rafId = null;
    function render(time) {
        if (document.hidden) { rafId = null; return; }
        const arr = geom.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
            const ix = i * 3;
            const nx = chaos[ix]   + Math.sin(time * 0.0009 + i * 0.05) * 0.07;
            const ny = chaos[ix+1] + Math.cos(time * 0.0011 + i * 0.04) * 0.07;
            const nz = chaos[ix+2] + Math.sin(time * 0.0012 + i * 0.03) * 0.07;
            arr[ix]   = nx*(1-align) + tgt[ix]*align;
            arr[ix+1] = ny*(1-align) + tgt[ix+1]*align;
            arr[ix+2] = nz*(1-align) + tgt[ix+2]*align;
        }
        geom.attributes.position.needsUpdate = true;
        points.rotation.y += 0.001;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = null; }
        else if (!document.hidden && !rafId) { rafId = requestAnimationFrame(render); }
    });

    /* GSAP scroll: align lattice on hero scroll */
    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.gsap.to({}, {
            scrollTrigger: {
                trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1,
                onUpdate: self => {
                    align = self.progress;
                    camera.position.z = 14 - self.progress * 5;
                }
            }
        });
    }

    rafId = requestAnimationFrame(render);
}

/* ── Boot ── */
if (document.readyState === 'complete') {
    heroEntrance(); initLenis(); initScene(); onScroll();
} else {
    window.addEventListener('load', () => { heroEntrance(); initLenis(); initScene(); onScroll(); });
}
