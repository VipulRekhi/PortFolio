/**
 * App — root component.
 *
 * Stack (spec §0):
 *   - React 18 + Vite
 *   - Tailwind CSS v4
 *   - GSAP + ScrollTrigger (used ONLY in ScrollImageSequence via ProjectReveal)
 *   - Framer Motion (used in Nav, Hero, About, Skills, Contact)
 *   - Three.js particle canvas (ThreeBackground — fixed, behind all content)
 *   - Noise grain overlay (fixed, above all content)
 *
 * Section order: Nav → Hero → About → Skills → Showcase → Contact
 * No Footer per spec (not listed in §1 file structure)
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ThreeBackground from './components/ThreeBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Showcase from './components/Showcase';
import Contact from './components/Contact';

// Register ScrollTrigger once at app level
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Ensure ScrollTrigger refreshes correctly on mount
  useEffect(() => {
    // Small delay to allow all pinned sections to measure correctly
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen text-[#A8A29A] antialiased overflow-x-hidden selection:bg-white/10 selection:text-[#F2EFE9]">

      {/* ── Three.js particle canvas (fixed, z:-30) ─────────── */}
      <ThreeBackground />

      {/* ── Noise grain overlay (fixed, z:9999) ─────────────── */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Sticky navigation ───────────────────────────────── */}
      <Nav />

      {/* ── Page sections ───────────────────────────────────── */}
      <main className="relative w-full" style={{ zIndex: 10 }}>
        <Hero />
        <About />
        <Skills />
        <Showcase />
        <Contact />
      </main>

    </div>
  );
}
