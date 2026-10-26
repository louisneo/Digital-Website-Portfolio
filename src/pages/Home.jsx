import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/Carousel.jsx'
import HeroStage, { Float } from '../components/HeroStage.jsx'
import { works } from '../data/works.js'
import { paintings } from '../data/odyssey.js'

const sections = [
  ['/profile', '01', 'Student Profile', 'Who I am as a reader.'],
  ['/analyses', '02', 'Seven Literary Analyses', 'Masterpieces, lenses, and interpretations.'],
  ['/favorite', '03', 'Favorite Masterpiece', 'The work that moved me most.'],
  ['/summary', '04', 'Summary of Learning', 'Knowledge, concepts, and skills gained.'],
  ['/reflection', '05', 'Personal Reflection', 'My growth as a reader and thinker.'],
]

const tabs = ['Job', 'Panchatantra', 'Ramayana', 'Mahabharata', 'Iliad', 'Odyssey', 'Roland']
const items = works.map((w, k) => ({ ...w, tab: tabs[k], n: String(k + 1).padStart(2, '0') }))
const img = f => import.meta.env.BASE_URL + f

function WorkCard({ it, active, onOpen }) {
  return (
    <article className="glass g-card-in g-work-card">
      <img src={img(it.image)} alt="" loading="lazy" />
      <span className="g-num">{it.n}</span>
      <h3>{it.title}</h3>
      <p className="g-by">{it.author}</p>
      <button
        type="button"
        className="g-plus"
        aria-haspopup="dialog"
        aria-label={`Open details for ${it.title}`}
        tabIndex={active ? 0 : -1}
        onClick={() => onOpen(it)}
      >
        +
      </button>
    </article>
  )
}

function Details({ it, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <div className="g-modal" onClick={onClose}>
      <div className="glass g-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={e => e.stopPropagation()}>
        <img src={img(it.image)} alt="" />
        <div>
          <span className="g-num">{it.n} of 07</span>
          <h3 id="dlg-title">{it.title}</h3>
          <p className="g-by">{it.author}</p>
          <p>This work is one of the seven pieces in the Analyses museum.</p>
          <div className="g-actions">
            <Link className="g-btn" to="/analyses">Open the Analyses</Link>
            {it.title === 'The Odyssey' && <Link className="g-btn ghost" to="/favorite">My favorite masterpiece</Link>}
          </div>
        </div>
        <button ref={closeRef} type="button" className="g-round g-close" onClick={onClose} aria-label="Close details">×</button>
      </div>
    </div>
  )
}

export default function Home() {
  const [open, setOpen] = useState(null)
  const sirens = paintings[0]
  return (
    <>
      <HeroStage className="g-hero">
        <Float depth={1} className="p-title">
          <p className="g-eyebrow">Great Books &middot; Final Project</p>
          <h1>My Literary Journey</h1>
          <p className="g-meta">A Great Books Digital Portfolio by <span>Louis Neo M. Lok</span></p>
          <Link className="g-btn" to="/analyses">Explore the Analyses</Link>
        </Float>
        <Float depth={2.2} delay={1.4} className="p-quote">
          <p className="g-plain-quote">&ldquo;A reader lives a thousand lives before he dies.&rdquo;</p>
          <p className="g-cite">George R. R. Martin</p>
        </Float>
        <Float depth={3} delay={2.6} className="p-art">
          <img src={sirens.src} alt={sirens.desc} loading="eager" />
          <small>{sirens.title}, {sirens.year}</small>
        </Float>
      </HeroStage>

      <section id="works" className="g-section reveal">
        <h2>The Seven Works</h2>
        <p className="g-lead">Swipe, use the arrow keys, or pick a title. Press + to see more.</p>
        <Carousel
          label="The seven works"
          items={items}
          renderCard={(it, k, active) => <WorkCard it={it} active={active} onOpen={setOpen} />}
        />
      </section>

      <section className="g-section">
        <h2 className="reveal">Portfolio Sections</h2>
        <div className="g-grid">
          {sections.map(([to, n, t, d], k) => (
            <Link key={to} className="glass g-lift g-link-card reveal" style={{ '--i': k }} to={to}>
              <span className="g-num">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Link>
          ))}
        </div>
      </section>

      {open && <Details it={open} onClose={() => setOpen(null)} />}
    </>
  )
}
