const fs = require('fs');
const files = ['src/pages/Favorite.jsx','src/pages/Summary.jsx','src/pages/Reflection.jsx','src/pages/Profile.jsx','src/components/Carousel.jsx','src/components/HeroStage.jsx','src/components/RoadChart.jsx'];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const cls = new Set();
  for (const m of s.matchAll(/className=(?:"([^"]+)"|\{`([^`]+)`\})/g)) (m[1]||m[2]).split(/\s+/).forEach(c => cls.add(c));
  const imports = s.split('\n').filter(l => l.startsWith('import')).join(' | ');
  console.log('==', f, s.length, 'chars\n  imports:', imports, '\n  classes:', [...cls].join(' '));
}

