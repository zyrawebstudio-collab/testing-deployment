import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import './styles.css';

const projects = [
  ['Sulawog','Healthcare · Commerce · Operations'],
  ['ShopSheron','Fashion · E-commerce'],
  ['Consult Sulawog','Healthcare · Patient Experience'],
];

function World(){
  const ref = useRef(null);
  useEffect(()=>{
    const host = ref.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, .1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.75));
    renderer.setSize(innerWidth, innerHeight);
    host.appendChild(renderer.domElement);

    const lime = new THREE.Color('#b8ff38');
    const group = new THREE.Group(); scene.add(group);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,2), new THREE.MeshPhysicalMaterial({color:'#0f140f', emissive:'#24420d', emissiveIntensity:.55, metalness:.55, roughness:.25, wireframe:false, transmission:.12}));
    group.add(core);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.5,2)), new THREE.LineBasicMaterial({color:lime, transparent:true, opacity:.55}));
    group.add(wire);
    [2.1,2.65,3.15].forEach((r,i)=>{
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,140), new THREE.MeshBasicMaterial({color:i===1?'#f2f0e9':'#b8ff38',transparent:true,opacity:.28}));
      ring.rotation.set(i*.75,.35+i*.5,i*.4); group.add(ring);
    });
    const pgeo = new THREE.BufferGeometry();
    const pts=[]; for(let i=0;i<(innerWidth<700?90:190);i++){pts.push((Math.random()-.5)*12,(Math.random()-.5)*9,(Math.random()-.5)*8)}
    pgeo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    const particles = new THREE.Points(pgeo,new THREE.PointsMaterial({color:lime,size:.025,transparent:true,opacity:.62})); scene.add(particles);

    const panels = [];
    for(let i=0;i<3;i++){
      const m = new THREE.Mesh(new THREE.BoxGeometry(2.2,1.35,.06), new THREE.MeshStandardMaterial({color:i===1?'#20241f':'#111311',metalness:.2,roughness:.55,emissive:i===2?'#112500':'#000000'}));
      m.position.set((i-1)*2.8,-.25,-1.5); m.rotation.y=(i-1)*-.28; m.visible=false; scene.add(m); panels.push(m);
    }
    const light1 = new THREE.PointLight(lime,22,18); light1.position.set(3,3,4); scene.add(light1);
    const light2 = new THREE.AmbientLight('#d7dfcf',1.6); scene.add(light2);

    let mx=0,my=0, scroll=0;
    const onMove=e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)};
    const onScroll=()=>{scroll=scrollY/Math.max(1,document.body.scrollHeight-innerHeight)};
    const onResize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};
    addEventListener('pointermove',onMove); addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onResize);
    const clock = new THREE.Clock(); let raf;
    const tick=()=>{
      const t=clock.getElapsedTime();
      group.rotation.x += .003 + my*.001; group.rotation.y += .005 + mx*.0015;
      particles.rotation.y=t*.025;
      if(scroll<.2){group.position.set(1.7+mx*.25,0+my*.2,0);group.scale.setScalar(1);panels.forEach(p=>p.visible=false)}
      else if(scroll<.42){group.position.set(-1.8+(scroll-.2)*8,0,0);group.scale.setScalar(1.15);panels.forEach(p=>p.visible=false)}
      else if(scroll<.68){group.position.set(0,0,-1.2);group.scale.setScalar(.58);panels.forEach((p,i)=>{p.visible=true;p.position.y=Math.sin(t*.7+i)*.18;p.rotation.x=Math.sin(t*.35+i)*.08})}
      else if(scroll<.86){group.position.set(-2.1,0,-.6);group.scale.setScalar(.75);panels.forEach((p,i)=>{p.visible=true;p.position.x=(i-1)*1.55;p.position.y=(i-1)*1.05;p.rotation.z=t*.03*(i-1)})}
      else {panels.forEach(p=>p.visible=false);group.position.set(1.1,0,0);group.scale.setScalar(1.05+Math.sin(t)*.03)}
      renderer.render(scene,camera); raf=requestAnimationFrame(tick);
    }; tick();
    return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',onMove);removeEventListener('scroll',onScroll);removeEventListener('resize',onResize);host.removeChild(renderer.domElement);renderer.dispose()}
  },[]);
  return <div className="world" ref={ref} aria-hidden="true"/>;
}

function App(){
 return <div className="app"><World/>
  <header><a className="brand" href="#top"><span className="mark">Z</span><span><b>zyra</b><small>WEB STUDIO</small></span></a><nav><a href="#work">Work</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a className="pill" href="#contact">Let's talk ↗</a></header>
  <main id="top">
   <section className="hero"><div className="grid"></div><div className="copy"><p className="eyebrow"><i/> Independent digital studio</p><h1>We build <em>digital</em> things people <span>remember.</span></h1><p className="lede">Strategy, brand, websites and business systems designed as one connected experience.</p><div className="actions"><a className="pill lime" href="#contact">Start a project ↗</a><a className="pill" href="#work">Selected work →</a></div></div></section>
   <section className="light statement" id="about"><p className="kicker">Our point of view / 01</p><h2>Businesses do not need <span>another website.</span> They need a digital presence that <em>moves them forward.</em></h2></section>
   <section id="services"><p className="kicker">What we do / 02</p><h2>One studio from the first idea to the system behind it.</h2>{[['01','Strategy'],['02','Brand & Experience'],['03','Websites & Products'],['04','Systems & Automation']].map(([n,t])=><div className="service" key={n}><span>{n}</span><b>{t}</b><p>Built around what the business actually needs, not what a template happens to offer.</p><strong>→</strong></div>)}</section>
   <section id="work"><p className="kicker">Selected work / 03</p><h2>Built for businesses with something real to do.</h2><div className="cards">{projects.map(([n,c],i)=><article key={n}><div className="screen"><div className="screenbar"><i/><i/><i/></div><div className="screenbody"><span>0{i+1}</span><b>{n}</b></div></div><h3>{n}</h3><p>{c}</p></article>)}</div></section>
   <section className="system"><p className="kicker">Under the interface / 04</p><h2>Beautiful is useful. The system underneath matters more.</h2><div className="network"><span>Customer</span><span>Website / App</span><span className="center">Zyra system</span><span>Database</span><span>Automation</span></div></section>
   <section className="light stats"><p className="kicker">How we work / 05</p><h2>Fast enough to move. Careful enough to last.</h2><div><article><b>72H</b><span>Prototype direction</span></article><article><b>Full-stack</b><span>Strategy through deployment</span></article><article><b>One team</b><span>Brand + technology + operations</span></article></div></section>
   <section id="contact" className="cta"><p className="kicker">Next project / 06</p><h2>Have something ambitious in mind?</h2><p>Tell us where the business is trying to go. We'll work out what deserves to be built next.</p><a className="pill lime" href="mailto:zyrawebstudio@gmail.com">Build it with Zyra ↗</a></section>
  </main>
  <footer><div className="brand"><span className="mark">Z</span><span><b>zyra</b><small>WEB STUDIO</small></span></div><a href="mailto:zyrawebstudio@gmail.com">zyrawebstudio@gmail.com</a><span>© 2026 Zyra Web Studio</span></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
