import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { glass } from './LiquidGlass';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const EXPLORING = ['Java', 'Spring Boot', 'REST APIs', 'JDBC', 'Backend Development'];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.about-animate');
      if (!items.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(items,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Section heading ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D9D9D6]/60 uppercase block mb-3 font-display">
            01 / Background
          </span>
          <h2
            className="font-bold text-[#F2EFE9] tracking-display font-display"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            About Me
          </h2>
        </motion.div>

        {/* ── Content grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: bio + exploring */}
          <div className="lg:col-span-7 space-y-5">
            {[
              'I am a 3rd-year Computer Engineering undergraduate at SPPU, focused on building clean backend APIs and reliable full-stack applications.',
              'I enjoy understanding how applications work beyond the interface—from API design and database structure to algorithms and system behavior. Most of my learning comes from building projects, breaking things, and figuring out better ways to rebuild them.',
              'I’m currently looking for backend or full-stack internship opportunities where I can contribute to real projects, strengthen my engineering skills, and learn how reliable software is built at scale.',
            ].map((para, i) => (
              <p
                key={i}
                className="about-animate text-base md:text-lg leading-relaxed font-light text-[#A8A29A]"
              >
                {para}
              </p>
            ))}

            {/* Currently Exploring */}
            <div className="about-animate pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2EFE9]/70 mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D9D9D6]" />
                Currently Exploring
              </h4>
              <div className="flex flex-wrap gap-2">
                {EXPLORING.map(tag => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full text-xs text-[#D9D9D6] font-medium liquid-glass"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: education + philosophy cards */}
          <div className="lg:col-span-5 space-y-5">

            {/* Education card */}
            <div className="about-animate p-6 rounded-3xl liquid-glass relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] blur-2xl rounded-full translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/[0.08] text-[#D9D9D6] shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29A]/60 font-semibold">Education</span>
                  <h3 className="text-lg font-bold text-[#F2EFE9] mt-1 font-display">Bachelor of Engineering</h3>
                  <p className="text-xs text-[#37E0C7] font-semibold mt-1">Computer Engineering · 3rd Year</p>
                  <div className="mt-4 space-y-2 text-sm text-[#A8A29A]">
                    <p className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#A8A29A]/50 shrink-0" />
                      International Institute Of Information Technology
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#A8A29A]/50 shrink-0" />
                      Pune, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy card */}
            <div className="about-animate p-6 rounded-3xl liquid-glass">
              <span className="text-[10px] uppercase tracking-wider text-[#A8A29A]/60 font-semibold block mb-3">
                Core Philosophy
              </span>
              <p className="text-sm md:text-base italic text-[#A8A29A] leading-relaxed">
                &ldquo;I build things not because they&apos;re easy, but because the world needed one more person who didn&apos;t look away from hard problems.&rdquo;
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
