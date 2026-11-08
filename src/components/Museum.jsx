import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { drawCover, wrapText, onCoverImageLoad } from '../lib/cover.js'
import { createRelicModel } from '../lib/relicModels.js'

const SPACING = 6.8
const PED_Z = -2.2
const px = i => (i - 3) * SPACING
const ROOM_W = 56, ROOM_D = 18, ROOM_H = 6.2

const RELIC_IMAGES = {
  'Voice out of the Whirlwind': 'relics/job-whirlwind.png',
  'The Panchatantra': 'relics/panchatantra-manuscript.png',
  'The Ramayana': 'relics/rama-bow.png',
  'The Mahabharata': 'relics/sudarshana-chakra.png',
  'The Iliad': 'relics/achilles-shield.png',
  'The Odyssey': 'relics/odysseus-bow.png',
  'The Song of Roland': 'relics/roland-oliphant.png',
}

// Procedural rich dark walnut parquet floor texture
function makeFloorTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')

  // Dark rich walnut base
  g.fillStyle = '#22150e'
  g.fillRect(0, 0, 512, 512)

  // Herringbone / parquet pattern
  for (let ty = 0; ty < 8; ty++) {
    for (let tx = 0; tx < 8; tx++) {
      const isAlt = (tx + ty) % 2 === 0
      const x = tx * 64
      const y = ty * 64

      // Subtle wood grain variation
      const hueVar = Math.floor(Math.random() * 8) - 4
      const lightVar = Math.floor(Math.random() * 12) - 6
      g.fillStyle = `hsl(${28 + hueVar}, 38%, ${20 + lightVar}%)`
      g.fillRect(x + 1, y + 1, 62, 62)

      // Fine wood planks
      for (let p = 0; p < 4; p++) {
        g.strokeStyle = 'rgba(15, 8, 4, 0.45)'
        g.lineWidth = 1
        if (isAlt) {
          g.strokeRect(x, y + p * 16, 64, 16)
        } else {
          g.strokeRect(x + p * 16, y, 16, 64)
        }
      }
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(ROOM_W / 3.5, ROOM_D / 3.5)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// Wall typography canvas plaque (matching reference photo Lorem Ipsum wall text)
function makeWallTextCanvas(work) {
  const c = document.createElement('canvas')
  c.width = 768
  c.height = 960
  const g = c.getContext('2d')

  // Transparent background
  g.clearRect(0, 0, c.width, c.height)

  // Title in clean modern serif
  g.fillStyle = '#1c1b18'
  g.font = '600 48px "Cormorant Garamond", Georgia, serif'
  g.textAlign = 'left'
  let y = wrapText(g, work.title, 40, 70, 680, 54)

  // Metadata
  g.fillStyle = '#8c6b38'
  g.font = '500 24px "Oswald", "Arial Narrow", sans-serif'
  g.letterSpacing = '3px'
  const authorLine = `${work.author.toUpperCase()} · ${work.era || 'CLASSIC'}`
  g.fillText(authorLine, 40, y + 25)
  y += 55

  // Thin separator rule
  g.strokeStyle = '#c8a462'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(40, y)
  g.lineTo(160, y)
  g.stroke()
  y += 35

  // Subtitle / Philosophical inquiry
  g.fillStyle = '#2d2822'
  g.font = 'italic 500 30px "Cormorant Garamond", Georgia, serif'
  y = wrapText(g, `“${work.hook || work.description || ''}”`, 40, y, 680, 38)
  y += 20

  // Narrative analysis excerpt
  g.fillStyle = '#4a443b'
  g.font = '400 22px "Inter", system-ui, sans-serif'
  y = wrapText(g, work.context || work.summary || '', 40, y, 680, 34)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// Classical Museum Amphora / Vase for decorative display
function makeAmphora(THREE, mat) {
  const grp = new THREE.Group()
  const points = []
  // Profile points for a Greek amphora
  points.push(new THREE.Vector2(0.01, 0))
  points.push(new THREE.Vector2(0.12, 0.03))
  points.push(new THREE.Vector2(0.08, 0.12))
  points.push(new THREE.Vector2(0.22, 0.38))
  points.push(new THREE.Vector2(0.24, 0.55))
  points.push(new THREE.Vector2(0.18, 0.72))
  points.push(new THREE.Vector2(0.09, 0.88))
  points.push(new THREE.Vector2(0.12, 0.95))
  points.push(new THREE.Vector2(0.14, 0.98))

  const vaseGeo = new THREE.LatheGeometry(points, 24)
  const vase = new THREE.Mesh(vaseGeo, mat)
  grp.add(vase)

  // Handles
  const handleCurveL = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 0.78, 0),
    new THREE.Vector3(-0.28, 0.65, 0),
    new THREE.Vector3(-0.24, 0.45, 0),
    new THREE.Vector3(-0.19, 0.42, 0),
  ])
  const handleGeo = new THREE.TubeGeometry(handleCurveL, 20, 0.018, 8, false)
  const handleL = new THREE.Mesh(handleGeo, mat)
  const handleR = handleL.clone()
  handleR.rotation.y = Math.PI
  grp.add(handleL, handleR)
  return grp
}

// Modern Museum Gallery Bench (wood + leather)
function makeMuseumBench(THREE, woodMat, leatherMat) {
  const grp = new THREE.Group()
  // Leather cushion
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.85), leatherMat)
  seat.position.y = 0.52
  grp.add(seat)
  // Wood frame underneath
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.08, 0.89), woodMat)
  frame.position.y = 0.39
  grp.add(frame)
  // Steel/wood legs
  ;[-1.0, 1.0].forEach(x => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.75), woodMat)
    leg.position.set(x, 0.19, 0)
    grp.add(leg)
  })
  return grp
}

// Brass Stanchion Guardrail Post
function makeStanchion(THREE, brassMat) {
  const grp = new THREE.Group()
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.05, 24), brassMat)
  base.position.y = 0.025
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.95, 16), brassMat)
  pole.position.y = 0.5
  const topBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), brassMat)
  topBall.position.y = 0.99
  grp.add(base, pole, topBall)
  return grp
}

export default function Museum({ works, active, onSelect, onHotspot, autoRotate }) {
  const mount = useRef(null)
  const api = useRef({})
  const cb = useRef({})
  cb.current = { onSelect, onHotspot, autoRotate }

  useEffect(() => {
    const el = mount.current
    if (!el) return
    let disposed = false

    const size = () => [el.clientWidth || window.innerWidth, el.clientHeight || window.innerHeight]
    const [w0, h0] = size()

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w0, h0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.xr.enabled = true
    el.appendChild(renderer.domElement)

    // 2. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x181a1f)
    scene.fog = new THREE.FogExp2(0x181a1f, 0.015)

    const camera = new THREE.PerspectiveCamera(50, w0 / h0, 0.1, 100)
    const dolly = new THREE.Group()
    dolly.add(camera)
    scene.add(dolly)

    // 3. Materials
    const floorTex = makeFloorTexture()
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.28,
      metalness: 0.08,
    })

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf4eee6, // Off-white warm contemporary gallery plaster
      roughness: 0.92,
      metalness: 0.02,
    })

    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x3d2417, // Dark walnut trim / baseboards / furniture
      roughness: 0.45,
      metalness: 0.05,
    })

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x1e2025, // Charcoal/black gallery bench leather
      roughness: 0.65,
      metalness: 0.1,
    })

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4b26f, // Museum brass / gold
      metalness: 0.9,
      roughness: 0.25,
    })

    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf8f5f0, // White classical marble
      roughness: 0.35,
      metalness: 0.02,
    })

    const terracottaMat = new THREE.MeshStandardMaterial({
      color: 0xb45838, // Antique Greek black/terracotta slipware
      roughness: 0.5,
      metalness: 0.08,
    })

    // Stepped pedestal material (matching screenshot)
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xfaf7f2,
      roughness: 0.32,
      metalness: 0.02,
    })

    // Ultra-clear museum vitrine glass material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      roughness: 0.03,
      metalness: 0.05,
      transmission: 0.94,
      thickness: 0.4,
      ior: 1.52,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    const glassFrameMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.4,
    })

    // 4. Room Construction: Floor, Ceiling, Louvers
    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Baseboards around perimeter
    const baseboardGeo = new THREE.BoxGeometry(ROOM_W, 0.22, 0.06)
    const backBaseboard = new THREE.Mesh(baseboardGeo, walnutMat)
    backBaseboard.position.set(0, 0.11, -ROOM_D / 2 + 0.03)
    scene.add(backBaseboard)

    // Main Back Exhibition Wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat)
    backWall.position.set(0, ROOM_H / 2, -ROOM_D / 2)
    backWall.receiveShadow = true
    scene.add(backWall)

    // Ceiling with Dark Slatted Architectural Louvers (matching reference photo)
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.95 })
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = ROOM_H
    scene.add(ceil)

    // Slatted ceiling beams / louvers running along length
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.85 })
    for (let z = -ROOM_D / 2 + 0.8; z < ROOM_D / 2; z += 0.45) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W - 2, 0.14, 0.08), louverMat)
      slat.position.set(0, ROOM_H - 0.07, z)
      scene.add(slat)
    }

    // Black Track Lighting Pipes on Ceiling
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x111113, metalness: 0.8, roughness: 0.3 })
    const trackRail1 = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W - 4, 0.05, 0.05), trackMat)
    trackRail1.position.set(0, ROOM_H - 0.25, PED_Z + 1.2)
    scene.add(trackRail1)

    // 5. Contemporary Partition Walls between Alcoves (matching reference photo)
    for (let i = 0; i < works.length - 1; i++) {
      const partX = (px(i) + px(i + 1)) / 2
      const partGroup = new THREE.Group()
      partGroup.position.set(partX, 0, -ROOM_D / 2 + 2.2)

      // Partition body with rounded aesthetic
      const partWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, ROOM_H - 0.4, 4.4), wallMat)
      partWall.position.y = (ROOM_H - 0.4) / 2
      partWall.castShadow = true
      partWall.receiveShadow = true

      // Walnut baseboard on partition
      const partBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 4.46), walnutMat)
      partBase.position.y = 0.11

      partGroup.add(partWall, partBase)
      scene.add(partGroup)
    }

    // 6. Ambient & Exhibition Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x3d3025, 0.95)
    scene.add(hemiLight)

    const softAmbient = new THREE.AmbientLight(0xfff5e6, 0.5)
    scene.add(softAmbient)

    // 7. Interactive Exhibits Setup
    const hitObjects = []
    const vitrineCases = [] // Stores data for click-to-open and float animations
    const spots = []
    const textures = []
    const canvases = []
    const wallArtworkMeshes = []
    const imageLoader = new THREE.TextureLoader()

    works.forEach((work, i) => {
      const x = px(i)

      // A. Large Framed Classical Painting on Wall
      const frameGroup = new THREE.Group()
      frameGroup.position.set(x - 0.9, 3.2, -ROOM_D / 2 + 0.08)

      const fw = 2.4, fh = 1.8
      const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(fw, fh, 0.09),
        new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.5, metalness: 0.1 })
      )
      const innerGoldFillet = new THREE.Mesh(
        new THREE.BoxGeometry(fw - 0.08, fh - 0.08, 0.095),
        brassMat
      )

      // Load painting texture
      const artTex = imageLoader.load(import.meta.env.BASE_URL + work.image)
      artTex.colorSpace = THREE.SRGBColorSpace
      textures.push(artTex)

      const paintingArt = new THREE.Mesh(
        new THREE.PlaneGeometry(fw - 0.16, fh - 0.16),
        new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.4 })
      )
      paintingArt.position.z = 0.05
      paintingArt.castShadow = true
      frameGroup.add(outerFrame, innerGoldFillet, paintingArt)

      // Picture light fixture above frame
      const picLightBar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 16), brassMat)
      picLightBar.rotation.z = Math.PI / 2
      picLightBar.position.set(0, fh / 2 + 0.22, 0.26)
      const picLightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8), brassMat)
      picLightArm.rotation.x = Math.PI / 3
      picLightArm.position.set(0, fh / 2 + 0.11, 0.13)
      frameGroup.add(picLightBar, picLightArm)

      frameGroup.traverse(o => { o.userData.index = i; if (o.isMesh) hitObjects.push(o) })
      scene.add(frameGroup)
      wallArtworkMeshes.push(frameGroup)

      // B. Wall Typography Plaque (matching Lorem Ipsum wall typography in reference photo)
      const textGroup = new THREE.Group()
      textGroup.position.set(x + 1.25, 3.1, -ROOM_D / 2 + 0.04)
      const textTex = makeWallTextCanvas(work)
      textures.push(textTex)
      const textMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 2.0),
        new THREE.MeshBasicMaterial({ map: textTex, transparent: true })
      )
      textGroup.add(textMesh)
      textGroup.traverse(o => { o.userData.index = i; if (o.isMesh) hitObjects.push(o) })
      scene.add(textGroup)

      // C. Ceiling Spotlights
      const spotLight = new THREE.SpotLight(0xfff4de, 35, 14, 0.52, 0.5, 1.4)
      spotLight.position.set(x, ROOM_H - 0.25, PED_Z + 1.2)
      spotLight.target.position.set(x, 1.4, PED_Z)
      spotLight.castShadow = true
      scene.add(spotLight, spotLight.target)
      spots.push(spotLight)

      // Spotlight fixture can on track
      const spotFixture = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16),
        new THREE.MeshStandardMaterial({ color: 0x111113, metalness: 0.9, roughness: 0.2 })
      )
      spotFixture.position.copy(spotLight.position)
      spotFixture.rotation.x = Math.PI / 5
      scene.add(spotFixture)

      // D. THE GLASS VITRINE PEDESTAL (matching screenshot media_1794125216296_95b71483.png)
      const pedestalGroup = new THREE.Group()
      pedestalGroup.position.set(x, 0, PED_Z)

      // 1. Stepped Plinth Base (White museum stepped plinth)
      const baseBottom = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.1, 1.36), plinthMat)
      baseBottom.position.y = 0.05
      baseBottom.receiveShadow = true

      const baseColumn = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.72, 1.18), plinthMat)
      baseColumn.position.y = 0.46
      baseColumn.castShadow = true
      baseColumn.receiveShadow = true

      const baseTopCap = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 1.34), plinthMat)
      baseTopCap.position.y = 0.86
      baseTopCap.receiveShadow = true

      pedestalGroup.add(baseBottom, baseColumn, baseTopCap)

      // 2. Clear Glass Vitrine Case (lifts and opens on click)
      const glassGroup = new THREE.Group()
      glassGroup.position.set(0, 0.9, 0) // Rests on top cap at y=0.9

      const caseH = 1.15
      const caseW = 1.16
      const caseGlass = new THREE.Mesh(new THREE.BoxGeometry(caseW, caseH, caseW), glassMat)
      caseGlass.position.y = caseH / 2

      // Fine chrome/white beveled edges on the glass vitrine
      const caseEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(caseGlass.geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
      )
      caseEdges.position.copy(caseGlass.position)

      // Sleek top chrome handle / edge band
      const topEdgeBand = new THREE.Mesh(new THREE.BoxGeometry(caseW + 0.02, 0.02, caseW + 0.02), glassFrameMat)
      topEdgeBand.position.y = caseH

      glassGroup.add(caseGlass, caseEdges, topEdgeBand)
      pedestalGroup.add(glassGroup)

      // 3. FULL HIGH-DETAIL 3D PROCEDURAL RELIC (from relicModels.js)
      let relic3D = null
      try {
        relic3D = createRelicModel(THREE, work.title)
      } catch {
        // Fallback procedural sphere if title mismatch
        relic3D = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), brassMat)
      }

      // Rest inside the case on the plinth
      const defaultRelicY = 1.45
      relic3D.position.set(0, defaultRelicY, 0)
      relic3D.scale.set(0.85, 0.85, 0.85)
      pedestalGroup.add(relic3D)

      // Subtle golden light beam inside the vitrine
      const vitrineGlow = new THREE.PointLight(0xffe6b0, 2.4, 3.2)
      vitrineGlow.position.set(0, 1.45, 0)
      pedestalGroup.add(vitrineGlow)

      // Gold Relic Identification Plaque on the front of the plinth
      const plaqueMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.22, 0.02),
        brassMat
      )
      plaqueMesh.position.set(0, 0.55, 0.6)
      pedestalGroup.add(plaqueMesh)

      // Mark clickable objects for interaction
      pedestalGroup.traverse(o => {
        o.userData.index = i
        o.userData.isVitrine = true
        if (o.isMesh) hitObjects.push(o)
      })
      scene.add(pedestalGroup)

      // Register vitrine animation tracking
      vitrineCases.push({
        index: i,
        pedestalGroup,
        glassGroup,
        relic3D,
        vitrineGlow,
        defaultRelicY,
        isOpen: false,
        openProgress: 0, // 0 = closed, 1 = fully open & floating
      })
    })

    // 8. RANDOM MUSEUM OBJECTS TO ENRICH THE GALLERY (Benches, Amphorae, Stanchions)
    // A. Center Gallery Benches (placed in central aisle)
    const bench1 = makeMuseumBench(THREE, walnutMat, leatherMat)
    bench1.position.set(px(1.5), 0, PED_Z + 4.2)
    scene.add(bench1)

    const bench2 = makeMuseumBench(THREE, walnutMat, leatherMat)
    bench2.position.set(px(4.5), 0, PED_Z + 4.2)
    scene.add(bench2)

    // B. Classical Marble Pedestals with Sculptures / Amphorae in corners and side bays
    const urnPositions = [
      [-ROOM_W / 2 + 2.5, PED_Z + 0.8],
      [ROOM_W / 2 - 2.5, PED_Z + 0.8],
      [px(0.8), PED_Z + 5.5],
      [px(5.2), PED_Z + 5.5],
    ]

    urnPositions.forEach(([ux, uz], k) => {
      const urnStand = new THREE.Group()
      urnStand.position.set(ux, 0, uz)

      // Marble fluted pedestal
      const pedBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.7), marbleMat)
      pedBase.position.y = 0.05
      const pedCol = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.88, 20), marbleMat)
      pedCol.position.y = 0.54
      const pedCap = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), marbleMat)
      pedCap.position.y = 1.02
      urnStand.add(pedBase, pedCol, pedCap)

      // Classical Terracotta / Bronze Amphora
      const amphora = makeAmphora(THREE, k % 2 === 0 ? terracottaMat : brassMat)
      amphora.position.y = 1.06
      amphora.scale.set(0.9, 0.9, 0.9)
      urnStand.add(amphora)

      scene.add(urnStand)
    })

    // C. Brass Stanchion Guide Posts along the gallery line
    for (let i = 0; i < works.length; i++) {
      const sx = px(i)
      const stanchionL = makeStanchion(THREE, brassMat)
      stanchionL.position.set(sx - 1.6, 0, PED_Z + 1.2)
      const stanchionR = makeStanchion(THREE, brassMat)
      stanchionR.position.set(sx + 1.6, 0, PED_Z + 1.2)
      scene.add(stanchionL, stanchionR)
    }

    // 9. Camera & Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.2
    controls.maxDistance = 12
    controls.maxPolarAngle = Math.PI * 0.52
    controls.screenSpacePanning = false
    let goal = null
    controls.addEventListener('start', () => { goal = null })

    let activeIdx = 0
    function setActive(i) {
      activeIdx = i
      const x = px(i)
      goal = {
        pos: new THREE.Vector3(x, 1.75, PED_Z + 3.8),
        tgt: new THREE.Vector3(x, 1.45, PED_Z),
      }
    }
    api.current.setActive = setActive

    // Initial camera placement
    {
      const x = px(active)
      camera.position.set(x, 1.75, PED_Z + 3.8)
      controls.target.set(x, 1.45, PED_Z)
      setActive(active)
      goal = null
    }

    // 10. Pointer Interaction: Click Vitrine to Open Glass & Float Object
    const rc = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

    function toggleVitrine(targetIndex) {
      vitrineCases.forEach((vc, idx) => {
        if (idx === targetIndex) {
          vc.isOpen = !vc.isOpen // Toggle clicked case
        } else {
          vc.isOpen = false // Close others
        }
      })
    }

    let downPos = null
    const onPointerDown = e => { downPos = [e.clientX, e.clientY] }
    const onPointerUp = e => {
      if (!downPos) return
      const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1])
      downPos = null
      if (moved < 6) {
        const r = renderer.domElement.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        rc.setFromCamera(ndc, camera)
        const intersects = rc.intersectObjects(hitObjects, true)
        if (intersects.length > 0) {
          // Find topmost object with index
          let hitObj = intersects[0].object
          while (hitObj && hitObj.userData.index === undefined && hitObj.parent) {
            hitObj = hitObj.parent
          }
          if (hitObj && hitObj.userData.index !== undefined) {
            const hitIndex = hitObj.userData.index
            // Trigger glass opening & relic floating
            toggleVitrine(hitIndex)
            cb.current.onSelect(hitIndex)
          }
        }
      }
    }

    const onPointerMove = e => {
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      rc.setFromCamera(ndc, camera)
      const intersects = rc.intersectObjects(hitObjects, true)
      renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'grab'
    }

    const dom = renderer.domElement
    dom.addEventListener('pointerdown', onPointerDown)
    dom.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('pointermove', onPointerMove)

    // Keyboard WASD / Arrow Walking
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

    // 11. 60 FPS Render Loop with Smooth Vitrine Opening & Object Float
    const clock = new THREE.Clock()
    const fwd = new THREE.Vector3(), side = new THREE.Vector3(), mv = new THREE.Vector3()

    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime

      // Smooth camera tween
      if (goal) {
        const k = 1 - Math.pow(0.002, dt)
        camera.position.lerp(goal.pos, k)
        controls.target.lerp(goal.tgt, k)
        if (camera.position.distanceTo(goal.pos) < 0.02 && controls.target.distanceTo(goal.tgt) < 0.02) {
          goal = null
        }
      }

      // WASD movement
      mv.set(0, 0, 0)
      camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize()
      side.crossVectors(fwd, camera.up).normalize()
      if (keys.w || keys.arrowup) mv.add(fwd)
      if (keys.s || keys.arrowdown) mv.sub(fwd)
      if (keys.d || keys.arrowright) mv.add(side)
      if (keys.a || keys.arrowleft) mv.sub(side)
      if (mv.lengthSq() > 0) {
        goal = null
        mv.normalize().multiplyScalar(3.2 * dt)
        const nx = THREE.MathUtils.clamp(camera.position.x + mv.x, -ROOM_W / 2 + 1.5, ROOM_W / 2 - 1.5)
        const nz = THREE.MathUtils.clamp(camera.position.z + mv.z, -ROOM_D / 2 + 1.8, ROOM_D / 2 - 1.5)
        mv.set(nx - camera.position.x, 0, nz - camera.position.z)
        camera.position.add(mv)
        controls.target.add(mv)
      }
      controls.update()

      // Spotlights intensity breathing
      spots.forEach((spot, i) => {
        const targetIntensity = i === activeIdx ? 45 : 24
        spot.intensity += (targetIntensity - spot.intensity) * 0.1
      })

      // Vitrine Glass Opening & 3D Relic Floating Animation
      vitrineCases.forEach(vc => {
        const targetProg = vc.isOpen ? 1 : 0
        vc.openProgress += (targetProg - vc.openProgress) * 0.08 // Smooth ease lerp

        // 1. Glass lifts UP into the air
        // Rests at y=0.9 when closed; lifts up to y=2.3 when opened
        const glassY = 0.9 + vc.openProgress * 1.45
        vc.glassGroup.position.y = glassY
        // Subtle tilt when glass opens
        vc.glassGroup.rotation.x = -vc.openProgress * 0.12

        // 2. 3D Relic floats UP to eye level and rotates
        // Base height is 1.45; floats up to 1.95 with vertical sine levitation
        const floatElevation = vc.openProgress * 0.55
        const levitation = vc.isOpen ? Math.sin(t * 2.2) * 0.06 : 0
        vc.relic3D.position.y = vc.defaultRelicY + floatElevation + levitation

        // Relic spins when open and floating
        if (vc.isOpen) {
          vc.relic3D.rotation.y += 0.018
          vc.vitrineGlow.intensity = 4.2 + Math.sin(t * 3) * 0.8
        } else {
          // Slow ambient rotation when resting inside glass
          vc.relic3D.rotation.y += 0.005
          vc.vitrineGlow.intensity = 2.0
        }
      })

      renderer.render(scene, camera)
    })

    // 12. Cleanup
    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      ro.disconnect()
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointerup', onPointerUp)
      dom.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
      controls.dispose()
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else {
            o.material.map?.dispose()
            o.material.dispose()
          }
        }
      })
      renderer.dispose()
      el.innerHTML = ''
    }
  }, [works])

  useEffect(() => {
    api.current.setActive?.(active)
  }, [active])

  return <div ref={mount} className="museum-canvas" />
}
