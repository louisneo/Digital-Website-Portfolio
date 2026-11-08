// High-fidelity procedural 3D museum artifacts for Myth & Mind
// Modeled with rich PBR materials, historical accuracy, and particle effects
// Exact 7 objects from Great Books Final Project:
// 1. Job: Swirling whirlwind column with a broken clay shard at the base
// 2. Panchatantra: Five palm-leaf manuscripts tied together with cord
// 3. Ramayana: Rama's bow with an arrow
// 4. Mahabharata: A large chariot wheel (wheel of time & fate at Kurukshetra)
// 5. Iliad: The Shield of Achilles with concentric rings
// 6. Odyssey: A small wooden ship with a sail
// 7. Song of Roland: The olifant, an ivory war horn

const SUPPORTED_RELICS = [
  'Voice out of the Whirlwind',
  'The Panchatantra',
  'The Ramayana',
  'The Mahabharata',
  'The Iliad',
  'The Odyssey',
  'The Song of Roland',
]

function createMaterials(THREE) {
  return {
    gold: new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
    }),
    paleGold: new THREE.MeshPhysicalMaterial({
      color: 0xf3e5ab,
      metalness: 0.75,
      roughness: 0.28,
      clearcoat: 0.2,
    }),
    bronze: new THREE.MeshPhysicalMaterial({
      color: 0x9c5a2b,
      metalness: 0.82,
      roughness: 0.32,
      clearcoat: 0.25,
    }),
    darkBronze: new THREE.MeshStandardMaterial({
      color: 0x482813,
      metalness: 0.75,
      roughness: 0.42,
    }),
    silver: new THREE.MeshPhysicalMaterial({
      color: 0xd8dde2,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.4,
    }),
    iron: new THREE.MeshStandardMaterial({
      color: 0x3e4248,
      metalness: 0.88,
      roughness: 0.45,
    }),
    teakWood: new THREE.MeshPhysicalMaterial({
      color: 0x4a2810,
      metalness: 0.05,
      roughness: 0.55,
      clearcoat: 0.3,
    }),
    chariotWood: new THREE.MeshStandardMaterial({
      color: 0x5a341a,
      metalness: 0.04,
      roughness: 0.68,
    }),
    darkWood: new THREE.MeshStandardMaterial({
      color: 0x241208,
      metalness: 0.04,
      roughness: 0.68,
    }),
    leather: new THREE.MeshStandardMaterial({
      color: 0x542618,
      metalness: 0.02,
      roughness: 0.75,
    }),
    agedIvory: new THREE.MeshPhysicalMaterial({
      color: 0xebdcc0,
      metalness: 0.04,
      roughness: 0.28,
      clearcoat: 0.25,
      clearcoatRoughness: 0.2,
    }),
    palmLeaf: new THREE.MeshStandardMaterial({
      color: 0xc49e62,
      metalness: 0.02,
      roughness: 0.82,
    }),
    palmLeafAged: new THREE.MeshStandardMaterial({
      color: 0x9e7a44,
      metalness: 0.02,
      roughness: 0.88,
    }),
    crimsonSilk: new THREE.MeshStandardMaterial({
      color: 0x8f191b,
      metalness: 0.15,
      roughness: 0.52,
    }),
    terracottaShard: new THREE.MeshStandardMaterial({
      color: 0xb55a36,
      metalness: 0.02,
      roughness: 0.88,
    }),
    linenSail: new THREE.MeshStandardMaterial({
      color: 0xf4eee2,
      metalness: 0.02,
      roughness: 0.78,
      side: THREE.DoubleSide,
    }),
    peacockBlue: new THREE.MeshPhysicalMaterial({
      color: 0x125873,
      metalness: 0.45,
      roughness: 0.3,
      clearcoat: 0.5,
    }),
    peacockGreen: new THREE.MeshPhysicalMaterial({
      color: 0x1b6942,
      metalness: 0.4,
      roughness: 0.3,
      clearcoat: 0.5,
    }),
    stormDark: new THREE.MeshPhysicalMaterial({
      color: 0x22242a,
      metalness: 0.15,
      roughness: 0.72,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
    stormMid: new THREE.MeshPhysicalMaterial({
      color: 0x3d414a,
      metalness: 0.1,
      roughness: 0.65,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    }),
    lightning: new THREE.MeshBasicMaterial({
      color: 0xfff6cf,
    }),
    cypressPlank: new THREE.MeshStandardMaterial({
      color: 0x5a3c26,
      metalness: 0.06,
      roughness: 0.62,
    }),
    lapisBlue: new THREE.MeshPhysicalMaterial({
      color: 0x193b68,
      metalness: 0.2,
      roughness: 0.4,
      clearcoat: 0.3,
    }),
    chalkWhite: new THREE.MeshStandardMaterial({
      color: 0xf0ece1,
      metalness: 0.02,
      roughness: 0.85,
    }),
  }
}

function mesh(THREE, geometry, material, name) {
  const result = new THREE.Mesh(geometry, material)
  if (name) result.name = name
  result.castShadow = true
  result.receiveShadow = true
  return result
}

function tube(THREE, points, radius, material, name, tubularSegments = 64, radialSegments = 12) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(...p)),
    false,
    'centripetal'
  )
  return mesh(THREE, new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false), material, name)
}

function cylinderBetween(THREE, start, end, startRadius, endRadius, material, name, radialSegments = 16) {
  const a = new THREE.Vector3(...start)
  const b = new THREE.Vector3(...end)
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const m = mesh(THREE, new THREE.CylinderGeometry(endRadius, startRadius, len, radialSegments, 1, false), material, name)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return m
}

// -------------------------------------------------------------
// 1. VOICE OUT OF THE WHIRLWIND (Book of Job)
// A swirling whirlwind column with a broken clay shard at the base
// -------------------------------------------------------------
function buildWhirlwind(THREE, mat) {
  const model = new THREE.Group()
  const motion = new THREE.Group()
  motion.name = 'whirlwind-motion'
  motion.userData.motion = { type: 'spin', axis: 'y', speed: 0.45 }
  model.add(motion)

  // 1. Funnel Spiral Mesh: Multi-layered dark storm clouds funneling down
  const rings = 14
  for (let i = 0; i < rings; i++) {
    const p = i / (rings - 1)
    const y = -0.32 + p * 0.82
    const radius = 0.045 + Math.pow(p, 1.45) * 0.42
    const thickness = 0.016 + p * 0.024
    const torus = mesh(
      THREE,
      new THREE.TorusGeometry(radius, thickness, 10, 48),
      p > 0.65 ? mat.stormDark : (p > 0.3 ? mat.stormMid : mat.stormDark),
      `vortex-ring-${i}`
    )
    torus.rotation.x = Math.PI / 2 + Math.sin(i * 0.9) * 0.12
    torus.rotation.y = i * 0.4
    torus.position.set(Math.sin(p * Math.PI * 2.2) * 0.025, y, Math.cos(p * Math.PI * 2.2) * 0.025)
    motion.add(torus)
  }

  // 2. Billowing Storm Canopy at the top
  const canopyLobeCount = 9
  for (let i = 0; i < canopyLobeCount; i++) {
    const angle = (i / canopyLobeCount) * Math.PI * 2
    const r = 0.26 + (i % 2) * 0.08
    const cloudLobe = mesh(
      THREE,
      new THREE.SphereGeometry(0.12 + (i % 3) * 0.03, 16, 12),
      mat.stormDark,
      `canopy-lobe-${i}`
    )
    cloudLobe.scale.set(1.4, 0.7, 1.1)
    cloudLobe.position.set(Math.cos(angle) * r, 0.48 + Math.sin(i * 1.5) * 0.04, Math.sin(angle) * r)
    motion.add(cloudLobe)
  }

  // 3. Jagged lightning core descending through the funnel
  const lightningPoints = []
  let lx = 0, lz = 0
  const lSegments = 18
  for (let i = 0; i <= lSegments; i++) {
    const p = i / lSegments
    const ly = 0.5 - p * 0.84
    lx += (Math.random() - 0.5) * 0.06
    lz += (Math.random() - 0.5) * 0.06
    lightningPoints.push([lx, ly, lz])
  }
  const lightningTube = tube(THREE, lightningPoints, 0.009, mat.lightning, 'lightning-core', 54, 8)
  motion.add(lightningTube)

  // 4. Glowing Ember and Stardust Particle Cloud
  const particleCount = 130
  const pGeo = new THREE.BufferGeometry()
  const pPositions = new Float32Array(particleCount * 3)
  const pColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const p = Math.random()
    const y = -0.32 + p * 0.84
    const r = (0.05 + Math.pow(p, 1.3) * 0.44) * (0.8 + Math.random() * 0.4)
    const angle = Math.random() * Math.PI * 2
    pPositions[i * 3] = Math.cos(angle) * r
    pPositions[i * 3 + 1] = y
    pPositions[i * 3 + 2] = Math.sin(angle) * r

    const isHot = Math.random() > 0.4
    pColors[i * 3] = isHot ? 1.0 : 0.95
    pColors[i * 3 + 1] = isHot ? 0.78 : 0.45
    pColors[i * 3 + 2] = isHot ? 0.28 : 0.08
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

  const emberPoints = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
  )
  motion.add(emberPoints)

  // 5. THE BROKEN CLAY SHARD AT THE BASE (Job 2:8 - Sitting in ashes scraping with a potsherd)
  const shardGroup = new THREE.Group()
  shardGroup.name = 'broken-clay-shards'
  shardGroup.position.set(0, -0.42, 0)

  // Main curved pottery shard
  const mainShardGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.12, 16, 1, true, 0, Math.PI * 0.65)
  const mainShard = mesh(THREE, mainShardGeo, mat.terracottaShard, 'main-clay-shard')
  mainShard.rotation.set(0.65, 0.4, -0.2)
  mainShard.position.set(-0.06, 0.04, 0.05)
  shardGroup.add(mainShard)

  // Broken fragment pieces
  const frag1 = mesh(THREE, new THREE.BoxGeometry(0.1, 0.022, 0.07), mat.terracottaShard, 'shard-fragment-1')
  frag1.rotation.set(-0.2, 0.8, 0.1)
  frag1.position.set(0.12, 0.015, -0.04)
  shardGroup.add(frag1)

  const frag2 = mesh(THREE, new THREE.BoxGeometry(0.08, 0.018, 0.05), mat.terracottaShard, 'shard-fragment-2')
  frag2.rotation.set(0.1, -0.5, 0.3)
  frag2.position.set(0.08, 0.012, 0.12)
  shardGroup.add(frag2)

  // Ash mound bed beneath the shards
  const ashBed = mesh(THREE, new THREE.CylinderGeometry(0.28, 0.32, 0.03, 24), mat.darkWood, 'ash-mound-bed')
  ashBed.position.y = 0
  shardGroup.add(ashBed)

  model.add(shardGroup)
  return model
}

// -------------------------------------------------------------
// 2. THE PANCHATANTRA
// Five palm-leaf manuscripts tied together with cord
// ("Pancha" = five, for the five books of animal fables)
// -------------------------------------------------------------
function buildPanchatantra(THREE, mat) {
  const model = new THREE.Group()
  const motion = new THREE.Group()
  motion.name = 'panchatantra-motion'
  motion.userData.motion = { type: 'sway', axis: 'y', amount: 0.08, speed: 0.35 }
  model.add(motion)

  // Presentation plinth in dark carved teak
  const plinth = mesh(THREE, new THREE.BoxGeometry(0.72, 0.035, 0.32), mat.teakWood, 'manuscript-plinth')
  plinth.position.y = -0.16
  motion.add(plinth)

  // EXACTLY FIVE PALM-LEAF MANUSCRIPTS TIED TOGETHER
  const leafCount = 5
  for (let i = 0; i < leafCount; i++) {
    const leaf = mesh(
      THREE,
      new THREE.BoxGeometry(0.64, 0.011, 0.16),
      i % 2 === 0 ? mat.palmLeaf : mat.palmLeafAged,
      `five-palm-leaf-${i + 1}`
    )
    leaf.position.set((Math.random() - 0.5) * 0.008, -0.12 + i * 0.016, (Math.random() - 0.5) * 0.006)
    leaf.rotation.y = (i - 2) * 0.02
    motion.add(leaf)

    // Sanskrit inscription lines on visible open leaf
    if (i === leafCount - 1) {
      for (let line = 0; line < 4; line++) {
        const textLine = mesh(
          THREE,
          new THREE.BoxGeometry(0.54, 0.003, 0.012),
          mat.darkBronze,
          `sanskrit-line-${line}`
        )
        textLine.position.set(0, leaf.position.y + 0.008, -0.045 + line * 0.03)
        motion.add(textLine)
      }
    }
  }

  // Carved Teak Top Binding Board (Kamblika)
  const topCover = mesh(THREE, new THREE.BoxGeometry(0.66, 0.018, 0.175), mat.teakWood, 'teak-top-cover')
  topCover.position.set(0.03, 0.01, 0.08)
  topCover.rotation.set(-0.35, 0.12, -0.04)
  motion.add(topCover)

  // Brass corner brackets on carved cover
  ;[-0.31, 0.31].forEach((x, xi) => {
    ;[-0.075, 0.075].forEach((z, zi) => {
      const bracket = mesh(THREE, new THREE.BoxGeometry(0.045, 0.022, 0.045), mat.gold, `bracket-${xi}-${zi}`)
      bracket.position.set(x, topCover.position.y, z + 0.08)
      bracket.rotation.copy(topCover.rotation)
      motion.add(bracket)
    })
  })

  // Crimson braided silk binding cords tying the 5 manuscripts together
  ;[-0.18, 0.18].forEach((x, idx) => {
    const cord = tube(
      THREE,
      [[x, -0.14, 0], [x, 0.08, (idx ? 0.06 : -0.06)], [x + (idx ? 0.08 : -0.08), -0.12, 0.12]],
      0.007,
      mat.crimsonSilk,
      `binding-cord-${idx}`,
      24,
      8
    )
    motion.add(cord)

    const bead = mesh(THREE, new THREE.SphereGeometry(0.018, 14, 12), mat.gold, `cord-bead-${idx}`)
    bead.position.set(x + (idx ? 0.08 : -0.08), -0.12, 0.12)
    motion.add(bead)
  })

  // Antique brass ink pot and writing stylus (Salaka)
  const inkPot = mesh(THREE, new THREE.CylinderGeometry(0.042, 0.052, 0.09, 18), mat.bronze, 'brass-inkpot')
  inkPot.position.set(0.28, -0.11, -0.08)
  motion.add(inkPot)

  const stylus = cylinderBetween(THREE, [0.18, -0.13, 0.12], [0.34, 0.02, -0.04], 0.005, 0.002, mat.bronze, 'iron-stylus')
  motion.add(stylus)

  return model
}

// -------------------------------------------------------------
// 3. THE RAMAYANA
// Rama's bow with an arrow (The Kodanda)
// Symbol of Dharma, duty, and righteous kingship
// -------------------------------------------------------------
// -------------------------------------------------------------
// 3. THE RAMAYANA
// Rama's Kodanda Bow, Celestial Arrow, and Sacred Paduka Sandals
// Symbol of Dharma, duty, righteous kingship, and selfless devotion
// -------------------------------------------------------------
function buildRamayana(THREE, mat) {
  const model = new THREE.Group()
  const displayGrp = new THREE.Group()
  displayGrp.name = 'ramayana-exhibition-ensemble'
  displayGrp.userData.motion = { type: 'sway', axis: 'y', amount: 0.08, speed: 0.35 }
  model.add(displayGrp)

  // 1. Classical Museum Presentation Stand (Carved Mysore Rosewood & Velvet Pad)
  const standBase = mesh(
    THREE,
    new THREE.BoxGeometry(0.74, 0.035, 0.34),
    mat.darkWood,
    'rosewood-stand-base'
  )
  standBase.position.y = -0.22
  displayGrp.add(standBase)

  const velvetCushion = mesh(
    THREE,
    new THREE.BoxGeometry(0.68, 0.018, 0.28),
    mat.crimsonSilk,
    'velvet-cushion-pad'
  )
  velvetCushion.position.y = -0.195
  displayGrp.add(velvetCushion)

  // Gold inlay fillet border
  const borderFrame = mesh(
    THREE,
    new THREE.BoxGeometry(0.70, 0.006, 0.30),
    mat.gold,
    'stand-gold-fillet'
  )
  borderFrame.position.y = -0.185
  displayGrp.add(borderFrame)

  // Twin Polished Brass Weapon Cradle Pillars to hold the Kodanda Bow horizontally
  ;[-0.22, 0.22].forEach((px, idx) => {
    // Vertical riser pillar
    const pillar = mesh(
      THREE,
      new THREE.CylinderGeometry(0.014, 0.018, 0.24, 16),
      mat.gold,
      `bow-riser-pillar-${idx}`
    )
    pillar.position.set(px, -0.07, -0.02)
    displayGrp.add(pillar)

    // Base ring
    const pBase = mesh(
      THREE,
      new THREE.CylinderGeometry(0.028, 0.032, 0.02, 16),
      mat.gold,
      `pillar-base-${idx}`
    )
    pBase.position.set(px, -0.18, -0.02)
    displayGrp.add(pBase)

    // U-shaped brass cradle fork for bow
    const cradleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(px - 0.028, 0.08, -0.02),
      new THREE.Vector3(px - 0.022, 0.05, -0.02),
      new THREE.Vector3(px, 0.045, -0.02),
      new THREE.Vector3(px + 0.022, 0.05, -0.02),
      new THREE.Vector3(px + 0.028, 0.08, -0.02),
    ])
    const cradleFork = new THREE.Mesh(
      new THREE.TubeGeometry(cradleCurve, 16, 0.008, 8, false),
      mat.gold
    )
    displayGrp.add(cradleFork)

    // Forward brass cradle fork for the Surya arrow
    const arrowPillar = mesh(
      THREE,
      new THREE.CylinderGeometry(0.009, 0.012, 0.09, 12),
      mat.gold,
      `arrow-pillar-${idx}`
    )
    arrowPillar.position.set(px, -0.14, 0.09)
    displayGrp.add(arrowPillar)

    const arrowForkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(px - 0.016, -0.08, 0.09),
      new THREE.Vector3(px, -0.095, 0.09),
      new THREE.Vector3(px + 0.016, -0.08, 0.09),
    ])
    const arrowFork = new THREE.Mesh(
      new THREE.TubeGeometry(arrowForkCurve, 12, 0.005, 8, false),
      mat.gold
    )
    displayGrp.add(arrowFork)
  })

  // 2. The Kodanda Recurve Bow (Masterfully arched horizontally across the twin pillars)
  const bowGrp = new THREE.Group()
  bowGrp.position.set(0, 0.05, -0.02)

  // Classical recurve double-curved composite stave points
  const bowCurvePoints = [
    [-0.46, 0.04, -0.02], // Left tip nock
    [-0.42, 0.09, -0.01],
    [-0.34, 0.14, 0.01],  // Left limb crest
    [-0.20, 0.09, 0.01],
    [-0.06, 0.02, 0.0],   // Approach handle
    [0.0, 0.01, 0.0],     // Riser center
    [0.06, 0.02, 0.0],
    [0.20, 0.09, 0.01],
    [0.34, 0.14, 0.01],   // Right limb crest
    [0.42, 0.09, -0.01],
    [0.46, 0.04, -0.02],  // Right tip nock
  ]
  const bowPath = new THREE.CatmullRomCurve3(
    bowCurvePoints.map(([x, y, z]) => new THREE.Vector3(x, y, z))
  )

  // Gold belly inlay
  const bowMesh = new THREE.Mesh(
    new THREE.TubeGeometry(bowPath, 72, 0.018, 12, false),
    mat.gold
  )
  bowGrp.add(bowMesh)

  // Polished teak/rosewood core backing
  const backingPath = new THREE.CatmullRomCurve3(
    bowCurvePoints.map(([x, y, z]) => new THREE.Vector3(x, y - 0.007, z - 0.008))
  )
  const backingMesh = new THREE.Mesh(
    new THREE.TubeGeometry(backingPath, 72, 0.014, 10, false),
    mat.teakWood
  )
  bowGrp.add(backingMesh)

  // Makara scroll tip finials at both ends (with delicate gem inserts)
  ;[-0.46, 0.46].forEach((tx, idx) => {
    const tipFinial = mesh(
      THREE,
      new THREE.SphereGeometry(0.022, 14, 12),
      mat.gold,
      `bow-tip-${idx}`
    )
    tipFinial.position.set(tx, 0.04, -0.02)
    tipFinial.scale.set(1.4, 0.8, 0.8)
    bowGrp.add(tipFinial)

    const tipBead = mesh(
      THREE,
      new THREE.SphereGeometry(0.008, 10, 8),
      mat.peacockBlue,
      `tip-gem-${idx}`
    )
    tipBead.position.set(tx + (idx === 0 ? -0.01 : 0.01), 0.04, -0.02)
    bowGrp.add(tipBead)
  })

  // Taut Celestial Bowstring running tip-to-tip
  const stringCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.46, 0.04, -0.02),
    new THREE.Vector3(0.0, -0.04, -0.015),
    new THREE.Vector3(0.46, 0.04, -0.02),
  ])
  const bowString = new THREE.Mesh(
    new THREE.TubeGeometry(stringCurve, 40, 0.0035, 8, false),
    mat.paleGold
  )
  bowGrp.add(bowString)

  // Embroidered Crimson Silk Velvet Handle Grip
  const handleGrip = mesh(
    THREE,
    new THREE.CylinderGeometry(0.025, 0.025, 0.12, 16),
    mat.crimsonSilk,
    'kodanda-handle-grip'
  )
  handleGrip.rotation.z = Math.PI / 2
  handleGrip.position.set(0, 0.01, 0)
  bowGrp.add(handleGrip)

  // Gold wire whipping rings on handle
  ;[-0.05, -0.025, 0, 0.025, 0.05].forEach((gx, idx) => {
    const gRing = mesh(
      THREE,
      new THREE.TorusGeometry(0.026, 0.0035, 8, 20),
      mat.gold,
      `grip-wire-ring-${idx}`
    )
    gRing.position.set(gx, 0.01, 0)
    gRing.rotation.y = Math.PI / 2
    bowGrp.add(gRing)
  })

  displayGrp.add(bowGrp)

  // 3. The Sacred Surya Celestial Arrow (resting horizontally on forward brass cradle forks)
  const arrowGrp = new THREE.Group()
  arrowGrp.position.set(0, -0.09, 0.09)

  // Polished dark reed shaft
  const arrowShaft = mesh(
    THREE,
    new THREE.CylinderGeometry(0.006, 0.006, 0.68, 12),
    mat.darkWood,
    'surya-arrow-shaft'
  )
  arrowShaft.rotation.z = Math.PI / 2
  arrowGrp.add(arrowShaft)

  // Chased golden broadhead arrowhead
  const arrowHead = mesh(
    THREE,
    new THREE.ConeGeometry(0.022, 0.11, 4),
    mat.gold,
    'surya-arrow-head'
  )
  arrowHead.position.set(0.39, 0, 0)
  arrowHead.rotation.z = -Math.PI / 2
  arrowHead.scale.set(1.5, 1.0, 0.35)
  arrowGrp.add(arrowHead)

  // Gold ferrule ring
  const arrowFerrule = mesh(
    THREE,
    new THREE.CylinderGeometry(0.008, 0.008, 0.03, 12),
    mat.gold,
    'arrow-ferrule'
  )
  arrowFerrule.rotation.z = Math.PI / 2
  arrowFerrule.position.set(0.33, 0, 0)
  arrowGrp.add(arrowFerrule)

  // Four authentic peacock feather fletchings at nock
  ;[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((fAng, fIdx) => {
    const fletch = mesh(
      THREE,
      new THREE.BoxGeometry(0.09, 0.018, 0.002),
      fIdx % 2 ? mat.peacockBlue : mat.peacockGreen,
      `peacock-fletching-${fIdx}`
    )
    fletch.position.set(-0.27, Math.sin(fAng) * 0.014, Math.cos(fAng) * 0.014)
    fletch.rotation.x = fAng
    arrowGrp.add(fletch)
  })

  // Aged ivory nock
  const arrowNock = mesh(
    THREE,
    new THREE.CylinderGeometry(0.007, 0.007, 0.02, 10),
    mat.agedIvory,
    'arrow-nock'
  )
  arrowNock.rotation.z = Math.PI / 2
  arrowNock.position.set(-0.34, 0, 0)
  arrowGrp.add(arrowNock)

  displayGrp.add(arrowGrp)

  // 4. Sacred Wooden Paduka Sandals of Lord Rama (Syllabus performance task item)
  const padukaGrp = new THREE.Group()
  padukaGrp.position.set(0, -0.175, 0.02)

  ;[-0.055, 0.055].forEach((sx, idx) => {
    const sandal = new THREE.Group()
    sandal.position.set(sx, 0, 0)

    const sole = mesh(
      THREE,
      new THREE.BoxGeometry(0.065, 0.016, 0.15),
      mat.teakWood,
      `paduka-sole-${idx}`
    )
    sandal.add(sole)

    const pegStem = mesh(
      THREE,
      new THREE.CylinderGeometry(0.004, 0.004, 0.025, 10),
      mat.gold,
      `peg-stem-${idx}`
    )
    pegStem.position.set(0, 0.018, -0.045)
    sandal.add(pegStem)

    const pegKnob = mesh(
      THREE,
      new THREE.SphereGeometry(0.012, 12, 10),
      mat.gold,
      `peg-knob-${idx}`
    )
    pegKnob.position.set(0, 0.03, -0.045)
    sandal.add(pegKnob)

    padukaGrp.add(sandal)
  })

  displayGrp.add(padukaGrp)

  return model
}

// -------------------------------------------------------------
// 4. THE MAHABHARATA
// A large chariot wheel (The wheel of time and fate at Kurukshetra)
// -------------------------------------------------------------
function buildMahabharata(THREE, mat) {
  const model = new THREE.Group()
  const wheel = new THREE.Group()
  wheel.name = 'chariot-wheel'
  wheel.userData.motion = { type: 'spin', axis: 'z', speed: 0.22 }
  model.add(wheel)

  // 1. Heavy Outer Wooden Felloes & Riveted Iron Tire Rim
  const wheelRadius = 0.42
  const rimTorus = mesh(THREE, new THREE.TorusGeometry(wheelRadius, 0.034, 16, 64), mat.chariotWood, 'wheel-felloe-rim')
  wheel.add(rimTorus)

  // Iron tire band on outer circumference
  const ironTire = mesh(THREE, new THREE.TorusGeometry(wheelRadius + 0.024, 0.014, 12, 64), mat.iron, 'wheel-iron-tire')
  wheel.add(ironTire)

  // Bronze tire studs / rivets along the circumference
  const studCount = 24
  for (let i = 0; i < studCount; i++) {
    const angle = (i / studCount) * Math.PI * 2
    const stud = mesh(THREE, new THREE.SphereGeometry(0.012, 8, 8), mat.bronze, `wheel-stud-${i}`)
    stud.position.set(Math.cos(angle) * (wheelRadius + 0.025), Math.sin(angle) * (wheelRadius + 0.025), 0)
    wheel.add(stud)
  }

  // 2. Central Massive Hub (Nave) with Bronze Bands & Axle Spindle
  const hubCore = mesh(THREE, new THREE.CylinderGeometry(0.09, 0.09, 0.16, 28), mat.chariotWood, 'hub-wood-core')
  hubCore.rotation.x = Math.PI / 2
  wheel.add(hubCore)

  const hubBandF = mesh(THREE, new THREE.TorusGeometry(0.088, 0.012, 10, 32), mat.bronze, 'hub-bronze-front')
  hubBandF.position.z = 0.06
  wheel.add(hubBandF)

  const hubBandB = mesh(THREE, new THREE.TorusGeometry(0.088, 0.012, 10, 32), mat.bronze, 'hub-bronze-back')
  hubBandB.position.z = -0.06
  wheel.add(hubBandB)

  // Axle pin protruding through the center
  const axlePin = mesh(THREE, new THREE.CylinderGeometry(0.038, 0.038, 0.24, 18), mat.iron, 'chariot-axle-spindle')
  axlePin.rotation.x = Math.PI / 2
  wheel.add(axlePin)

  // 3. Sixteen Carved Ashwood Spokes Radiating from Hub to Rim
  const spokeCount = 16
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2
    const spoke = cylinderBetween(
      THREE,
      [Math.cos(angle) * 0.085, Math.sin(angle) * 0.085, 0],
      [Math.cos(angle) * (wheelRadius - 0.02), Math.sin(angle) * (wheelRadius - 0.02), 0],
      0.016,
      0.013,
      i % 2 === 0 ? mat.chariotWood : mat.teakWood,
      `chariot-spoke-${i}`,
      10
    )
    wheel.add(spoke)
  }

  // 4. Bronze support cradle for museum presentation
  const stand = new THREE.Group()
  stand.name = 'chariot-wheel-stand'
  stand.add(cylinderBetween(THREE, [-0.18, -0.46, 0.12], [-0.08, -0.22, 0], 0.014, 0.014, mat.darkBronze, 'stand-l'))
  stand.add(cylinderBetween(THREE, [0.18, -0.46, 0.12], [0.08, -0.22, 0], 0.014, 0.014, mat.darkBronze, 'stand-r'))
  stand.add(cylinderBetween(THREE, [0, -0.46, -0.16], [0, -0.22, 0], 0.014, 0.014, mat.darkBronze, 'stand-b'))
  model.add(stand)

  return model
}

// -------------------------------------------------------------
// 5. THE ILIAD
// The Shield of Achilles with concentric rings
// War and peace together, the whole world, hero's glory and price
// -------------------------------------------------------------
function buildIliad(THREE, mat) {
  const model = new THREE.Group()
  const shield = new THREE.Group()
  shield.name = 'achilles-shield'
  shield.userData.motion = { type: 'sway', axis: 'y', amount: 0.14, speed: 0.3 }
  model.add(shield)

  // 1. Deep Hammered Bronze Roundel Body
  const shieldBody = mesh(THREE, new THREE.SphereGeometry(0.42, 64, 32), mat.bronze, 'shield-body')
  shieldBody.scale.set(1, 1, 0.16)
  shield.add(shieldBody)

  // 2. Concentric Rings
  const rings = [
    { r: 0.415, th: 0.024, m: mat.gold, name: 'ocean-stream-rim' },
    { r: 0.33, th: 0.016, m: mat.silver, name: 'pastoral-fields-ring' },
    { r: 0.23, th: 0.014, m: mat.bronze, name: 'two-cities-ring' },
    { r: 0.14, th: 0.012, m: mat.paleGold, name: 'constellation-ring' },
  ]
  rings.forEach(({ r, th, m, name }, i) => {
    const ring = mesh(THREE, new THREE.TorusGeometry(r, th, 12, 64), m, name)
    ring.position.z = 0.065 - i * 0.005
    shield.add(ring)
  })

  // 3. Central Gilded Sun Boss with Constellation Stars
  const sunBoss = mesh(THREE, new THREE.SphereGeometry(0.09, 32, 16), mat.gold, 'sun-boss')
  sunBoss.scale.set(1, 1, 0.7)
  sunBoss.position.z = 0.08
  shield.add(sunBoss)

  const starCoords = [
    [-0.04, 0.05], [0.03, 0.06], [-0.02, 0.08], [0.05, 0.03],
    [-0.06, -0.04], [0.04, -0.05], [0, -0.07],
  ]
  starCoords.forEach(([x, y], i) => {
    const star = mesh(THREE, new THREE.SphereGeometry(0.009, 10, 8), mat.silver, `star-${i}`)
    star.position.set(x, y, 0.12)
    shield.add(star)
  })

  // 4. Wave Frieze Studs on the Ocean Rim
  const studCount = 32
  for (let i = 0; i < studCount; i++) {
    const angle = (i / studCount) * Math.PI * 2
    const stud = mesh(THREE, new THREE.SphereGeometry(0.012, 12, 8), i % 2 ? mat.silver : mat.gold, `ocean-stud-${i}`)
    stud.position.set(Math.cos(angle) * 0.395, Math.sin(angle) * 0.395, 0.068)
    shield.add(stud)
  }

  // 5. Museum Bronze Easel Stand
  const easel = new THREE.Group()
  easel.name = 'museum-easel'
  easel.add(cylinderBetween(THREE, [-0.22, -0.42, 0.12], [-0.18, 0.15, -0.05], 0.012, 0.012, mat.darkBronze, 'easel-leg-l'))
  easel.add(cylinderBetween(THREE, [0.22, -0.42, 0.12], [0.18, 0.15, -0.05], 0.012, 0.012, mat.darkBronze, 'easel-leg-r'))
  easel.add(cylinderBetween(THREE, [0, -0.42, -0.22], [0, 0.18, -0.08], 0.012, 0.012, mat.darkBronze, 'easel-leg-back'))
  model.add(easel)

  return model
}

// -------------------------------------------------------------
// 6. THE ODYSSEY
// A small wooden ship with a sail
// The long journey home, cleverness, and perseverance
// -------------------------------------------------------------
function buildOdyssey(THREE, mat) {
  const model = new THREE.Group()
  const ship = new THREE.Group()
  ship.name = 'odysseus-ship-with-sail'
  ship.userData.motion = { type: 'sway', axis: 'y', amount: 0.12, speed: 0.35 }
  model.add(ship)

  // 1. Curved Stem-Post & Cypress Planking Hull
  const stemPoints = [
    [-0.32, -0.24, 0],
    [-0.18, -0.20, 0],
    [0.02, -0.10, 0],
    [0.18, 0.04, 0],
    [0.28, 0.18, 0],
    [0.32, 0.32, 0],
    [0.26, 0.38, 0],
  ]
  ship.add(tube(THREE, stemPoints, 0.032, mat.cypressPlank, 'stem-post', 64, 12))

  for (let plank = 0; plank < 5; plank++) {
    const p = plank / 4
    const portPoints = stemPoints.map(([x, y, z]) => [
      x - 0.04 - p * 0.08,
      y + (plank % 2 ? 0.01 : 0),
      z + 0.04 + p * 0.14,
    ])
    ship.add(tube(THREE, portPoints, 0.02, mat.cypressPlank, `port-plank-${plank}`, 48, 8))

    const stbdPoints = stemPoints.map(([x, y, z]) => [
      x - 0.04 - p * 0.08,
      y + (plank % 2 ? 0.01 : 0),
      z - 0.04 - p * 0.14,
    ])
    ship.add(tube(THREE, stbdPoints, 0.02, mat.cypressPlank, `stbd-plank-${plank}`, 48, 8))
  }

  // 2. Three-bladed bronze ram at the waterline
  const ramCore = mesh(THREE, new THREE.ConeGeometry(0.06, 0.2, 3), mat.bronze, 'bronze-ram')
  ramCore.position.set(-0.4, -0.24, 0)
  ramCore.rotation.z = Math.PI / 2
  ship.add(ramCore)

  // 3. Painted Apotropaic Eye against sea monsters
  ;[-1, 1].forEach((side, i) => {
    const eyeSocket = mesh(THREE, new THREE.SphereGeometry(0.035, 18, 12), mat.chalkWhite, `eye-white-${i}`)
    eyeSocket.scale.set(1.4, 0.8, 0.3)
    eyeSocket.position.set(0.12, 0.04, side * 0.11)
    ship.add(eyeSocket)

    const iris = mesh(THREE, new THREE.SphereGeometry(0.02, 16, 10), mat.lapisBlue, `eye-iris-${i}`)
    iris.scale.set(1, 1, 0.4)
    iris.position.set(0.12, 0.04, side * 0.122)
    ship.add(iris)

    const pupil = mesh(THREE, new THREE.SphereGeometry(0.01, 12, 8), mat.darkWood, `eye-pupil-${i}`)
    pupil.position.set(0.12, 0.04, side * 0.13)
    ship.add(pupil)
  })

  // 4. THE MAST & HOISTED LINEN SAIL
  const mast = cylinderBetween(THREE, [-0.04, -0.15, 0], [-0.04, 0.44, 0], 0.016, 0.012, mat.darkWood, 'ship-mast')
  ship.add(mast)

  const yardArm = cylinderBetween(THREE, [-0.04, 0.38, -0.26], [-0.04, 0.38, 0.26], 0.011, 0.011, mat.darkWood, 'ship-yardarm')
  ship.add(yardArm)

  // Billowed woven linen sail catching the wind
  const sailShape = new THREE.Shape()
  sailShape.moveTo(-0.25, 0.36)
  sailShape.quadraticCurveTo(0, 0.38, 0.25, 0.36)
  sailShape.lineTo(0.23, -0.05)
  sailShape.quadraticCurveTo(0, -0.08, -0.23, -0.05)
  sailShape.lineTo(-0.25, 0.36)

  const sailGeo = new THREE.ShapeGeometry(sailShape, 18)
  const sailMesh = mesh(THREE, sailGeo, mat.linenSail, 'homeric-linen-sail')
  sailMesh.rotation.y = Math.PI / 2
  sailMesh.position.set(-0.06, 0, 0)
  ship.add(sailMesh)

  // Rigging ropes (stays and braces)
  ship.add(tube(THREE, [[-0.04, 0.42, 0], [0.22, 0.18, 0]], 0.004, mat.leather, 'forestay', 16, 6))
  ship.add(tube(THREE, [[-0.04, 0.42, 0], [-0.28, -0.12, 0]], 0.004, mat.leather, 'backstay', 16, 6))

  return model
}

// -------------------------------------------------------------
// 7. THE SONG OF ROLAND
// The olifant, an ivory war horn (Pride, honor, and sacrifice)
// -------------------------------------------------------------
function buildRoland(THREE, mat) {
  const model = new THREE.Group()
  const horn = new THREE.Group()
  horn.name = 'roland-oliphant'
  horn.userData.motion = { type: 'sway', axis: 'y', amount: 0.12, speed: 0.32 }
  horn.rotation.z = -0.08
  model.add(horn)

  // 1. Natural Curved Elephant Tusk Contour
  const points = [
    [-0.38, -0.22, 0.08],
    [-0.30, -0.11, 0.04],
    [-0.21, 0.02, 0.01],
    [-0.08, 0.14, -0.01],
    [0.06, 0.22, 0],
    [0.22, 0.26, 0.02],
    [0.36, 0.22, 0.05],
  ].map(p => new THREE.Vector3(...p))

  for (let i = 0; i < points.length - 1; i++) {
    const p = i / (points.length - 2)
    const rStart = 0.105 - p * 0.068
    const rEnd = 0.105 - ((i + 1) / (points.length - 1)) * 0.068
    horn.add(
      cylinderBetween(
        THREE,
        points[i].toArray(),
        points[i + 1].toArray(),
        rStart,
        Math.max(rEnd, 0.028),
        mat.agedIvory,
        `ivory-segment-${i}`,
        24
      )
    )
  }

  // 2. Flared Scalloped Horn Bell
  const bellTangent = new THREE.Vector3().subVectors(points[0], points[1]).normalize()
  const bellRim = mesh(THREE, new THREE.TorusGeometry(0.118, 0.022, 14, 48), mat.gold, 'oliphant-bell-rim')
  orientAxisTo(THREE, bellRim, bellTangent, new THREE.Vector3(0, 0, 1))
  bellRim.position.copy(points[0]).addScaledVector(bellTangent, 0.014)
  horn.add(bellRim)

  const bellHollow = mesh(THREE, new THREE.CircleGeometry(0.096, 32), mat.darkWood, 'oliphant-bell-hollow')
  orientAxisTo(THREE, bellHollow, bellTangent, new THREE.Vector3(0, 0, 1))
  bellHollow.position.copy(points[0]).addScaledVector(bellTangent, 0.016)
  horn.add(bellHollow)

  // 3. Polished Ivory Mouthpiece
  const mouthTangent = new THREE.Vector3().subVectors(points.at(-1), points.at(-2)).normalize()
  const mouthpiece = mesh(THREE, new THREE.TorusGeometry(0.036, 0.012, 12, 28), mat.gold, 'oliphant-mouthpiece')
  orientAxisTo(THREE, mouthpiece, mouthTangent, new THREE.Vector3(0, 0, 1))
  mouthpiece.position.copy(points.at(-1)).addScaledVector(mouthTangent, 0.01)
  horn.add(mouthpiece)

  // 4. Four Chased Brass Repoussé Mounting Bands with Suspension Loops
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  ;[0.2, 0.45, 0.7, 0.9].forEach((prog, idx) => {
    const pt = curve.getPoint(prog)
    const tang = curve.getTangent(prog)
    const bandR = 0.105 - prog * 0.068
    const band = mesh(THREE, new THREE.TorusGeometry(bandR, 0.012, 10, 36), mat.gold, `brass-band-${idx}`)
    orientAxisTo(THREE, band, tang, new THREE.Vector3(0, 0, 1))
    band.position.copy(pt)
    horn.add(band)

    const loop = mesh(THREE, new THREE.TorusGeometry(0.022, 0.005, 8, 20), mat.gold, `loop-${idx}`)
    loop.position.copy(pt).add(new THREE.Vector3(0, -bandR - 0.015, 0))
    horn.add(loop)
  })

  // 5. Braided Red Silk Carrying Baldric Strap
  const baldric = tube(
    THREE,
    [[-0.30, -0.14, 0.03], [-0.08, -0.36, -0.02], [0.22, 0.14, -0.01]],
    0.014,
    mat.crimsonSilk,
    'silk-baldric',
    48,
    8
  )
  horn.add(baldric)

  // Museum Bronze Cradle Stand
  const cradle = new THREE.Group()
  cradle.name = 'museum-cradle'
  cradle.add(cylinderBetween(THREE, [-0.22, -0.38, 0], [-0.22, -0.16, 0.04], 0.01, 0.01, mat.darkBronze, 'cradle-post-l'))
  cradle.add(cylinderBetween(THREE, [0.18, -0.38, 0], [0.18, 0.04, 0.02], 0.01, 0.01, mat.darkBronze, 'cradle-post-r'))
  model.add(cradle)

  return model
}

function orientAxisTo(THREE, object, direction, sourceAxis = new THREE.Vector3(0, 1, 0)) {
  object.quaternion.setFromUnitVectors(sourceAxis, direction.clone().normalize())
  return object
}

const BUILDERS = {
  'Voice out of the Whirlwind': buildWhirlwind,
  'The Panchatantra': buildPanchatantra,
  'The Ramayana': buildRamayana,
  'The Mahabharata': buildMahabharata,
  'The Iliad': buildIliad,
  'The Odyssey': buildOdyssey,
  'The Song of Roland': buildRoland,
}

export function createRelicModel(THREE, title) {
  const builder = BUILDERS[title]
  if (!builder) {
    throw new RangeError(`Unknown relic title "${title}". Expected one of: ${SUPPORTED_RELICS.join(', ')}`)
  }

  const root = new THREE.Group()
  root.name = `relic-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
  root.userData.relicTitle = title

  const normalization = new THREE.Group()
  normalization.name = 'relic-normalization'
  const model = builder(THREE, createMaterials(THREE))
  normalization.add(model)
  root.add(normalization)

  model.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(model)
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const largestDimension = Math.max(size.x, size.y, size.z) || 1
  model.position.sub(center)
  normalization.scale.setScalar(0.92 / largestDimension)

  root.traverse(object => {
    if (!object.isMesh && !object.isPoints) return
    object.castShadow = true
    object.receiveShadow = true
  })
  return root
}

export { SUPPORTED_RELICS }
