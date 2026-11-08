import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * VirtualJoystick - Touch-friendly analog thumbstick for mobile/tablet 3D gallery navigation.
 * Emits normalized movement vector { x, y } where:
 *   x: -1 (left) to +1 (right)
 *   y: -1 (backward) to +1 (forward)
 */
export default function VirtualJoystick({ onMove, visible = true }) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const baseRef = useRef(null)
  const pointerIdRef = useRef(null)
  const maxRadius = 36

  const handlePointerMove = useCallback((e) => {
    if (!active || e.pointerId !== pointerIdRef.current || !baseRef.current) return
    const rect = baseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rawDx = e.clientX - centerX
    const rawDy = e.clientY - centerY
    const dist = Math.hypot(rawDx, rawDy)
    const angle = Math.atan2(rawDy, rawDx)
    const clampedDist = Math.min(dist, maxRadius)

    const knobX = Math.cos(angle) * clampedDist
    const knobY = Math.sin(angle) * clampedDist

    setKnobPos({ x: knobX, y: knobY })

    // Normalized vector: x (-1 to +1), y (-1 backward to +1 forward)
    const normX = clampedDist > 4 ? +(knobX / maxRadius).toFixed(3) : 0
    const normY = clampedDist > 4 ? +(-knobY / maxRadius).toFixed(3) : 0
    onMove?.({ x: normX, y: normY })
  }, [active, onMove])

  const handlePointerUp = useCallback((e) => {
    if (e.pointerId !== pointerIdRef.current) return
    setActive(false)
    pointerIdRef.current = null
    setKnobPos({ x: 0, y: 0 })
    onMove?.({ x: 0, y: 0 })
  }, [onMove])

  const handlePointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    pointerIdRef.current = e.pointerId
    setActive(true)
    handlePointerMove(e)
  }

  useEffect(() => {
    if (!active) return
    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [active, handlePointerMove, handlePointerUp])

  if (!visible) return null

  return (
    <div className="museum-joystick-wrap" aria-label="Touch Navigation Joystick">
      <div
        ref={baseRef}
        className={`museum-joystick-base ${active ? 'is-active' : ''}`}
        onPointerDown={handlePointerDown}
      >
        <span className="joy-arrow up" aria-hidden="true">▲</span>
        <span className="joy-arrow down" aria-hidden="true">▼</span>
        <span className="joy-arrow left" aria-hidden="true">◀</span>
        <span className="joy-arrow right" aria-hidden="true">▶</span>

        <div
          className="museum-joystick-knob"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
          }}
        >
          <div className="knob-core" />
        </div>
      </div>
      <span className="joystick-label">WALK GALLERY</span>
    </div>
  )
}

