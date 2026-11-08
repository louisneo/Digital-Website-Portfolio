import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { wrapText } from '../lib/cover.js'
import { createRelicModel } from '../lib/relicModels.js'
import { artifacts } from '../data/artifacts.js'

// Gallery Hall Dimensions
const ROOM_W = 46
const ROOM_D = 40
const ROOM_H = 6.2

// Architectural Exhibition Stations in Non-Linear Gallery
// (Matching reference photo media_1794126160696_477e6c04.jpg)
const EXHIBIT_STATIONS = [
  // 0: Book of Job - Near East & Wisdom Gallery (West wing, facing south)
  {
    x: -12.5,
    z: -9.5,
    rotY: 0,
    wallX: -12.5,
    wallZ: -11.6,
    wallRotY: 0,
    camX: -12.5,
    camY: 1.75,
    camZ: -5.6,
    lookX: -12.5,
    lookY: 1.45,
    lookZ: -9.5,
    wing: 'Wisdom & Cosmic Justice',
  },
  // 1: The Panchatantra - Sanskrit Fables & Statecraft (West wing, facing east)
  {
    x: -12.5,
    z: 7.5,
    rotY: -Math.PI / 2,
    wallX: -14.6,
    wallZ: 7.5,
    wallRotY: -Math.PI / 2,
    camX: -8.6,
    camY: 1.75,
    camZ: 7.5,
    lookX: -12.5,
    lookY: 1.45,
    lookZ: 7.5,
    wing: 'Sanskrit Wisdom Treasury',
  },
  // 2: The Ramayana - Ayodhya & Cosmic Dharma (South gallery, facing north)
  {
    x: -3.5,
    z: 12.0,
    rotY: Math.PI,
    wallX: -3.5,
    wallZ: 14.1,
    wallRotY: Math.PI,
    camX: -3.5,
    camY: 1.75,
    camZ: 8.0,
    lookX: -3.5,
    lookY: 1.45,
    lookZ: 12.0,
    wing: 'Sacred Epics of Ayodhya',
  },
  // 3: The Mahabharata - The Great War & Kāla (South gallery, facing north)
  {
    x: 8.5,
    z: 12.0,
    rotY: Math.PI,
    wallX: 8.5,
    wallZ: 14.1,
    wallRotY: Math.PI,
    camX: 8.5,
    camY: 1.75,
    camZ: 8.0,
    lookX: 8.5,
    lookY: 1.45,
    lookZ: 12.0,
    wing: 'The Kurukshetra Treasury',
  },
  // 4: The Iliad - Bronze Age Mycenae & Wrath (East wing, facing west)
  {
    x: 13.5,
    z: 2.5,
    rotY: Math.PI / 2,
    wallX: 15.6,
    wallZ: 2.5,
    wallRotY: Math.PI / 2,
    camX: 9.5,
    camY: 1.75,
    camZ: 2.5,
    lookX: 13.5,
    lookY: 1.45,
    lookZ: 2.5,
    wing: 'The Trojan War & Mycenae',
  },
  // 5: The Odyssey - The Wine-Dark Sea & Nostos (East wing, facing south)
  {
    x: 13.5,
    z: -9.5,
    rotY: 0,
    wallX: 13.5,
    wallZ: -11.6,
    wallRotY: 0,
    camX: 13.5,
    camY: 1.75,
    camZ: -5.6,
    lookX: 13.5,
    lookY: 1.45,
    lookZ: -9.5,
    wing: 'Archaic Aegean Maritime',
  },
  // 6: The Song of Roland - Chivalric Rotunda (North focal atrium, facing south)
  {
    x: 0,
    z: -11.5,
    rotY: 0,
    wallX: 0,
    wallZ: -13.6,
    wallRotY: 0,
    camX: 0,
    camY: 1.75,
    camZ: -7.2,
    lookX: 0,
    lookY: 1.45,
    lookZ: -11.5,
    wing: 'Medieval Chivalric Hall',
  },
]

// High-DPI Procedural Parquet Hardwood Floor
function makeFloorTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const g = c.getContext('2d')

  // Warm rich dark walnut base
  g.fillStyle = '#261810'
  g.fillRect(0, 0, 1024, 1024)

  // Parquet / Herringbone pattern with grain variation
  const tiles = 8
  const tileSize = 1024 / tiles
  for (let ty = 0; ty < tiles; ty++) {
    for (let tx = 0; tx < tiles; tx++) {
      const isAlt = (tx + ty) % 2 === 0
      const x = tx * tileSize
      const y = ty * tileSize

      const hueVar = (Math.sin(tx * 3.7 + ty * 2.1) * 6) | 0
      const lightVar = (Math.cos(tx * 1.9 + ty * 4.3) * 8) | 0
      g.fillStyle = `hsl(${26 + hueVar}, 34%, ${22 + lightVar}%)`
      g.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2)

      // Individual wood planks
      for (let p = 0; p < 4; p++) {
        g.strokeStyle = 'rgba(12, 7, 4, 0.45)'
        g.lineWidth = 2
        if (isAlt) {
          g.strokeRect(x, y + (p * tileSize) / 4, tileSize, tileSize / 4)
        } else {
          g.strokeRect(x + (p * tileSize) / 4, y, tileSize / 4, tileSize)
        }
      }
    }
  }

  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(ROOM_W / 4.2, ROOM_D / 4.2)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 16
  return tex
}

// 2048x2048 Razor-Sharp High-DPI Wall Typography Plaque
// (Completely eliminates blur; matching reference photo wall typography)
function makeWallTextCanvas(work, station) {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 2048
  const g = c.getContext('2d')

  // Clean, warm museum linen-white background matching gallery plaster
  g.fillStyle = '#f8f4ee'
  g.fillRect(0, 0, 2048, 2048)

  // Architectural border rule
  g.strokeStyle = '#ded4c0'
  g.lineWidth = 14
  g.strokeRect(50, 50, 1948, 1948)

  // Gallery Wing Header
  g.fillStyle = '#947035'
  g.font = '600 46px "Oswald", -apple-system, sans-serif'
  g.letterSpacing = '6px'
  g.fillText(station.wing.toUpperCase(), 120, 180)

  // Masterpiece Title in Bold Classic Serif
  g.fillStyle = '#121212'
  g.font = '700 86px "Playfair Display", "Cormorant Garamond", Georgia, serif'
  g.textAlign = 'left'
  let y = wrapText(g, work.title, 120, 290, 1780, 102)

  // Author & Epoch Line
  g.fillStyle = '#7a5518'
  g.font = '600 44px "Oswald", -apple-system, sans-serif'
  g.letterSpacing = '4px'
  const authorLine = `${work.author.toUpperCase()} · ${work.era || 'CLASSIC'}`
  g.fillText(authorLine, 120, y + 40)
  y += 110

  // Gold Separator Bar
  g.strokeStyle = '#c89531'
  g.lineWidth = 8
  g.beginPath()
  g.moveTo(120, y)
  g.lineTo(480, y)
  g.stroke()
  y += 90

  // Philosophical Curatorial Hook (Italic Serif)
  g.fillStyle = '#221e1a'
  g.font = 'italic 500 52px "Playfair Display", Georgia, serif'
  const quoteText = work.hook || work.description || ''
  y = wrapText(g, `“${quoteText}”`, 120, y, 1780, 72)
  y += 70

  // Curatorial Narrative Context Excerpt
  g.fillStyle = '#343029'
  g.font = '400 42px -apple-system, "Segoe UI", Roboto, sans-serif'
  const narrative = work.context || work.summary || ''
  y = wrapText(g, narrative, 120, y, 1780, 64)
  y += 80

  // Key Themes Chips Line
  g.fillStyle = '#8c6827'
  g.font = '600 38px "Oswald", sans-serif'
  g.letterSpacing = '3px'
  const themeStr = 'THEMES: ' + (work.themes?.map(t => t.name.toUpperCase()).join('  ·  ') || 'LITERARY CLASSIC')
  g.fillText(themeStr, 120, y)

  const tex = new THREE.CanvasTexture(c)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Classical Museum Amphora / Sculpture
function makeAmphora(THREE, mat) {
  const grp = new THREE.Group()
  const points = []
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

// Modern Museum Gallery Bench (wood + leather cushion)
function makeMuseumBench(THREE, woodMat, leatherMat) {
  const grp = new THREE.Group()
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.85), leatherMat)
  seat.position.y = 0.52
  grp.add(seat)
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.08, 0.89), woodMat)
  frame.position.y = 0.39
  grp.add(frame)
  ;[-1.0, 1.0].forEach(x => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.75), woodMat)
    leg.position.set(x, 0.19, 0)
    grp.add(leg)
  })
  return grp
}

// Free-standing partition wall with rounded corners and wood baseboards
// (Matching reference photo media_1794126160696_477e6c04.jpg)
function makePartitionWall(THREE, width, height, depth, wallMat, woodMat) {
  const grp = new THREE.Group()

  // Main architectural wall body
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat)
  body.position.y = height / 2
  body.castShadow = true
  body.receiveShadow = true
  grp.add(body)

  // Walnut baseboard skirting board around the bottom
  const baseboard = new THREE.Mesh(new THREE.BoxGeometry(width + 0.06, 0.24, depth + 0.06), woodMat)
  baseboard.position.y = 0.12
  baseboard.receiveShadow = true
  grp.add(baseboard)

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
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.xr.enabled = true
    el.appendChild(renderer.domElement)

    // 2. Scene & Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x131518)
    scene.fog = new THREE.FogExp2(0x131518, 0.012)

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
      color: 0xf5efe6, // Warm off-white museum plaster
      roughness: 0.92,
      metalness: 0.02,
    })

    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x361f12, // Rich dark walnut baseboards & wood trim
      roughness: 0.45,
      metalness: 0.05,
    })

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x1b1d22, // Charcoal leather bench
      roughness: 0.65,
      metalness: 0.1,
    })

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd8b570, // Brushed museum brass
      metalness: 0.9,
      roughness: 0.24,
    })

    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf8f5f0, // White classical marble
      roughness: 0.35,
      metalness: 0.02,
    })

    const terracottaMat = new THREE.MeshStandardMaterial({
      color: 0xb45838,
      roughness: 0.55,
      metalness: 0.06,
    })

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xfaf7f2, // White stepped museum pedestal
      roughness: 0.3,
      metalness: 0.02,
    })

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
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

    // 4. Room Construction: Floor, Outer Walls & Slatted Ceiling
    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Outer Gallery Walls
    const wallNorth = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat)
    wallNorth.position.set(0, ROOM_H / 2, -ROOM_D / 2)
    wallNorth.receiveShadow = true
    scene.add(wallNorth)

    const wallSouth = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), wallMat)
    wallSouth.position.set(0, ROOM_H / 2, ROOM_D / 2)
    wallSouth.rotation.y = Math.PI
    wallSouth.receiveShadow = true
    scene.add(wallSouth)

    const wallWest = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat)
    wallWest.position.set(-ROOM_W / 2, ROOM_H / 2, 0)
    wallWest.rotation.y = Math.PI / 2
    wallWest.receiveShadow = true
    scene.add(wallWest)

    const wallEast = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), wallMat)
    wallEast.position.set(ROOM_W / 2, ROOM_H / 2, 0)
    wallEast.rotation.y = -Math.PI / 2
    wallEast.receiveShadow = true
    scene.add(wallEast)

    // Dark Slatted Ceiling with Acoustic Louvers (matching reference photo)
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.95 })
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = ROOM_H
    scene.add(ceil)

    const louverMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.85 })
    for (let z = -ROOM_D / 2 + 1.2; z < ROOM_D / 2; z += 0.55) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W - 2, 0.14, 0.08), louverMat)
      slat.position.set(0, ROOM_H - 0.07, z)
      scene.add(slat)
    }

    // 5. Ambient & Gallery Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x2d241c, 0.9)
    scene.add(hemiLight)

    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.45)
    scene.add(ambientLight)

    // 6. Free-Standing Partition Walls & Exhibit Stations (Non-Linear Architecture)
    const hitObjects = []
    const vitrineCases = []
    const spots = []
    const textures = []
    const imageLoader = new THREE.TextureLoader()

    works.forEach((work, i) => {
      const st = EXHIBIT_STATIONS[i] || EXHIBIT_STATIONS[0]

      // A. Free-Standing Architectural Partition Wall
      // (Wide enough for painting + wall text side-by-side with rounded aesthetic)
      const wallW = 5.6
      const wallH = 4.4
      const wallD = 0.55
      const partition = makePartitionWall(THREE, wallW, wallH, wallD, wallMat, walnutMat)
      partition.position.set(st.wallX, 0, st.wallZ)
      partition.rotation.y = st.wallRotY
      scene.add(partition)

      // B. Large Framed Artwork Mounted on the Partition Wall
      const frameGroup = new THREE.Group()
      // Position artwork on the left half of the partition wall face
      frameGroup.position.set(-1.25, 2.5, wallD / 2 + 0.05)

      const fw = 2.2, fh = 1.7
      const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(fw, fh, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x20170f, roughness: 0.45, metalness: 0.1 })
      )
      const innerGoldFillet = new THREE.Mesh(
        new THREE.BoxGeometry(fw - 0.08, fh - 0.08, 0.085),
        brassMat
      )

      const artTex = imageLoader.load(import.meta.env.BASE_URL + work.image)
      artTex.colorSpace = THREE.SRGBColorSpace
      textures.push(artTex)

      const paintingArt = new THREE.Mesh(
        new THREE.PlaneGeometry(fw - 0.16, fh - 0.16),
        new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.35 })
      )
      paintingArt.position.z = 0.045
      paintingArt.castShadow = true
      frameGroup.add(outerFrame, innerGoldFillet, paintingArt)

      // Overhead picture light fixture
      const picLightBar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.85, 16), brassMat)
      picLightBar.rotation.z = Math.PI / 2
      picLightBar.position.set(0, fh / 2 + 0.18, 0.22)
      const picLightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.24, 8), brassMat)
      picLightArm.rotation.x = Math.PI / 3
      picLightArm.position.set(0, fh / 2 + 0.09, 0.11)
      frameGroup.add(picLightBar, picLightArm)

      partition.add(frameGroup)
      frameGroup.traverse(o => { o.userData.index = i; if (o.isMesh) hitObjects.push(o) })

      // C. Razor-Sharp 2048x2048 Wall Plaque Typography Canvas
      // Mounted on the right half of the partition wall face
      const textGroup = new THREE.Group()
      textGroup.position.set(1.25, 2.45, wallD / 2 + 0.03)
      const textTex = makeWallTextCanvas(work, st)
      textures.push(textTex)

      const textMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 1.9),
        new THREE.MeshStandardMaterial({ map: textTex, roughness: 0.7, metalness: 0.02 })
      )
      textMesh.receiveShadow = true
      textGroup.add(textMesh)
      partition.add(textGroup)
      textGroup.traverse(o => { o.userData.index = i; if (o.isMesh) hitObjects.push(o) })

      // D. Focused Overhead Ceiling Spotlight
      const spotLight = new THREE.SpotLight(0xfff6e4, 38, 16, 0.55, 0.5, 1.4)
      spotLight.position.set(st.x, ROOM_H - 0.3, st.z + 1.6)
      spotLight.target.position.set(st.x, 1.45, st.z)
      spotLight.castShadow = true
      scene.add(spotLight, spotLight.target)
      spots.push(spotLight)

      // E. Stepped Plinth Pedestal with Clear Glass Vitrine Case
      const pedGroup = new THREE.Group()
      pedGroup.position.set(st.x, 0, st.z)
      pedGroup.rotation.y = st.rotY

      // Stepped museum plinth
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
      pedGroup.add(baseBottom, baseColumn, baseTopCap)

      // Glass vitrine case (lifts open on click)
      const glassGroup = new THREE.Group()
      glassGroup.position.set(0, 0.9, 0)

      const caseH = 1.18
      const caseW = 1.16
      const caseGlass = new THREE.Mesh(new THREE.BoxGeometry(caseW, caseH, caseW), glassMat)
      caseGlass.position.y = caseH / 2

      const caseEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(caseGlass.geometry),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
      )
      caseEdges.position.copy(caseGlass.position)

      const topEdgeBand = new THREE.Mesh(new THREE.BoxGeometry(caseW + 0.02, 0.02, caseW + 0.02), glassFrameMat)
      topEdgeBand.position.y = caseH
      glassGroup.add(caseGlass, caseEdges, topEdgeBand)
      pedGroup.add(glassGroup)

      // Authentic 3D Procedural Museum Relic (Elevated High-Detail Models)
      let relic3D = null
      try {
        relic3D = createRelicModel(THREE, work.title)
      } catch {
        relic3D = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), brassMat)
      }

      const defaultRelicY = 1.46
      relic3D.position.set(0, defaultRelicY, 0)
      relic3D.scale.set(0.92, 0.92, 0.92)
      pedGroup.add(relic3D)

      // Golden light beam inside vitrine
      const vitrineGlow = new THREE.PointLight(0xffe2a8, 2.8, 3.5)
      vitrineGlow.position.set(0, 1.46, 0)
      pedGroup.add(vitrineGlow)

      // Brass Identification Plaque on Front
      const plaqueMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.02), brassMat)
      plaqueMesh.position.set(0, 0.55, 0.6)
      pedGroup.add(plaqueMesh)

      pedGroup.traverse(o => {
        o.userData.index = i
        o.userData.isVitrine = true
        if (o.isMesh) hitObjects.push(o)
      })
      scene.add(pedGroup)

      vitrineCases.push({
        index: i,
        pedGroup,
        glassGroup,
        relic3D,
        vitrineGlow,
        defaultRelicY,
        isOpen: false,
        openProgress: 0,
      })
    })

    // 7. Architectural Enrichments: Free-Standing Island Partitions, Benches & Sculptures
    // Central Atrium Island Wall (creating non-linear wandering flow like in reference photo)
    const centralIsland1 = makePartitionWall(THREE, 4.2, 4.0, 0.6, wallMat, walnutMat)
    centralIsland1.position.set(-1.5, 0, 1.5)
    centralIsland1.rotation.y = Math.PI / 4
    scene.add(centralIsland1)

    // Gallery Benches in Atrium & Corridors
    const bench1 = makeMuseumBench(THREE, walnutMat, leatherMat)
    bench1.position.set(0, 0, 4.5)
    scene.add(bench1)

    const bench2 = makeMuseumBench(THREE, walnutMat, leatherMat)
    bench2.position.set(-6.5, 0, -2.5)
    bench2.rotation.y = Math.PI / 2
    scene.add(bench2)

    const bench3 = makeMuseumBench(THREE, walnutMat, leatherMat)
    bench3.position.set(6.5, 0, -2.5)
    bench3.rotation.y = -Math.PI / 2
    scene.add(bench3)

    // Marble pedestals with classical amphorae in open circulation bays
    const urnBays = [
      [-ROOM_W / 2 + 3.2, -ROOM_D / 2 + 3.2],
      [ROOM_W / 2 - 3.2, -ROOM_D / 2 + 3.2],
      [-ROOM_W / 2 + 3.2, ROOM_D / 2 - 3.2],
      [ROOM_W / 2 - 3.2, ROOM_D / 2 - 3.2],
      [0, -2.0],
    ]
    urnBays.forEach(([ux, uz], k) => {
      const urnStand = new THREE.Group()
      urnStand.position.set(ux, 0, uz)

      const pedBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 0.72), marbleMat)
      pedBase.position.y = 0.05
      const pedCol = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.88, 20), marbleMat)
      pedCol.position.y = 0.54
      const pedCap = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.66), marbleMat)
      pedCap.position.y = 1.02
      urnStand.add(pedBase, pedCol, pedCap)

      const amphora = makeAmphora(THREE, k % 2 === 0 ? terracottaMat : brassMat)
      amphora.position.y = 1.06
      amphora.scale.set(0.9, 0.9, 0.9)
      urnStand.add(amphora)
      scene.add(urnStand)
    })

    // 8. Orbit Controls & Camera Navigation
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.2
    controls.maxDistance = 15
    controls.maxPolarAngle = Math.PI * 0.52
    controls.screenSpacePanning = false

    let goal = null
    controls.addEventListener('start', () => { goal = null })

    let activeIdx = 0
    function setActive(i) {
      activeIdx = i
      const st = EXHIBIT_STATIONS[i] || EXHIBIT_STATIONS[0]
      goal = {
        pos: new THREE.Vector3(st.camX, st.camY, st.camZ),
        tgt: new THREE.Vector3(st.lookX, st.lookY, st.lookZ),
      }

      // Automatically lift the vitrine case of the active exhibit
      vitrineCases.forEach((vc, idx) => {
        vc.isOpen = idx === i
      })
    }
    api.current.setActive = setActive

    // Initial camera position
    {
      const st = EXHIBIT_STATIONS[active] || EXHIBIT_STATIONS[0]
      camera.position.set(st.camX, st.camY, st.camZ)
      controls.target.set(st.lookX, st.lookY, st.lookZ)
      setActive(active)
      goal = null
    }

    // 9. Interactive Pointer Handling: Click to Open Glass & Float Object
    const rc = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

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
          let hitObj = intersects[0].object
          while (hitObj && hitObj.userData.index === undefined && hitObj.parent) {
            hitObj = hitObj.parent
          }
          if (hitObj && hitObj.userData.index !== undefined) {
            const hitIndex = hitObj.userData.index
            setActive(hitIndex)
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

    // 10. Keyboard Walking (WASD / Arrows)
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

    // 11. Render Loop: Smooth Camera, Vitrine Lift & Relic Levitation
    const clock = new THREE.Clock()
    const fwd = new THREE.Vector3(), side = new THREE.Vector3(), mv = new THREE.Vector3()

    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.1)
      const t = clock.elapsedTime

      // Camera lerp
      if (goal) {
        const k = 1 - Math.pow(0.002, dt)
        camera.position.lerp(goal.pos, k)
        controls.target.lerp(goal.tgt, k)
        if (camera.position.distanceTo(goal.pos) < 0.02 && controls.target.distanceTo(goal.tgt) < 0.02) {
          goal = null
        }
      }

      // WASD navigation
      mv.set(0, 0, 0)
      camera.getWorldDirection(fwd); fwd.y = 0; fwd.normalize()
      side.crossVectors(fwd, camera.up).normalize()
      if (keys.w || keys.arrowup) mv.add(fwd)
      if (keys.s || keys.arrowdown) mv.sub(fwd)
      if (keys.d || keys.arrowright) mv.add(side)
      if (keys.a || keys.arrowleft) mv.sub(side)
      if (mv.lengthSq() > 0) {
        goal = null
        mv.normalize().multiplyScalar(3.4 * dt)
        const nx = THREE.MathUtils.clamp(camera.position.x + mv.x, -ROOM_W / 2 + 1.8, ROOM_W / 2 - 1.8)
        const nz = THREE.MathUtils.clamp(camera.position.z + mv.z, -ROOM_D / 2 + 1.8, ROOM_D / 2 - 1.8)
        mv.set(nx - camera.position.x, 0, nz - camera.position.z)
        camera.position.add(mv)
        controls.target.add(mv)
      }
      controls.update()

      // Spotlights breathing
      spots.forEach((spot, i) => {
        const targetIntensity = i === activeIdx ? 48 : 22
        spot.intensity += (targetIntensity - spot.intensity) * 0.1
      })

      // Vitrine Glass Opening & 3D Relic Floating Animation
      vitrineCases.forEach(vc => {
        const targetProg = vc.isOpen ? 1 : 0
        vc.openProgress += (targetProg - vc.openProgress) * 0.08

        // Glass lifts UP into the air
        const glassY = 0.9 + vc.openProgress * 1.45
        vc.glassGroup.position.y = glassY
        vc.glassGroup.rotation.x = -vc.openProgress * 0.12

        // Relic floats UP to eye level and rotates
        const floatElevation = vc.openProgress * 0.55
        const levitation = vc.isOpen ? Math.sin(t * 2.2) * 0.05 : 0
        vc.relic3D.position.y = vc.defaultRelicY + floatElevation + levitation

        if (vc.isOpen) {
          vc.relic3D.rotation.y += 0.016
          vc.vitrineGlow.intensity = 4.2 + Math.sin(t * 3) * 0.8
        } else {
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
