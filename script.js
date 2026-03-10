/* ═══════════════════════════════════════════════════════════════════════
   INTERACTIVE — Divyam Katiyar Portfolio
   ═══════════════════════════════════════════════════════════════════════ */

// ── Typed Text Effect ─────────────────────────────────────────────────
const phrases = [
    'Secure Multi-Party Computation',
    'Oblivious Transfer & OLE',
    'Garbled Circuits',
    'Privacy-Preserving Protocols',
    'Applied Cryptography',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
    const current = phrases[phraseIdx];
    if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
            deleting = true;
            return setTimeout(typeLoop, 2200);
        }
    } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ── Navigation Scroll Effect ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile Nav Toggle ─────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
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

// ── Scroll Reveal ─────────────────────────────────────────────────────
const reveals = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
reveals.forEach(el => revealObserver.observe(el));

// ── Smooth Scroll for Nav Links ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile nav
            if (window.innerWidth <= 600) navLinks.style.display = 'none';
        }
    });
});

// ── Particle Background ──────────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7
            ? `rgba(124,58,237,${this.opacity})`
            : `rgba(38,198,218,${this.opacity})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Create particles — fewer on mobile
const particleCount = window.innerWidth > 600 ? 80 : 35;
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(38,198,218,${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Active Nav Link Highlight ─────────────────────────────────────────
const sections = document.querySelectorAll('.section, .hero');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        const top = s.offsetTop - 200;
        if (window.scrollY >= top) current = s.getAttribute('id');
    });
    navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}`
            ? '#26c6da' : '';
    });
});
