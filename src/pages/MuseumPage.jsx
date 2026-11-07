import { useState } from 'react'
import { Link } from 'react-router-dom'
import Museum from '../components/Museum.jsx'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'

export default function MuseumPage() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
  const [help, setHelp] = useState(true)
  const w = open === null ? null : works[open]
  const m = open === null ? null : meta[open]

  return (
    <div className="museum">
      <Museum works={works} active={active} onSelect={i => { setActive(i); setOpen(i) }} onHotspot={() => setHelp(true)} autoRotate />

      <header className="museum-bar">
        <Link to="/analyses" className="btn-dark">← Back to the analyses</Link>
        <p className="museum-name">Myth &amp; Mind · 3D Gallery</p>
        <button type="button" className="btn-dark" onClick={() => setHelp(h => !h)} aria-expanded={help}>How to explore</button>
      </header>

      {help && (
        <div className="museum-help" role="note">
          <h2>Welcome to the gallery</h2>
          <p>Drag to look around and scroll to zoom. Click a painting to read about the work it belongs to.</p>
          <button type="button" className="btn-gold" onClick={() => setHelp(false)}>Start exploring</button>
        </div>
      )}

      <nav className="museum-strip" aria-label="Jump to a painting">
        {meta.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>{roman[i]} · {x.short}</button>
        ))}
      </nav>

      {w && (
        <div className="museum-modal" role="dialog" aria-modal="true" aria-labelledby="mm-title" onClick={e => e.target === e.currentTarget && setOpen(null)}>
          <div className="museum-card">
            <button type="button" className="museum-x" onClick={() => setOpen(null)} aria-label="Close">×</button>
            <p className="eyebrow">{roman[open]} · {m.era} · {m.date}</p>
            <h2 id="mm-title" className="h-serif">{w.title}</h2>
            <p className="px-card-by">{w.author}</p>
            <p>{w.summary}</p>
            <ul className="chips">{w.themes.map(t => <li key={t.name}>{t.name}</li>)}</ul>
            <Link className="btn-gold" to={`/analyses?work=${m.id}`}>Read the full analysis</Link>
          </div>
        </div>
      )}
    </div>
  )
}
