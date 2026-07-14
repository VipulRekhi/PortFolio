/**
 * LiquidGlass — shared glass className strings.
 *
 * Import `glass` wherever you need the frosted panel look.
 * For interactive elements that need hover lift, use `glassInteractive`.
 *
 * Do NOT add backdrop-filter here — it's already defined in index.css
 * via .liquid-glass / .liquid-glass-interactive utility classes.
 * These exported strings are used when you need to apply the glass
 * look through Tailwind's className prop directly.
 */

export const glass =
  'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl';

export const glassInteractive =
  'bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ' +
  'transition-all duration-300 ease-out hover:bg-white/[0.07] hover:border-white/20 ' +
  'hover:shadow-2xl hover:-translate-y-0.5';

// Accent teal — used sparingly on borders, icons, hover states. Never as a large fill.
export const accentColor = '#37E0C7';
