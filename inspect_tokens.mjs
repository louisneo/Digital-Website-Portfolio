import fs from 'fs';
const js = fs.readFileSync('ref_analyses.js', 'utf8');

// Search for any quoted words that look like classes or identifiers
const matches = js.match(/"([^"\\]{2,60})"/g) || [];
const unique = [...new Set(matches.map(s => s.slice(1, -1)))];
console.log('Total string tokens:', unique.length);
fs.writeFileSync('analyses_tokens.json', JSON.stringify(unique, null, 2));

const css = fs.readFileSync('ref_analyses.css', 'utf8');
const cssClasses = css.match(/\.[a-zA-Z0-9_-]+/g) || [];
console.log('CSS classes in ref_analyses.css:', [...new Set(cssClasses)].slice(0, 50));
fs.writeFileSync('analyses_css_classes.json', JSON.stringify([...new Set(cssClasses)], null, 2));

