import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const typeConfig = {
  birth: { emoji: '⭐', label: 'Ngày sinh' },
  key: { emoji: '🔑', label: 'Sự kiện trọng đại' },
  military: { emoji: '⚔️', label: 'Quân sự' },
  victory: { emoji: '🏆', label: 'Chiến thắng' },
  war: { emoji: '🔥', label: 'Chiến tranh' },
};

function TimelineImage({ image, event, year }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="timeline-media">
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className="timeline-thumb"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={image}
          alt={event}
          loading="lazy"
          className="timeline-thumb-img"
          onMouseEnter={e => e.currentTarget.style.filter = 'sepia(0%) brightness(1)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'sepia(15%) brightness(0.85)'}
        />
        {/* golden overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        {/* year tag */}
        <div style={{
          position: 'absolute',
          bottom: '0.6rem',
          left: '0.8rem',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(200,169,81,0.3)',
          color: '#c8a951',
          fontSize: '0.7rem',
          fontWeight: '700',
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          letterSpacing: '1px',
        }}>
          {year}
        </div>
        {/* expand icon */}
        <div style={{
          position: 'absolute',
          top: '0.6rem',
          right: '0.6rem',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          color: '#c8a951',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          border: '1px solid rgba(200,169,81,0.3)',
        }}>
          {expanded ? '✕' : '⤢'}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(12px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={image}
                alt={event}
                style={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  border: '1px solid rgba(200,169,81,0.3)',
                }}
              />
              <div style={{
                marginTop: '1rem',
                color: '#c8a951',
                fontSize: '0.9rem',
                letterSpacing: '1px',
                fontStyle: 'italic',
              }}>
                {year} · {event}
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  marginTop: '1rem',
                  background: 'rgba(200,169,81,0.1)',
                  border: '1px solid rgba(200,169,81,0.3)',
                  color: '#c8a951',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Timeline({ events }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;
    if (!events?.length) return;

    // Continuous auto-scroll "showcase" (smoothest). We render events twice;
    // when we reach the midpoint, we jump back to 0 seamlessly.
    let raf = 0;
    let last = performance.now();
    const speedPxPerSecond = 28; // tuned for readability

    const loop = (now) => {
      const dt = now - last;
      last = now;
      const max = track.scrollWidth / 2;
      track.scrollLeft += (speedPxPerSecond * dt) / 1000;
      if (track.scrollLeft >= max) track.scrollLeft = 0;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [events, paused, prefersReducedMotion]);

  const displayEvents = useMemo(() => {
    if (!events?.length) return [];
    return [...events, ...events];
  }, [events]);

  return (
    <div className="timeline-container">
      <div
        ref={trackRef}
        className="timeline-track"
        aria-label="Mốc thời gian lịch sử (tự động trình chiếu ngang)"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {displayEvents.map((event, index) => {
          const config = typeConfig[event.type] || typeConfig.key;

          return (
            <motion.div
              key={`${index}-${event.year}-${event.event}`}
              className="timeline-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: Math.min(index * 0.04, 0.25), duration: 0.5 }}
            >
              <div className="timeline-dot-col">
                <div className="timeline-dot" title={config.label} aria-label={config.label}>
                  {config.emoji}
                </div>
              </div>

              <div className="timeline-content">
                <div className="timeline-year-badge">{event.year}</div>
                <div className="timeline-event">{event.event}</div>
                <p className="timeline-desc">{event.description}</p>
                {event.image && (
                  <TimelineImage
                    image={event.image}
                    event={event.event}
                    year={event.year}
                  />
                )}
                {!event.image && (
                  <div className="timeline-media" aria-hidden="true">
                    <div className="timeline-image-spacer" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
