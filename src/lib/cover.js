const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export function wrapText(g, text, x, y, maxW, lh) {
  const words = text.split(' ')
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y)
      line = w
      y += lh
    } else line = test
  }
  g.fillText(line, x, y)
  return y + lh
}

// Draws a manuscript-style book cover for a work onto a canvas.
export function drawCover(work, i, W = 600, H = 800, canvas) {
  const c = canvas || document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const s = W / 600
  const grad = g.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, work.colors[0])
  grad.addColorStop(1, work.colors[1])
  g.fillStyle = grad
  g.fillRect(0, 0, W, H)
  for (let k = 0; k < 1200; k++) {
    g.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`
    g.fillRect(Math.random() * W, Math.random() * H, 2 * s, 2 * s)
  }
  const gold = '#d8b86a'
  g.strokeStyle = gold
  g.fillStyle = gold
  g.lineWidth = 6 * s
  g.strokeRect(30 * s, 30 * s, W - 60 * s, H - 60 * s)
  g.lineWidth = 2 * s
  g.strokeRect(48 * s, 48 * s, W - 96 * s, H - 96 * s)
  g.textAlign = 'center'
  g.font = `italic ${30 * s}px "Bodoni Moda", Georgia, serif`
  g.fillText(ROMAN[i] || String(i + 1), W / 2, 125 * s)
  // ornament: circle with radiating lines
  const cx = W / 2, cy = 260 * s
  g.beginPath(); g.arc(cx, cy, 70 * s, 0, Math.PI * 2); g.stroke()
  g.beginPath(); g.arc(cx, cy, 52 * s, 0, Math.PI * 2); g.stroke()
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2
    g.beginPath()
    g.moveTo(cx + Math.cos(ang) * 20 * s, cy + Math.sin(ang) * 20 * s)
    g.lineTo(cx + Math.cos(ang) * 52 * s, cy + Math.sin(ang) * 52 * s)
    g.stroke()
  }
  g.font = `500 ${46 * s}px "Bodoni Moda", Georgia, serif`
  g.fillStyle = '#f3e6c4'
  const end = wrapText(g, work.title.toUpperCase(), W / 2, 420 * s, W - 170 * s, 56 * s)
  g.fillStyle = gold
  g.fillRect(W / 2 - 60 * s, end - 20 * s, 120 * s, 2 * s)
  g.font = `italic ${28 * s}px "Bodoni Moda", Georgia, serif`
  wrapText(g, work.author, W / 2, end + 35 * s, W - 170 * s, 36 * s)
  return c
}
