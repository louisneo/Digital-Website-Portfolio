import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'
import HeroCanvas from '../components/HeroCanvas.jsx'
import BookCanvas from '../components/BookCanvas.jsx'
import { KrakenEngraving, ChimeraEngraving } from '../components/MythicalEngravings.jsx'

const img = file => import.meta.env.BASE_URL + file

const stats = [
  ['07', 'Works Read Closely'],
  ['04', 'Civilizations'],
  ['1,900', 'Years of Storytelling'],
  ['05', 'Reflection Essays'],
]

const explore = [
  ['/favorite', 'Favorite Masterpiece', 'Why The Odyssey stayed with me: homecoming, patience, and the people who wait.', 'odyssey-waterhouse-sirens.webp'],
  ['/summary', 'Summary of Learning', 'A comparison of all seven works and the literary lenses I used to read them.', 'mahabharata-razmnama.webp'],
  ['/reflection', 'Personal Reflection', 'Five questions about how these old stories changed the way I read and think.', 'iliad-ivanov-priam.webp'],
  ['/profile', 'About the Reader', 'Who I am, what I used to read, and what I expected from Great Books.', 'roland-fouquet.webp'],
]

const byYear = [...meta].sort((a, b) => a.year - b.year).map(m => m.id)

export default function Home() {
  const root = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const activeWork = works[activeIdx]
  const activeMeta = meta[activeIdx]

  // Keyboard navigation for Showcase (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExpanded && e.key === 'Escape') {
        setIsExpanded(false)
        return
      }
      if (e.key === 'ArrowRight') {
        setActiveIdx(i => (i + 1) % works.length)
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx(i => (i - 1 + works.length) % works.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  // Parallax on scroll for intro, timeline, and quote
  useEffect(() => {
    const el = root.current
    if (!el) return
    const layers = [...el.querySelectorAll('[data-speed]')]
    const reveals = [...el.querySelectorAll('.rv')]
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in')
      })
    }, { threshold: 0.12 })
    reveals.forEach(r => io.observe(r))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => io.disconnect()
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      layers.forEach(l => {
        const r = l.parentElement.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) return
        const offset = r.top + r.height / 2 - vh / 2
        l.style.transform = `translate3d(0, ${(-offset * Number(l.dataset.speed)).toFixed(1)}px, 0)`
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="home pinterest-theme" ref={root}>
      {/* 
        =========================================================
        HERO SECTION: "Welcome to Myth & Mind"
        - Slow zoom out on whole hero on load
        - Left illustration slides from bottom-left (slow with ease-out)
        - Right illustration slides from top-right (slow with ease-out)
        - Staggered fade-ins: Title -> Tagline -> Paragraph -> Buttons
          (each 0.4 to 0.6s apart with small upward drift)
        - No scrollbar / scroll indicator
        - 3D armillary relic fully contained without clipping
        ========================================================= 
      */}
      <section className="spline-hero" aria-labelledby="spline-hero-title">
        {/* Slow zoom out on the whole hero background on load */}
        <motion.div
          className="px-layer px-bg spline-hero-bg-zoom"
          initial={{ scale: 1.14 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 4.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundImage: `url(${img('bg-turner-polyphemus.jpg')})` }}
        />
        <div className="spline-hero-vignette" aria-hidden="true" />

        {/* Right illustration slides in from TOP-RIGHT (slow with ease-out) */}
        <motion.div
          className="hero-engraving-top-right"
          aria-hidden="true"
          initial={{ x: 140, y: -140, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 0.85 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <KrakenEngraving />
        </motion.div>

        {/* Left illustration slides in from BOTTOM-LEFT (slow with ease-out) */}
        <motion.div
          className="hero-engraving-bottom-left"
          aria-hidden="true"
          initial={{ x: -140, y: 140, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 0.85 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChimeraEngraving />
        </motion.div>

        {/* Interactive 3D Armillary Celestial Relic (never cut out) */}
        <div className="spline-hero-canvas-wrap" aria-hidden="true">
          <HeroCanvas />
        </div>

        {/* Center Editorial Content with Staggered Upward Drift */}
        <div className="spline-hero-content">
          {/* 1. Title (fades in first with small upward drift) */}
          <motion.h1
            id="spline-hero-title"
            className="spline-hero-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Welcome to</span>
            <em>Myth &amp; Mind</em>
          </motion.h1>

          {/* 2. Tagline / Eyebrow (0.5s after title) */}
          <motion.p
            className="spline-hero-eyebrow"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            A GREAT BOOKS DIGITAL PORTFOLIO · LOUIS NEO M. LOK · 4TH YEAR BS IT
          </motion.p>

          {/* 3. Paragraph (0.5s after tagline) */}
          <motion.p
            className="spline-hero-sub"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            A PSYCHOLOGICAL AND PHILOSOPHICAL LENS ON ANCIENT HEROIC EPICS
          </motion.p>

          {/* 4. Buttons (0.5s after paragraph) */}
          <motion.div
            className="spline-hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#showcase" className="btn-pill-gold">
              <span className="dot" />
              EXPLORE THE SEVEN WORKS
            </a>
            <Link to="/analyses" className="btn-pill-glass">
              READ ANALYSES
            </Link>
            <Link to="/museum" className="btn-pill-glass">
              3D MUSEUM ↗
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 
        =========================================================
        PORTFOLIO INTRO: Louis Neo M. Lok / UNC BS IT
        ========================================================= 
      */}
      <section id="intro" className="px-intro">
        <div className="px-intro-text rv">
          <p className="eyebrow">About this portfolio</p>
          <h2 className="h-serif">Old stories, read like systems of the mind</h2>
          <p>
            As a 4th-year Information Technology student at the University of Nueva Caceres, my daily world revolves around systems architecture, data flows, and error handling. In Great Books, I applied that exact systemic lens to the seven foundational epics of human history.
          </p>
          <p>
            Why does Achilles’ pride cause catastrophic cascade failure across the Achaean army? Why does Job refuse the false diagnostic theories of his friends? Why does Roland let his division fall rather than trigger an emergency horn? Each story holds a timeless psychological model of how human beings confront fate, grief, and truth.
          </p>
        </div>
        <ul className="px-stats">
          {stats.map(([n, t], i) => (
            <li key={t} className="rv" style={{ transitionDelay: `${i * 90}ms` }}>
              <b>{n}</b>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 
        =========================================================
        SHOWCASE SECTION ("The Black Book" Style)
        - When active item changes:
          * Crossfade background with slight zoom on new image (~1s)
          * Fade and swap center 3D book object (~1s)
          * Ghost morph on big title (old & new overlap & blur before settling ~1s)
          * Fade side text at the same time (~1s)
        - Click interaction: center object scales up to fill most of screen
          and scales back down.
        ========================================================= 
      */}
      <section id="showcase" className="spline-works-stage" aria-labelledby="showcase-heading">
        <div className="spline-works-header rv">
          <p className="eyebrow">The Seven Foundational Epics</p>
          <h2 id="showcase-heading" className="h-serif">Curated Masterpieces</h2>
          <p className="spline-works-subtitle">
            Interactive 3D hardcover editions. Click the center book to inspect in full scale.
          </p>

          {/* Interactive Navigation Pills for switching works */}
          <div className="showcase-nav-pills" role="tablist" aria-label="Select work">
            {works.map((w, idx) => (
              <button
                key={w.title}
                role="tab"
                aria-selected={activeIdx === idx}
                className={`showcase-pill-btn ${activeIdx === idx ? 'is-active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span>{roman[idx]}</span>
                <small>{meta[idx].short}</small>
              </button>
            ))}
          </div>
        </div>

        {/* The Active Showcase Stage */}
        <div className="spline-work-slide active-showcase-stage">
          {/* 1. Crossfading Background with Slight Zoom on New Image (~1.0s) */}
          <AnimatePresence initial={false}>
            <motion.div
              key={activeWork.image}
              className="px-layer px-bg spline-slide-bg"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 1.0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{ backgroundImage: `url(${img(activeWork.image)})` }}
            />
          </AnimatePresence>
          <div className="spline-slide-shade" aria-hidden="true" />

          {/* Navigation Arrows for Previous / Next */}
          <button
            className="showcase-arrow-btn prev"
            onClick={() => setActiveIdx((activeIdx - 1 + works.length) % works.length)}
            aria-label="Previous work"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            className="showcase-arrow-btn next"
            onClick={() => setActiveIdx((activeIdx + 1) % works.length)}
            aria-label="Next work"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="spline-slide-grid">
            {/* 2. Side Editorial Text: Fades simultaneously (~1.0s) */}
            <AnimatePresence mode="wait">
              <motion.article
                key={activeWork.title}
                className="spline-slide-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="spline-card-meta">
                  <span className="card-roman">{roman[activeIdx]}</span>
                  <span className="card-separator">·</span>
                  <span className="card-era">{activeMeta.era}</span>
                  <span className="card-separator">·</span>
                  <span className="card-date">{activeMeta.date}</span>
                </div>

                <h3 className="spline-card-hook">
                  “{activeMeta.hook}”
                </h3>

                <p className="spline-card-author">
                  <b>{activeWork.author}</b>
                  <span lang="und">{activeMeta.orig}</span>
                </p>

                <p className="spline-card-desc">
                  {activeWork.context}
                </p>

                <ul className="spline-card-chips">
                  {activeWork.themes.slice(0, 3).map(t => (
                    <li key={t.name}>{t.name}</li>
                  ))}
                </ul>

                <div className="spline-card-actions">
                  <Link className="btn-work-pill" to={`/analyses?work=${activeMeta.id}`}>
                    <span>READ ANALYSIS</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    className="btn-work-ghost"
                    onClick={() => setIsExpanded(true)}
                    title="Scale up 3D book inspection"
                  >
                    ✦ INSPECT 3D
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* 3. Center 3D Book Object: Fades and Swaps (~1.0s) + Click to Scale Up */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.title}
                className="spline-slide-book-wrap"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="spline-book-link is-clickable"
                  onClick={() => setIsExpanded(true)}
                  role="button"
                  tabIndex={0}
                  title={`Click to inspect 3D edition of ${activeWork.title}`}
                >
                  <BookCanvas
                    image={activeWork.image}
                    title={activeMeta.short}
                    author={activeWork.author}
                    roman={roman[activeIdx]}
                    orig={activeMeta.orig}
                    era={activeMeta.era}
                  />
                  <div className="spline-book-badge">
                    <span className="badge-glow" />
                    <span className="badge-text">✦ CLICK TO EXPAND · TILT &amp; ROTATE</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. Big Title with Ghost Morph: Old and New Overlap & Blur Before Settling (~1.0s) */}
          <div className="spline-grand-footer-title" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeWork.title}
                className="ghost-morph-title-wrap"
                initial={{ opacity: 0, filter: 'blur(16px)', y: 24 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(18px)', y: -24 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/analyses?work=${activeMeta.id}`}>
                  <em>{activeWork.title}</em>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 
          =========================================================
          CLICK INTERACTION: 3D Center Object Scales Up to Fill Most of Screen
          ========================================================= 
        */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="book-expanded-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsExpanded(false)}
            >
              <motion.div
                className="book-expanded-card"
                initial={{ scale: 0.55, opacity: 0 }}
                animate={{ scale: 1.0, opacity: 1 }}
                exit={{ scale: 0.55, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="book-expanded-close"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close 3D inspection view"
                >
                  ✕
                </button>

                <div className="book-expanded-canvas-wrap">
                  <BookCanvas
                    image={activeWork.image}
                    title={activeMeta.short}
                    author={activeWork.author}
                    roman={roman[activeIdx]}
                    orig={activeMeta.orig}
                    era={activeMeta.era}
                  />
                </div>

                <div className="book-expanded-info">
                  <span className="expanded-tag">{roman[activeIdx]} · {activeMeta.era} · {activeMeta.date}</span>
                  <h3 className="expanded-title">{activeWork.title}</h3>
                  <p className="expanded-desc">“{activeMeta.hook}”</p>
                  <p className="expanded-context">{activeWork.context}</p>
                  <div className="expanded-actions">
                    <Link className="btn-work-pill" to={`/analyses?work=${activeMeta.id}`}>
                      <span>READ FULL ANALYSIS</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>
                    <button className="btn-work-ghost" onClick={() => setIsExpanded(false)}>
                      SCALE BACK DOWN
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 
        =========================================================
        TIMELINE: 800 BCE to 1100 CE
        ========================================================= 
      */}
      <section className="px-timeline" aria-labelledby="tl-title">
        <p className="eyebrow rv">Chronological Arc</p>
        <h2 id="tl-title" className="h-serif rv">Nineteen centuries of storytelling</h2>
        <div className="tl rv">
          <div className="tl-line" aria-hidden="true" />
          {meta.map(m => (
            <Link
              key={m.id}
              to={`/analyses?work=${m.id}`}
              className={`tl-pt${byYear.indexOf(m.id) % 2 ? ' down' : ''}`}
              style={{ left: `${((m.year + 800) / 1900) * 100}%` }}
            >
              <i aria-hidden="true" />
              <b>{m.short}</b>
              <span>{m.date}</span>
            </Link>
          ))}
        </div>
        <div className="tl-ends rv" aria-hidden="true">
          <span>800 BCE</span>
          <span>1100 CE</span>
        </div>
      </section>

      {/* 
        =========================================================
        QUOTE BAND
        ========================================================= 
      */}
      <section className="px-quote" aria-label="Quotation">
        <div
          className="px-layer px-bg"
          data-speed="0.3"
          style={{ backgroundImage: `url(${img('waterhouse-penelope-suitors-1912.jpg')})` }}
        />
        <div className="px-chapter-shade" aria-hidden="true" />
        <blockquote className="rv">
          <p>“I have heard of thee by the hearing of the ear: but now mine eye seeth thee.”</p>
          <cite>Job 42:5 · King James Version</cite>
        </blockquote>
      </section>

      {/* 
        =========================================================
        EXPLORE THE REST: Portfolio Essays & Profile
        ========================================================= 
      */}
      <section className="px-explore" aria-labelledby="ex-title">
        <p className="eyebrow rv">Continue the journey</p>
        <h2 id="ex-title" className="h-serif rv">More from the portfolio</h2>
        <div className="ex-grid">
          {explore.map(([to, t, d, pic], i) => (
            <Link
              key={to}
              to={to}
              className="ex-card rv"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="ex-img">
                <img src={img(pic)} alt="" loading="lazy" />
              </div>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="link-arrow">Open <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
