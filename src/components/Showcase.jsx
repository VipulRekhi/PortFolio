/**
 * Showcase — Projects section (id="projects")
 * Full-bleed looping video per project, stacked vertically with a gap.
 */

import { motion } from 'framer-motion';
import ProjectReveal from './ProjectReveal';

const PROJECTS = [
  {
    title: 'Weatherly',
    tech: ['Express', 'EJS', 'Open-Meteo API'],
    liveUrl: 'https://weather-project-seven-ebon.vercel.app/',
    repoUrl: 'https://github.com/VipulRekhi/weather-project',
    videoSrc: '/assets/projects/weatherly/frames/demo.mp4',
  },
  {
    title: 'LinkedOut',
    tech: ['Express', 'PostgreSQL', 'Gemini API', 'React'],
    liveUrl: 'https://linked-in-caption-generator.vercel.app/',
    repoUrl: 'https://github.com/VipulRekhi/Introduction-project',
    videoSrc: '/assets/projects/linkedout/frames/demo.mp4',
  },
  {
    title: 'Memory Color Game',
    tech: ['HTML', 'CSS', 'jQuery'],
    liveUrl: 'https://vipulrekhi.github.io/Memory-Game/',
    repoUrl: 'https://github.com/VipulRekhi/Memory-Game',
    videoSrc: '/assets/projects/memory-color-game/frames/demo.mp4',
  },
];

export default function Showcase() {
  return (
    <section id="projects" className="relative w-full">

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8"
      >
        <span className="text-xs font-semibold tracking-[0.25em] text-[#D9D9D6]/60 uppercase font-display">
          03 / Shipped Products
        </span>
        <h2
          className="font-bold text-[#F2EFE9] tracking-display font-display mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          Projects
        </h2>
      </motion.div>

      {/* Project blocks — gap between each */}
      <div className="flex flex-col gap-4 px-6 md:px-12 pb-16 max-w-7xl mx-auto w-full">
        {PROJECTS.map((p) => (
          <div
            key={p.title}
            className="rounded-3xl overflow-hidden"
          >
            <ProjectReveal {...p} />
          </div>
        ))}
      </div>

    </section>
  );
}
