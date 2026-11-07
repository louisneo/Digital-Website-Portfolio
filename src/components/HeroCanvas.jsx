import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * HeroCanvas - Interactive 3D Celestial Relic / Armillary Sphere
 * Inspired by Spline 3D "Hungry Minds" showcase.
 * Features:
 * - Golden Torus Knot Core with specular sheen
 * - Orbital Armillary Rings with astronomical notches
 * - Wireframe Celestial Cage (Icosahedron)
 * - 400+ Floating Stardust Particles
 * - Fluid Mouse-Tracking Parallax Lerp
 * - Autonomous Celestial Rotation
 * - ResizeObserver support (no layout collapse / NaN errors)
 */
export default function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let width = el.clientWidth || 560
    let height = el.clientHeight || 560
    if (width <= 0) width = 560
    if (height <= 0) height = 560

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 5.2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    el.appendChild(renderer.domElement)

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2)
    scene.add(ambientLight)

    const goldKeyLight = new THREE.DirectionalLight(0xf7dfb3, 3.8)
    goldKeyLight.position.set(4, 5, 4)
    scene.add(goldKeyLight)

    const cyanRimLight = new THREE.DirectionalLight(0x5082a6, 2.5)
    cyanRimLight.position.set(-4, -2, -3)
    scene.add(cyanRimLight)

    const warmCoreLight = new THREE.PointLight(0xffbe55, 3.0, 8)
    warmCoreLight.position.set(0, 0, 1.5)
    scene.add(warmCoreLight)

    // 3. Central Relic Group
    const relicGroup = new THREE.Group()
    scene.add(relicGroup)

    // A. Golden Torus Knot (Astrolabe Core)
    const coreGeo = new THREE.TorusKnotGeometry(0.85, 0.22, 128, 32, 2, 3)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd8bd92,
      metalness: 0.92,
      roughness: 0.2,
      emissive: 0x2e1e0a,
      wireframe: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    relicGroup.add(coreMesh)

    // B. Inner Glowing Jewel Sphere
    const jewelGeo = new THREE.SphereGeometry(0.42, 32, 32)
    const jewelMat = new THREE.MeshStandardMaterial({
      color: 0xffaa33,
      metalness: 0.5,
      roughness: 0.1,
      emissive: 0xff7700,
      emissiveIntensity: 0.8,
    })
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat)
    relicGroup.add(jewelMesh)

    // C. Outer Wireframe Armillary Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.68, 2)
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0xe2c99b,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    })
    const cageMesh = new THREE.Mesh(cageGeo, cageMat)
    relicGroup.add(cageMesh)

    // D. Orbital Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xecd0a0,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x3d2710,
    })

    const ring1Geo = new THREE.TorusGeometry(1.98, 0.024, 16, 120)
    const ring1 = new THREE.Mesh(ring1Geo, ringMat)
    ring1.rotation.x = Math.PI / 3.2
    relicGroup.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(2.18, 0.018, 16, 120)
    const ring2 = new THREE.Mesh(ring2Geo, ringMat)
    ring2.rotation.y = Math.PI / 3.8
    ring2.rotation.z = Math.PI / 6
    relicGroup.add(ring2)

    const ring3Geo = new THREE.TorusGeometry(2.38, 0.014, 16, 120)
    const ring3 = new THREE.Mesh(ring3Geo, ringMat)
    ring3.rotation.x = -Math.PI / 4
    ring3.rotation.y = Math.PI / 2
    relicGroup.add(ring3)

    // 4. Stardust Particles Cloud
    const particleCount = 420
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 1.1 + Math.random() * 4.6
      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particlePos[i * 3 + 2] = r * Math.cos(phi)
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5dfb6,
      size: 0.038,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 5. Interactive Mouse Parallax (Window-Wide Tracking)
    let targetX = 0
    let targetY = 0
    let mouseX = 0
    let mouseY = 0

    const onPointerMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    // ResizeObserver ensures exact canvas dimensions without stretch or layout flicker
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        if (cr.width > 0 && cr.height > 0) {
          width = cr.width
          height = cr.height
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.setSize(width, height)
        }
      }
    })
    ro.observe(el)

    // 6. 60 FPS Render Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse damping
      targetX += (mouseX - targetX) * 0.045
      targetY += (mouseY - targetY) * 0.045

      // Autonomous motion
      coreMesh.rotation.x = t * 0.28
      coreMesh.rotation.y = t * 0.38
      cageMesh.rotation.y = -t * 0.16
      cageMesh.rotation.x = t * 0.12

      ring1.rotation.z = t * 0.22
      ring2.rotation.x = t * 0.19
      ring3.rotation.y = -t * 0.25

      particles.rotation.y = t * 0.035
      particles.rotation.x = Math.sin(t * 0.02) * 0.05

      // Mouse-driven 3D tilt + gentle vertical breathing
      relicGroup.rotation.y = targetX * 0.65 + Math.sin(t * 0.35) * 0.08
      relicGroup.rotation.x = -targetY * 0.55 + Math.cos(t * 0.28) * 0.06
      relicGroup.position.y = Math.sin(t * 0.8) * 0.12

      renderer.render(scene, camera)
    }

    animate()

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
      renderer.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      jewelGeo.dispose()
      jewelMat.dispose()
      cageGeo.dispose()
      cageMat.dispose()
      ring1Geo.dispose()
      ring2Geo.dispose()
      ring3Geo.dispose()
      ringMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="hero-3d-stage"
      aria-label="Interactive 3D Armillary Celestial Relic"
    />
  )
}
