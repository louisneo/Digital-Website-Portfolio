import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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

  // Smooth scroll parallax & reveal observer
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
        Faithful to Pinterest Spline showcase (duhstudio / hungry minds)
        ========================================================= 
      */}
      <section className="spline-hero" aria-labelledby="spline-hero-title">
        {/* Parallax background painting with moody oceanic vignette */}
        <div
          className="px-layer px-bg"
          data-speed="0.32"
          style={{ backgroundImage: `url(${img('bg-turner-polyphemus.jpg')})` }}
        />
        <div className="spline-hero-vignette" aria-hidden="true" />

        {/* Antique Mythological Engravings flanking the hero */}
        <div className="hero-engraving-top-right" aria-hidden="true">
          <KrakenEngraving />
        </div>
        <div className="hero-engraving-bottom-left" aria-hidden="true">
          <ChimeraEngraving />
        </div>

        {/* Interactive 3D Armillary Celestial Relic */}
        <div className="spline-hero-canvas-wrap" aria-hidden="true">
          <HeroCanvas />
        </div>

        {/* Center Typography & Controls */}
        <div className="spline-hero-content rv">
          <p className="spline-hero-eyebrow">
            A GREAT BOOKS DIGITAL PORTFOLIO · LOUIS NEO M. LOK · 4TH YEAR BS IT
          </p>
          <h1 id="spline-hero-title" className="spline-hero-title">
            <span>Welcome to</span>
            <em>Myth &amp; Mind</em>
          </h1>
          <p className="spline-hero-sub">
            A PSYCHOLOGICAL AND PHILOSOPHICAL LENS ON ANCIENT HEROIC EPICS
          </p>

          <div className="spline-hero-actions">
            <a href="#works-stage" className="btn-pill-gold">
              <span className="dot" />
              EXPLORE THE SEVEN WORKS
            </a>
            <Link to="/analyses" className="btn-pill-glass">
              READ ANALYSES
            </Link>
            <Link to="/museum" className="btn-pill-glass">
              3D MUSEUM ↗
            </Link>
          </div>
        </div>

        <a className="px-scroll" href="#intro" aria-label="Scroll to introduction">
          <span />
        </a>
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
        THE SEVEN WORKS: "The Black Book" Pinterest Style
        Each chapter has panoramic art, central 3D interactive book,
        floating editorial card, and giant footer title!
        ========================================================= 
      */}
      <section id="works-stage" className="spline-works-stage" aria-labelledby="works-stage-heading">
        <div className="spline-works-header rv">
          <p className="eyebrow">The Seven Foundational Epics</p>
          <h2 id="works-stage-heading" className="h-serif">Curated Masterpieces</h2>
          <p className="spline-works-subtitle">
            Interactive 3D hardcover editions. Move cursor across each stage to tilt and inspect.
          </p>
        </div>

        {works.map((w, i) => {
          const m = meta[i]
          return (
            <section
              key={m.id}
              className={`spline-work-slide rv`}
              aria-labelledby={`work-title-${m.id}`}
            >
              {/* Full panoramic painting background with parallax */}
              <div
                className="px-layer px-bg spline-slide-bg"
                data-speed="0.25"
                style={{ backgroundImage: `url(${img(w.image)})` }}
              />
              <div className="spline-slide-shade" aria-hidden="true" />

              <div className="spline-slide-grid">
                {/* Left: Floating Editorial Card */}
                <article className="spline-slide-card">
                  <div className="spline-card-meta">
                    <span className="card-roman">{roman[i]}</span>
                    <span className="card-separator">·</span>
                    <span className="card-era">{m.era}</span>
                    <span className="card-separator">·</span>
                    <span className="card-date">{m.date}</span>
                  </div>

                  <h3 className="spline-card-hook">
                    “{m.hook}”
                  </h3>

                  <p className="spline-card-author">
                    <b>{w.author}</b>
                    <span lang="und">{m.orig}</span>
                  </p>

                  <p className="spline-card-desc">
                    {w.context}
                  </p>

                  <ul className="spline-card-chips">
                    {w.themes.slice(0, 3).map(t => (
                      <li key={t.name}>{t.name}</li>
                    ))}
                  </ul>

                  <div className="spline-card-actions">
                    <Link className="btn-work-pill" to={`/analyses?work=${m.id}`}>
                      <span>READ ANALYSIS</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link className="btn-work-ghost" to="/museum">
                      MUSEUM ↗
                    </Link>
                  </div>
                </article>

                {/* Center: Interactive 3D Hardcover Book Canvas */}
                <div className="spline-slide-book-wrap">
                  <Link
                    to={`/analyses?work=${m.id}`}
                    className="spline-book-link"
                    title={`Click to read analysis of ${w.title}`}
                  >
                    <BookCanvas
                      image={w.image}
                      title={m.short}
                      author={w.author}
                      roman={roman[i]}
                      orig={m.orig}
                      era={m.era}
                    />
                    <div className="spline-book-badge">
                      <span className="badge-glow" />
                      <span className="badge-text">✦ TILT &amp; ROTATE</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Giant Serif Italic Title Across the Bottom (matching "The Black Book") */}
              <div className="spline-grand-footer-title" aria-hidden="true">
                <Link to={`/analyses?work=${m.id}`}>
                  <em>{w.title}</em>
                </Link>
              </div>
            </section>
          )
        })}
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
