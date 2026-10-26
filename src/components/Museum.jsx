import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { drawCover, wrapText, onCoverImageLoad } from '../lib/cover.js'

const SPACING = 5.2
const PED_Z = -2.2
const px = i => (i - 3) * SPACING
const ROOM_W = 44, ROOM_D = 14, ROOM_H = 6
const RELICS = {
  'Voice out of the Whirlwind': 'relics/job-whirlwind.png',
  'The Panchatantra': 'relics/panchatantra-manuscript.png',
  'The Ramayana': 'relics/rama-bow.png',
  'The Mahabharata': 'relics/sudarshana-chakra.png',
  'The Iliad': 'relics/achilles-shield.png',
  'The Odyssey': 'relics/odysseus-bow.png',
  'The Song of Roland': 'relics/roland-oliphant.png',
}

function makeFloor() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  g.strokeStyle = 'rgba(40,20,5,.55)'
  g.lineWidth = 2
  for (let ty = 0; ty < 4; ty++) for (let tx = 0; tx < 4; tx++) {
    const horiz = (tx + ty) % 2 === 0
    for (let k = 0; k < 4; k++) {
      const x = tx * 128, y = ty * 128
      g.fillStyle = `hsl(${26 + Math.random() * 6} 42% ${30 + Math.random() * 10}%)`
      if (horiz) { g.fillRect(x, y + k * 32, 128, 32); g.strokeRect(x, y + k * 32, 128, 32) }
      else { g.fillRect(x + k * 32, y, 32, 128); g.strokeRect(x + k * 32, y, 32, 128) }
    }
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(ROOM_W / 4, ROOM_D / 4)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function wallGroup(len) {
  const grp = new THREE.Group()
  const upper = new THREE.Mesh(new THREE.PlaneGeometry(len, ROOM_H), new THREE.MeshStandardMaterial({ color: 0x8a6a52, roughness: 0.9 }))
  upper.position.y = ROOM_H / 2
  grp.add(upper)
  const lowerMat = new THREE.MeshStandardMaterial({ color: 0xcfbd9a, roughness: 0.8 })
  const lower = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.3), lowerMat)
  lower.position.set(0, 0.65, 0.01)
  grp.add(lower)
  const panelMat = new THREE.MeshStandardMaterial({ color: 0xdccba8, roughness: 0.7 })
  for (let x = -len / 2 + 1.1; x < len / 2 - 0.5; x += 2.2) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 0.04), panelMat)
    p.position.set(x, 0.7, 0.03)
    grp.add(p)
  }
  const trim = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.6 })
  const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.1, 0.1), trim)
  rail.position.set(0, 1.35, 0.05)
  grp.add(rail)
  const base = new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, 0.08), trim)
  base.position.set(0, 0.11, 0.04)
  grp.add(base)
  return grp
}

function hotspotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.shadowColor = 'rgba(0,0,0,.45)'
  g.shadowBlur = 12
  g.fillStyle = '#fff'
  g.beginPath(); g.arc(64, 64, 34, 0, Math.PI * 2); g.fill()
  g.shadowBlur = 0
  g.strokeStyle = 'rgba(255,255,255,.7)'
  g.lineWidth = 5
  g.beginPath(); g.arc(64, 64, 48, 0, Math.PI * 2); g.stroke()
  return new THREE.CanvasTexture(c)
}

export default function Museum({ works, active, onSelect, onHotspot, autoRotate }) {
  const mount = useRef(null)
  const api = useRef({})
  const cb = useRef({})
  cb.current = { onSelect, onHotspot, autoRotate }

  useEffect(() => {
    const el = mount.current
    let disposed = false
    const size = () => [el.clientWidth || 1, el.clientHeight || 1]
    const [w0, h0] = size()

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const coarse = window.matchMedia?.('(pointer: coarse)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2))
    renderer.setSize(w0, h0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.xr.enabled = true
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x3a2a20)
    const camera = new THREE.PerspectiveCamera(55, w0 / h0, 0.1, 100)
    const dolly = new THREE.Group()
    dolly.add(camera)
    scene.add(dolly)

    // Room
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), new THREE.MeshStandardMaterial({ map: makeFloor(), roughness: 0.35, metalness: 0.05 }))
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), new THREE.MeshStandardMaterial({ color: 0xeae2d2, roughness: 0.9 }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = ROOM_H
    scene.add(ceil)
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xd8ccb4, roughness: 0.8 })
    for (let x = -ROOM_W / 2 + 2; x < ROOM_W / 2; x += 4) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, ROOM_D), beamMat)
      b.position.set(x, ROOM_H - 0.12, 0)
      scene.add(b)
    }
    const back = wallGroup(ROOM_W); back.position.z = -ROOM_D / 2; scene.add(back)
    const front = wallGroup(ROOM_W); front.position.z = ROOM_D / 2; front.rotation.y = Math.PI; scene.add(front)
    const left = wallGroup(ROOM_D); left.position.x = -ROOM_W / 2; left.rotation.y = Math.PI / 2; scene.add(left)
    const right = wallGroup(ROOM_D); right.position.x = ROOM_W / 2; right.rotation.y = -Math.PI / 2; scene.add(right)

    scene.add(new THREE.HemisphereLight(0xfff0d8, 0x6b4a30, 1.1))
    scene.add(new THREE.AmbientLight(0xffe6c4, 0.5))

    // Exhibits
    const hit = []
    const frames = []
    const relicDisplays = []
    const spots = []
    const canvases = []
    const textures = []
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xb98a2f, metalness: 0.8, roughness: 0.35 })
    const pedMat = new THREE.MeshStandardMaterial({ color: 0xf4f0e8, roughness: 0.6 })
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0, side: THREE.DoubleSide, depthWrite: false })
    const fixMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffe9b8, emissiveIntensity: 1.2 })
    const relicLoader = new THREE.TextureLoader()

    function framed(i, fw, fh) {
      const grp = new THREE.Group()
      const frame = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.07), goldMat)
      const inner = new THREE.Mesh(new THREE.BoxGeometry(fw - 0.12, fh - 0.12, 0.075), new THREE.MeshStandardMaterial({ color: 0x2a1c10 }))
      const canvas = canvases[i]
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      textures.push(tex)
      const art = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.18, fh - 0.18), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }))
      art.position.z = 0.04
      grp.add(frame, inner, art)
      return grp
    }

    works.forEach((work, i) => {
      canvases[i] = drawCover(work, i, 600, 800)
      const x = px(i)
      const g = new THREE.Group()
      g.position.set(x, 0, PED_Z)
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), pedMat); base.position.y = 0.075
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 1.3), pedMat); body.position.y = 0.575
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), pedMat); top.position.y = 1.05
      const caseM = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 1.3), glassMat); caseM.position.y = 1.7
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(caseM.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }))
      edges.position.copy(caseM.position)
      const frame = framed(i, 0.92, 1.2)
      frame.position.y = 1.72
      frame.rotation.x = -0.08
      g.add(base, body, top, caseM, edges, frame)
      g.traverse(o => { o.userData.index = i; if (o.isMesh) hit.push(o) })
      scene.add(g)
      frames.push({ frame, scale: 1 })

      // Companion glass case containing the symbolic object for this work.
      const relicGroup = new THREE.Group()
      relicGroup.position.set(x + 1.65, 0, PED_Z + 0.1)
      const relicBase = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.13, 1.25), pedMat); relicBase.position.y = 0.065
      const relicBody = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.62, 1.05), pedMat); relicBody.position.y = 0.43
      const relicTop = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.09, 1.25), pedMat); relicTop.position.y = 0.785
      const relicGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.15, 1.1), glassMat); relicGlass.position.y = 1.4
      const relicEdges = new THREE.LineSegments(new THREE.EdgesGeometry(relicGlass.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }))
      relicEdges.position.copy(relicGlass.position)
      const relicTexture = relicLoader.load(import.meta.env.BASE_URL + RELICS[work.title])
      relicTexture.colorSpace = THREE.SRGBColorSpace
      relicTexture.anisotropy = 8
      textures.push(relicTexture)
      const relicArt = new THREE.Mesh(
        new THREE.PlaneGeometry(0.94, 0.94),
        new THREE.MeshStandardMaterial({ map: relicTexture, transparent: true, alphaTest: 0.025, side: THREE.DoubleSide, roughness: 0.55, depthWrite: false })
      )
      relicArt.position.set(0, 1.4, 0.03)
      relicGroup.add(relicBase, relicBody, relicTop, relicGlass, relicEdges, relicArt)
      relicGroup.traverse(o => { o.userData.index = i; if (o.isMesh) hit.push(o) })
      scene.add(relicGroup)
      relicDisplays.push({ art: relicArt, index: i })

      // Large framed piece on the wall
      const wall = framed(i, 1.7, 2.2)
      wall.position.set(x, 3.6, -ROOM_D / 2 + 0.06)
      wall.traverse(o => { o.userData.index = i; if (o.isMesh) hit.push(o) })
      scene.add(wall)

      // Ceiling spotlight
      const fix = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.2, 16), fixMat)
      fix.position.set(x, ROOM_H - 0.2, PED_Z + 0.8)
      scene.add(fix)
      const spot = new THREE.SpotLight(0xfff2d8, 40, 12, 0.5, 0.6, 1.5)
      spot.position.copy(fix.position)
      spot.target.position.set(x, 1.5, PED_Z)
      scene.add(spot, spot.target)
      spots.push(spot)
    })

    // Redraw covers once the display fonts are available
    const redraw = () => {
      if (disposed) return
      works.forEach((wk, i) => drawCover(wk, i, 600, 800, canvases[i]))
      textures.forEach(t => { t.needsUpdate = true })
    }
    const offImg = onCoverImageLoad(redraw)
    Promise.all([document.fonts.load('italic 28px "Bodoni Moda"'), document.fonts.load('500 44px "Bodoni Moda"')]).then(redraw).catch(() => {})

    // Hotspot anchor
    const hotspot = new THREE.Sprite(new THREE.SpriteMaterial({ map: hotspotTexture(), depthTest: false, transparent: true }))
    hotspot.renderOrder = 10
    hotspot.userData.hotspot = true
    scene.add(hotspot)
    hit.push(hotspot)

    // VR-only floating info panel
    const xrCanvas = document.createElement('canvas')
    xrCanvas.width = 800; xrCanvas.height = 1000
    const xrTex = new THREE.CanvasTexture(xrCanvas)
    xrTex.colorSpace = THREE.SRGBColorSpace
    const xrPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshBasicMaterial({ map: xrTex, transparent: true }))
    xrPanel.visible = false
    scene.add(xrPanel)
    function drawXR(i) {
      const wk = works[i]
      const g = xrCanvas.getContext('2d')
      g.clearRect(0, 0, 800, 1000)
      g.fillStyle = 'rgba(30,22,18,0.82)'
      g.beginPath(); g.roundRect(0, 0, 800, 1000, 50); g.fill()
      g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 3; g.stroke()
      g.textAlign = 'left'
      g.fillStyle = '#fff'
      g.font = '500 54px "Bodoni Moda", Georgia, serif'
      let y = wrapText(g, wk.title, 50, 90, 700, 62)
      g.fillStyle = '#d8b86a'
      g.font = 'italic 32px Georgia, serif'
      y = wrapText(g, `${wk.author}  ·  ${wk.lens}`, 50, y + 6, 700, 40)
      g.fillStyle = '#eee'
      const themeText = Array.isArray(wk.themes) ? wk.themes.map(item => item.name).join(' · ') : wk.themes
      for (const [h, t] of [['Description', wk.description], ['Themes', themeText], ['Imagery', wk.imagery]]) {
        g.font = '600 30px Montserrat, sans-serif'; g.fillStyle = '#d8b86a'
        y = wrapText(g, h, 50, y + 20, 700, 38)
        g.font = '26px Montserrat, sans-serif'; g.fillStyle = '#eee'
        y = wrapText(g, t, 50, y, 700, 34)
      }
      xrTex.needsUpdate = true
    }

    // Camera control
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 1.2
    controls.maxDistance = 9
    controls.maxPolarAngle = Math.PI * 0.55
    controls.screenSpacePanning = false
    let goal = null
    controls.addEventListener('start', () => { goal = null })

    let activeIdx = 0
    function setActive(i) {
      activeIdx = i
      const x = px(i)
      goal = { pos: new THREE.Vector3(x + 0.2, 1.65, PED_Z + 4.0), tgt: new THREE.Vector3(x + 0.8, 1.5, PED_Z) }
      hotspot.position.set(x + 0.5, 2.28, PED_Z + 0.1)
      xrPanel.position.set(x + 1.9, 1.7, PED_Z + 0.9)
      xrPanel.rotation.y = -0.35
      drawXR(i)
    }
    api.current.setActive = setActive
    {
      const x = px(active)
      camera.position.set(x + 0.2, 1.65, PED_Z + 4.0)
      controls.target.set(x + 0.8, 1.5, PED_Z)
      setActive(active)
      goal = null
    }

    // XR session handling and controllers
    // Only show the VR control when this browser can actually start an immersive session.
    // VRButton otherwise renders a distracting "VR NOT SUPPORTED" badge.
    navigator.xr?.isSessionSupported?.('immersive-vr').then(supported => {
      if (supported && !disposed) el.appendChild(VRButton.createButton(renderer))
    }).catch(() => {})
    renderer.xr.addEventListener('sessionstart', () => {
      dolly.position.set(px(activeIdx) + 0.2, 0, PED_Z + 3.0)
      xrPanel.visible = true
    })
    renderer.xr.addEventListener('sessionend', () => {
      dolly.position.set(0, 0, 0)
      xrPanel.visible = false
      setActive(activeIdx)
    })
    const rc = new THREE.Raycaster()
    const tmp = new THREE.Matrix4()
    function pick() {
      const h = rc.intersectObjects(hit, false)[0]
      if (!h) return
      const o = h.object
      if (o.userData.hotspot) cb.current.onHotspot()
      else if (o.userData.index !== undefined) cb.current.onSelect(o.userData.index)
    }
    for (let k = 0; k < 2; k++) {
      const ctrl = renderer.xr.getController(k)
      ctrl.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -4)]), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })))
      ctrl.addEventListener('selectstart', () => {
        tmp.identity().extractRotation(ctrl.matrixWorld)
        rc.ray.origin.setFromMatrixPosition(ctrl.matrixWorld)
        rc.ray.direction.set(0, 0, -1).applyMatrix4(tmp)
        pick()
      })
      dolly.add(ctrl)
    }

    // Desktop pointer interaction
    const ndc = new THREE.Vector2()
    let hover = -1
    const cast = e => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      rc.setFromCamera(ndc, camera)
    }
    let down = null
    const onDown = e => { down = [e.clientX, e.clientY] }
    const onUp = e => {
      if (!down) return
      const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1])
      down = null
      if (moved < 5) { cast(e); pick() }
    }
    const onMove = e => {
      cast(e)
      const h = rc.intersectObjects(hit, false)[0]
      const o = h && h.object
      hover = o && o.userData.index !== undefined ? o.userData.index : -1
      renderer.domElement.style.cursor = o ? 'pointer' : 'grab'
    }
    const dom = renderer.domElement
    dom.addEventListener('pointerdown', onDown)
    dom.addEventListener('pointerup', onUp)
    dom.addEventListener('pointermove', onMove)

    // WASD walking
    const keys = {}
    const onKey = v => e => {
      if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return
      keys[e.key.toLowerCase()] = v
    }
    const kd = onKey(true), ku = onKey(false)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)

    const onResize = () => {
      const [w, h] = size()
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    const clock = new THREE.Clock()
    const fwd = new THREE.Vector3(), side = new THREE.Vector3(), mv = new THREE.Vector3()
    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime
      if (!renderer.xr.isPresenting) {
        if (goal) {
          const k = 1 - Math.pow(0.002, dt)
          camera.position.lerp(goal.pos, k)
          controls.target.lerp(goal.tgt, k)
          if (camera.position.distanceTo(goal.pos) < 0.02 && controls.target.distanceTo(goal.tgt) < 0.02) goal = null
        }
        mv.set(0, 0, 0)
        camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize()
        side.crossVectors(fwd, camera.up).normalize()
        if (keys.w || keys.arrowup) mv.add(fwd)
        if (keys.s || keys.arrowdown) mv.sub(fwd)
        if (keys.d || keys.arrowright) mv.add(side)
        if (keys.a || keys.arrowleft) mv.sub(side)
        if (mv.lengthSq() > 0) {
          goal = null
          mv.normalize().multiplyScalar(3 * dt)
          const nx = THREE.MathUtils.clamp(camera.position.x + mv.x, -ROOM_W / 2 + 1, ROOM_W / 2 - 1)
          const nz = THREE.MathUtils.clamp(camera.position.z + mv.z, -ROOM_D / 2 + 1.5, ROOM_D / 2 - 1)
          mv.set(nx - camera.position.x, 0, nz - camera.position.z)
          camera.position.add(mv)
          controls.target.add(mv)
        }
        controls.update()
      }
      hotspot.scale.setScalar(0.16 + Math.sin(t * 3) * 0.015)
      frames.forEach((f, i) => {
        const targetS = i === hover ? 1.05 : 1
        f.scale += (targetS - f.scale) * 0.15
        f.frame.scale.setScalar(f.scale)
        f.frame.rotation.y = i === activeIdx && cb.current.autoRotate ? Math.sin(t * 0.6) * 0.28 : f.frame.rotation.y * 0.9
        spots[i].intensity += ((i === activeIdx ? 90 : i === hover ? 60 : 25) - spots[i].intensity) * 0.1
      })
      relicDisplays.forEach(({ art, index }) => {
        const wanted = index === activeIdx && cb.current.autoRotate ? Math.sin(t * 0.55) * 0.32 : 0
        art.rotation.y += (wanted - art.rotation.y) * 0.08
        const s = index === hover ? 1.08 : 1
        art.scale.lerp(new THREE.Vector3(s, s, s), 0.12)
      })
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      offImg()
      renderer.setAnimationLoop(null)
      ro.disconnect()
      dom.removeEventListener('pointerdown', onDown)
      dom.removeEventListener('pointerup', onUp)
      dom.removeEventListener('pointermove', onMove)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
      controls.dispose()
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) { o.material.map?.dispose(); o.material.dispose() }
      })
      renderer.dispose()
      el.innerHTML = ''
    }
  }, [works])

  useEffect(() => { api.current.setActive?.(active) }, [active])

  return <div ref={mount} className="museum-canvas" />
}
