import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Atom, Code, FileCode, Palette,
  Wind, Grid, Zap,
  Server, Cpu, FileText, Link2,
  Database, Binary,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CATEGORIES = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React.js',    icon: Atom },
      { name: 'JavaScript',  icon: Code },
      { name: 'HTML5',       icon: FileCode },
      { name: 'CSS3',        icon: Palette },
    ],
  },
  {
    title: 'Styling & UI',
    skills: [
      { name: 'Tailwind CSS', icon: Wind },
      { name: 'Bootstrap',    icon: Grid },
      { name: 'jQuery',       icon: Zap },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js',                 icon: Server },
      { name: 'Express.js',              icon: Cpu },
      { name: 'EJS (Embedded JavaScript)', icon: FileText },
      { name: 'REST APIs',               icon: Link2 },
    ],
  },
  {
    title: 'Databases & Fundamentals',
    skills: [
      { name: 'PostgreSQL',                  icon: Database },
      { name: 'MySQL',                       icon: Database },
      { name: 'MongoDB',                     icon: Database },
      { name: 'Data Structures & Algorithms', icon: Binary },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const pills = gsap.utils.toArray('.skill-pill');
      if (!pills.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(pills,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Heading ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D9D9D6]/60 uppercase block mb-3 font-display">
            02 / Abilities
          </span>
          <h2
            className="font-bold text-[#F2EFE9] tracking-display font-display"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Technologies &amp; Stack
          </h2>
        </motion.div>

        {/* ── 2×2 card grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="p-6 md:p-7 rounded-[1.75rem] liquid-glass flex flex-col"
            >
              <h3 className="text-[11px] font-bold text-[#F2EFE9] uppercase tracking-[0.2em] mb-4 font-display border-b border-white/5 pb-3">
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.name}
                      className="skill-pill flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass liquid-glass-interactive text-xs text-[#A8A29A] hover:text-[#F2EFE9] cursor-default select-none min-h-[44px]"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#D9D9D6]/60 shrink-0" />
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
