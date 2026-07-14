import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground — fixed, full-screen Three.js particle + ring canvas.
 * Sits behind all page content via z-index: -30.
 * Mouse parallax + slow rotation + breathing scale.
 * Fully disposed on unmount to prevent memory leaks.
 */
export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Scene setup ─────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // ── Particles ────────────────────────────────────────────────
    const COUNT = 320;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xD9D9D6,
      transparent: true,
      opacity: 0.22,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Subtle teal accent particles ─────────────────────────────
    const ACCENT_COUNT = 40;
    const accentPositions = new Float32Array(ACCENT_COUNT * 3);
    for (let i = 0; i < ACCENT_COUNT; i++) {
      accentPositions[i * 3] = (Math.random() - 0.5) * 20;
      accentPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      accentPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPositions, 3));
    const accentMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x37E0C7,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const accentParticles = new THREE.Points(accentGeo, accentMat);
    scene.add(accentParticles);

    // ── Rings ─────────────────────────────────────────────────────
    const ring1Geo = new THREE.TorusGeometry(7, 0.008, 4, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.045 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.8, 0.006, 4, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    scene.add(ring2);

    // ── Mouse tracking ────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle particle drift + mouse parallax
      particles.rotation.y = t * 0.04 + mouse.x * 0.06;
      particles.rotation.x = t * 0.018 + mouse.y * 0.04;

      // Accent particles drift slightly differently for depth
      accentParticles.rotation.y = t * 0.025 + mouse.x * 0.04;
      accentParticles.rotation.x = t * 0.012 + mouse.y * 0.03;

      // Breathing scale
      const breathe = 1 + Math.sin(t * 0.35) * 0.018;
      particles.scale.setScalar(breathe);

      // Rings spin
      ring1.rotation.z = t * 0.06;
      ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.12) * 0.1;

      ring2.rotation.z = -t * 0.05;
      ring2.rotation.y = t * 0.09;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      accentGeo.dispose();
      accentMat.dispose();
      ring1Geo.dispose(); ring1Mat.dispose();
      ring2Geo.dispose(); ring2Mat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block', zIndex: -30 }}
    />
  );
}
