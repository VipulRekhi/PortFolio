/**
 * Hero — full-bleed video background + Framer Motion reveal engine.
 *
 * Layout change (user request):
 *   - <video> fills the ENTIRE section as an absolute background (object-cover)
 *   - Dark gradient overlay sits between video and text for legibility
 *   - Text content (stat cards, headline, tagline, scroll CTA) overlays on top
 *   - Rotated edge labels sit at the outer edges as before
 *
 * Spec §4 motion rules unchanged:
 *   - video plays once, freezes on last frame (no loop)
 *   - 4s fallback timeout if video never fires onEnded
 *   - prefers-reduced-motion: static portrait-fallback.webp as background, immediate reveal
 *   - Left column fully hidden until videoEnded === true (no partial flash)
 *   - Reveal sequence via Framer Motion variants:
 *       1. Stat cards     → 0ms,    y 12→0, opacity, 0.5s
 *       2. Edge labels    → 150ms,  opacity only, 0.4s
 *       3. Headline       → 250ms,  clipPath wipe, 0.6s custom ease
 *       4. Tagline        → 850ms,  y 12→0, 0.5s
 *       5. Scroll CTA     → 1450ms, then infinite arrow bounce
 *
 * STRICT EXCLUSIONS: NO GSAP, NO ScrollTrigger, NO ScrollImageSequence import.
 */

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { glass } from './LiquidGlass';

// ── Framer Motion variants ────────────────────────────────────────────────────

const statVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 2.0 } },
};

const labelVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut', delay: 2.15 } },
};

const headlineVariants = {
  hidden:  { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 2.25 },
  },
};

const taglineVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 2.85 } },
};

const scrollVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut', delay: 3.45 } },
};

export default function Hero() {
  const videoRef         = useRef(null);
  const fallbackTimerRef = useRef(null);

  const [videoEnded, setVideoEnded] = useState(false);
  const [reducedMotion]             = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Reduced-motion: reveal immediately, no video
  useEffect(() => {
    if (reducedMotion) setVideoEnded(true);
  }, [reducedMotion]);

  // 4-second fallback guard
  useEffect(() => {
    if (reducedMotion || videoEnded) return;
    fallbackTimerRef.current = setTimeout(() => setVideoEnded(true), 4000);
    return () => clearTimeout(fallbackTimerRef.current);
  }, [reducedMotion, videoEnded]);

  const handleVideoEnded = () => {
    clearTimeout(fallbackTimerRef.current);
    if (videoRef.current) videoRef.current.pause();
    setVideoEnded(true);
  };

  const reveal = videoEnded ? 'visible' : 'hidden';

  return (
    <section className="relative w-full min-h-dvh overflow-hidden flex flex-col justify-end md:justify-center">

      {/* ══ LAYER 0: Full-bleed video / fallback background ════════ */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {reducedMotion ? (
          <img
            src="/portrait-fallback.webp"
            alt="Vipul Pravin Rekhi"
            className="w-full h-full object-cover max-md:object-[80%_top] md:object-top"
            loading="eager"
          />
        ) : (
          <video
            ref={videoRef}
            src="/hero-video.mp4"
            poster="/portrait-fallback.webp"
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            autoPlay
            loop={false}
            controls={false}
            disablePictureInPicture
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover max-md:object-[80%_top] md:object-top"
            style={{ display: 'block' }}
            aria-label="Vipul Pravin Rekhi portrait video"
          />
        )}
      </div>

      {/* ══ LAYER 1: Gradient overlay — text legibility ════════════ */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: [
            /* Strong dark vignette at bottom where text lives */
            'linear-gradient(to top,  rgba(10,11,15,0.92) 0%, rgba(10,11,15,0.55) 45%, rgba(10,11,15,0.18) 75%, rgba(10,11,15,0.10) 100%)',
          ].join(', '),
        }}
      />
      {/* Additional left-side gradient so left-column text stays legible */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(10,11,15,0.70) 0%, rgba(10,11,15,0.30) 55%, transparent 100%)',
        }}
      />

      {/* Portfolio @ 2026 — right edge label */}
      <motion.div
        variants={labelVariants}
        initial="hidden"
        animate={reveal}
        className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 rotate-90 origin-center hidden lg:flex items-center gap-4 select-none"
        style={{ zIndex: 20 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 whitespace-nowrap">
          Portfolio @ 2026
        </span>
        <span className="w-8 h-px bg-white/20" />
      </motion.div>

      {/* ══ LAYER 3: Overlaid text content ═════════════════════════ */}
      <div
        className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16 md:py-0 flex flex-col justify-end md:justify-center min-h-dvh"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-xl lg:max-w-2xl">

          {/* Step 1 — Stat cards */}
          <motion.div
            variants={statVariants}
            initial="hidden"
            animate={reveal}
            className="flex flex-col-reverse md:flex-row items-start gap-3 mb-8"
          >
            <div className={`${glass} px-5 py-4 rounded-2xl inline-flex flex-col`}>
              <span className="text-2xl font-bold text-[#F2EFE9] tracking-tight">3+</span>
              <span className="text-[10px] uppercase tracking-wider text-black font-semibold mt-1">Projects Built</span>
            </div>
            <div className={`${glass} px-5 py-4 rounded-2xl inline-flex flex-col`}>
              <span className="text-2xl font-bold text-[#F2EFE9] tracking-tight">3rd yr</span>
              <span className="text-[10px] uppercase tracking-wider text-black font-semibold mt-1">CE Student · SPPU</span>
            </div>
          </motion.div>

          {/* Step 3 — Headline clip-path wipe */}
          <motion.div
            variants={headlineVariants}
            initial="hidden"
            animate={reveal}
            style={{ overflow: 'hidden' }}
          >
            <h1
              className="font-bold text-white tracking-display leading-[0.88] font-display mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              Hi, I&apos;m<br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #ffffff 0%, #D9D9D6 55%, rgba(168,162,154,0.85) 100%)',
                }}
              >
                Vipul Rekhi
              </span>
            </h1>
          </motion.div>

          {/* Step 4 — Tagline */}
          <motion.p
            variants={taglineVariants}
            initial="hidden"
            animate={reveal}
            className="text-base md:text-lg text-[#D9D9D6]/80 font-light max-w-md leading-relaxed mb-8"
          >
            — I build full-stack web applications with React, Node.js, and a focus on clean, practical engineering.
          </motion.p>

          {/* Step 5 — Resume Button */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            variants={scrollVariants}
            initial="hidden"
            animate={reveal}
            className="inline-flex items-center gap-2 px-5 py-3 mb-8 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-all duration-300 w-fit cursor-pointer min-h-[44px]"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <FileText className="w-4 h-4" />
            <span>Checkout Resume</span>
          </motion.a>

          {/* Step 6 — Scroll CTA */}
          <motion.div
            variants={scrollVariants}
            initial="hidden"
            animate={reveal}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-300 w-fit cursor-pointer"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            aria-label="Scroll to About section"
          >
            <span>Scroll Down</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
