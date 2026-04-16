import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// On touch devices skip the 3-D tilt – mouse coords are unreliable on mobile
const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function LeaderCard({ leader, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (isTouchDevice) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setTimeout(() => {
      if (card) card.style.transition = '';
    }, 600);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div
        ref={cardRef}
        className="leader-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: 'box-shadow 0.3s' }}
        onMouseEnter={(e) => {
          if (!isTouchDevice) {
            e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${leader.glowColor}22`;
          }
        }}
        // On touch devices open the modal on tap
        onClick={() => isTouchDevice && onClick(leader)}
      >
        <div className="leader-card-glow" style={{ background: `linear-gradient(135deg, ${leader.color}, transparent)` }} />

        <div className="leader-image-wrap">
          <img src={leader.image} alt={leader.name} loading="lazy" />
          <div className="leader-image-overlay" />
          <div className="leader-years">{leader.birth.split('/')[2]} – {leader.death.split('/')[2]}</div>
        </div>

        <div className="leader-body">
          <div className="leader-title-small" style={{ color: leader.color }}>
            ✦ &nbsp;{leader.title}
          </div>
          <h3 className="leader-name">{leader.name}</h3>
          <div className="leader-subtitle">{leader.realName}</div>
          <p className="leader-bio">{leader.shortBio}</p>

          <div className="leader-quote-preview">
            "{leader.quote}"
          </div>

          <div className="leader-card-footer">
            <div className="leader-born">
              Sinh: <span>{leader.birth}</span>
            </div>
            <button
              className="btn-detail"
              onClick={(e) => { e.stopPropagation(); onClick(leader); }}
              style={{ borderColor: `${leader.color}44`, color: leader.color }}
            >
              Xem chi tiết →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
