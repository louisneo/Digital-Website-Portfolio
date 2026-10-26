import { useCallback, useEffect, useRef, useState } from 'react'

// Glass pill tabs plus a horizontal carousel of tall cards.
// items: [{ tab, ... }]. renderCard(item, index, active) returns the card body.
export default function Carousel({ items, label, renderCard }) {
  const [i, setI] = useState(0)
  const rootRef = useRef(null)
  const inView = useRef(false)
  const drag = useRef({ x: null, moved: false })
  const n = items.length
  const go = useCallback(d => setI(v => Math.min(n - 1, Math.max(0, v + d))), [n])

  // Arrow keys work while the carousel is on screen.
  useEffect(() => {
    const el = rootRef.current
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    const onKey = e => {
      if (!inView.current || e.altKey || e.ctrlKey || e.metaKey) return
      if (e.target.closest && e.target.closest('input,textarea,select,[role="dialog"],[role="tablist"]')) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [go])

  const down = e => {
    drag.current = { x: e.clientX, moved: false }
  }
  const up = e => {
    const { x } = drag.current
    if (x == null) return
    const dx = e.clientX - x
    if (Math.abs(dx) > 40) {
      drag.current.moved = true
      go(dx < 0 ? 1 : -1)
    }
    drag.current.x = null
  }

  return (
    <div className="g-carousel" ref={rootRef} role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="g-tabs glass" role="tablist" aria-label={`${label} tabs`}>
        {items.map((it, k) => (
          <button
            key={it.tab}
            id={`${label}-tab-${k}`}
            role="tab"
            type="button"
            className="g-tab"
            aria-selected={k === i}
            tabIndex={k === i ? 0 : -1}
            onClick={() => setI(k)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') { e.preventDefault(); go(1); e.currentTarget.parentNode.children[Math.min(n - 1, k + 1)].focus() }
              if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); e.currentTarget.parentNode.children[Math.max(0, k - 1)].focus() }
            }}
          >
            {it.tab}
          </button>
        ))}
      </div>

      <div className="g-car" onPointerDown={down} onPointerUp={up} onPointerCancel={() => (drag.current.x = null)}>
        {items.map((it, k) => {
          const o = k - i
          const abs = Math.abs(o)
          return (
            <div
              key={it.tab}
              className={`g-car-card${o === 0 ? ' is-center' : ''}${abs > 1 ? ' far' : ''}`}
              style={{ '--o': o, '--abs': abs }}
              aria-hidden={o !== 0}
              onClick={o !== 0 ? () => !drag.current.moved && setI(k) : undefined}
            >
              {renderCard(it, k, o === 0)}
            </div>
          )
        })}
      </div>

      <div className="g-car-ctrl">
        <button type="button" className="g-round" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous card">‹</button>
        <span className="g-count" aria-live="polite">{i + 1} / {n}</span>
        <button type="button" className="g-round" onClick={() => go(1)} disabled={i === n - 1} aria-label="Next card">›</button>
      </div>
    </div>
  )
}
