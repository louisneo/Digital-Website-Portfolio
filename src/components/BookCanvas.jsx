import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * BookCanvas - Interactive 3D Hardcover Book (Spline / WebGL style)
 * Inspired by the "The Black Book" showcase on Pinterest / Spline.
 * Features:
 * - Dynamic Canvas Texture with gold foil borders, classical art, typography
 * - Gold-embossed leather spine with realistic ribs
 * - Textured cream paper edges
 * - Real-time 3D tilt tracking with smooth damping (lerp)
 * - Orbiting stardust motes
 * - Automatic ResizeObserver handling
 */
export default function BookCanvas({ image, title, author, roman, orig, era }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let width = el.clientWidth || 360
    let height = el.clientHeight || 460
    if (width <= 0) width = 360
    if (height <= 0) height = 460

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50)
    camera.position.set(0, 0, 4.4)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    el.appendChild(renderer.domElement)

    // 2. Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.1)
    scene.add(ambLight)

    const mainLight = new THREE.DirectionalLight(0xfff3e0, 3.6)
    mainLight.position.set(3, 4.5, 3.5)
    scene.add(mainLight)

    const goldRim = new THREE.DirectionalLight(0xd8bd92, 2.4)
    goldRim.position.set(-3.5, -2, -2.5)
    scene.add(goldRim)

    const bookGroup = new THREE.Group()
    scene.add(bookGroup)

    // 3. Dynamic High-Resolution Cover Texture (Canvas 2D)
    const coverCanvas = document.createElement('canvas')
    coverCanvas.width = 768
    coverCanvas.height = 1080
    const ctx = coverCanvas.getContext('2d')

    // Spine Canvas Texture
    const spineCanvas = document.createElement('canvas')
    spineCanvas.width = 160
    spineCanvas.height = 1080
    const sCtx = spineCanvas.getContext('2d')

    const coverImg = new Image()
    coverImg.crossOrigin = 'anonymous'
    coverImg.src = import.meta.env.BASE_URL + image

    const drawCover = () => {
      // Background / Leather Base
      ctx.fillStyle = '#14171d'
      ctx.fillRect(0, 0, coverCanvas.width, coverCanvas.height)

      // Classic painting artwork
      if (coverImg.complete && coverImg.naturalWidth) {
        // Draw artwork in upper-middle area
        ctx.save()
        ctx.beginPath()
        ctx.rect(50, 50, coverCanvas.width - 100, coverCanvas.height - 100)
        ctx.clip()
        ctx.drawImage(coverImg, 0, 0, coverCanvas.width, coverCanvas.height)
        ctx.restore()
      }

      // Dark moody gradient overlay for editorial elegance
      const grad = ctx.createLinearGradient(0, 0, 0, coverCanvas.height)
      grad.addColorStop(0, 'rgba(12, 14, 18, 0.88)')
      grad.addColorStop(0.25, 'rgba(12, 14, 18, 0.4)')
      grad.addColorStop(0.65, 'rgba(12, 14, 18, 0.55)')
      grad.addColorStop(1, 'rgba(12, 14, 18, 0.96)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, coverCanvas.width, coverCanvas.height)

      // Gold-foil framing borders
      ctx.strokeStyle = '#d8bd92'
      ctx.lineWidth = 4
      ctx.strokeRect(36, 36, coverCanvas.width - 72, coverCanvas.height - 72)
      ctx.lineWidth = 1.5
      ctx.strokeRect(46, 46, coverCanvas.width - 92, coverCanvas.height - 92)

      // Corner ornaments
      const corners = [
        [36, 36], [coverCanvas.width - 36, 36],
        [36, coverCanvas.height - 36], [coverCanvas.width - 36, coverCanvas.height - 36]
      ]
      ctx.fillStyle = '#d8bd92'
      corners.forEach(([cx, cy]) => {
        ctx.beginPath()
        ctx.arc(cx, cy, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Typography
      ctx.textAlign = 'center'

      // Top Roman Numeral & Era Tag
      ctx.font = '600 24px "Oswald", "Arial Narrow", sans-serif'
      ctx.fillStyle = '#d8bd92'
      ctx.letterSpacing = '5px'
      ctx.fillText(`${roman || 'I'} · ${era ? era.toUpperCase() : 'CLASSIC'}`, coverCanvas.width / 2, 92)

      // Main Title
      ctx.font = '600 56px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = '#fef9ee'
      ctx.letterSpacing = '2px'

      const titleWords = (title || 'Great Book').split(' ')
      if (titleWords.length > 2) {
        ctx.fillText(titleWords.slice(0, 2).join(' '), coverCanvas.width / 2, 185)
        ctx.fillText(titleWords.slice(2).join(' '), coverCanvas.width / 2, 250)
      } else {
        ctx.fillText(title || 'Great Book', coverCanvas.width / 2, 205)
      }

      // Thin divider
      ctx.strokeStyle = '#c5a059'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(coverCanvas.width / 2 - 80, 280)
      ctx.lineTo(coverCanvas.width / 2 + 80, 280)
      ctx.stroke()

      // Author Name
      ctx.font = '500 25px "Inter", sans-serif'
      ctx.fillStyle = '#d8bd92'
      ctx.letterSpacing = '3px'
      ctx.fillText((author || '').replace(/\s*\(.*\)/, '').toUpperCase(), coverCanvas.width / 2, 325)

      // Original Script at Bottom
      if (orig) {
        ctx.font = '500 46px "Cormorant Garamond", Georgia, serif'
        ctx.fillStyle = '#eed6ad'
        ctx.fillText(orig, coverCanvas.width / 2, coverCanvas.height - 85)
      }

      // Draw Spine
      sCtx.fillStyle = '#161920'
      sCtx.fillRect(0, 0, spineCanvas.width, spineCanvas.height)
      // Gold ribs on spine
      sCtx.fillStyle = '#d8bd92'
      for (let y of [120, 280, 440, 600, 760, 920]) {
        sCtx.fillRect(10, y, spineCanvas.width - 20, 6)
      }
      // Vertical text on spine
      sCtx.save()
      sCtx.translate(spineCanvas.width / 2, spineCanvas.height / 2)
      sCtx.rotate(-Math.PI / 2)
      sCtx.textAlign = 'center'
      sCtx.font = '600 28px "Cormorant Garamond", serif'
      sCtx.fillStyle = '#f0d8a8'
      sCtx.fillText(`${roman || 'I'} · ${title || ''}`, 0, 10)
      sCtx.restore()
    }

    coverImg.onload = () => {
      drawCover()
      coverTexture.needsUpdate = true
      spineTexture.needsUpdate = true
    }
    drawCover()

    const coverTexture = new THREE.CanvasTexture(coverCanvas)
    coverTexture.colorSpace = THREE.SRGBColorSpace

    const spineTexture = new THREE.CanvasTexture(spineCanvas)
    spineTexture.colorSpace = THREE.SRGBColorSpace

    // Front/Back Cover material
    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.28,
      metalness: 0.18,
    })

    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.32,
      metalness: 0.22,
    })

    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xede4d1,
      roughness: 0.88,
      metalness: 0.05,
    })

    // Materials order: [Right (pages), Left (spine), Top (pages), Bottom (pages), Front (cover), Back (cover)]
    const materials = [
      pagesMat,
      spineMat,
      pagesMat,
      pagesMat,
      coverMat,
      spineMat,
    ]

    // Realistic Hardcover Book Geometry
    // Width: 1.52, Height: 2.18, Thickness: 0.26
    const bookGeo = new THREE.BoxGeometry(1.52, 2.18, 0.26)
    const bookMesh = new THREE.Mesh(bookGeo, materials)
    bookGroup.add(bookMesh)

    // Initial angled pose matching Pinterest Spline showcase
    bookGroup.rotation.y = -0.32
    bookGroup.rotation.x = 0.12
    bookGroup.rotation.z = -0.04

    // Floating Stardust motes
    const pCount = 90
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 3.8
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 3.8
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 2.8
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xd8bd92,
      size: 0.03,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Window-Wide Pointer Move Tracking with Distance Falloff
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onPointerMove = (e) => {
      const rect = el.getBoundingClientRect()
      // Center of element
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Normalize relative to viewport
      mouseX = (e.clientX - cx) / (window.innerWidth * 0.5)
      mouseY = -(e.clientY - cy) / (window.innerHeight * 0.5)
      // Clamp between -1.2 and 1.2
      mouseX = Math.max(-1.2, Math.min(1.2, mouseX))
      mouseY = Math.max(-1.2, Math.min(1.2, mouseY))
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

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

    // Render Loop
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      targetX += (mouseX - targetX) * 0.06
      targetY += (mouseY - targetY) * 0.06

      // Fluid 3D interactive tilt with natural breathing float
      bookGroup.rotation.y = -0.32 + targetX * 0.52 + Math.sin(t * 0.85) * 0.04
      bookGroup.rotation.x = 0.12 - targetY * 0.42 + Math.cos(t * 0.65) * 0.03
      bookGroup.position.y = Math.sin(t * 1.1) * 0.08

      particles.rotation.y = t * 0.03

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
      renderer.dispose()
      bookGeo.dispose()
      coverMat.dispose()
      spineMat.dispose()
      pagesMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      coverTexture.dispose()
      spineTexture.dispose()
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [image, title, author, roman, orig, era])

  return (
    <div
      ref={mountRef}
      className="book-3d-stage"
      aria-label={`Interactive 3D Hardcover Book for ${title}`}
    />
  )
}
