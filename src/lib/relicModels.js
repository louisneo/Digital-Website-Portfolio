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
      color: 0xc89531,
      metalness: 0.82,
      roughness: 0.25,
      clearcoat: 0.28,
    }),
    paleGold: new THREE.MeshStandardMaterial({ color: 0xe0bd68, metalness: 0.72, roughness: 0.3 }),
    bronze: new THREE.MeshPhysicalMaterial({
      color: 0x8c4b20,
      metalness: 0.76,
      roughness: 0.34,
      clearcoat: 0.18,
    }),
    darkBronze: new THREE.MeshStandardMaterial({ color: 0x402213, metalness: 0.68, roughness: 0.4 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x596064, metalness: 0.88, roughness: 0.25 }),
    wood: new THREE.MeshPhysicalMaterial({ color: 0x6a3018, metalness: 0.06, roughness: 0.58, clearcoat: 0.24 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x2b160e, metalness: 0.03, roughness: 0.7 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x5f271c, metalness: 0.02, roughness: 0.7 }),
    ivory: new THREE.MeshPhysicalMaterial({
      color: 0xe6d1a2,
      metalness: 0.02,
      roughness: 0.3,
      clearcoat: 0.22,
    }),
    parchment: new THREE.MeshStandardMaterial({ color: 0xb88a4b, metalness: 0.02, roughness: 0.82 }),
    parchmentLight: new THREE.MeshStandardMaterial({ color: 0xd8b977, metalness: 0, roughness: 0.9 }),
    ink: new THREE.MeshStandardMaterial({ color: 0x24140e, metalness: 0.02, roughness: 0.78 }),
    red: new THREE.MeshStandardMaterial({ color: 0x6f1716, metalness: 0.18, roughness: 0.52 }),
    olive: new THREE.MeshStandardMaterial({ color: 0x536031, metalness: 0.08, roughness: 0.62 }),
    smoke: new THREE.MeshPhysicalMaterial({
      color: 0x857969,
      metalness: 0.08,
      roughness: 0.7,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
    cloud: new THREE.MeshPhysicalMaterial({
      color: 0xb8afa0,
      metalness: 0,
      roughness: 0.8,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    }),
    black: new THREE.MeshStandardMaterial({ color: 0x090705, metalness: 0.15, roughness: 0.72 }),
  }
}

function mesh(THREE, geometry, material, name) {
  const result = new THREE.Mesh(geometry, material)
  if (name) result.name = name
  result.castShadow = true
  result.receiveShadow = true
  return result
}

function ellipsoid(THREE, material, scale, position, name) {
  const result = mesh(THREE, new THREE.SphereGeometry(1, 24, 16), material, name)
  result.scale.set(...scale)
  result.position.set(...position)
  return result
}

function tube(THREE, points, radius, material, name, tubularSegments = 56, radialSegments = 9) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'centripetal')
  return mesh(THREE, new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false), material, name)
}

function cylinderBetween(THREE, start, end, startRadius, endRadius, material, name, radialSegments = 12) {
  const a = new THREE.Vector3(...start)
  const b = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(b, a)
  const result = mesh(
    THREE,
    new THREE.CylinderGeometry(endRadius, startRadius, direction.length(), radialSegments, 1, false),
    material,
    name,
  )
  result.position.copy(a).add(b).multiplyScalar(0.5)
  result.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  return result
}

function orientAxisTo(THREE, object, direction, sourceAxis = new THREE.Vector3(0, 1, 0)) {
  object.quaternion.setFromUnitVectors(sourceAxis, direction.clone().normalize())
  return object
}

function roundedTablet(THREE, width, height, depth, radius, material) {
  const shape = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: Math.min(radius * 0.35, 0.012),
    bevelThickness: 0.008,
    curveSegments: 5,
  })
  geometry.translate(0, 0, -depth / 2)
  return mesh(THREE, geometry, material)
}

function buildWhirlwind(THREE, materials) {
  const model = new THREE.Group()
  const motion = new THREE.Group()
  motion.name = 'whirlwind-motion'
  motion.userData.motion = { type: 'spin', axis: 'y', speed: 0.34 }
  model.add(motion)

  const helixPoints = []
  for (let i = 0; i <= 52; i += 1) {
    const progress = i / 52
    const angle = progress * Math.PI * 6.3
    const radius = 0.035 + progress * 0.23
    helixPoints.push([Math.cos(angle) * radius, -0.35 + progress * 0.64, Math.sin(angle) * radius])
  }
  motion.add(tube(THREE, helixPoints, 0.022, materials.smoke, 'whirlwind-spiral', 100, 8))

  for (let i = 0; i < 7; i += 1) {
    const progress = i / 6
    const ring = mesh(
      THREE,
      new THREE.TorusGeometry(0.08 + progress * 0.25, 0.012 + progress * 0.004, 8, 40),
      i % 2 ? materials.cloud : materials.smoke,
      `whirlwind-ring-${i + 1}`,
    )
    ring.rotation.x = Math.PI / 2
    ring.rotation.z = (i % 2 ? -1 : 1) * 0.14
    ring.position.y = -0.3 + progress * 0.57
    motion.add(ring)
  }

  const cloudPositions = [
    [-0.22, 0.28, 0.01, 0.14], [0, 0.31, -0.05, 0.18], [0.2, 0.29, 0.02, 0.13],
    [-0.1, 0.36, 0.06, 0.13], [0.12, 0.37, 0.04, 0.12],
  ]
  cloudPositions.forEach(([x, y, z, scale], index) => {
    motion.add(ellipsoid(THREE, materials.cloud, [scale * 1.35, scale * 0.64, scale], [x, y, z], `storm-cloud-${index + 1}`))
  })
  return model
}

function buildPanchatantra(THREE, materials) {
  const model = new THREE.Group()
  const tableau = new THREE.Group()
  tableau.name = 'panchatantra-tableau'
  tableau.userData.motion = { type: 'breathe', amount: 0.018, speed: 0.8 }
  model.add(tableau)

  const books = new THREE.Group()
  books.name = 'manuscript-stack'
  tableau.add(books)
  const tabletData = [
    { y: -0.22, rotation: -0.08, width: 0.55 },
    { y: -0.15, rotation: 0.055, width: 0.52 },
    { y: -0.08, rotation: -0.025, width: 0.49 },
  ]
  tabletData.forEach(({ y, rotation, width }, index) => {
    const tablet = roundedTablet(THREE, width, 0.27, 0.045, 0.025, index === 1 ? materials.parchmentLight : materials.parchment)
    tablet.name = `manuscript-tablet-${index + 1}`
    tablet.rotation.set(-0.94, 0, rotation)
    tablet.position.set(0, y, 0)
    books.add(tablet)
  })
  for (let i = -2; i <= 2; i += 1) {
    const glyph = mesh(THREE, new THREE.BoxGeometry(0.035, 0.006, 0.008), materials.ink, `manuscript-glyph-${i + 3}`)
    glyph.position.set(i * 0.065, 0.025, 0.125)
    glyph.rotation.x = -0.94
    books.add(glyph)
  }

  const jackal = new THREE.Group()
  jackal.name = 'jackal-figure'
  jackal.position.set(-0.29, 0.04, 0.03)
  jackal.rotation.y = -0.14
  jackal.add(
    ellipsoid(THREE, materials.bronze, [0.13, 0.085, 0.07], [0, -0.08, 0], 'jackal-body'),
    ellipsoid(THREE, materials.bronze, [0.085, 0.09, 0.075], [0.02, 0.055, 0], 'jackal-head'),
  )
  const snout = mesh(THREE, new THREE.ConeGeometry(0.052, 0.13, 10), materials.darkBronze, 'jackal-snout')
  snout.rotation.z = -Math.PI / 2
  snout.position.set(0.105, 0.035, 0.018)
  jackal.add(snout)
  ;[-0.04, 0.045].forEach((x, index) => {
    const ear = mesh(THREE, new THREE.ConeGeometry(0.035, 0.1, 7), materials.darkBronze, `jackal-ear-${index + 1}`)
    ear.position.set(x, 0.15, 0)
    ear.rotation.z = index ? -0.16 : 0.16
    jackal.add(ear)
  })
  ;[-0.07, 0.07].forEach((x, index) => {
    jackal.add(cylinderBetween(THREE, [x, -0.12, 0], [x, -0.27, 0], 0.02, 0.016, materials.darkBronze, `jackal-leg-${index + 1}`, 8))
  })
  tableau.add(jackal)

  const owl = new THREE.Group()
  owl.name = 'owl-figure'
  owl.position.set(0.3, 0.055, 0.04)
  owl.add(
    ellipsoid(THREE, materials.darkBronze, [0.095, 0.14, 0.07], [0, -0.09, 0], 'owl-body'),
    ellipsoid(THREE, materials.bronze, [0.115, 0.1, 0.075], [0, 0.08, 0], 'owl-head'),
    ellipsoid(THREE, materials.gold, [0.034, 0.034, 0.015], [-0.04, 0.09, 0.071], 'owl-eye-left'),
    ellipsoid(THREE, materials.gold, [0.034, 0.034, 0.015], [0.04, 0.09, 0.071], 'owl-eye-right'),
    ellipsoid(THREE, materials.black, [0.012, 0.012, 0.009], [-0.04, 0.09, 0.085], 'owl-pupil-left'),
    ellipsoid(THREE, materials.black, [0.012, 0.012, 0.009], [0.04, 0.09, 0.085], 'owl-pupil-right'),
  )
  const beak = mesh(THREE, new THREE.ConeGeometry(0.025, 0.07, 5), materials.paleGold, 'owl-beak')
  beak.rotation.x = Math.PI / 2
  beak.position.set(0, 0.055, 0.1)
  owl.add(beak)
  ;[-1, 1].forEach((side, index) => {
    const wing = ellipsoid(THREE, materials.bronze, [0.045, 0.115, 0.025], [side * 0.085, -0.09, 0], `owl-wing-${index + 1}`)
    wing.rotation.z = side * 0.24
    owl.add(wing)
  })
  tableau.add(owl)
  return model
}

function addArrow(THREE, group, materials, options = {}) {
  const {
    y = 0,
    z = 0.055,
    start = -0.34,
    end = 0.37,
    shaftMaterial = materials.darkWood,
    metalMaterial = materials.iron,
    featherMaterial = materials.red,
    name = 'arrow',
  } = options
  const arrow = new THREE.Group()
  arrow.name = name
  arrow.add(cylinderBetween(THREE, [start, y, z], [end - 0.07, y, z], 0.009, 0.009, shaftMaterial, `${name}-shaft`, 9))
  const head = mesh(THREE, new THREE.ConeGeometry(0.035, 0.11, 6), metalMaterial, `${name}-head`)
  orientAxisTo(THREE, head, new THREE.Vector3(1, 0, 0))
  head.position.set(end - 0.015, y, z)
  arrow.add(head)
  ;[-1, 1].forEach((side, index) => {
    const feather = mesh(THREE, new THREE.BoxGeometry(0.1, 0.025, 0.008), featherMaterial, `${name}-feather-${index + 1}`)
    feather.position.set(start + 0.055, y + side * 0.026, z)
    feather.rotation.z = side * 0.22
    arrow.add(feather)
  })
  group.add(arrow)
  return arrow
}

function buildRamayana(THREE, materials) {
  const model = new THREE.Group()
  const bow = new THREE.Group()
  bow.name = 'ramayana-bow'
  bow.userData.motion = { type: 'sway', axis: 'y', amount: 0.12, speed: 0.45 }
  model.add(bow)

  const bowPoints = [
    [0.16, 0.39, 0], [0.015, 0.28, 0], [-0.09, 0.12, 0], [-0.13, 0, 0],
    [-0.09, -0.12, 0], [0.015, -0.28, 0], [0.16, -0.39, 0],
  ]
  bow.add(tube(THREE, bowPoints, 0.026, materials.gold, 'ramayana-bow-limb', 72, 10))
  bow.add(
    tube(THREE, [[0.16, 0.39, 0], [0.02, 0, 0.012], [0.16, -0.39, 0]], 0.006, materials.ivory, 'ramayana-bowstring', 28, 6),
  )
  ;[-0.31, -0.18, 0.18, 0.31].forEach((y, index) => {
    const ornament = mesh(THREE, new THREE.TorusGeometry(0.036, 0.008, 6, 18), materials.red, `ramayana-binding-${index + 1}`)
    ornament.position.set(index < 2 ? 0.055 : 0.055, y, 0)
    ornament.rotation.z = Math.PI / 2
    bow.add(ornament)
  })
  const grip = mesh(THREE, new THREE.CylinderGeometry(0.038, 0.038, 0.16, 12), materials.leather, 'ramayana-grip')
  grip.position.set(-0.13, 0, 0)
  bow.add(grip)
  addArrow(THREE, bow, materials, { y: 0, z: 0.04, start: -0.31, end: 0.38, featherMaterial: materials.red, name: 'rama-arrow' })
  return model
}

function buildMahabharata(THREE, materials) {
  const model = new THREE.Group()
  const chakra = new THREE.Group()
  chakra.name = 'mahabharata-chakra-spin'
  chakra.userData.motion = { type: 'spin', axis: 'z', speed: 0.28 }
  model.add(chakra)

  const rim = mesh(THREE, new THREE.TorusGeometry(0.33, 0.032, 12, 64), materials.gold, 'chakra-rim')
  chakra.add(rim)
  const innerRim = mesh(THREE, new THREE.TorusGeometry(0.26, 0.014, 9, 64), materials.paleGold, 'chakra-inner-rim')
  chakra.add(innerRim)
  const hub = mesh(THREE, new THREE.CylinderGeometry(0.075, 0.075, 0.09, 32), materials.bronze, 'chakra-hub')
  hub.rotation.x = Math.PI / 2
  chakra.add(hub)
  const bossFront = ellipsoid(THREE, materials.gold, [0.06, 0.06, 0.035], [0, 0, 0.065], 'chakra-boss')
  chakra.add(bossFront)

  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2
    const direction = [Math.cos(angle), Math.sin(angle), 0]
    chakra.add(cylinderBetween(
      THREE,
      [direction[0] * 0.07, direction[1] * 0.07, 0],
      [direction[0] * 0.29, direction[1] * 0.29, 0],
      0.009,
      0.009,
      i % 2 ? materials.bronze : materials.paleGold,
      `chakra-spoke-${i + 1}`,
      8,
    ))
  }

  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2
    const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0)
    const blade = mesh(THREE, new THREE.ConeGeometry(0.038, 0.115, 4), materials.gold, `chakra-blade-${i + 1}`)
    orientAxisTo(THREE, blade, radial)
    blade.position.copy(radial).multiplyScalar(0.39)
    blade.rotation.z += Math.PI / 4
    chakra.add(blade)
  }
  return model
}

function buildIliad(THREE, materials) {
  const model = new THREE.Group()
  const shield = new THREE.Group()
  shield.name = 'iliad-shield-spin'
  shield.userData.motion = { type: 'sway', axis: 'y', amount: 0.16, speed: 0.36 }
  shield.rotation.x = -0.08
  model.add(shield)

  const body = mesh(THREE, new THREE.SphereGeometry(0.37, 56, 32), materials.bronze, 'achilles-shield-body')
  body.scale.z = 0.14
  shield.add(body)
  ;[
    [0.365, 0.022, materials.gold],
    [0.286, 0.012, materials.paleGold],
    [0.205, 0.011, materials.darkBronze],
  ].forEach(([radius, thickness, material], index) => {
    const ring = mesh(THREE, new THREE.TorusGeometry(radius, thickness, 9, 64), material, `shield-ring-${index + 1}`)
    ring.position.z = 0.057 + index * 0.003
    shield.add(ring)
  })
  const boss = ellipsoid(THREE, materials.gold, [0.095, 0.095, 0.075], [0, 0, 0.09], 'shield-boss')
  shield.add(boss)

  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2
    const stud = ellipsoid(
      THREE,
      i % 2 ? materials.gold : materials.darkBronze,
      [0.018, 0.018, 0.013],
      [Math.cos(angle) * 0.325, Math.sin(angle) * 0.325, 0.079],
      `shield-stud-${i + 1}`,
    )
    shield.add(stud)
  }
  const sunRays = new THREE.Group()
  sunRays.name = 'shield-sun-emblem'
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2
    const ray = mesh(THREE, new THREE.BoxGeometry(0.105, 0.014, 0.01), materials.paleGold, `shield-ray-${i + 1}`)
    ray.position.set(Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0.073)
    ray.rotation.z = angle
    sunRays.add(ray)
  }
  shield.add(sunRays)
  return model
}

function buildOdyssey(THREE, materials) {
  const model = new THREE.Group()
  const bow = new THREE.Group()
  bow.name = 'odyssey-bow'
  bow.userData.motion = { type: 'sway', axis: 'y', amount: 0.1, speed: 0.4 }
  bow.rotation.z = -0.08
  model.add(bow)

  const bowPoints = [
    [0.22, 0.39, 0], [0.1, 0.31, 0], [-0.015, 0.18, 0], [-0.08, 0, 0],
    [-0.015, -0.18, 0], [0.1, -0.31, 0], [0.22, -0.39, 0],
  ]
  bow.add(tube(THREE, bowPoints, 0.023, materials.darkWood, 'odysseus-bow-limb', 72, 10))
  bow.add(tube(THREE, [[0.22, 0.39, 0], [0.035, 0, 0.012], [0.22, -0.39, 0]], 0.005, materials.ivory, 'odysseus-bowstring', 28, 6))
  const grip = mesh(THREE, new THREE.CylinderGeometry(0.034, 0.034, 0.145, 12), materials.leather, 'odysseus-bow-grip')
  grip.position.set(-0.08, 0, 0)
  bow.add(grip)

  ;[-0.315, -0.255, 0.255, 0.315].forEach((y, index) => {
    const band = mesh(THREE, new THREE.TorusGeometry(0.03, 0.006, 6, 18), materials.gold, `greek-bow-band-${index + 1}`)
    band.position.set(0.13, y, 0)
    band.rotation.z = Math.PI / 2
    bow.add(band)
  })
  ;[-1, 1].forEach((side, index) => {
    const nock = mesh(THREE, new THREE.ConeGeometry(0.038, 0.095, 7), materials.bronze, `greek-bow-nock-${index + 1}`)
    orientAxisTo(THREE, nock, new THREE.Vector3(side * 0.7, side, 0))
    nock.position.set(0.205, side * 0.375, 0)
    bow.add(nock)
  })
  addArrow(THREE, bow, materials, {
    y: 0,
    z: 0.044,
    start: -0.32,
    end: 0.39,
    shaftMaterial: materials.wood,
    metalMaterial: materials.bronze,
    featherMaterial: materials.olive,
    name: 'odysseus-arrow',
  })
  return model
}

function buildRoland(THREE, materials) {
  const model = new THREE.Group()
  const horn = new THREE.Group()
  horn.name = 'roland-oliphant'
  horn.userData.motion = { type: 'sway', axis: 'y', amount: 0.13, speed: 0.32 }
  horn.rotation.z = -0.1
  model.add(horn)

  const points = [
    [-0.36, -0.21, 0.09], [-0.29, -0.1, 0.045], [-0.22, 0.02, 0.015],
    [-0.1, 0.14, -0.005], [0.04, 0.22, 0], [0.19, 0.25, 0.025], [0.32, 0.22, 0.055],
  ].map(point => new THREE.Vector3(...point))
  for (let i = 0; i < points.length - 1; i += 1) {
    const progress = i / (points.length - 2)
    const startRadius = 0.092 - progress * 0.062
    const endRadius = 0.092 - ((i + 1) / (points.length - 1)) * 0.062
    horn.add(cylinderBetween(
      THREE,
      points[i].toArray(),
      points[i + 1].toArray(),
      startRadius,
      Math.max(endRadius, 0.026),
      materials.ivory,
      `oliphant-segment-${i + 1}`,
      18,
    ))
  }

  const bellTangent = new THREE.Vector3().subVectors(points[0], points[1]).normalize()
  const bell = mesh(THREE, new THREE.TorusGeometry(0.105, 0.018, 10, 36), materials.gold, 'oliphant-bell-rim')
  orientAxisTo(THREE, bell, bellTangent, new THREE.Vector3(0, 0, 1))
  bell.position.copy(points[0]).addScaledVector(bellTangent, 0.012)
  horn.add(bell)
  const bellDark = mesh(THREE, new THREE.CircleGeometry(0.083, 32), materials.darkWood, 'oliphant-bell-opening')
  orientAxisTo(THREE, bellDark, bellTangent, new THREE.Vector3(0, 0, 1))
  bellDark.position.copy(points[0]).addScaledVector(bellTangent, 0.014)
  horn.add(bellDark)

  const mouthTangent = new THREE.Vector3().subVectors(points.at(-1), points.at(-2)).normalize()
  const mouthRing = mesh(THREE, new THREE.TorusGeometry(0.034, 0.009, 8, 24), materials.gold, 'oliphant-mouthpiece')
  orientAxisTo(THREE, mouthRing, mouthTangent, new THREE.Vector3(0, 0, 1))
  mouthRing.position.copy(points.at(-1)).addScaledVector(mouthTangent, 0.01)
  horn.add(mouthRing)

  ;[0.22, 0.52, 0.76].forEach((progress, index) => {
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
    const point = curve.getPoint(progress)
    const tangent = curve.getTangent(progress)
    const bandRadius = 0.092 - progress * 0.062
    const band = mesh(THREE, new THREE.TorusGeometry(bandRadius, 0.009, 8, 28), index === 1 ? materials.red : materials.gold, `oliphant-band-${index + 1}`)
    orientAxisTo(THREE, band, tangent, new THREE.Vector3(0, 0, 1))
    band.position.copy(point)
    horn.add(band)
  })

  const strap = tube(
    THREE,
    [[-0.27, -0.08, -0.025], [-0.03, -0.32, -0.04], [0.2, 0.18, -0.025]],
    0.012,
    materials.leather,
    'oliphant-carry-strap',
    42,
    7,
  )
  horn.add(strap)
  return model
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
 * The returned group fits inside an approximately 0.86-unit bounding cube.
 * Named child groups expose optional `userData.motion` hints for animation.
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
  normalization.scale.setScalar(0.86 / largestDimension)

  root.traverse(object => {
    if (!object.isMesh) return
    object.castShadow = true
    object.receiveShadow = true
  })
  return root
}

export { SUPPORTED_RELICS }
