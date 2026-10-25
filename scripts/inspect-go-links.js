const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git'].includes(f)) res = res.concat(walk(full));
    } else if (f.endsWith('.html')) res.push(full);
  });
  return res;
}

const htmls = walk('.');
const goLinks = new Set();
const details = [];

htmls.forEach(file => {
  const c = fs.readFileSync(file, 'utf-8');
  const aRegex = /<a\s+[^>]*href=["'](\/go\/[^"']*)["'][^>]*>/gi;
  let match;
  while ((match = aRegex.exec(c)) !== null) {
    const fullTag = match[0];
    const href = match[1];
    goLinks.add(href);
    const relMatch = fullTag.match(/rel=["']([^"']*)["']/i);
    const rel = relMatch ? relMatch[1] : '(none)';
    details.push({ file, href, rel, fullTag });
  }
});

console.log('Total /go/ link occurrences:', details.length);
console.log('Unique hrefs:', Array.from(goLinks));
const relTypes = {};
details.forEach(d => {
  relTypes[d.rel] = (relTypes[d.rel] || 0) + 1;
});
console.log('Rel breakdown:', relTypes);
