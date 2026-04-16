import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Achievement Article Modal (centered, full-read layout) ───────────────────
function AchievementModal({ item, onClose, leaderColor }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        <motion.article
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(180deg, #0f0f1a 0%, #141425 100%)',
            border: `1px solid ${leaderColor}33`,
            borderRadius: '24px',
            maxWidth: '720px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${leaderColor}11`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${leaderColor}44`,
              color: leaderColor,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
              zIndex: 10,
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            ✕
          </button>

          {/* Hero image – full width */}
          <div style={{ position: 'relative', height: '280px' }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
                filter: 'brightness(0.75)',
              }}
            />
            {/* gradient fade to background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, #0f0f1a 100%)',
            }} />

            {/* Year badge overlay on image */}
            <div style={{
              position: 'absolute',
              bottom: '1.4rem',
              left: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                background: leaderColor,
                color: '#0a0a0f',
                fontWeight: '700',
                fontSize: '0.8rem',
                padding: '0.3rem 1rem',
                borderRadius: '20px',
                letterSpacing: '1px',
              }}>
                📅 {item.year}
              </div>
            </div>
          </div>

          {/* Article body */}
          <div style={{ padding: '0 2.5rem 3rem' }}>

            {/* Title */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              marginBottom: '1.2rem',
            }}>
              <div style={{
                width: '4px',
                minHeight: '100%',
                height: 'auto',
                alignSelf: 'stretch',
                background: `linear-gradient(to bottom, ${leaderColor}, transparent)`,
                borderRadius: '2px',
                flexShrink: 0,
                marginTop: '4px',
              }} />
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                color: '#f0e6d3',
                lineHeight: 1.3,
                margin: 0,
              }}>
                {item.title}
              </h2>
            </div>

            {/* Decorative divider */}
            <div style={{
              height: '1px',
              background: `linear-gradient(90deg, ${leaderColor}55, rgba(200,169,81,0.1), transparent)`,
              marginBottom: '2rem',
            }} />

            {/* Article text */}
            <div style={{
              color: '#c0a882',
              fontSize: '1rem',
              lineHeight: '1.95',
              whiteSpace: 'pre-line',
              letterSpacing: '0.01em',
            }}>
              {item.detail.split('\n\n').map((paragraph, i) => (
                <p key={i} style={{
                  marginBottom: i < item.detail.split('\n\n').length - 1 ? '1.4rem' : 0,
                }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Achievement Item Button ──────────────────────────────────────────────────
function AchievementItem({ item, onClick, leaderColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.75rem 1rem',
        background: hovered
          ? `rgba(${hexToRgb(leaderColor)}, 0.12)`
          : 'rgba(200,169,81,0.04)',
        border: `1px solid ${hovered ? leaderColor + '55' : 'rgba(200,169,81,0.08)'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.25s',
        userSelect: 'none',
      }}
    >
      <span style={{ color: leaderColor, flexShrink: 0, fontSize: '0.9rem' }}>✦</span>
      <span style={{
        fontSize: '0.88rem',
        color: hovered ? '#f0e6d3' : '#b0926a',
        flex: 1,
        lineHeight: 1.4,
        transition: 'color 0.25s',
      }}>
        {item.title}
      </span>
      <span style={{
        color: leaderColor,
        fontSize: '0.85rem',
        opacity: hovered ? 1 : 0.3,
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        transition: 'all 0.25s',
        flexShrink: 0,
      }}>
        →
      </span>
    </li>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '200, 169, 81';
}

// ── Main Leader Modal ────────────────────────────────────────────────────────
export default function LeaderModal({ leader, onClose }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => {
      if (e.key === 'Escape' && !selectedAchievement) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, selectedAchievement]);

  if (!leader) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <button className="modal-close" onClick={onClose}>✕</button>

            <div className="modal-hero">
              <div className="modal-image">
                <img src={leader.image} alt={leader.name} />
              </div>
              <div className="modal-meta">
                <div className="modal-badge" style={{ color: leader.color }}>
                  ✦ &nbsp;Lãnh tụ Việt Nam
                </div>
                <h2 className="modal-name">{leader.name}</h2>
                <p className="modal-role">{leader.title}</p>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <label>Tên thật</label>
                    <span>{leader.realName}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Nơi sinh</label>
                    <span>{leader.birthPlace}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Ngày sinh</label>
                    <span>{leader.birth}</span>
                  </div>
                  <div className="modal-info-item">
                    <label>Ngày mất</label>
                    <span>{leader.death}</span>
                  </div>
                </div>
                <div className="modal-quote">"{leader.quote}"</div>
              </div>
            </div>

            <div className="modal-body">
              <h3>Cuộc đời & Sự nghiệp</h3>
              <p className="modal-story">{leader.story}</p>

              <h3>
                Những đóng góp tiêu biểu
                <span style={{
                  marginLeft: '0.8rem',
                  fontSize: '0.75rem',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  color: 'var(--text-muted)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}>
                  — nhấn để xem chi tiết
                </span>
              </h3>

              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {leader.achievements.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <AchievementItem
                      item={item}
                      onClick={setSelectedAchievement}
                      leaderColor={leader.color}
                    />
                  </motion.div>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Achievement Article Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <AchievementModal
            item={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
            leaderColor={leader.color}
          />
        )}
      </AnimatePresence>
    </>
  );
}
