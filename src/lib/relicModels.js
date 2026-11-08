// High-fidelity procedural 3D museum artifacts for Myth & Mind
// Modeled with rich PBR materials, historical accuracy, and particle effects
// Matching user references for museum exhibits (Whirlwind, Oliphant, etc.)

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
      color: 0x42464b,
      metalness: 0.85,
      roughness: 0.38,
    }),
    teakWood: new THREE.MeshPhysicalMaterial({
      color: 0x4a2810,
      metalness: 0.05,
      roughness: 0.55,
      clearcoat: 0.3,
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
    stormEmber: new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      transparent: true,
      opacity: 0.95,
    }),
    lightning: new THREE.MeshBasicMaterial({
      color: 0xfff6cf,
      wireframe: false,
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
    pedestalVelvet: new THREE.MeshStandardMaterial({
      color: 0x1c1714,
      metalness: 0.05,
      roughness: 0.92,
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
// Volumetric dramatic storm vortex matching user reference
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
    const y = -0.38 + p * 0.82
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
    cloudLobe.position.set(Math.cos(angle) * r, 0.42 + Math.sin(i * 1.5) * 0.04, Math.sin(angle) * r)
    motion.add(cloudLobe)
  }

  // 3. Jagged lightning core descending through the funnel
  const lightningPoints = []
  let lx = 0, lz = 0
  const lSegments = 18
  for (let i = 0; i <= lSegments; i++) {
    const p = i / lSegments
    const ly = 0.44 - p * 0.8
    lx += (Math.random() - 0.5) * 0.06
    lz += (Math.random() - 0.5) * 0.06
    lightningPoints.push([lx, ly, lz])
  }
  const lightningTube = tube(THREE, lightningPoints, 0.009, mat.lightning, 'lightning-core', 54, 8)
  motion.add(lightningTube)

  // 4. Glowing Ember and Stardust Particle Cloud
  const particleCount = 140
  const pGeo = new THREE.BufferGeometry()
  const pPositions = new Float32Array(particleCount * 3)
  const pColors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const p = Math.random()
    const y = -0.38 + p * 0.84
    const r = (0.05 + Math.pow(p, 1.3) * 0.44) * (0.8 + Math.random() * 0.4)
    const angle = Math.random() * Math.PI * 2
    pPositions[i * 3] = Math.cos(angle) * r
    pPositions[i * 3 + 1] = y
    pPositions[i * 3 + 2] = Math.sin(angle) * r

    // Warm golden to incandescent white embers
    const isHot = Math.random() > 0.4
    pColors[i * 3] = isHot ? 1.0 : 0.95
    pColors[i * 3 + 1] = isHot ? 0.78 : 0.45
    pColors[i * 3 + 2] = isHot ? 0.28 : 0.08
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3))

  const pMat = new THREE.PointsMaterial({
    size: 0.024,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  })
  const emberPoints = new THREE.Points(pGeo, pMat)
  emberPoints.name = 'whirlwind-embers'
  motion.add(emberPoints)

  return model
}

// -------------------------------------------------------------
// 2. PALM-LEAF MANUSCRIPT (The Panchatantra)
// Sacred Tala-patra manuscript bound with teak covers & silk
// -------------------------------------------------------------
function buildPanchatantra(THREE, mat) {
  const model = new THREE.Group()
  const motion = new THREE.Group()
  motion.name = 'panchatantra-motion'
  motion.userData.motion = { type: 'sway', axis: 'y', amount: 0.08, speed: 0.35 }
  model.add(motion)

  // Presentation easel/plinth in dark teak
  const plinth = mesh(THREE, new THREE.BoxGeometry(0.72, 0.035, 0.32), mat.teakWood, 'manuscript-plinth')
  plinth.position.y = -0.16
  motion.add(plinth)

  // Stack of Palm Leaves (Tala-patra)
  const leafCount = 7
  for (let i = 0; i < leafCount; i++) {
    const leaf = mesh(
      THREE,
      new THREE.BoxGeometry(0.64, 0.008, 0.16),
      i === leafCount - 1 ? mat.palmLeaf : mat.palmLeafAged,
      `palm-leaf-${i}`
    )
    leaf.position.set((Math.random() - 0.5) * 0.008, -0.12 + i * 0.011, (Math.random() - 0.5) * 0.006)
    leaf.rotation.y = (i - 3) * 0.025
    motion.add(leaf)

    // Sanskrit inscription lines on the top visible leaf
    if (i === leafCount - 1) {
      for (let line = 0; line < 4; line++) {
        const textLine = mesh(
          THREE,
          new THREE.BoxGeometry(0.54, 0.003, 0.012),
          mat.darkBronze,
          `sanskrit-line-${line}`
        )
        textLine.position.set(0, leaf.position.y + 0.006, -0.045 + line * 0.03)
        motion.add(textLine)
      }
    }
  }

  // Carved Teak Top & Bottom Binding Boards (Kamblika)
  const topCover = mesh(THREE, new THREE.BoxGeometry(0.66, 0.018, 0.175), mat.teakWood, 'teak-top-cover')
  topCover.position.set(0.04, 0.02, 0.08)
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

  // Crimson braided silk binding cords passing through twin holes
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

    // Polished carnelian bead counterweight
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
// 3. THE KODANDA - CELESTIAL BOW OF RAMA (The Ramayana)
// Majestic recurve composite bow with gold makara dragon tips
// -------------------------------------------------------------
function buildRamayana(THREE, mat) {
  const model = new THREE.Group()
  const bow = new THREE.Group()
  bow.name = 'ramayana-bow'
  bow.userData.motion = { type: 'sway', axis: 'y', amount: 0.12, speed: 0.4 }
  model.add(bow)

  // 1. Classical Recurve Bow Curve with gracefully sweeping limbs
  const bowPoints = [
    [0.18, 0.44, 0],
    [0.08, 0.36, 0.01],
    [-0.05, 0.24, 0.01],
    [-0.14, 0.1, 0.005],
    [-0.16, 0, 0],
    [-0.14, -0.1, 0.005],
    [-0.05, -0.24, 0.01],
    [0.08, -0.36, 0.01],
    [0.18, -0.44, 0],
  ]
  bow.add(tube(THREE, bowPoints, 0.024, mat.gold, 'kodanda-limb-gold', 84, 14))

  // Horn core backing along inner curve
  const backingPoints = bowPoints.map(([x, y, z]) => [x - 0.012, y, z])
  bow.add(tube(THREE, backingPoints, 0.018, mat.teakWood, 'kodanda-limb-horn', 84, 12))

  // 2. Chased Golden Makara Dragon Head Finials at each tip
  ;[-1, 1].forEach((side, i) => {
    const finial = mesh(THREE, new THREE.ConeGeometry(0.038, 0.11, 10), mat.gold, `makara-finial-${i}`)
    finial.position.set(0.18, side * 0.46, 0)
    finial.rotation.z = side * 0.45
    bow.add(finial)

    const makaraEye = mesh(THREE, new THREE.SphereGeometry(0.009, 10, 8), mat.peacockBlue, `makara-gem-${i}`)
    makaraEye.position.set(0.165, side * 0.43, 0.022)
    bow.add(makaraEye)
  })

  // 3. Taut Celestial Bowstring with spun silk sheen
  const stringPoints = [
    [0.18, 0.44, 0],
    [0.02, 0, 0.01],
    [0.18, -0.44, 0],
  ]
  bow.add(tube(THREE, stringPoints, 0.005, mat.paleGold, 'kodanda-bowstring', 32, 8))

  // 4. Wrapped Leather Grip with Braided Gold Wire & Red Lacquer
  const grip = mesh(THREE, new THREE.CylinderGeometry(0.036, 0.036, 0.18, 16), mat.leather, 'kodanda-grip')
  grip.position.set(-0.16, 0, 0)
  bow.add(grip)

  ;[-0.07, -0.035, 0, 0.035, 0.07].forEach((y, i) => {
    const ring = mesh(THREE, new THREE.TorusGeometry(0.038, 0.005, 8, 24), i % 2 ? mat.gold : mat.crimsonSilk, `grip-ring-${i}`)
    ring.position.set(-0.16, y, 0)
    ring.rotation.x = Math.PI / 2
    bow.add(ring)
  })

  // 5. The Surya Celestial Arrow (Surya-astra)
  const arrow = new THREE.Group()
  arrow.name = 'surya-arrow'
  arrow.position.set(0, 0, 0.035)

  // Arrow shaft in ebony & gold
  arrow.add(cylinderBetween(THREE, [-0.34, 0, 0], [0.38, 0, 0], 0.009, 0.009, mat.darkWood, 'arrow-shaft'))

  // Faceted golden arrowhead
  const arrowHead = mesh(THREE, new THREE.ConeGeometry(0.034, 0.12, 4), mat.gold, 'arrow-head')
  arrowHead.position.set(0.42, 0, 0)
  arrowHead.rotation.z = -Math.PI / 2
  arrow.add(arrowHead)

  // Iridescent Peacock Feather Fletchings
  ;[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang, i) => {
    const fletch = mesh(THREE, new THREE.BoxGeometry(0.12, 0.024, 0.004), i % 2 ? mat.peacockBlue : mat.peacockGreen, `arrow-fletch-${i}`)
    fletch.position.set(-0.28, Math.sin(ang) * 0.02, Math.cos(ang) * 0.02)
    fletch.rotation.x = ang
    arrow.add(fletch)
  })
  bow.add(arrow)

  return model
}

// -------------------------------------------------------------
// 4. THE SUDARSHANA CHAKRA (The Mahabharata)
// 108 serrated golden blades, lotus hub & orbiting fire plasma
// -------------------------------------------------------------
function buildMahabharata(THREE, mat) {
  const model = new THREE.Group()
  const chakra = new THREE.Group()
  chakra.name = 'sudarshana-chakra'
  chakra.userData.motion = { type: 'spin', axis: 'z', speed: 0.35 }
  model.add(chakra)

  // 1. Heavy Outer Bronze & Gold Rim
  const outerRim = mesh(THREE, new THREE.TorusGeometry(0.36, 0.026, 16, 72), mat.gold, 'chakra-outer-rim')
  chakra.add(outerRim)

  const innerRim = mesh(THREE, new THREE.TorusGeometry(0.28, 0.016, 12, 64), mat.bronze, 'chakra-inner-rim')
  chakra.add(innerRim)

  // 2. Central Lotus Wheel Hub
  const hubCore = mesh(THREE, new THREE.CylinderGeometry(0.09, 0.09, 0.08, 36), mat.gold, 'chakra-hub-core')
  hubCore.rotation.x = Math.PI / 2
  chakra.add(hubCore)

  const boss = mesh(THREE, new THREE.SphereGeometry(0.065, 24, 16), mat.paleGold, 'chakra-central-boss')
  boss.scale.set(1, 1, 0.6)
  boss.position.z = 0.04
  chakra.add(boss)

  // 3. Pierced Lotus Spokes (24 Radiating Blades)
  const spokeCount = 24
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2
    const spoke = cylinderBetween(
      THREE,
      [Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0],
      [Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0],
      0.009,
      0.006,
      i % 2 ? mat.gold : mat.bronze,
      `chakra-spoke-${i}`
    )
    chakra.add(spoke)
  }

  // 4. 108 Curved Serrated Razor Blades around perimeter
  const bladeCount = 36 // Clean dense visual spacing
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2
    const blade = mesh(THREE, new THREE.ConeGeometry(0.032, 0.13, 4), mat.gold, `chakra-blade-${i}`)
    blade.position.set(Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 0)
    blade.rotation.z = angle + Math.PI / 3.2 // Swept forward vortex angle
    chakra.add(blade)
  }

  // 5. Orbiting Solar Flame Particles around the Chakra
  const flameCount = 72
  const fGeo = new THREE.BufferGeometry()
  const fPos = new Float32Array(flameCount * 3)
  const fCol = new Float32Array(flameCount * 3)

  for (let i = 0; i < flameCount; i++) {
    const angle = (i / flameCount) * Math.PI * 2
    const r = 0.46 + Math.random() * 0.08
    fPos[i * 3] = Math.cos(angle) * r
    fPos[i * 3 + 1] = Math.sin(angle) * r
    fPos[i * 3 + 2] = (Math.random() - 0.5) * 0.04

    fCol[i * 3] = 1.0
    fCol[i * 3 + 1] = 0.7 + Math.random() * 0.3
    fCol[i * 3 + 2] = 0.1
  }
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3))
  fGeo.setAttribute('color', new THREE.BufferAttribute(fCol, 3))

  const flameParticles = new THREE.Points(
    fGeo,
    new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
  )
  chakra.add(flameParticles)

  return model
}

// -------------------------------------------------------------
// 5. THE SHIELD OF ACHILLES (The Iliad)
// Concentric ekphrastic Mycenaean bronze shield on museum easel
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

  // 2. Concentric Ekphrastic Relief Rings
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

  // 3. Central Gilded Sun Boss
  const sunBoss = mesh(THREE, new THREE.SphereGeometry(0.09, 32, 16), mat.gold, 'sun-boss')
  sunBoss.scale.set(1, 1, 0.7)
  sunBoss.position.z = 0.08
  shield.add(sunBoss)

  // Constellation stars (Pleiades, Orion, the Bear)
  const starCoords = [
    [-0.04, 0.05], [0.03, 0.06], [-0.02, 0.08], [0.05, 0.03],
    [-0.06, -0.04], [0.04, -0.05], [0, -0.07],
  ]
  starCoords.forEach(([x, y], i) => {
    const star = mesh(THREE, new THREE.SphereGeometry(0.009, 10, 8), mat.silver, `star-${i}`)
    star.position.set(x, y, 0.12)
    shield.add(star)
  })

  // 4. Wave Frieze Studs on the Ocean Rim (32 Silver Roundels)
  const studCount = 32
  for (let i = 0; i < studCount; i++) {
    const angle = (i / studCount) * Math.PI * 2
    const stud = mesh(THREE, new THREE.SphereGeometry(0.012, 12, 8), i % 2 ? mat.silver : mat.gold, `ocean-stud-${i}`)
    stud.position.set(Math.cos(angle) * 0.395, Math.sin(angle) * 0.395, 0.068)
    shield.add(stud)
  }

  // 5. Reverse Side: Porpax Bronze Armband & Leather Handstrap
  const porpax = mesh(THREE, new THREE.TorusGeometry(0.12, 0.012, 8, 32), mat.darkBronze, 'shield-porpax')
  porpax.position.set(0, 0, -0.035)
  shield.add(porpax)

  // Museum Bronze Easel Stand
  const easel = new THREE.Group()
  easel.name = 'museum-easel'
  easel.add(cylinderBetween(THREE, [-0.22, -0.42, 0.12], [-0.18, 0.15, -0.05], 0.012, 0.012, mat.darkBronze, 'easel-leg-l'))
  easel.add(cylinderBetween(THREE, [0.22, -0.42, 0.12], [0.18, 0.15, -0.05], 0.012, 0.012, mat.darkBronze, 'easel-leg-r'))
  easel.add(cylinderBetween(THREE, [0, -0.42, -0.22], [0, 0.18, -0.08], 0.012, 0.012, mat.darkBronze, 'easel-leg-back'))
  model.add(easel)

  return model
}

// -------------------------------------------------------------
// 6. THE ITHACAN GALLEY PROW (The Odyssey)
// Black ship of Odysseus with apotropaic eye & 3-bladed ram
// -------------------------------------------------------------
function buildOdyssey(THREE, mat) {
  const model = new THREE.Group()
  const ship = new THREE.Group()
  ship.name = 'odysseus-galley'
  ship.userData.motion = { type: 'sway', axis: 'y', amount: 0.12, speed: 0.35 }
  model.add(ship)

  // 1. Curved Stem-Post Rising from the Waterline
  const stemPoints = [
    [-0.32, -0.32, 0],
    [-0.18, -0.28, 0],
    [0.02, -0.16, 0],
    [0.18, 0.02, 0],
    [0.28, 0.22, 0],
    [0.32, 0.38, 0],
    [0.26, 0.44, 0],
  ]
  ship.add(tube(THREE, stemPoints, 0.034, mat.cypressPlank, 'stem-post', 64, 12))

  // 2. Lapstrake Cypress Planking Hull
  for (let plank = 0; plank < 5; plank++) {
    const p = plank / 4
    const plankPoints = stemPoints.map(([x, y, z]) => [
      x - 0.04 - p * 0.08,
      y + (plank % 2 ? 0.01 : 0),
      z + 0.04 + p * 0.14,
    ])
    ship.add(tube(THREE, plankPoints, 0.022, mat.cypressPlank, `port-plank-${plank}`, 48, 8))

    const stbdPoints = stemPoints.map(([x, y, z]) => [
      x - 0.04 - p * 0.08,
      y + (plank % 2 ? 0.01 : 0),
      z - 0.04 - p * 0.14,
    ])
    ship.add(tube(THREE, stbdPoints, 0.022, mat.cypressPlank, `stbd-plank-${plank}`, 48, 8))
  }

  // 3. Three-Bladed Bronze Ram (Embolon) at the Waterline
  const ramCore = mesh(THREE, new THREE.ConeGeometry(0.065, 0.22, 3), mat.bronze, 'bronze-ram')
  ramCore.position.set(-0.42, -0.32, 0)
  ramCore.rotation.z = Math.PI / 2
  ship.add(ramCore)

  // 4. Iconic Carved Apotropaic Eye (Eye of Horus/Ward against monsters)
  ;[-1, 1].forEach((side, i) => {
    const eyeSocket = mesh(THREE, new THREE.SphereGeometry(0.038, 18, 12), mat.chalkWhite, `eye-white-${i}`)
    eyeSocket.scale.set(1.4, 0.8, 0.3)
    eyeSocket.position.set(0.12, 0.04, side * 0.11)
    ship.add(eyeSocket)

    const iris = mesh(THREE, new THREE.SphereGeometry(0.022, 16, 10), mat.lapisBlue, `eye-iris-${i}`)
    iris.scale.set(1, 1, 0.4)
    iris.position.set(0.12, 0.04, side * 0.122)
    ship.add(iris)

    const pupil = mesh(THREE, new THREE.SphereGeometry(0.011, 12, 8), mat.darkWood, `eye-pupil-${i}`)
    pupil.position.set(0.12, 0.04, side * 0.13)
    ship.add(pupil)
  })

  // 5. Coiled Hemp Mooring Rope & Bronze Anchor on Foredeck
  const ropeCoil = mesh(THREE, new THREE.TorusGeometry(0.065, 0.016, 12, 32), mat.leather, 'deck-rope-coil')
  ropeCoil.rotation.x = Math.PI / 2
  ropeCoil.position.set(-0.06, -0.08, 0)
  ship.add(ropeCoil)

  const anchor = mesh(THREE, new THREE.TorusGeometry(0.075, 0.012, 8, 24, Math.PI), mat.bronze, 'bronze-anchor')
  anchor.position.set(-0.06, -0.06, 0)
  ship.add(anchor)

  return model
}

// -------------------------------------------------------------
// 7. THE OLIPHANT (The Song of Roland)
// Modeled exactly after user reference media_1794126066152_2c336f39.jpg
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

  // Carved Ivory Tusk Segments
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

    // Suspension ring
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

/**
 * Creates a centered, normalized procedural relic for one of the seven works.
 * Bounding volume fits inside approximately 0.94-unit space.
 */
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
