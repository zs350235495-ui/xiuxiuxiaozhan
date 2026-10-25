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
let count = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  // Match <meta http-equiv="refresh" ...> or <meta http-equiv='refresh' ...> including preceding whitespace and newline
  const refreshRegex = /\r?\n\s*<meta\s+http-equiv=["']refresh["'][^>]*>/gi;
  if (refreshRegex.test(content)) {
    content = content.replace(refreshRegex, '');
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log(`Removed meta refresh from: ${file}`);
  }
}

console.log(`\nTotal files cleaned: ${count}`);
