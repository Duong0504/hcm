import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCanvas from './components/HeroCanvas';
import LeaderCard from './components/LeaderCard';
import LeaderModal from './components/LeaderModal';
import Timeline from './components/Timeline';
import IntroOverlay from './components/IntroOverlay';
import { leaders, timeline } from './data/leaders';
import './index.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" onClick={closeMenu}>
            LÃNH TỤ <span>VIỆT NAM</span>
          </a>
          {/* Desktop nav */}
          <ul className="nav-links">
            <li><a href="#leaders">Lãnh Tụ</a></li>
            <li><a href="#timeline">Lịch Sử</a></li>
            <li><a href="#quote">Ngữ Ngôn</a></li>
          </ul>
          {/* Hamburger button (mobile) */}
          <button
            className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu điều hướng"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <a href="#leaders" onClick={closeMenu}>Lãnh Tụ</a>
        <a href="#timeline" onClick={closeMenu}>Lịch Sử</a>
        <a href="#quote" onClick={closeMenu}>Ngữ Ngôn</a>
        <button
          onClick={closeMenu}
          style={{
            marginTop: '1rem',
            background: 'rgba(200,169,81,0.1)',
            border: '1px solid rgba(200,169,81,0.3)',
            color: 'var(--gold)',
            padding: '0.6rem 2rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            letterSpacing: '1px',
          }}
        >
          ✕ Đóng
        </button>
      </div>
    </>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-canvas">
        <HeroCanvas />
      </div>

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,10,15,0.7) 70%, rgba(10,10,15,0.95) 100%)',
        zIndex: 5,
      }} />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="hero-badge">🇻🇳 &nbsp;Di sản lịch sử Việt Nam</div>

        <h1 className="hero-title">
          Những <span className="highlight">Lãnh Tụ</span><br />
          Vĩ Đại Việt Nam
        </h1>

        <p className="hero-subtitle">
          Tôn vinh những con người tài hoa, kiên trung, đã dành cả cuộc đời cho
          độc lập tự do của Tổ quốc — những ngôi sao sáng mãi trên bầu trời dân tộc.
        </p>

        <div className="hero-actions">
          <a href="#leaders" className="btn-primary">
            ✦ &nbsp;Khám phá ngay
          </a>
          <a href="#timeline" className="btn-outline">
            📜 &nbsp;Mốc lịch sử
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(200,169,81,0.6)',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>Cuộn xuống</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { number: '80+', label: 'Năm đấu tranh' },
    { number: '1945', label: 'Độc lập lập quốc' },
    { number: '3', label: 'Lãnh tụ tiêu biểu' },
    { number: '∞', label: 'Thế hệ tri ân' },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadersSection({ onSelectLeader }) {
  return (
    <section className="leaders-section" id="leaders">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Những Lãnh Tụ Vĩ Đại
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Những con người đã viết nên trang sử hào hùng của dân tộc Việt Nam
          </motion.p>
        </div>

        <div className="leaders-grid">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} onClick={onSelectLeader} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="timeline-section" id="timeline">
      <div className="container">
        <div className="section-title">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Mốc Thời Gian Lịch Sử
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Hành trình đấu tranh giành độc lập tự do của dân tộc Việt Nam
            qua các thời kỳ lịch sử
          </motion.p>
        </div>

        <Timeline events={timeline} />
      </div>
    </section>
  );
}

function QuoteSection() {
  const [active, setActive] = useState(0);
  const quotes = leaders.map((l) => ({ quote: l.quote, author: l.name }));

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <section className="quote-section" id="quote">
      <div className="container">
        <div className="gold-line" />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active}
            className="quote-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            "<span>{quotes[active].quote}</span>"
          </motion.blockquote>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={`author-${active}`}
            className="quote-author"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {quotes[active].author}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === active ? 'var(--gold)' : 'rgba(200,169,81,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo">Lãnh Tụ Việt Nam</div>
        <p className="footer-text">
          Trang web được tạo ra để tôn vinh và ghi nhớ những đóng góp vĩ đại<br />
          của các lãnh tụ Việt Nam trong sự nghiệp giải phóng dân tộc.
        </p>
        <div className="footer-flag">🇻🇳 ✦ 🇻🇳</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          © 2025 · Không có gì quý hơn độc lập, tự do.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('hcm_intro_seen') === '1';
      setShowIntro(!seen);
    } catch {
      setShowIntro(true);
    }
  }, []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem('hcm_intro_seen', '1');
    } catch {
      // ignore
    }
    setShowIntro(false);
  };

  return (
    <>
      <IntroOverlay open={showIntro} onDone={finishIntro} />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <LeadersSection onSelectLeader={setSelectedLeader} />
      <TimelineSection />
      <QuoteSection />
      <Footer />

      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
