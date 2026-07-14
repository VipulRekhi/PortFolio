/**
 * Nav — sticky top navigation.
 *
 * Spec §3:
 *   Left:   "VPR" wordmark with teal dot accent
 *   Center: About / Skills / Projects / Contact — native smooth-scroll
 *   Right:  "LET'S CONNECT" pill (teal accent border) → Contact section
 *   Sticky: bg/blur fades in on scroll past Hero (Framer Motion useScroll)
 *   Safe-area: padding-top for notched phones
 *
 * NO GSAP used here — Framer Motion useScroll only.
 * Nav does NOT animate on scroll itself — only bg opacity/blur changes.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Contact'];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Simple scroll-position check — toggles bg class, no GSAP needed
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 w-full z-50 transition-all duration-500 safe-top',
          scrolled || mobileOpen
            ? 'bg-[#0A0B0F]/70 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group cursor-pointer"
            aria-label="Scroll to top"
          >
            <img
              src="/logo.png"
              alt="Vipul Rekhi Logo"
              className="h-12 w-40 md:h-[70px] md:w-[230px] object-contain select-none transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </motion.button>

          {/* ── Desktop nav links ─────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((item, i) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                onClick={() => scrollTo(item.toLowerCase())}
                className="relative text-sm text-[#A8A29A] hover:text-[#F2EFE9] font-medium transition-colors duration-300 py-1 min-h-[44px] flex items-center"
              >
                {item}
              </motion.button>
            ))}
          </nav>

          {/* ── CTA + Mobile toggle ───────────────────────────── */}
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onClick={() => scrollTo('contact')}
              className="hidden md:flex group items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F2EFE9] cursor-pointer min-h-[44px]"
              style={{
                border: '1px solid rgba(55,224,199,0.4)',
                background: 'rgba(55,224,199,0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(55,224,199,0.12)';
                e.currentTarget.style.borderColor = 'rgba(55,224,199,0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(55,224,199,0.05)';
                e.currentTarget.style.borderColor = 'rgba(55,224,199,0.4)';
              }}
            >
              Let&apos;s Connect
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 text-[#A8A29A] hover:text-[#F2EFE9] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed top-[calc(5rem+env(safe-area-inset-top))] left-0 w-full z-40 liquid-glass border-t border-white/[0.06] px-6 py-6 flex flex-col gap-1"
          >
            {NAV_LINKS.map(item => (
              <button
                key={item}
                onClick={() => { scrollTo(item.toLowerCase()); setMobileOpen(false); }}
                className="text-left text-base font-medium text-[#A8A29A] hover:text-[#F2EFE9] py-3 border-b border-white/5 last:border-0 transition-colors min-h-[44px]"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => { scrollTo('contact'); setMobileOpen(false); }}
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-[#F2EFE9] min-h-[44px]"
              style={{ border: '1px solid rgba(55,224,199,0.4)', background: 'rgba(55,224,199,0.08)' }}
            >
              Let&apos;s Connect <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
