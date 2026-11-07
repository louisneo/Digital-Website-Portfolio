import fs from 'fs';
const js = fs.readFileSync('chunk_AnalysesView-DUeKu-gf.js', 'utf8');

// Print how each work is structured and rendered in AnalysesView
console.log('AnalysesView length:', js.length);
// Find headings or element templates in chunk_AnalysesView
const snips = js.match(/.{0,80}(work-poster|work-head|tabpanel|work-meta|char-list|element-list).{0,80}/g) || [];
console.log('Snippet count:', snips.length);
fs.writeFileSync('analyses_snippets.json', JSON.stringify(snips.slice(0, 50), null, 2));

