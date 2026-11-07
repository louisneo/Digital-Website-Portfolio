import fs from 'fs';
const css = fs.readFileSync('ref_index.css', 'utf8');

// Match class definitions like .work-card, .analysis-section, .lens-tab, etc.
const selectors = css.match(/\.[a-zA-Z][a-zA-Z0-9_-]+/g) || [];
const unique = [...new Set(selectors)];
console.log('Total unique CSS classes in ref_index.css:', unique.length);

const workRelated = unique.filter(c => c.includes('work') || c.includes('art') || c.includes('analysis') || c.includes('tab') || c.includes('lens') || c.includes('nav') || c.includes('char') || c.includes('elem') || c.includes('hero') || c.includes('plate'));
console.log('Work/analysis related classes:', workRelated);
fs.writeFileSync('ref_work_classes.json', JSON.stringify(workRelated, null, 2));

