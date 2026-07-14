import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { glass } from './LiquidGlass';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Formspree endpoint — already configured ✅ ─────────────────────────────
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqrnqjo';
// True when the endpoint is a real Formspree URL (not the placeholder)
const FORMSPREE_CONFIGURED = FORMSPREE_ENDPOINT.includes('formspree.io/f/') &&
  !FORMSPREE_ENDPOINT.endsWith('/YOUR_FORM_ID');
// ────────────────────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    name: 'Email',
    label: 'vipulrekhi@gmail.com',
    href: 'mailto:vipulrekhi@gmail.com',
    Icon: Mail,
  },
  {
    name: 'LinkedIn',
    label: 'vipul-rekhi-592b11332',
    href: 'https://www.linkedin.com/in/vipul-rekhi-592b11332/',
    Icon: Linkedin,
  },
  {
    name: 'GitHub',
    label: 'VipulRekhi',
    href: 'https://github.com/VipulRekhi',
    Icon: Github,
  },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay } },
});

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.contact-animate');
      if (!items.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 10%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(items,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FORMSPREE_CONFIGURED) return;

    setStatus('loading');
    const data = new FormData(formRef.current);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-[#37E0C7]/40 focus:outline-none text-[#F2EFE9] text-sm transition-all duration-300 placeholder:text-[#A8A29A]/40 min-h-[44px]';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Heading ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D9D9D6]/60 uppercase block mb-3 font-display">
            04 / Get In Touch
          </span>
          <h2
            className="font-bold text-[#F2EFE9] tracking-display font-display"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Let&apos;s Build Something.
          </h2>
        </motion.div>

        {/* ── Two-column grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left: channel cards */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F2EFE9]/70 mb-5 font-display">
              Connect Channels
            </h3>

            {CHANNELS.map(({ name, label, href, Icon }) => (
              <a
                key={name}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="contact-animate flex items-center gap-4 p-4 rounded-2xl liquid-glass liquid-glass-interactive text-[#A8A29A] hover:text-[#F2EFE9] cursor-pointer group w-full min-h-[44px]"
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-[#D9D9D6] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D9D9D6]/50">
                    {name}
                  </span>
                  <span className="text-xs md:text-sm font-semibold truncate">
                    {label}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right: form card */}
          <div className={`md:col-span-7 p-6 md:p-8 rounded-[2rem] ${glass}`}>
            {/* Formspree not-configured warning */}
            {!FORMSPREE_CONFIGURED && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
                style={{
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  color: '#fbbf24',
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Form submission not yet configured. Replace{' '}
                  <code className="text-[11px] px-1 py-0.5 rounded bg-white/10">YOUR_FORM_ID</code>{' '}
                  in <code className="text-[11px] px-1 py-0.5 rounded bg-white/10">Contact.jsx</code>{' '}
                  with your Formspree form ID to enable email delivery.
                </span>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="contact-animate space-y-1.5">
                <label htmlFor="contact-name" className="text-[10px] uppercase font-bold tracking-wider text-[#D9D9D6]/60 block">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className={inputClass}
                />
              </div>

              <div className="contact-animate space-y-1.5">
                <label htmlFor="contact-email" className="text-[10px] uppercase font-bold tracking-wider text-[#D9D9D6]/60 block">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className={inputClass}
                />
              </div>

              <div className="contact-animate space-y-1.5">
                <label htmlFor="contact-message" className="text-[10px] uppercase font-bold tracking-wider text-[#D9D9D6]/60 block">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className={`${inputClass} resize-none`}
                  style={{ minHeight: 120 }}
                />
              </div>

              {/* Success state */}
              {status === 'success' && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl text-sm"
                  style={{
                    background: 'rgba(55,224,199,0.08)',
                    border: '1px solid rgba(55,224,199,0.25)',
                    color: '#37E0C7',
                  }}
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Message sent! I&apos;ll get back to you soon.
                </div>
              )}

              {/* Error state */}
              {status === 'error' && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl text-sm"
                  style={{
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Try emailing me directly at vipulrekhi@gmail.com
                </div>
              )}

              <button
                type="submit"
                disabled={!FORMSPREE_CONFIGURED || status === 'loading' || status === 'success'}
                className="contact-animate group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#F2EFE9] liquid-glass liquid-glass-interactive bg-white/5 cursor-pointer mt-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-opacity duration-300"
              >
                {status === 'loading' ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
