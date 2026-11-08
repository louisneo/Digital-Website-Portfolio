import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'
import BookCanvas from '../components/BookCanvas.jsx'

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
  const [flipCount, setFlipCount] = useState(0)

  const activeWork = works[activeIdx]
  const activeMeta = meta[activeIdx]

  // Function to flip to next work
  const flipNext = () => {
    setActiveIdx(i => (i + 1) % works.length)
    setFlipCount(c => c + 1)
  }

  // Function to flip to previous work
  const flipPrev = () => {
    setActiveIdx(i => (i - 1 + works.length) % works.length)
    setFlipCount(c => c + 1)
  }

  // Keyboard navigation: Left / Right arrows to flip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        flipNext()
      } else if (e.key === 'ArrowLeft') {
        flipPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        HERO SECTION: "The Book" (Pinterest Spline Style)
        - Panoramic artwork background corresponding to active work
        - On load / refresh: Dramatic 3D Zoom-In animation into center stage
        - When book is flipped:
          * 3D book spins 360-degrees
          * Background crossfades to that work's classical painting
          * Giant footer title ghost-morphs
          * Editorial text updates smoothly
        ========================================================= 
      */}
      <section className="the-book-hero" aria-labelledby="the-book-title">
        {/* Crossfading Background with Slight Zoom on New Work Image (~1.0s) */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeWork.image}
            className="px-layer px-bg the-book-hero-bg"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundImage: `url(${img(activeWork.image)})` }}
          />
        </AnimatePresence>
        <div className="the-book-hero-vignette" aria-hidden="true" />

        {/* Top Control Bar: Work Selector Pills & Counter */}
        <header className="the-book-top-bar">
          <div className="the-book-brand">
            <span className="brand-dot" />
            <b>Myth &amp; Mind</b>
            <span className="brand-sep">·</span>
            <small>Louis Neo M. Lok</small>
          </div>

          <div className="the-book-pills" role="tablist" aria-label="Select work">
            {works.map((w, idx) => (
              <button
                key={w.title}
                role="tab"
                aria-selected={activeIdx === idx}
                className={`book-pill-nav ${activeIdx === idx ? 'is-active' : ''}`}
                onClick={() => {
                  if (activeIdx !== idx) {
                    setActiveIdx(idx)
                    setFlipCount(c => c + 1)
                  }
                }}
              >
                <span>{roman[idx]}</span>
                <small>{meta[idx].short}</small>
              </button>
            ))}
          </div>

          <div className="the-book-counter">
            <b>{String(activeIdx + 1).padStart(2, '0')}</b>
            <span>/ 07</span>
          </div>
        </header>

        {/* Main Stage Grid: Left Editorial Card + Center 3D Book */}
        <div className="the-book-hero-grid">
          {/* Left: Editorial Narrative Hook Card (Smooth Fades on Change) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWork.title}
              className="the-book-editorial"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="the-book-eyebrow">
                {roman[activeIdx]} · {activeMeta.era.toUpperCase()} · {activeMeta.date}
              </p>

              <h2 className="the-book-hook">
                “{activeMeta.hook}”
              </h2>

              <p className="the-book-author">
                <b>{activeWork.author}</b>
                <span lang="und">{activeMeta.orig}</span>
              </p>

              <p className="the-book-desc">
                {activeWork.context}
              </p>

              <ul className="the-book-chips">
                {activeWork.themes.slice(0, 3).map(t => (
                  <li key={t.name}>{t.name}</li>
                ))}
              </ul>

              <div className="the-book-actions">
                <Link className="btn-pill-gold" to={`/analyses?work=${activeMeta.id}`}>
                  <span className="dot" />
                  READ ANALYSIS
                </Link>
                <button
                  className="btn-pill-flip"
                  onClick={flipNext}
                  title="Flip book to next masterpiece"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  FLIP BOOK
                </button>
                <Link className="btn-pill-glass" to="/museum">
                  3D MUSEUM ↗
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Center: 3D Hardcover Book Flanked by Previous / Next Arrow Controls */}
          <motion.div
            className="the-book-centerpiece"
            initial={{ scale: 0.22, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="the-book-stage-row">
              <button
                className="book-arrow-btn prev"
                onClick={flipPrev}
                aria-label="Flip to previous work"
                title="Previous work (or press Left arrow)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div
                className="the-book-3d-interactive"
                onClick={flipNext}
                role="button"
                tabIndex={0}
                title="Click to flip the book and change the work"
              >
                <BookCanvas
                  image={activeWork.image}
                  title={activeMeta.short}
                  author={activeWork.author}
                  roman={roman[activeIdx]}
                  orig={activeMeta.orig}
                  era={activeMeta.era}
                  flipKey={flipCount}
                />
                <div className="the-book-click-hint">
                  <span className="hint-pulse" />
                  <span className="hint-text">✦ CLICK BOOK TO FLIP ({activeIdx + 1}/7)</span>
                </div>
              </div>

              <button
                className="book-arrow-btn next"
                onClick={flipNext}
                aria-label="Flip to next work"
                title="Next work (or press Right arrow)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Giant Serif Italic Title Across the Bottom (matching "The Book" in screenshot) */}
        <div className="the-book-giant-title" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeWork.title}
              className="ghost-morph-title-wrap"
              initial={{ opacity: 0, filter: 'blur(18px)', y: 26 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(20px)', y: -26 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/analyses?work=${activeMeta.id}`}>
                <em>{activeWork.title}</em>
              </Link>
            </motion.div>
          </AnimatePresence>
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
