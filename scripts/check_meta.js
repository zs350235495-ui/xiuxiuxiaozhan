const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = walk(__dirname ? path.resolve(__dirname, '..') : '.');
const missing = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('name="description"') && !content.includes("name='description'")) {
    missing.push(path.relative(path.resolve(__dirname, '..'), file));
  }
}

console.log('Total missing:', missing.length);
console.log(JSON.stringify(missing, null, 2));
