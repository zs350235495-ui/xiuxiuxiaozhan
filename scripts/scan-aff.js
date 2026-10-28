const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git'].includes(f)) res = res.concat(walk(full));
    } else if (f.endsWith('.html') || f.endsWith('.md')) {
      res.push(full);
    }
  });
  return res;
}

const files = walk('.');
const extLinks = [];

files.forEach(file => {
  const c = fs.readFileSync(file, 'utf-8');
  const regex = /href=["'](https?:\/\/[^"']+)["']/gi;
  let m;
  while ((m = regex.exec(c)) !== null) {
    extLinks.push({ file, url: m[1] });
  }
  const mdRegex = /\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/gi;
  while ((m = mdRegex.exec(c)) !== null) {
    extLinks.push({ file, url: m[2], isMd: true });
  }
});

console.log('Total external links found across all files:', extLinks.length);
const notGo = extLinks.filter(x => !x.file.split(path.sep).includes('go'));
console.log('Total external links outside /go/ folder:', notGo.length);

const grouped = {};
notGo.forEach(x => {
  grouped[x.url] = (grouped[x.url] || []);
  grouped[x.url].push(x.file);
});

for (const [url, fileList] of Object.entries(grouped)) {
  console.log(`URL: ${url} (count: ${fileList.length})`);
  fileList.slice(0, 3).forEach(f => console.log('   ', f));
  if (fileList.length > 3) console.log(`    ... and ${fileList.length - 3} more`);
}
