import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'

const img = file => import.meta.env.BASE_URL + file

const stats = [
  ['07', 'works read closely'],
  ['04', 'civilizations'],
  ['1,900', 'years of storytelling'],
  ['05', 'reflection essays'],
]

const explore = [
  ['/favorite', 'Favorite Masterpiece', 'Why The Odyssey stayed with me: homecoming, patience, and the people who wait.', 'odyssey-waterhouse-sirens.webp'],
  ['/summary', 'Summary of Learning', 'A comparison of all seven works and the literary lenses I used to read them.', 'mahabharata-razmnama.webp'],
  ['/reflection', 'Personal Reflection', 'Five questions about how these old stories changed the way I read and think.', 'iliad-ivanov-priam.webp'],
  ['/profile', 'About the Reader', 'Who I am, what I used to read, and what I expected from Great Books.', 'roland-fouquet.webp'],
]

// Works in date order, so timeline labels can alternate above and below the line.
const byYear = [...meta].sort((a, b) => a.year - b.year).map(m => m.id)

export default function Home() {
  const root = useRef(null)

  // Parallax: each [data-speed] layer moves against its section while scrolling.
  useEffect(() => {
    const el = root.current
    const layers = [...el.querySelectorAll('[data-speed]')]
    const reveals = [...el.querySelectorAll('.rv')]
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 })
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
    <div className="home" ref={root}>
      {/* Hero */}
      <section className="px-hero" aria-labelledby="home-title">
        <div className="px-layer px-bg" data-speed="0.35" style={{ backgroundImage: `url(${img('bg-turner-polyphemus.jpg')})` }} />
        <div className="px-hero-shade" aria-hidden="true" />
        <div className="px-hero-copy" data-speed="-0.12">
          <p className="eyebrow">A Great Books Digital Portfolio · Louis Neo M. Lok</p>
          <h1 id="home-title" className="px-hero-title">Myth <i>&amp;</i> Mind</h1>
          <p className="px-hero-sub">A psychological and philosophical lens on ancient heroic epics: seven stories, from the Book of Job to <em>The Song of Roland</em>, read for what they reveal about the human mind.</p>
          <div className="px-actions">
            <Link className="btn-gold" to="/analyses">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>Explore the analyses
            </Link>
            <Link className="btn-dark" to="/museum">Enter the 3D museum ↗</Link>
          </div>
        </div>
        <a className="px-scroll" href="#intro" aria-label="Scroll to introduction"><span /></a>
      </section>

      {/* Introduction and numbers */}
      <section id="intro" className="px-intro">
        <div className="px-intro-text rv">
          <p className="eyebrow">About this portfolio</p>
          <h2 className="h-serif">Old stories, read like systems of the mind</h2>
          <p>I study Information Technology, so I am used to asking how a system works and why it fails. In Great Books I asked the same questions of seven epics. Why does Achilles’ anger spread through an army? Why does Job reject easy answers? Why does Roland refuse to call for help?</p>
          <p>Each work below opens a close reading of its story, characters, themes, and literary craft, paired with a painting it inspired. Scroll down to travel from 800 BCE to 1100 CE.</p>
        </div>
        <ul className="px-stats">
          {stats.map(([n, t], i) => (
            <li key={t} className="rv" style={{ transitionDelay: `${i * 90}ms` }}><b>{n}</b><span>{t}</span></li>
          ))}
        </ul>
      </section>

      {/* Seven parallax chapters */}
      {works.map((w, i) => {
        const m = meta[i]
        return (
          <section key={m.id} className={`px-chapter${i % 2 ? ' is-right' : ''}`} aria-labelledby={`ch-${m.id}`}>
            <div className="px-layer px-bg" data-speed="0.25" style={{ backgroundImage: `url(${img(w.image)})` }} />
            <div className="px-chapter-shade" aria-hidden="true" />
            <span className="px-numeral" data-speed="-0.18" aria-hidden="true">{roman[i]}</span>
            <article className="px-card rv">
              <p className="eyebrow">{roman[i]} · {m.era} · {m.date}</p>
              <h2 id={`ch-${m.id}`} className="h-serif">{w.title}</h2>
              <p className="px-card-by">{w.author} <span lang="und">{m.orig}</span></p>
              <p className="px-card-hook">{m.hook}</p>
              <p>{w.context}</p>
              <ul className="chips">
                {w.themes.slice(0, 3).map(t => <li key={t.name}>{t.name}</li>)}
              </ul>
              <Link className="link-arrow" to={`/analyses?work=${m.id}`}>Read the analysis <span aria-hidden="true">→</span></Link>
              <p className="px-credit">{m.credit}</p>
            </article>
          </section>
        )
      })}

      {/* Timeline */}
      <section className="px-timeline" aria-labelledby="tl-title">
        <p className="eyebrow rv">Timeline</p>
        <h2 id="tl-title" className="h-serif rv">Nineteen centuries of storytelling</h2>
        <div className="tl rv">
          <div className="tl-line" aria-hidden="true" />
          {meta.map(m => (
            <Link key={m.id} to={`/analyses?work=${m.id}`} className={`tl-pt${byYear.indexOf(m.id) % 2 ? ' down' : ''}`} style={{ left: `${((m.year + 800) / 1900) * 100}%` }}>
              <i aria-hidden="true" />
              <b>{m.short}</b>
              <span>{m.date}</span>
            </Link>
          ))}
        </div>
        <div className="tl-ends rv" aria-hidden="true"><span>800 BCE</span><span>1100 CE</span></div>
        <ol className="tl-list">
          {meta.map(m => <li key={m.id}><b>{m.short}</b> <span>{m.date}</span></li>)}
        </ol>
      </section>

      {/* Quote band */}
      <section className="px-quote" aria-label="Quotation">
        <div className="px-layer px-bg" data-speed="0.3" style={{ backgroundImage: `url(${img('waterhouse-penelope-suitors-1912.jpg')})` }} />
        <div className="px-chapter-shade" aria-hidden="true" />
        <blockquote className="rv">
          <p>“I have heard of thee by the hearing of the ear: but now mine eye seeth thee.”</p>
          <cite>Job 42:5, King James Version</cite>
        </blockquote>
      </section>

      {/* Explore the rest */}
      <section className="px-explore" aria-labelledby="ex-title">
        <p className="eyebrow rv">Continue the journey</p>
        <h2 id="ex-title" className="h-serif rv">More from the portfolio</h2>
        <div className="ex-grid">
          {explore.map(([to, t, d, pic], i) => (
            <Link key={to} to={to} className="ex-card rv" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="ex-img"><img src={img(pic)} alt="" loading="lazy" /></div>
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
