import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import './styles.css';
import './cinematic.css';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);
const mix = (a, b, t) => a + (b - a) * t;

const services = [
  ['01', 'Strategy'],
  ['02', 'Brand & Experience'],
  ['03', 'Websites & Products'],
  ['04', 'Systems & Automation'],
];

const projects = [
  ['Sulawog', 'Healthcare · Commerce · Operations'],
  ['ShopSheron', 'Fashion · E-commerce'],
  ['Consult Sulawog', 'Healthcare · Patient Experience'],
];

function CinematicWorld() {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.7));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const lime = new THREE.Color('#b8ff38');
    const bone = new THREE.Color('#f2f0e9');

    const ambient = new THREE.AmbientLight('#d6ded0', 1.25);
    scene.add(ambient);
    const key = new THREE.PointLight(lime, 22, 20);
    key.position.set(3, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight('#f2f0e9', 8, 18);
    rim.position.set(-4, -1, 4);
    scene.add(rim);

    // The same core survives every chapter.
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: '#101510',
      emissive: '#24420d',
      emissiveIntensity: 0.62,
      metalness: 0.62,
      roughness: 0.2,
      transmission: 0.08,
      clearcoat: 0.7,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 2), coreMat);
    coreGroup.add(core);

    const edgeMat = new THREE.LineBasicMaterial({ color: lime, transparent: true, opacity: 0.58 });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.45, 2)), edgeMat);
    coreGroup.add(wire);

    const rings = [
      [2.0, 0.01, [1.15, 0.2, 0.25]],
      [2.55, 0.012, [0.42, 1.15, 0.55]],
      [3.06, 0.008, [0.8, 0.65, 1.25]],
    ].map(([r, tube, rot], i) => {
      const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? bone : lime, transparent: true, opacity: i === 1 ? 0.2 : 0.3 });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 6, 160), mat);
      mesh.rotation.set(...rot);
      coreGroup.add(mesh);
      return mesh;
    });

    // Portal rings expand out of the hero and become the service transition.
    const portal = new THREE.Group();
    scene.add(portal);
    const portalRings = [2.7, 3.25, 3.8, 4.35].map((r, i) => {
      const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? bone : lime, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 6, 180), mat);
      mesh.rotation.set(Math.PI / 2 + i * 0.09, i * 0.14, i * 0.18);
      portal.add(mesh);
      return mesh;
    });

    // Fragments release during Services and become visual momentum into Work.
    const fragments = [];
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? '#b8ff38' : '#222821',
        emissive: i % 3 === 0 ? '#24420d' : '#000000',
        transparent: true,
        opacity: 0,
        roughness: 0.4,
        metalness: 0.35,
      });
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.12 + (i % 4) * 0.035, 0), mat);
      mesh.userData.angle = (i / 14) * Math.PI * 2;
      mesh.userData.radius = 1.7 + (i % 5) * 0.42;
      mesh.userData.speed = 0.32 + (i % 4) * 0.07;
      scene.add(mesh);
      fragments.push(mesh);
    }

    // Project panels are the physical form the fragments resolve into.
    const projectPanels = [];
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: i === 1 ? '#171b17' : '#0f110f',
        emissive: i === 2 ? '#132800' : '#000000',
        transparent: true,
        opacity: 0,
        metalness: 0.28,
        roughness: 0.52,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.42, 0.08), bodyMat);
      group.add(body);
      const outlineMat = new THREE.LineBasicMaterial({ color: i === 1 ? bone : lime, transparent: true, opacity: 0 });
      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.32, 1.44, 0.09)), outlineMat);
      group.add(outline);
      group.userData.bodyMat = bodyMat;
      group.userData.outlineMat = outlineMat;
      scene.add(group);
      projectPanels.push(group);
    }

    // The panels collapse into a connected systems network.
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);
    const nodePositions = [
      [-2.6, 1.15, 0], [2.6, 1.15, 0], [0, 0, 0], [-2.6, -1.15, 0], [2.6, -1.15, 0],
    ];
    const networkNodes = nodePositions.map((pos, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: i === 2 ? '#b8ff38' : '#141714',
        emissive: i === 2 ? '#2d560d' : '#000000',
        transparent: true,
        opacity: 0,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(i === 2 ? 0.22 : 0.13, 18, 18), mat);
      mesh.position.set(...pos);
      networkGroup.add(mesh);
      return mesh;
    });
    const linePoints = [];
    [0, 1, 3, 4].forEach((i) => {
      linePoints.push(...nodePositions[2], ...nodePositions[i]);
    });
    const networkLineMat = new THREE.LineBasicMaterial({ color: lime, transparent: true, opacity: 0 });
    const networkLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3)),
      networkLineMat,
    );
    networkGroup.add(networkLines);

    // Ambient particles continue through the whole film so it never feels like a reset.
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = innerWidth < 700 ? 85 : 190;
    const pts = [];
    for (let i = 0; i < particleCount; i++) {
      pts.push((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 8);
    }
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: lime, size: innerWidth < 700 ? 0.018 : 0.026, transparent: true, opacity: 0.42 }),
    );
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let pageProgress = 0;
    let raf = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (event) => {
      mouseX = event.clientX / innerWidth - 0.5;
      mouseY = event.clientY / innerHeight - 0.5;
    };
    const onScroll = () => {
      pageProgress = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    };
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.7));
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    onScroll();

    const clock = new THREE.Clock();

    const render = () => {
      const t = clock.getElapsedTime();
      const p = reduced ? 0 : pageProgress;

      // Hero → portal.
      const heroExit = smooth(range(p, 0.07, 0.19));
      const portalIn = smooth(range(p, 0.1, 0.23));
      const portalOut = smooth(range(p, 0.24, 0.34));

      // Portal → services fragments.
      const serviceIn = smooth(range(p, 0.23, 0.36));
      const serviceOut = smooth(range(p, 0.39, 0.5));

      // Services → work panels.
      const workIn = smooth(range(p, 0.43, 0.56));
      const workOut = smooth(range(p, 0.62, 0.72));

      // Work → network.
      const networkIn = smooth(range(p, 0.64, 0.76));
      const networkOut = smooth(range(p, 0.79, 0.88));

      // Editorial light → finale.
      const finaleIn = smooth(range(p, 0.87, 0.98));

      const heroX = innerWidth < 800 ? 0.8 : 2.25;
      coreGroup.position.x = mix(heroX, 0, heroExit);
      coreGroup.position.y = mix(0.05, 0, heroExit) + mouseY * 0.18 * (1 - heroExit);
      coreGroup.position.z = mix(0, -0.3, portalIn);
      let coreScale = mix(1, 1.22, portalIn);

      if (serviceIn > 0) {
        coreGroup.position.x = mix(0, -1.6, serviceIn);
        coreGroup.position.z = mix(-0.3, -0.9, serviceIn);
        coreScale = mix(1.22, 0.72, serviceIn);
      }
      if (workIn > 0) {
        coreGroup.position.x = mix(-1.6, 0, workIn);
        coreGroup.position.z = mix(-0.9, -2.3, workIn);
        coreScale = mix(0.72, 0.32, workIn);
      }
      if (networkIn > 0) {
        coreGroup.position.x = mix(0, 0, networkIn);
        coreGroup.position.y = mix(0, 0, networkIn);
        coreGroup.position.z = mix(-2.3, -0.7, networkIn);
        coreScale = mix(0.32, 0.45, networkIn);
      }
      if (networkOut > 0) {
        coreGroup.position.x = mix(0, 1.8, networkOut);
        coreGroup.position.z = mix(-0.7, -0.25, networkOut);
        coreScale = mix(0.45, 0.72, networkOut);
      }
      if (finaleIn > 0) {
        coreGroup.position.x = mix(1.8, 0, finaleIn);
        coreGroup.position.y = mix(0, 0.05, finaleIn);
        coreGroup.position.z = mix(-0.25, 0, finaleIn);
        coreScale = mix(0.72, 1.12, finaleIn);
      }
      coreGroup.scale.setScalar(coreScale * (1 + Math.sin(t * 1.2) * 0.015));
      coreGroup.rotation.x += (reduced ? 0 : 0.0024) + mouseY * 0.0005;
      coreGroup.rotation.y += (reduced ? 0 : 0.0042) + mouseX * 0.0008;
      wire.rotation.y -= 0.0018;
      rings[0].rotation.z += 0.0024;
      rings[1].rotation.x -= 0.0017;
      rings[2].rotation.y += 0.0013;

      // Portal physically grows from the hero core then fades into fragments.
      portal.position.copy(coreGroup.position);
      portal.scale.setScalar(mix(0.42, 1.12, portalIn) * mix(1, 1.35, portalOut));
      portal.rotation.z = t * 0.025;
      portalRings.forEach((ring, i) => {
        ring.material.opacity = Math.max(0, portalIn * (1 - portalOut) * (0.16 + i * 0.06));
        ring.rotation.z += 0.0005 * (i + 1);
      });

      // Fragments emerge from the portal and travel across services.
      const fragmentVisibility = Math.max(0, serviceIn * (1 - workIn * 0.88));
      fragments.forEach((frag, i) => {
        const a = frag.userData.angle + t * frag.userData.speed;
        const radius = frag.userData.radius * mix(0.15, 1, serviceIn);
        frag.position.set(
          coreGroup.position.x + Math.cos(a) * radius,
          Math.sin(a * 1.15) * radius * 0.62,
          Math.sin(a * 0.7) * 1.3 - 0.4,
        );
        frag.rotation.x = t * 0.38 + i;
        frag.rotation.y = t * 0.25 - i * 0.2;
        frag.material.opacity = fragmentVisibility * (0.32 + (i % 3) * 0.16);
        frag.scale.setScalar(mix(0.4, 1, serviceIn));
      });

      // Project panels fly in from depth, then converge to become the systems scene.
      projectPanels.forEach((panel, i) => {
        const baseX = (i - 1) * 2.65;
        const fromY = i % 2 ? -2.8 : 2.8;
        panel.position.x = mix(baseX * 1.45, baseX, workIn);
        panel.position.y = mix(fromY, Math.sin(t * 0.55 + i) * 0.12, workIn);
        panel.position.z = mix(-6, -1.1 - i * 0.18, workIn);
        panel.rotation.y = mix((i - 1) * 0.6, (i - 1) * -0.2, workIn) + Math.sin(t * 0.25 + i) * 0.025;
        panel.rotation.x = Math.sin(t * 0.31 + i) * 0.035;
        const opacity = Math.max(0, workIn * (1 - networkIn));
        panel.userData.bodyMat.opacity = opacity * 0.9;
        panel.userData.outlineMat.opacity = opacity * (i === 1 ? 0.5 : 0.34);
        panel.scale.setScalar(mix(0.7, 1, workIn) * mix(1, 0.55, networkIn));
      });

      // Network is literally the next form of the same visual system.
      networkGroup.position.z = mix(-3.5, -0.4, networkIn);
      networkGroup.rotation.y = Math.sin(t * 0.18) * 0.08;
      networkGroup.scale.setScalar(mix(0.65, 1, networkIn));
      const netOpacity = Math.max(0, networkIn * (1 - networkOut));
      networkNodes.forEach((node, i) => {
        node.material.opacity = netOpacity * (i === 2 ? 0.95 : 0.65);
        node.scale.setScalar(1 + Math.sin(t * 1.3 + i) * 0.08 * netOpacity);
      });
      networkLineMat.opacity = netOpacity * 0.42;

      particles.rotation.y = t * 0.018 + p * 0.8;
      particles.rotation.x = Math.sin(t * 0.08) * 0.05;
      particles.material.opacity = mix(0.42, 0.18, range(p, 0.72, 0.86)) + finaleIn * 0.22;

      camera.position.x += ((mouseX * 0.22) - camera.position.x) * 0.025;
      camera.position.y += ((-mouseY * 0.13) - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      host.removeChild(renderer.domElement);
      renderer.dispose();
      particleGeo.dispose();
    };
  }, []);

  return <div className="world" ref={ref} aria-hidden="true" />;
}

function useCinematicScroll() {
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const work = document.querySelector('.chapter--work');
      if (work) {
        const rect = work.getBoundingClientRect();
        const travel = Math.max(1, work.offsetHeight - innerHeight);
        const local = clamp(-rect.top / travel);
        document.documentElement.style.setProperty('--film-shift', `${local * -46}vw`);
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', update);
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', update);
    };
  }, []);
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Zyra Web Studio home">
      <span className="mark">Z</span>
      <span><b>zyra</b><small>WEB STUDIO</small></span>
    </a>
  );
}

function ChapterIndex({ current, next }) {
  return <div className="chapter-index"><b>{current}</b> / {next}</div>;
}

function App() {
  useCinematicScroll();

  return (
    <div className="app">
      <CinematicWorld />

      <header>
        <Brand />
        <nav>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="pill" href="#contact">Let's talk ↗</a>
      </header>

      <div className="scene-progress" aria-hidden="true">
        <a href="#top" /><a href="#about" /><a href="#services" /><a href="#work" /><a href="#system" /><a href="#method" /><a href="#contact" />
      </div>

      <main id="top">
        <section className="chapter chapter--hero">
          <div className="chapter-sticky">
            <div className="cinema-copy">
              <p className="chapter-kicker">Independent digital studio · UK + Nigeria</p>
              <h1 className="cinema-title">We build <em>digital</em> things people <span className="ghost">remember.</span></h1>
              <p className="cinema-lede">Strategy, brand, websites and business systems — designed as one connected experience, not a pile of disconnected deliverables.</p>
              <div className="cinema-actions">
                <a className="pill lime" href="#contact">Start a project ↗</a>
                <a className="pill" href="#work">Enter the work →</a>
              </div>
            </div>
            <div className="scroll-cue">Scroll to enter</div>
            <ChapterIndex current="00" next="ORIGIN" />
            <div className="chapter-bridge" />
          </div>
        </section>

        <section className="chapter chapter--portal" id="about">
          <div className="chapter-sticky">
            <div className="portal-ring" aria-hidden="true" />
            <div className="portal-copy">
              <p className="chapter-kicker" style={{ justifyContent: 'center' }}>A different point of view</p>
              <h2>Not another <span>website.</span> A digital <em>system.</em></h2>
            </div>
            <ChapterIndex current="01" next="SHIFT" />
            <div className="chapter-bridge" />
          </div>
        </section>

        <section className="chapter chapter--services" id="services">
          <div className="chapter-sticky">
            <div className="services-cinema">
              <div className="services-intro">
                <p className="chapter-kicker">The system opens / 02</p>
                <h2>One studio. Four connected disciplines.</h2>
                <p>The same core idea moves through strategy, identity, product and operations — so the result feels like one business, not four suppliers.</p>
              </div>
              <div className="service-deck">
                {services.map(([n, title]) => (
                  <div className="service-frame" key={n}>
                    <span className="n">{n}</span>
                    <b>{title}</b>
                    <span className="arr">→</span>
                  </div>
                ))}
              </div>
            </div>
            <ChapterIndex current="02" next="BUILD" />
            <div className="chapter-bridge" />
          </div>
        </section>

        <section className="chapter chapter--work" id="work">
          <div className="chapter-sticky">
            <div className="work-head">
              <div>
                <p className="chapter-kicker">The system becomes product / 03</p>
                <h2>From invisible thinking to things people can actually use.</h2>
              </div>
              <p>A tracking shot through selected Zyra work. The fragments from the previous scene resolve into interfaces.</p>
            </div>
            <div className="film-strip">
              {projects.map(([name, category], i) => (
                <article className="film-card" key={name}>
                  <div className="visual">
                    <span>CASE / 0{i + 1}</span>
                    <strong>{name}</strong>
                  </div>
                  <div className="film-meta">
                    <div><h3>{name}</h3><p>{category}</p></div>
                    <span>↗</span>
                  </div>
                </article>
              ))}
            </div>
            <ChapterIndex current="03" next="WORK" />
            <div className="chapter-bridge" />
          </div>
        </section>

        <section className="chapter chapter--system" id="system">
          <div className="chapter-sticky">
            <div className="system-copy">
              <p className="chapter-kicker">Behind the screen / 04</p>
              <h2>The interface dissolves. The business system appears.</h2>
            </div>
            <div className="system-network">
              <span className="node">Customer</span>
              <span className="node">Website / App</span>
              <span className="node node--center">Zyra system</span>
              <span className="node">Database</span>
              <span className="node">Automation</span>
            </div>
            <ChapterIndex current="04" next="SYSTEM" />
            <div className="chapter-bridge" />
          </div>
        </section>

        <section className="chapter chapter--light" id="method">
          <div className="chapter-sticky">
            <div className="light-copy">
              <p className="chapter-kicker">Breathing room / 05</p>
              <h2>Fast enough to <span>move.</span><br />Careful enough to last.</h2>
              <div className="light-stats">
                <article><b>72H</b><span>Prototype direction</span></article>
                <article><b>Full-stack</b><span>Strategy through deployment</span></article>
                <article><b>One team</b><span>Brand + technology + operations</span></article>
              </div>
            </div>
            <ChapterIndex current="05" next="METHOD" />
            <div className="chapter-bridge" style={{ background: 'linear-gradient(to bottom, transparent, #26382a)' }} />
          </div>
        </section>

        <section className="chapter chapter--finale" id="contact">
          <div className="chapter-sticky">
            <div className="finale-copy">
              <p className="chapter-kicker" style={{ justifyContent: 'center' }}>The core reforms / 06</p>
              <h2>What should we <em>build next?</em></h2>
              <p>Bring us the business problem, the ambitious idea or the messy operation. We will work out what deserves to exist.</p>
              <a className="pill lime" href="mailto:zyrawebstudio@gmail.com">Build it with Zyra ↗</a>
            </div>
            <ChapterIndex current="06" next="BEGIN" />
          </div>
        </section>
      </main>

      <footer>
        <Brand />
        <a href="mailto:zyrawebstudio@gmail.com">zyrawebstudio@gmail.com</a>
        <span>© 2026 Zyra Web Studio</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
