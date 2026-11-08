import { useState } from 'react'
import { Link } from 'react-router-dom'
import Museum from '../components/Museum.jsx'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'

export default function MuseumPage() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)
  const [help, setHelp] = useState(true)

  const activeWork = works[active]
  const activeMeta = meta[active]
  const modalWork = open === null ? null : works[open]
  const modalMeta = open === null ? null : meta[open]

  return (
    <div className="museum">
      <Museum
        works={works}
        active={active}
        onSelect={i => {
          setActive(i)
        }}
        onHotspot={() => setHelp(true)}
        autoRotate
      />

      <header className="museum-bar">
        <Link to="/analyses" className="btn-dark">← Back to the analyses</Link>
        <p className="museum-name">Myth &amp; Mind · 3D Gallery</p>
        <button
          type="button"
          className="btn-dark"
          onClick={() => setHelp(h => !h)}
          aria-expanded={help}
        >
          Gallery Guide
        </button>
      </header>

      {help && (
        <div className="museum-help" role="note">
          <h2>Welcome to the 3D Gallery</h2>
          <p>
            • <b>Explore</b>: Click &amp; drag to look around. Scroll to zoom in/out.<br />
            • <b>Walk</b>: Use <b>W, A, S, D</b> or <b>Arrow Keys</b> to walk through the gallery.<br />
            • <b>Glass Vitrine</b>: Click any glass case to open the case and float the 3D relic!<br />
            • <b>Art &amp; Info</b>: Click paintings or wall plaques to focus that masterpiece.
          </p>
          <button type="button" className="btn-gold" onClick={() => setHelp(false)}>Start Exploring</button>
        </div>
      )}

      {/* Floating HUD Exhibit Badge in Lower Left */}
      <div className="museum-hud-card">
        <div className="hud-meta">
          <span className="hud-roman">{roman[active]}</span>
          <span className="hud-sep">·</span>
          <span className="hud-era">{activeMeta.era}</span>
          <span className="hud-sep">·</span>
          <span className="hud-date">{activeMeta.date}</span>
        </div>
        <h3 className="hud-title">{activeWork.title}</h3>
        <p className="hud-author">{activeWork.author}</p>
        <p className="hud-hint">✦ Click glass case to open vitrine &amp; float 3D relic</p>
        <div className="hud-actions">
          <button
            type="button"
            className="btn-hud-open"
            onClick={() => setOpen(active)}
          >
            Read Overview
          </button>
          <Link
            className="btn-hud-analysis"
            to={`/analyses?work=${activeMeta.id}`}
          >
            Full Analysis →
          </Link>
        </div>
      </div>

      <nav className="museum-strip" aria-label="Jump to an alcove">
        {meta.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {roman[i]} · {x.short}
          </button>
        ))}
      </nav>

      {modalWork && (
        <div
          className="museum-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-title"
          onClick={e => e.target === e.currentTarget && setOpen(null)}
        >
          <div className="museum-card">
            <button type="button" className="museum-x" onClick={() => setOpen(null)} aria-label="Close">×</button>
            <p className="eyebrow">{roman[open]} · {modalMeta.era} · {modalMeta.date}</p>
            <h2 id="mm-title" className="h-serif">{modalWork.title}</h2>
            <p className="px-card-by">{modalWork.author}</p>
            <p>{modalWork.summary}</p>
            <ul className="chips">{modalWork.themes.map(t => <li key={t.name}>{t.name}</li>)}</ul>
            <Link className="btn-gold" to={`/analyses?work=${modalMeta.id}`}>Read the full analysis</Link>
          </div>
        </div>
      )}
    </div>
  )
}
