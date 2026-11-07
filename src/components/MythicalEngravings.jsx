// Antique Mythological Copperplate Engravings
// Inspired by Renaissance cartography and the Duh Studio Spline project
export function KrakenEngraving({ className = '' }) {
  return (
    <svg
      className={`antique-engraving kraken-engraving ${className}`}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="krakenGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3deb5" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#c89b53" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#875824" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="tentacleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8bd92" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d8bd92" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="200" cy="120" r="110" fill="url(#tentacleGlow)" />

      {/* Main Kraken Head & Body */}
      <path
        d="M260 40 C280 70 290 110 260 140 C240 160 210 160 190 145 C170 130 180 90 200 70 C220 50 240 30 260 40 Z"
        stroke="url(#krakenGold)"
        strokeWidth="2.2"
        fill="#13161c"
        fillOpacity="0.8"
      />

      {/* Eye of the Leviathan */}
      <circle cx="235" cy="95" r="7" stroke="url(#krakenGold)" strokeWidth="2" fill="#e8c78a" />
      <circle cx="236" cy="95" r="3" fill="#111317" />

      {/* Curling Tentacle 1 - Sweeping downward */}
      <path
        d="M220 150 C210 190 170 220 130 230 C90 240 60 210 80 180 C95 160 130 175 140 195 C150 215 130 245 90 265 C60 280 20 270 10 250"
        stroke="url(#krakenGold)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Sucker cups on tentacle 1 */}
      {[
        [180, 195, 4], [150, 215, 4], [120, 222, 3.5], [85, 205, 3],
        [95, 175, 3], [125, 185, 3.5], [135, 210, 4], [115, 240, 3], [70, 265, 3]
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} stroke="url(#krakenGold)" strokeWidth="1.2" fill="#201a14" />
      ))}

      {/* Curling Tentacle 2 - Upper arch */}
      <path
        d="M245 145 C270 180 300 210 290 250 C280 280 240 290 210 270 C190 250 205 220 230 215 C250 210 265 230 255 250"
        stroke="url(#krakenGold)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Sucker cups on tentacle 2 */}
      {[
        [260, 180, 3.5], [280, 210, 4], [285, 245, 3.5], [250, 275, 3],
        [220, 260, 3], [215, 230, 3], [240, 220, 3]
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} stroke="url(#krakenGold)" strokeWidth="1.2" fill="#201a14" />
      ))}

      {/* Curling Tentacle 3 - Inner loop */}
      <path
        d="M190 130 C160 150 140 130 130 100 C120 70 150 40 180 50 C200 60 190 85 170 90 C150 95 145 75 160 65"
        stroke="url(#krakenGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Antique woodcut hatching lines */}
      <path
        d="M210 80 L230 70 M215 90 L240 80 M205 105 L230 100 M200 120 L225 115 M210 135 L235 130"
        stroke="url(#krakenGold)"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <path
        d="M160 170 L170 180 M135 195 L145 205 M105 220 L115 230 M85 240 L95 250"
        stroke="url(#krakenGold)"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  )
}

export function ChimeraEngraving({ className = '' }) {
  return (
    <svg
      className={`antique-engraving chimera-engraving ${className}`}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chimeraGold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f3deb5" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#c89b53" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#875824" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="chimeraGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8bd92" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d8bd92" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="120" cy="200" r="110" fill="url(#chimeraGlow)" />

      {/* Chimera / Merman Torso & Head */}
      <path
        d="M70 280 C60 250 70 220 90 200 C105 180 120 170 115 150 C110 135 95 125 100 110 C105 95 125 90 135 100 C145 110 140 130 135 145 C145 160 160 180 150 210 C140 240 110 270 70 280 Z"
        stroke="url(#chimeraGold)"
        strokeWidth="2.2"
        fill="#13161c"
        fillOpacity="0.8"
      />

      {/* Eye & Crown */}
      <circle cx="118" cy="112" r="3" fill="#f5dfb6" />
      {/* Crown / Horns */}
      <path
        d="M102 95 L112 80 L120 92 L130 75 L138 90"
        stroke="url(#chimeraGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Wing stretching backwards */}
      <path
        d="M95 190 C65 170 40 140 30 100 C50 120 70 140 85 165 M40 125 C30 100 35 70 60 55 C65 80 80 110 95 140 M60 75 C60 50 80 35 105 40 C100 65 105 95 105 130"
        stroke="url(#chimeraGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Serpentine Fish Tail */}
      <path
        d="M70 280 C50 290 30 270 25 240 C20 210 40 195 55 210 C70 225 60 255 40 265"
        stroke="url(#chimeraGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Arm holding Celestial Wand pointing UP-RIGHT */}
      <path
        d="M135 165 L170 150 L205 130"
        stroke="url(#chimeraGold)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Golden Wand / Scepter */}
      <line
        x1="180"
        y1="150"
        x2="295"
        y2="75"
        stroke="#fbe6be"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Glowing Star tip on Wand */}
      <circle cx="295" cy="75" r="5" fill="#f8e5b9" />
      <path
        d="M295 62 L295 88 M282 75 L308 75 M286 66 L304 84 M286 84 L304 66"
        stroke="#fbe6be"
        strokeWidth="1.8"
      />

      {/* Antique woodcut hatching lines */}
      <path
        d="M100 130 L115 135 M95 145 L115 150 M100 160 L125 165 M115 180 L135 185 M120 200 L140 205"
        stroke="url(#chimeraGold)"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
    </svg>
  )
}

