import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Seven Symbolic Relics from Great Books Final Project
const RELICS = [
  {
    id: 'job-whirlwind',
    name: 'Voice out of the Whirlwind',
    work: 'The Book of Job',
    object: 'A swirling whirlwind column with a broken clay shard at the base',
    symbolism: 'God answering Job from the storm, suffering, and the limits of human understanding. The broken clay shard recalls Job sitting among the ashes (Job 2:8).',
    modelFile: 'job-whirlwind.glb',
    isParticleSystem: true, // Whirlwind built with a spiral particle system in code
  },
  {
    id: 'panchatantra-manuscripts',
    name: 'The Five Palm-Leaf Manuscripts',
    work: 'The Panchatantra',
    object: 'Five palm-leaf manuscripts tied together with cord',
    symbolism: '“Pancha” means five, for the five books of animal fables. It stands for practical wisdom, political strategy, and clever critical thinking.',
    modelFile: 'panchatantra-manuscripts.glb',
  },
  {
    id: 'ramayana-bow',
    name: 'Rama’s Bow and Arrow (The Kodanda)',
    work: 'The Ramayana',
    object: 'Rama’s bow with an arrow',
    symbolism: 'Dharma, duty, and righteous kingship. Power in a just ruler is wielded strictly to defend moral order without personal hatred or vengeance.',
    modelFile: 'ramayana-bow.glb',
  },
  {
    id: 'mahabharata-wheel',
    name: 'The Chariot Wheel of Kurukshetra',
    work: 'The Mahabharata',
    object: 'A large chariot wheel',
    symbolism: 'The wheel of time and fate (Kāla), the catastrophic war at Kurukshetra (Karna’s trapped wheel), and the heavy moral cost of duty.',
    modelFile: 'mahabharata-wheel.glb',
  },
  {
    id: 'iliad-shield',
    name: 'The Shield of Achilles',
    work: 'The Iliad',
    object: 'The Shield of Achilles with concentric rings',
    symbolism: 'War and peace together, the whole world in concentric rings, and the tragic glory and immense price of being a hero.',
    modelFile: 'iliad-shield.glb',
  },
  {
    id: 'odyssey-ship',
    name: 'The Wooden Ship with Sail',
    work: 'The Odyssey',
    object: 'A small wooden ship with a sail',
    symbolism: 'The long journey home (nostos), maritime cleverness (metis), and steadfast human perseverance across the wine-dark sea.',
    modelFile: 'odyssey-ship.glb',
  },
  {
    id: 'roland-olifant',
    name: 'The Olifant (Ivory War Horn)',
    work: 'The Song of Roland',
    object: 'The olifant, an ivory war horn',
    symbolism: 'Chivalric pride, martial honor, vassal loyalty, and tragic sacrifice, because Roland blew the horn too late to save his men.',
    modelFile: 'roland-olifant.glb',
  },
]

// Safely dispose of Three.js geometries and textures
function disposeObject(obj) {
  if (!obj) return
  obj.traverse(child => {
    if (child.geometry) child.geometry.dispose()
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => {
          m.map?.dispose()
          m.dispose()
        })
      } else {
        child.material.map?.dispose()
        child.material.dispose()
      }
    }
  })
}

// Fit any loaded object into the target bounding box and center it
function fitToBoundingBox(object, targetSize = 1.35) {
  object.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  object.position.sub(center)
  const scale = targetSize / maxDim
  object.scale.setScalar(scale)
  return scale
}

// Build the Whirlwind with a spiral particle system in code
function createWhirlwindParticleSystem(THREE) {
  const root = new THREE.Group()
  root.name = 'procedural-whirlwind-vortex'

  const particleCount = 480
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const particleData = []

  for (let i = 0; i < particleCount; i++) {
    const p = i / particleCount
    const height = -0.45 + p * 1.15
    const radius = 0.05 + Math.pow(p, 1.35) * 0.48
    const angle = p * Math.PI * 12 + (i % 2) * Math.PI

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const isEmber = Math.random() > 0.35
    colors[i * 3] = isEmber ? 1.0 : 0.65
    colors[i * 3 + 1] = isEmber ? 0.72 : 0.65
    colors[i * 3 + 2] = isEmber ? 0.22 : 0.72

    particleData.push({
      angle,
      height,
      radius,
      speed: 0.8 + Math.random() * 0.9,
      baseRadius: radius,
    })
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geo, mat)
  root.add(points)

  // Glowing lightning filament core running down the center
  const lPoints = []
  let lx = 0, lz = 0
  for (let i = 0; i <= 16; i++) {
    const p = i / 16
    const ly = 0.65 - p * 1.1
    lx += (Math.random() - 0.5) * 0.05
    lz += (Math.random() - 0.5) * 0.05
    lPoints.push(new THREE.Vector3(lx, ly, lz))
  }
  const lCurve = new THREE.CatmullRomCurve3(lPoints)
  const lTube = new THREE.Mesh(
    new THREE.TubeGeometry(lCurve, 42, 0.008, 6, false),
    new THREE.MeshBasicMaterial({ color: 0xfff4cf })
  )
  root.add(lTube)

  // Broken clay shard (potsherd) at the base (Job 2:8)
  const shardGroup = new THREE.Group()
  shardGroup.position.set(0, -0.48, 0)

  const shardMat = new THREE.MeshStandardMaterial({
    color: 0xb55a36, // Terracotta pottery clay
    roughness: 0.88,
    metalness: 0.02,
  })

  const shardGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.1, 16, 1, true, 0, Math.PI * 0.65)
  const shardMesh = new THREE.Mesh(shardGeo, shardMat)
  shardMesh.rotation.set(0.65, 0.4, -0.2)
  shardMesh.position.set(-0.06, 0.04, 0.05)
  shardGroup.add(shardMesh)

  const frag = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.02, 0.06, 2, 0.005), shardMat)
  frag.position.set(0.1, 0.012, -0.04)
  frag.rotation.set(-0.2, 0.8, 0.1)
  shardGroup.add(frag)

  root.add(shardGroup)

  // Animation update hook
  root.userData.updateParticles = dt => {
    const posAttr = points.geometry.attributes.position
    const posArr = posAttr.array
    for (let i = 0; i < particleCount; i++) {
      const d = particleData[i]
      d.angle += dt * d.speed
      d.height += dt * 0.22
      if (d.height > 0.7) {
        d.height = -0.45
      }
      const progress = (d.height + 0.45) / 1.15
      const currentRadius = 0.05 + Math.pow(progress, 1.35) * 0.48
      posArr[i * 3] = Math.cos(d.angle) * currentRadius
      posArr[i * 3 + 1] = d.height
      posArr[i * 3 + 2] = Math.sin(d.angle) * currentRadius
    }
    posAttr.needsUpdate = true
  }

  return root
}

// Create a simple, elegant geometric fallback shape while a model loads
function createFallbackShape(THREE) {
  const grp = new THREE.Group()
  grp.name = 'loading-fallback-shape'

  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xd8bd92,
    wireframe: true,
    roughness: 0.3,
    metalness: 0.8,
  })
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x2c2214,
    transparent: true,
    opacity: 0.75,
    roughness: 0.2,
    metalness: 0.3,
  })

  const cage = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), wireMat)
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), innerMat)
  grp.add(cage, core)
  grp.position.set(0, 0.05, 0)
  return grp
}

export default function SymbolicRelics({ pathname = '/' }) {
  const mountRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const activeRelic = RELICS[activeIdx]

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let disposed = false
    const w = el.clientWidth || 560
    const h = el.clientHeight || 420

    // 1. Renderer Setup
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    el.appendChild(renderer.domElement)

    // 2. Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50)
    camera.position.set(0, 0.75, 3.2)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.8
    controls.maxDistance = 6.0
    controls.maxPolarAngle = Math.PI * 0.52
    controls.target.set(0, 0.15, 0)

    // 3. Lighting: Warm gallery keylight, fill, and soft hover glow point light
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.7)
    scene.add(ambientLight)

    const keySpot = new THREE.SpotLight(0xfff4db, 28, 12, 0.52, 0.5, 1.4)
    keySpot.position.set(1.8, 3.2, 2.4)
    keySpot.target.position.set(0, 0.2, 0)
    keySpot.castShadow = true
    keySpot.shadow.mapSize.width = 1024
    keySpot.shadow.mapSize.height = 1024
    keySpot.shadow.bias = -0.0001
    scene.add(keySpot, keySpot.target)

    const fillSpot = new THREE.PointLight(0xd4b886, 1.6, 6)
    fillSpot.position.set(-2.2, 1.2, -1.2)
    scene.add(fillSpot)

    // Soft glow point light that brightens on hover
    const hoverGlow = new THREE.PointLight(0xffe2a4, 1.4, 4.5)
    hoverGlow.position.set(0, 0.35, 0.8)
    scene.add(hoverGlow)

    // 4. Museum Pedestal (RoundedBoxGeometry edges)
    const pedestalGroup = new THREE.Group()
    pedestalGroup.position.set(0, -0.75, 0)

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x181b22,
      roughness: 0.45,
      metalness: 0.1,
    })
    const brassTrimMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8b570,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.3,
    })

    const basePlinth = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.12, 1.6, 4, 0.02), plinthMat)
    basePlinth.position.y = 0.06
    basePlinth.receiveShadow = true

    const columnPlinth = new THREE.Mesh(new RoundedBoxGeometry(1.36, 0.65, 1.36, 4, 0.025), plinthMat)
    columnPlinth.position.y = 0.44
    columnPlinth.receiveShadow = true
    columnPlinth.castShadow = true

    const topCapPlinth = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.08, 1.5, 4, 0.02), plinthMat)
    topCapPlinth.position.y = 0.8
    topCapPlinth.receiveShadow = true

    const brassPlaque = new THREE.Mesh(new RoundedBoxGeometry(0.65, 0.18, 0.02, 2, 0.008), brassTrimMat)
    brassPlaque.position.set(0, 0.44, 0.69)
    pedestalGroup.add(basePlinth, columnPlinth, topCapPlinth, brassPlaque)
    scene.add(pedestalGroup)

    // Circular ground shadow contact disc
    const shadowDisc = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 1.4, 32),
      new THREE.MeshBasicMaterial({ color: 0x050608, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    )
    shadowDisc.rotation.x = -Math.PI / 2
    shadowDisc.position.y = -0.74
    scene.add(shadowDisc)

    // 5. Model Container & Loader Setup
    const relicContainer = new THREE.Group()
    relicContainer.position.set(0, 0.22, 0)
    scene.add(relicContainer)

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
    dracoLoader.setDecoderConfig({ type: 'js' })

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    let currentRelicObj = null
    let fallbackObj = null
    let activeParticlesHook = null

    function loadRelic(relicIndex) {
      if (disposed) return
      const relic = RELICS[relicIndex]

      // Clean up previous relic
      if (currentRelicObj) {
        relicContainer.remove(currentRelicObj)
        disposeObject(currentRelicObj)
        currentRelicObj = null
      }
      if (fallbackObj) {
        relicContainer.remove(fallbackObj)
        disposeObject(fallbackObj)
        fallbackObj = null
      }
      activeParticlesHook = null

      // Check if whirlwind is built with spiral particle system in code
      if (relic.isParticleSystem) {
        setIsLoading(false)
        const whirlwindSystem = createWhirlwindParticleSystem(THREE)
        currentRelicObj = whirlwindSystem
        fitToBoundingBox(whirlwindSystem, 1.35)
        relicContainer.add(whirlwindSystem)
        activeParticlesHook = whirlwindSystem.userData.updateParticles
        return
      }

      // Show fallback shape while loading model
      setIsLoading(true)
      fallbackObj = createFallbackShape(THREE)
      relicContainer.add(fallbackObj)

      // Load .glb model from /public/models/ using GLTFLoader and DRACOLoader
      const modelUrl = `${import.meta.env.BASE_URL}models/${relic.modelFile}`
      gltfLoader.load(
        modelUrl,
        gltf => {
          if (disposed) return
          setIsLoading(false)

          if (fallbackObj) {
            relicContainer.remove(fallbackObj)
            disposeObject(fallbackObj)
            fallbackObj = null
          }

          const model = gltf.scene
          model.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })

          // Scale every model to fit the same bounding box and center it
          fitToBoundingBox(model, 1.35)
          currentRelicObj = model
          relicContainer.add(model)
        },
        undefined,
        error => {
          console.warn(`Could not load GLB model from ${modelUrl}:`, error)
          setIsLoading(false)
        }
      )
    }

    // Initial load
    loadRelic(activeIdx)

    // 6. Raycasting for hover detection & soft glow
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-999, -999)
    let hovered = false

    const onPointerMove = e => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects([relicContainer, pedestalGroup], true)
      const nowHovered = hits.length > 0
      if (nowHovered !== hovered) {
        hovered = nowHovered
        setIsHovered(hovered)
        renderer.domElement.style.cursor = hovered ? 'grab' : 'default'
      }
    }

    const onPointerLeave = () => {
      hovered = false
      setIsHovered(false)
      mouse.set(-999, -999)
    }

    const dom = renderer.domElement
    dom.addEventListener('pointermove', onPointerMove)
    dom.addEventListener('pointerleave', onPointerLeave)

    // Resize handling
    const onResize = () => {
      const nw = el.clientWidth || 560
      const nh = el.clientHeight || 420
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    // 7. Render Loop with slow rotation & hover glow
    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      const dt = Math.min(clock.getDelta(), 0.1)

      controls.update()

      // Slow rotation on the relic
      const rotSpeed = hovered ? 0.65 : 0.28
      relicContainer.rotation.y += dt * rotSpeed

      // Fallback shape rotation if loading
      if (fallbackObj) {
        fallbackObj.rotation.x += dt * 0.8
        fallbackObj.rotation.z += dt * 0.5
      }

      // Update whirlwind spiral particles if active
      if (activeParticlesHook) {
        activeParticlesHook(dt)
      }

      // Soft glow intensity on hover
      const targetGlow = hovered ? 3.6 : 1.2
      hoverGlow.intensity += (targetGlow - hoverGlow.intensity) * 0.1

      // Subtle scale pulse on hover
      const targetScale = hovered ? 1.04 : 1.0
      relicContainer.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

      renderer.render(scene, camera)
    })

    // Store loadRelic on element for switching active index
    el.__loadRelic = loadRelic

    // 8. Cleanup & disposal
    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      ro.disconnect()
      dom.removeEventListener('pointermove', onPointerMove)
      dom.removeEventListener('pointerleave', onPointerLeave)
      controls.dispose()
      dracoLoader.dispose()

      if (currentRelicObj) disposeObject(currentRelicObj)
      if (fallbackObj) disposeObject(fallbackObj)
      disposeObject(scene)
      renderer.dispose()
      el.innerHTML = ''
    }
  }, [])

  // Trigger model switch when activeIdx changes
  useEffect(() => {
    if (mountRef.current?.__loadRelic) {
      mountRef.current.__loadRelic(activeIdx)
    }
  }, [activeIdx])

  return (
    <div className="symbolic-relics-showcase" aria-label="Interactive 3D Symbolic Relics">
      {/* 3D Viewport Header */}
      <div className="relics-header">
        <p className="eyebrow">GREAT BOOKS CULMINATING TASK · 3D SYMBOLIC RELICS</p>
        <h2 className="relics-headline">Relics of Myth &amp; Mind</h2>
        <p className="relics-sub">
          Explore the seven primary symbolic artifacts of each masterpiece. Every relic is scaled, centered,
          and rendered with physical materials. Hover to illuminate with soft celestial glow.
        </p>
      </div>

      {/* Relic Selector Tabs */}
      <nav className="relics-tabs" aria-label="Select a literary relic">
        {RELICS.map((relic, idx) => (
          <button
            key={relic.id}
            type="button"
            className={`relic-tab-btn ${activeIdx === idx ? 'is-active' : ''}`}
            onClick={() => setActiveIdx(idx)}
            aria-pressed={activeIdx === idx}
          >
            <span className="tab-num">0{idx + 1}</span>
            <span className="tab-name">{relic.work}</span>
          </button>
        ))}
      </nav>

      {/* 3D WebGL Canvas & Curatorial Placard */}
      <div className="relics-display-grid">
        <div className="relic-canvas-wrapper">
          <div ref={mountRef} className="relic-viewport" />
          {isLoading && (
            <div className="relic-loading-badge">
              <span className="loading-spinner" />
              <span>Loading 3D GLB Model...</span>
            </div>
          )}
          <div className={`relic-glow-indicator ${isHovered ? 'active' : ''}`}>
            ✦ Hover to illuminate · Drag to turn · Scroll to zoom
          </div>
        </div>

        {/* Curatorial Narrative Card */}
        <div className="relic-info-card">
          <div className="relic-badge-tag">
            <span>RELIC 0{activeIdx + 1}</span>
            <span className="relic-tag-sep">·</span>
            <span>{activeRelic.work}</span>
          </div>

          <h3 className="relic-title">{activeRelic.name}</h3>

          <div className="relic-object-detail">
            <span className="detail-label">OBJECT DESCRIPTION</span>
            <p className="detail-value">{activeRelic.object}</p>
          </div>

          <div className="relic-symbolism-detail">
            <span className="detail-label">WHAT IT SYMBOLIZES</span>
            <p className="detail-value">{activeRelic.symbolism}</p>
          </div>

          <div className="relic-provenance-footer">
            <span className="tech-chip">GLTF/DRACO 3D</span>
            <span className="tech-chip">{activeRelic.isParticleSystem ? 'PROCEDURAL PARTICLES' : 'PBR GLB ASSET'}</span>
            <span className="tech-chip">PBR REFLECTION</span>
          </div>
        </div>
      </div>
    </div>
  )
}
