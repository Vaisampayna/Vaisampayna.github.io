/* ═══════════════════════════════════════════════════════════════════════
   Secure Enclave Portfolio Interactions
   ═══════════════════════════════════════════════════════════════════════ */

const sections = document.querySelectorAll('.section, .hero');
const navAnchors = document.querySelectorAll('.nav-links a');

const phrases = [
    'Secure Multi-Party Computation',
    'Lattice Cryptography · RLWE / Ring-SIS',
    'Privacy-Preserving Machine Learning',
    'Trusted Execution Environments (OP-TEE)',
    'Applied Cryptography Systems',
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

    window.setTimeout(typeLoop, deleting ? 30 : 60);
}

typeLoop();

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

function initLenis() {
    if (!window.Lenis) return;
    const lenis = new window.Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function initSecureEnclaveScene() {
    const canvas = document.getElementById('particles');
    if (!canvas || !window.THREE) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.matchMedia('(max-width: 900px)').matches;
    const memory = Number(navigator.deviceMemory || 8);
    if (reduceMotion || isSmall || memory <= 4) {
        canvas.style.display = 'none';
        return;
    }

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.09);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0.2, 14);

    scene.add(new THREE.AmbientLight(0x8fcfff, 0.7));
    const key = new THREE.DirectionalLight(0x6ff0ff, 0.9);
    key.position.set(6, 7, 8);
    scene.add(key);

    const root = new THREE.Group();
    scene.add(root);
    const modelGroup = new THREE.Group();
    root.add(modelGroup);
    let enclaveModel = null;
    let modelLoaded = false;

    // 1) Lattice cloud that can align with secret-view angle
    const latticeCount = 3600;
    const latticeGeom = new THREE.BufferGeometry();
    const latticePos = new Float32Array(latticeCount * 3);
    const latticeTarget = new Float32Array(latticeCount * 3);
    const latticeChaos = new Float32Array(latticeCount * 3);

    for (let i = 0; i < latticeCount; i++) {
        const ix = i * 3;

        // target: structured 3D lattice
        const gx = (i % 30) - 15;
        const gy = ((Math.floor(i / 30)) % 20) - 10;
        const gz = Math.floor(i / 600) - 3;
        latticeTarget[ix] = gx * 0.24;
        latticeTarget[ix + 1] = gy * 0.24;
        latticeTarget[ix + 2] = gz * 0.34;

        // chaos: random noisy points
        latticeChaos[ix] = (Math.random() - 0.5) * 10;
        latticeChaos[ix + 1] = (Math.random() - 0.5) * 7;
        latticeChaos[ix + 2] = (Math.random() - 0.5) * 6;

        latticePos[ix] = latticeChaos[ix];
        latticePos[ix + 1] = latticeChaos[ix + 1];
        latticePos[ix + 2] = latticeChaos[ix + 2];
    }

    latticeGeom.setAttribute('position', new THREE.BufferAttribute(latticePos, 3));
    const latticeMat = new THREE.PointsMaterial({
        color: 0x67e8f9,
        size: 0.04,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const lattice = new THREE.Points(latticeGeom, latticeMat);
    root.add(lattice);

    // 2) TEE sphere + two execution zones
    const teeSphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.65, 2),
        new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uA: { value: new THREE.Color('#d7f4ff') },
                uB: { value: new THREE.Color('#4cd8ff') },
            },
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: `
                uniform float uTime;
                varying vec3 vN;
                varying vec3 vP;
                void main() {
                    vec3 p = position + normal * sin(uTime * 1.2 + position.y * 5.0) * 0.03;
                    vN = normal;
                    vP = p;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uA;
                uniform vec3 uB;
                uniform float uTime;
                varying vec3 vN;
                varying vec3 vP;
                void main() {
                    float fres = pow(1.0 - abs(dot(normalize(vN), vec3(0.0,0.0,1.0))), 2.2);
                    float pulse = 0.5 + 0.5 * sin(uTime * 1.8 + vP.y * 4.0);
                    vec3 col = mix(uA, uB, pulse * 0.7 + fres * 0.3);
                    float a = 0.24 + fres * 0.35;
                    gl_FragColor = vec4(col, a);
                }
            `,
        })
    );
    teeSphere.visible = false;
    root.add(teeSphere);

    const zoneGeo = new THREE.BufferGeometry();
    const zoneCount = 1200;
    const zonePos = new Float32Array(zoneCount * 3);
    for (let i = 0; i < zoneCount; i++) {
        const ix = i * 3;
        zonePos[ix] = (Math.random() - 0.5) * 10;
        zonePos[ix + 1] = (Math.random() - 0.5) * 6;
        zonePos[ix + 2] = (Math.random() - 0.5) * 3;
    }
    zoneGeo.setAttribute('position', new THREE.BufferAttribute(zonePos, 3));
    const zoneMat = new THREE.PointsMaterial({ color: 0x65d8ff, size: 0.03, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    const zones = new THREE.Points(zoneGeo, zoneMat);
    zones.visible = false;
    root.add(zones);

    // 3) MPC streams -> result particle
    const mpcGroup = new THREE.Group();
    mpcGroup.visible = false;
    root.add(mpcGroup);

    function createStream(color, yOffset) {
        const pts = [];
        for (let i = 0; i <= 80; i++) {
            const t = i / 80;
            pts.push(new THREE.Vector3(-3.3 + t * 5.8, yOffset + Math.sin(t * Math.PI * 2) * 0.18, Math.cos(t * 3.1) * 0.2));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
        return new THREE.Line(geo, mat);
    }

    const s1 = createStream(0x22d3ee, 0.9);
    const s2 = createStream(0x7c3aed, 0.0);
    const s3 = createStream(0x16a34a, -0.9);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshBasicMaterial({ color: 0x95f3ff }));
    core.position.set(2.6, 0, 0);
    const result = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    result.position.set(3.0, 0, 0);

    mpcGroup.add(s1, s2, s3, core, result);

    // 4) Timeline trace
    const timelineGroup = new THREE.Group();
    timelineGroup.visible = false;
    root.add(timelineGroup);

    const timelineNodes = [
        new THREE.Vector3(-3.8, -1.2, 0),
        new THREE.Vector3(-2.2, -0.6, 0),
        new THREE.Vector3(-0.6, 0.0, 0),
        new THREE.Vector3(1.2, 0.7, 0),
        new THREE.Vector3(3.4, 1.5, 0),
    ];

    const traceGeom = new THREE.BufferGeometry().setFromPoints(timelineNodes);
    const traceLine = new THREE.Line(traceGeom, new THREE.LineBasicMaterial({ color: 0x6de6ff, transparent: true, opacity: 0.7 }));
    timelineGroup.add(traceLine);

    const nodeMeshes = timelineNodes.map((p) => {
        const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: 0x274d6d }));
        n.position.copy(p);
        timelineGroup.add(n);
        return n;
    });

    const tracer = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    timelineGroup.add(tracer);

    const sceneState = {
        mode: 0,
        align: 0,
        timelineProgress: 0,
    };

    function loadEnclaveModel() {
        if (!THREE.GLTFLoader) return;

        const loader = new THREE.GLTFLoader();
        if (THREE.DRACOLoader) {
            const draco = new THREE.DRACOLoader();
            draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
            loader.setDRACOLoader(draco);
        }

        loader.load(
            'assets/models/secure-enclave.glb',
            (gltf) => {
                enclaveModel = gltf.scene;
                enclaveModel.scale.set(1.8, 1.8, 1.8);
                enclaveModel.position.set(0, -0.2, 0);
                enclaveModel.traverse((obj) => {
                    if (!obj.isMesh) return;
                    obj.castShadow = false;
                    obj.receiveShadow = false;
                    if (obj.material) {
                        obj.material.transparent = true;
                        obj.material.opacity = Math.min(1, obj.material.opacity || 1);
                    }
                });
                modelGroup.add(enclaveModel);
                modelLoaded = true;
            },
            undefined,
            () => {
                // Try embedded glTF placeholder model if GLB is missing.
                loader.load(
                    'assets/models/secure-enclave.gltf',
                    (gltf) => {
                        enclaveModel = gltf.scene;
                        enclaveModel.scale.set(2.2, 2.2, 2.2);
                        enclaveModel.position.set(0, -0.1, 0);
                        enclaveModel.traverse((obj) => {
                            if (!obj.isMesh) return;
                            obj.castShadow = false;
                            obj.receiveShadow = false;
                            obj.material = new THREE.MeshPhysicalMaterial({
                                color: 0xb8e9ff,
                                emissive: 0x215eb7,
                                emissiveIntensity: 0.22,
                                transmission: 0.28,
                                transparent: true,
                                opacity: 0.92,
                                roughness: 0.28,
                                metalness: 0.04,
                            });
                        });
                        modelGroup.add(enclaveModel);
                        modelLoaded = true;
                    },
                    undefined,
                    () => {
                        // Fallback visuals remain active if model fails to load.
                    }
                );
            }
        );
    }

    function setMode(mode) {
        sceneState.mode = mode;
        if (modelLoaded) {
            lattice.visible = false;
            teeSphere.visible = false;
            zones.visible = false;
            mpcGroup.visible = false;
            timelineGroup.visible = false;
            return;
        }
        lattice.visible = mode === 0;
        teeSphere.visible = mode === 1;
        zones.visible = mode === 1;
        mpcGroup.visible = mode === 2;
        timelineGroup.visible = mode === 3;
    }

    setMode(0);

    function updateLattice(time) {
        const pos = latticeGeom.attributes.position.array;
        for (let i = 0; i < latticeCount; i++) {
            const ix = i * 3;
            const t = sceneState.align;

            const nx = latticeChaos[ix] + Math.sin(time * 0.0009 + i * 0.05) * 0.08;
            const ny = latticeChaos[ix + 1] + Math.cos(time * 0.0011 + i * 0.04) * 0.08;
            const nz = latticeChaos[ix + 2] + Math.sin(time * 0.0012 + i * 0.03) * 0.08;

            pos[ix] = nx * (1 - t) + latticeTarget[ix] * t;
            pos[ix + 1] = ny * (1 - t) + latticeTarget[ix + 1] * t;
            pos[ix + 2] = nz * (1 - t) + latticeTarget[ix + 2] * t;
        }
        latticeGeom.attributes.position.needsUpdate = true;
        lattice.rotation.y += 0.0012;
    }

    function updateTEE(time) {
        teeSphere.material.uniforms.uTime.value = time * 0.001;
        teeSphere.rotation.y += 0.004;

        const pos = zoneGeo.attributes.position.array;
        for (let i = 0; i < zoneCount; i++) {
            const ix = i * 3;
            pos[ix + 2] = Math.sin(time * 0.001 + i * 0.07) * 0.6;
        }
        zoneGeo.attributes.position.needsUpdate = true;
    }

    function updateMPC(time) {
        core.scale.setScalar(1 + Math.sin(time * 0.004) * 0.12);
        result.position.x = 3.0 + Math.sin(time * 0.003) * 0.3;
        result.material.opacity = 0.8 + Math.abs(Math.sin(time * 0.005)) * 0.2;
    }

    function updateTimeline() {
        const p = Math.max(0, Math.min(0.999, sceneState.timelineProgress));
        const scaled = p * (timelineNodes.length - 1);
        const a = Math.floor(scaled);
        const b = Math.min(a + 1, timelineNodes.length - 1);
        const t = scaled - a;

        tracer.position.lerpVectors(timelineNodes[a], timelineNodes[b], t);
        nodeMeshes.forEach((n, idx) => {
            n.material.color.setHex(idx <= a ? 0x9af5ff : 0x274d6d);
        });
    }

    let rafId = null;
    function render(time) {
        if (document.hidden) {
            rafId = null;
            return;
        }

        if (modelLoaded && enclaveModel) {
            enclaveModel.rotation.y += 0.0035;
            enclaveModel.rotation.x = Math.sin(time * 0.0005) * 0.08;
            enclaveModel.position.y = -0.2 + Math.sin(time * 0.0012) * 0.08;

            if (sceneState.mode === 0) enclaveModel.scale.setScalar(1.75 + sceneState.align * 0.2);
            if (sceneState.mode === 1) enclaveModel.scale.setScalar(1.95);
            if (sceneState.mode === 2) enclaveModel.scale.setScalar(1.85);
            if (sceneState.mode === 3) enclaveModel.scale.setScalar(1.7 + sceneState.timelineProgress * 0.25);
        } else {
            if (sceneState.mode === 0) updateLattice(time);
            if (sceneState.mode === 1) updateTEE(time);
            if (sceneState.mode === 2) updateMPC(time);
            if (sceneState.mode === 3) updateTimeline();
        }

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(render);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!document.hidden && rafId === null) {
            rafId = requestAnimationFrame(render);
        }
    });

    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);

        window.gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    setMode(0);
                    sceneState.align = self.progress;
                    camera.position.z = 14 - self.progress * 4.5;
                    camera.position.x = self.progress * 0.8;
                },
            },
        });

        window.gsap.timeline({
            scrollTrigger: {
                trigger: '#research',
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    setMode(1);
                    camera.position.z = 9 - self.progress * 4.2;
                    camera.position.y = 0.1 - self.progress * 0.3;
                    zones.material.opacity = 0.35 + (1 - self.progress) * 0.35;
                },
            },
        });

        window.gsap.timeline({
            scrollTrigger: {
                trigger: '#projects',
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    setMode(2);
                    camera.position.z = 7.2 + self.progress * 0.8;
                    mpcGroup.rotation.y = self.progress * 0.4;
                },
            },
        });

        window.gsap.timeline({
            scrollTrigger: {
                trigger: '#contact',
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    setMode(3);
                    sceneState.timelineProgress = self.progress;
                    camera.position.z = 8.2;
                },
            },
        });
    }

    loadEnclaveModel();
    rafId = requestAnimationFrame(render);
}

// Wait for all deferred external scripts (Three.js, GSAP, Lenis) to fully load
// before initializing — this is the key fix for Vercel's blank hero section.
if (document.readyState === 'complete') {
    initLenis();
    initSecureEnclaveScene();
    onScroll();
} else {
    window.addEventListener('load', () => {
        initLenis();
        initSecureEnclaveScene();
        onScroll();
    });
}
