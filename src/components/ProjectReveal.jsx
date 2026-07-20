import { useEffect, useRef } from 'react';
import { glass } from './LiquidGlass';
import { ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ProjectReveal({ title, tech = [], liveUrl = '#', repoUrl = '#', videoSrc }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.project-animate');
      if (!items.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(items,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[70vh] md:h-[75vh] overflow-hidden">

      {/* Video background */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Dark tint */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: 'rgba(0,0,0,0.52)' }}
      />

      {/* Info overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14 md:pb-16">

          {/* Tech tags */}
          <div className="project-animate flex flex-wrap gap-2 mb-4">
            {tech.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'rgba(55,224,199,0.10)',
                  border: '1px solid rgba(55,224,199,0.3)',
                  color: '#37E0C7',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3
            className="project-animate font-bold text-white font-display mb-6 tracking-display"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h3>

          {/* Buttons */}
          <div className="project-animate flex gap-3">
            <a
              href={liveUrl}
              target={liveUrl !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
              style={{
                background: 'rgba(55,224,199,0.15)',
                border: '1px solid rgba(55,224,199,0.4)',
                color: '#37E0C7',
              }}
            >
              Live Demo <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white min-h-[44px] ${glass}`}
            >
              <Github className="w-4 h-4" /> Repo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
