import { road, CHART_DESC } from '../data/odyssey.js'

const W = 720
const H = 300
const L = 56
const R = 24
const T = 28
const B = 36

export default function RoadChart() {
  const x = k => L + (k * (W - L - R)) / (road.length - 1)
  const y = v => T + (1 - v / 100) * (H - T - B)
  const pts = road.map(([, , v], k) => [x(k), y(v)])
  const line = pts.map(([px, py], k) => `${k ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')
  const area = `${line} L${x(road.length - 1)} ${H - B} L${x(0)} ${H - B} Z`

  return (
    <figure className="g-figure glass reveal">
      <h3 id="road-title">The long road home</h3>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="road-title road-desc" className="road-svg">
        <desc id="road-desc">{CHART_DESC}</desc>
        <defs>
          <linearGradient id="roadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6c978" stopOpacity=".35" />
            <stop offset="1" stopColor="#f6c978" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 50, 100].map(v => (
          <line key={v} x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="road-grid" />
        ))}
        <text x={L - 10} y={y(100) + 4} textAnchor="end" className="road-axis">Home</text>
        <text x={L - 10} y={y(0) + 4} textAnchor="end" className="road-axis">Far</text>
        <path d={area} fill="url(#roadFill)" />
        <path d={line} pathLength="1" className="road-line" />
        {pts.map(([px, py], k) => (
          <g key={k}>
            <circle cx={px} cy={py} r="13" className="road-dot" />
            <text x={px} y={py + 4.5} textAnchor="middle" className="road-num">{k + 1}</text>
            <title>{`${road[k][0]} (${road[k][1]})`}</title>
          </g>
        ))}
      </svg>
      <ol className="road-legend">
        {road.map(([name, book], k) => (
          <li key={name}><b>{k + 1}</b> {name} <span>({book})</span></li>
        ))}
      </ol>
      <p className="g-note">The higher the line, the closer Odysseus is to home.</p>
      <p className="g-desc">{CHART_DESC}</p>
    </figure>
  )
}
