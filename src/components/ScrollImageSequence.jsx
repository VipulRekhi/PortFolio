/**
 * ScrollImageSequence — GSAP ScrollTrigger-pinned canvas frame scrubber.
 *
 * Props:
 *   framePath   {string}  URL template, supports %d or %03d for frame index.
 *                         e.g. "/sequences/weatherly/frame_%03d.webp"
 *   frameCount  {number}  Total number of frames (1-indexed files).
 *   pacing      {number}  px of scroll per frame (controls spacer height).
 *   onProgress  {fn}      Callback(progress 0-1) fired on each scroll update.
 *
 * Motion rules (spec §7.1):
 *   - Preloads all frames → liquid-glass skeleton shimmer while loading
 *   - Pins wrapper via GSAP ScrollTrigger for frameCount × pacing px
 *   - rAF lerp (factor 0.12) smooths frame jumps
 *   - Cover-crop canvas draw (no letterboxing at any ratio)
 *   - Mobile: skips every other frame to halve effective scroll distance
 *   - prefers-reduced-motion: static final frame, no pin, no canvas logic
 *
 * STRICT RULE: This component is ONLY used inside ProjectReveal.jsx.
 * It must NEVER be imported into Hero.jsx or any other section.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Parse a printf-style frame URL template (%d, %03d, %04d)
function buildFrameUrl(template, index) {
  return template.replace(/%0?(\d*)d/, (_, width) => {
    if (!width) return String(index);
    return String(index).padStart(parseInt(width, 10), '0');
  });
}

// Canvas cover-crop: draws `img` to fill canvas without letterboxing
function drawCover(ctx, img, canvasW, canvasH) {
  const imgAR    = img.naturalWidth / img.naturalHeight;
  const canvasAR = canvasW / canvasH;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

  if (imgAR > canvasAR) {
    // Image wider than canvas — crop sides
    sw = img.naturalHeight * canvasAR;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image taller than canvas — crop top/bottom
    sh = img.naturalWidth / canvasAR;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
}

export default function ScrollImageSequence({
  framePath,
  frameCount = 60,
  pacing     = 18,
  onProgress,
  triggerRef,   // ref to the outer ProjectReveal container — used as GSAP trigger
}) {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);
  const frames     = useRef([]);
  const rafId      = useRef(null);
  const currentIdx = useRef(0);
  const targetIdx  = useRef(0);

  const [loaded,       setLoaded]       = useState(false);
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isMobile] = useState(() => window.innerWidth < 768);

  // ── Frame preload ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled   = false;
    const imgs      = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = buildFrameUrl(framePath, i);

      const onLoad = () => {
        loadedCount++;
        if (!cancelled && loadedCount === frameCount) {
          frames.current = imgs;
          setLoaded(true);
        }
      };
      img.onload  = onLoad;
      img.onerror = onLoad; // Count errors so we never hang on a missing frame
      imgs.push(img);
    }

    return () => { cancelled = true; };
  }, [framePath, frameCount]);

  // ── Draw a specific frame index to canvas ─────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !frames.current.length) return;

    const clampedIdx = Math.max(0, Math.min(Math.round(index), frames.current.length - 1));
    const img = frames.current[clampedIdx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    // Update canvas resolution to match physical pixels
    canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawCover(ctx, img, canvas.offsetWidth, canvas.offsetHeight);
  }, []);

  // ── Resize: redraw current frame on window resize ─────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const onResize = () => drawFrame(Math.round(currentIdx.current));
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [loaded, drawFrame]);

  // ── Reduced-motion: draw static final frame ────────────────────────────────
  useEffect(() => {
    if (!loaded || !reducedMotion) return;
    drawFrame(frameCount - 1);
  }, [loaded, reducedMotion, frameCount, drawFrame]);

  // ── GSAP ScrollTrigger pin + scrub ────────────────────────────────────────
  useEffect(() => {
    if (!loaded || reducedMotion) return;

    const wrapper     = wrapperRef.current;
    const spacerHeight = frameCount * pacing;

    // Draw frame 0 immediately before ScrollTrigger starts
    drawFrame(0);

    // rAF lerp loop — smooths targetIdx → currentIdx
    const tick = () => {
      const diff = targetIdx.current - currentIdx.current;
      if (Math.abs(diff) > 0.3) {
        currentIdx.current += diff * 0.12;
        drawFrame(currentIdx.current);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    // Pin the outer ProjectReveal container (in normal document flow),
    // NOT the absolute inner wrapper — absolute elements can't create spacers.
    const pinTarget = triggerRef?.current || wrapper;

    const st = ScrollTrigger.create({
      trigger:          pinTarget,
      start:            'top top',
      end:              `+=${spacerHeight}`,
      pin:              true,
      pinSpacing:       true,
      scrub:            false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const effectiveFrames = isMobile ? Math.floor(frameCount / 2) : frameCount;
        const rawTarget       = progress * (effectiveFrames - 1);
        targetIdx.current     = isMobile ? rawTarget * 2 : rawTarget;
        onProgress?.(progress);
      },
    });

    return () => {
      cancelAnimationFrame(rafId.current);
      st.kill();
    };
  }, [loaded, reducedMotion, frameCount, pacing, isMobile, drawFrame, onProgress, triggerRef]);

  // ── Reduced-motion path: static img only ──────────────────────────────────
  if (reducedMotion) {
    return (
      <div ref={wrapperRef} className="absolute inset-0 w-full h-full">
        <img
          src={buildFrameUrl(framePath, frameCount)}
          alt="Project preview — final frame"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full">

      {/* Skeleton shimmer while frames load */}
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}

      {/* Canvas — always in DOM so GSAP can pin the wrapper */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: loaded ? 'block' : 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
