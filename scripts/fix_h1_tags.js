const fs = require('fs');
const path = require('path');

const targetRoots = ['go', 'xiuxiuxiaozhan/go'];
let count = 0;

targetRoots.forEach(root => {
  if (!fs.existsSync(root)) return;
  const dirs = fs.readdirSync(root);
  dirs.forEach(d => {
    const filePath = path.join(root, d, 'index.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('<h1') && content.includes('<h2')) {
      content = content.replace(/<h2([\s\S]*?)<\/h2>/i, '<h1$1</h1>');
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
      console.log(`Updated H1 in: ${filePath}`);
    }
  });
});

console.log(`\nTotal files updated with H1: ${count}`);
