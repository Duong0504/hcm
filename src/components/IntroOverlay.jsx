import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay({ open, onDone }) {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const [progress, setProgress] = useState(0);

  const particles = useMemo(() => {
    // deterministic-ish (no Math.random during render loops)
    // mix of: red fabric shards + gold sparkles + small stars
    const count = 34;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 110 + (i % 8) * 16;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const delay = 0.10 + (i % 10) * 0.018;

      const kind = i % 3; // 0 shard, 1 sparkle, 2 star
      const size = kind === 0 ? 10 + (i % 5) * 6 : kind === 2 ? 14 + (i % 3) * 4 : 5 + (i % 4) * 3;
      const rot = (i * 37) % 360;
      return { i, x, y, size, delay, kind, rot };
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    if (prefersReducedMotion) {
      const t = window.setTimeout(onDone, 600);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    const duration = 3200;

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p >= 1) onDone();
      else raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, onDone, prefersReducedMotion]);

  const variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="intro-overlay"
          variants={variants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="intro-bg" aria-hidden="true" />

          {/* Explosion / shatter reveal */}
          <div className="intro-stage" aria-hidden="true">
            <motion.div
              className="intro-shockwave"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: [0, 0.85, 0], scale: [0.1, 1.65, 2.3] }}
              transition={{ duration: 1.2, ease: [0.2, 0.9, 0.2, 1] }}
            />

            <motion.div
              className="intro-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0] }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />

            <motion.div
              className="intro-emblem"
              initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
              animate={{ scale: [0.85, 1.05, 1], opacity: [0, 1, 1], rotate: [-8, 2, 0] }}
              transition={{ duration: 0.95, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="intro-flag-star" />
              <div className="intro-emblem-text">VIỆT NAM</div>
            </motion.div>

            {particles.map((p) => (
              <motion.span
                key={p.i}
                className={`intro-particle kind-${p.kind}`}
                style={{
                  width: p.size,
                  height: p.kind === 0 ? Math.max(8, Math.round(p.size * 0.55)) : p.size,
                  rotate: `${p.rot}deg`,
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, p.x],
                  y: [0, p.y],
                  scale: [0.6, 1, 0.9],
                }}
                transition={{
                  delay: p.delay,
                  duration: 1.05,
                  ease: [0.1, 0.9, 0.2, 1],
                }}
              />
            ))}
          </div>

          {/* Caption + progress (kept minimal, cinematic) */}
          <motion.div
            className="intro-caption"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: 'easeOut' }}
          >
            <div className="intro-badge">🇻🇳 &nbsp;Di sản lịch sử Việt Nam</div>
            <div className="intro-title">Những Lãnh Tụ Vĩ Đại Việt Nam</div>
            <div className="intro-progress">
              <div
                className="intro-progress-bar"
                style={{ transform: `scaleX(${Math.max(0.03, progress)})` }}
                aria-hidden="true"
              />
            </div>
            <div className="intro-actions">
              <button className="intro-skip" onClick={onDone}>
                Bỏ qua →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

