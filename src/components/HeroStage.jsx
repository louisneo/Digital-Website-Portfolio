import { useEffect, useRef } from 'react'

const quiet = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches

// Holds floating glass panels. A gentle mouse tilt is written to CSS variables.
export default function HeroStage({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || quiet()) return
    let raf = 0
    const move = e => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
      })
    }
    const leave = () => {
      el.style.setProperty('--mx', 0)
      el.style.setProperty('--my', 0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className={`stage ${className}`}>
      {children}
    </div>
  )
}

// One floating panel. The outer layer floats, the inner layer tilts and holds the glass.
export function Float({ depth = 1, delay = 0, className = '', children }) {
  return (
    <div className={`float ${className}`} style={{ '--d': depth, '--delay': `${delay}s` }}>
      <div className="tilt glass">{children}</div>
    </div>
  )
}
