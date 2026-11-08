import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Museum from '../components/Museum.jsx'
import VirtualJoystick from '../components/VirtualJoystick.jsx'
import { DEFAULT_MUSEUM_LIGHTING } from '../data/museumLighting.js'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'
import { artifacts } from '../data/artifacts.js'

export default function MuseumPage() {
  const [active, setActive] = useState(0)
  const [showArtifactCard, setShowArtifactCard] = useState(false)
  const [showLightingPanel, setShowLightingPanel] = useState(false)
  const [lighting, setLighting] = useState(DEFAULT_MUSEUM_LIGHTING)
  const [help, setHelp] = useState(false)
  const [showOverviewModal, setShowOverviewModal] = useState(false)
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isPortraitMobile, setIsPortraitMobile] = useState(false)
  const [dismissLandscapePrompt, setDismissLandscapePrompt] = useState(false)

  const activeWork = works[active]
  const activeMeta = meta[active]
  const activeArtifact = artifacts[active] || artifacts[0]

  useEffect(() => {
    const isTouch = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    )
    setIsTouchDevice(isTouch)

    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 840 || isTouch
      const isPortrait = window.innerHeight > window.innerWidth
      setIsPortraitMobile(isMobile && isPortrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  const handleSelectExhibit = (i, openInfo = false) => {
    setActive(i)
    setHelp(false)
    if (openInfo) {
      setShowArtifactCard(true)
    }
  }

  const handleOpenOverview = () => {
    setHelp(false)
    setShowArtifactCard(false) // Close artifact drawer so cards never overlap
    setShowOverviewModal(true)
  }

  const handleCloseOverview = () => {
    setShowOverviewModal(false)
  }

  return (
    <div className="museum">
      <Museum
        works={works}
        active={active}
        onSelect={handleSelectExhibit}
        onHotspot={() => setHelp(true)}
        autoRotate
        lighting={lighting}
        moveVector={joystickVector}
      />

      {/* Landscape Experience Suggestion Banner on Mobile */}
      {isPortraitMobile && !dismissLandscapePrompt && (
        <aside className="museum-landscape-toast" role="alert">
          <span className="toast-rotate-icon" aria-hidden="true">⟲</span>
          <div className="toast-content">
            <strong>Landscape Mode Recommended</strong>
            <span>Rotate your phone for an immersive widescreen gallery view &amp; joystick controls.</span>
          </div>
          <button
            type="button"
            className="toast-dismiss"
            onClick={() => setDismissLandscapePrompt(true)}
            aria-label="Dismiss orientation notice"
          >
            Got it
          </button>
        </aside>
      )}

      {/* Virtual Analog Touch Joystick for Mobile / Tablet (Hidden when artifact infos or modals are displayed to eliminate overlap) */}
      {isTouchDevice && (
        <VirtualJoystick
          onMove={setJoystickVector}
          visible={!showOverviewModal && !help && !showArtifactCard}
        />
      )}

      <header className="museum-bar">
        <Link to="/analyses" className="btn-dark">← Back to the analyses</Link>
        <p className="museum-name">Myth &amp; Mind · 3D Gallery</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-dark"
            onClick={() => {
              if (showOverviewModal) setShowOverviewModal(false)
              if (help) setHelp(false)
              setShowArtifactCard(c => !c)
            }}
          >
            {showArtifactCard ? 'Hide Artifact Card' : 'Inspect Artifact'}
          </button>
          <button
            type="button"
            className={`btn-dark ${showLightingPanel ? 'is-active' : ''}`}
            onClick={() => setShowLightingPanel(p => !p)}
            title="Fine-tune exposure, bloom, and light intensity live"
          >
            ⚙ Lighting
          </button>
          <button
            type="button"
            className="btn-dark"
            onClick={() => {
              if (showOverviewModal) setShowOverviewModal(false)
              if (showArtifactCard) setShowArtifactCard(false)
              setHelp(h => !h)
            }}
            aria-expanded={help}
          >
            Gallery Guide
          </button>
        </div>
      </header>

      {/* On-screen Live Lighting Tuning Slider Panel */}
      {showLightingPanel && (
        <aside className="museum-lighting-panel" role="region" aria-label="Lighting and Exposure Controls">
          <div className="museum-lighting-header">
            <h3>Lighting &amp; Exposure</h3>
            <button
              type="button"
              className="museum-lighting-close"
              onClick={() => setShowLightingPanel(false)}
              aria-label="Close lighting controls"
            >
              ×
            </button>
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Exposure</span>
              <span className="museum-lighting-val">{lighting.exposure.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="0.1"
              max="1.4"
              step="0.02"
              value={lighting.exposure}
              onChange={e => setLighting(l => ({ ...l, exposure: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Bloom Strength</span>
              <span className="museum-lighting-val">{lighting.bloomStrength.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="0.0"
              max="0.8"
              step="0.02"
              value={lighting.bloomStrength}
              onChange={e => setLighting(l => ({ ...l, bloomStrength: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Bloom Threshold</span>
              <span className="museum-lighting-val">{lighting.bloomThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="0.6"
              max="1.0"
              step="0.01"
              value={lighting.bloomThreshold}
              onChange={e => setLighting(l => ({ ...l, bloomThreshold: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Spotlight Intensity</span>
              <span className="museum-lighting-val">{lighting.spotIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="2"
              max="28"
              step="0.5"
              value={lighting.spotIntensity}
              onChange={e => setLighting(l => ({ ...l, spotIntensity: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Ambient Light</span>
              <span className="museum-lighting-val">{lighting.ambientIntensity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="0.0"
              max="0.5"
              step="0.02"
              value={lighting.ambientIntensity}
              onChange={e => setLighting(l => ({ ...l, ambientIntensity: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-row">
            <div className="museum-lighting-label">
              <span>Environment IBL</span>
              <span className="museum-lighting-val">{lighting.envIntensity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="museum-lighting-slider"
              min="0.0"
              max="0.8"
              step="0.02"
              value={lighting.envIntensity}
              onChange={e => setLighting(l => ({ ...l, envIntensity: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="museum-lighting-footer">
            <button
              type="button"
              className="museum-lighting-reset"
              onClick={() => setLighting(DEFAULT_MUSEUM_LIGHTING)}
            >
              Reset to Tuned Defaults
            </button>
          </div>
        </aside>
      )}

      {/* Dynamic Gallery Guide with Mobile / Touch vs Desktop instructions */}
      {help && (
        <div
          className="museum-modal museum-guide-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={e => e.target === e.currentTarget && setHelp(false)}
        >
          <div className="museum-help" role="note">
            <h2>Welcome to the 3D Gallery</h2>
            {isTouchDevice ? (
              <p>
                • <b>Walk &amp; Explore</b>: Use the glowing <b>Touch Joystick</b> in the bottom-left to walk smoothly between wings.<br />
                • <b>Look Around</b>: Swipe with one finger anywhere on the room to turn camera view.<br />
                • <b>Glass Vitrines</b>: Tap any glass case to open the vitrine and float the 3D relic!<br />
                • <b>Zoom In</b>: Pinch with two fingers to zoom in on intricate relic craftsmanship.<br />
                • <b>Best Experience</b>: Rotate device to <b>Landscape</b> for the wide cinematic gallery view.
              </p>
            ) : (
              <p>
                • <b>Explore &amp; Inspect</b>: Click &amp; drag to rotate camera. Scroll to zoom in on 3D relics.<br />
                • <b>Non-Linear Architecture</b>: Use <b>W, A, S, D</b> or <b>Arrow Keys</b> to walk between gallery wings.<br />
                • <b>Glass Vitrines</b>: Click any glass case to open the vitrine and float the 3D relic!<br />
                • <b>Art &amp; Placards</b>: Click paintings or high-DPI wall plaques to focus that masterpiece.
              </p>
            )}
            <button type="button" className="btn-gold" onClick={() => setHelp(false)}>Start Exploring</button>
          </div>
        </div>
      )}

      {/* DEDICATED ARTIFACT CARD OVERLAY (Only shows when overview modal and guide are closed to eliminate overlap) */}
      {!showOverviewModal && !help && showArtifactCard && activeArtifact && (
        <aside className="artifact-inspector-drawer" aria-label="Artifact Information">
          <div className="artifact-topbar">
            <span className="artifact-label">ARTIFACT</span>
            <button
              type="button"
              className="artifact-close-btn"
              onClick={() => setShowArtifactCard(false)}
              aria-label="Close artifact card"
            >
              ×
            </button>
          </div>
          <div className="artifact-rule" />

          <h2 className="artifact-title">{activeArtifact.relicName}</h2>
          <p className="artifact-subheading">{activeArtifact.subtitle}</p>

          <div className="artifact-narrative">
            <p>{activeArtifact.description}</p>
          </div>

          <p className="artifact-drag-hint">{activeArtifact.controlsHint}</p>

          <div className="artifact-credit-line">
            <p>{activeArtifact.credit}</p>
          </div>

          <div className="artifact-actions">
            <button
              type="button"
              className="btn-hud-open"
              onClick={handleOpenOverview}
            >
              Read Overview
            </button>
            <Link
              className="btn-hud-analysis"
              to={`/analyses?work=${activeMeta.id}`}
            >
              Full Literary Analysis →
            </Link>
          </div>
        </aside>
      )}

      {/* Floating HUD Exhibit Badge in Lower Left when artifact drawer and guide are hidden */}
      {!showOverviewModal && !help && !showArtifactCard && (
        <div className="museum-hud-card">
          <div className="hud-meta">
            <span className="hud-roman">{roman[active]}</span>
            <span className="hud-sep">·</span>
            <span className="hud-era">{activeMeta.era}</span>
            <span className="hud-sep">·</span>
            <span className="hud-date">{activeMeta.date}</span>
          </div>
          <h3 className="hud-title">{activeArtifact.relicName}</h3>
          <p className="hud-author">{activeWork.title} · {activeWork.author}</p>
          <p className="hud-hint">✦ Click glass case to open vitrine &amp; float 3D relic</p>
          <div className="hud-actions">
            <button
              type="button"
              className="btn-hud-open"
              onClick={() => setShowArtifactCard(true)}
            >
              Inspect Artifact
            </button>
            <Link
              className="btn-hud-analysis"
              to={`/analyses?work=${activeMeta.id}`}
            >
              Full Analysis →
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Nav Strip to jump between exhibits */}
      <nav className="museum-strip" aria-label="Jump to an alcove">
        {meta.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={active === i}
            onClick={() => handleSelectExhibit(i)}
          >
            {roman[i]} · {x.short}
          </button>
        ))}
      </nav>

      {/* Full Curatorial Overview Modal (Guaranteed single active card, z-index 200, no stacking) */}
      {showOverviewModal && (
        <div
          className="museum-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mm-title"
          onClick={e => e.target === e.currentTarget && handleCloseOverview()}
        >
          <div className="museum-card">
            <button
              type="button"
              className="museum-x"
              onClick={handleCloseOverview}
              aria-label="Close"
            >
              ×
            </button>
            <p className="eyebrow">{roman[active]} · {activeMeta.era} · {activeMeta.date}</p>
            <h2 id="mm-title" className="h-serif">{activeWork.title}</h2>
            <p className="px-card-by">{activeWork.author}</p>
            <p>{activeWork.summary}</p>
            <ul className="chips">
              {activeWork.themes.map(t => (
                <li key={t.name}>{t.name}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <Link className="btn-gold" to={`/analyses?work=${activeMeta.id}`}>
                Read the full analysis
              </Link>
              <button
                type="button"
                className="btn-dark"
                onClick={handleCloseOverview}
              >
                Return to 3D Museum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
