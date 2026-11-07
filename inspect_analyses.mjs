import fs from 'fs';
const js = fs.readFileSync('ref_analyses.js', 'utf8');

// Match template / JSX structure and element classes
const classRegex = /class:\s*"([^"]+)"|className:\s*"([^"]+)"/g;
const classes = [];
let m;
while ((m = classRegex.exec(js)) !== null) {
  classes.push(m[1] || m[2]);
}

// Find HTML strings or element names
const tags = js.match(/_createElementVNode\("([^"]+)"/g) || js.match(/_createVNode\("([^"]+)"/g) || [];

console.log('Unique classes:', [...new Set(classes)]);
console.log('Sample tags:', tags.slice(0, 30));

