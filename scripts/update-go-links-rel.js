const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git'].includes(f)) {
        res = res.concat(walk(full));
      }
    } else if (f.endsWith('.html')) {
      res.push(full);
    }
  });
  return res;
}

const htmlFiles = walk('.');
let totalUpdatedTags = 0;
let updatedFilesCount = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Match all <a> tags that have href="/go/..."
  // Tag might span multiple attributes
  content = content.replace(/<a\b([^>]*\bhref=["']\/go\/[^"']*["'][^>]*)>/gi, (match, attrs) => {
    // Check if rel attribute exists
    const relRegex = /\brel=(["'])(.*?)\1/i;
    const relMatch = attrs.match(relRegex);

    if (relMatch) {
      const quote = relMatch[1];
      const currentTokens = relMatch[2].split(/\s+/).filter(Boolean);
      const tokenSet = new Set(currentTokens);

      tokenSet.add('nofollow');
      tokenSet.add('noopener');
      tokenSet.add('noreferrer');

      // Sort order: nofollow, sponsored (if existed), noopener, noreferrer
      const finalTokens = [];
      if (tokenSet.has('nofollow')) finalTokens.push('nofollow');
      if (tokenSet.has('sponsored')) finalTokens.push('sponsored');
      if (tokenSet.has('noopener')) finalTokens.push('noopener');
      if (tokenSet.has('noreferrer')) finalTokens.push('noreferrer');

      const newRel = `rel=${quote}${finalTokens.join(' ')}${quote}`;
      const newAttrs = attrs.replace(relRegex, newRel);
      totalUpdatedTags++;
      return `<a${newAttrs}>`;
    } else {
      // Add rel attribute
      totalUpdatedTags++;
      return `<a${attrs} rel="nofollow noopener noreferrer">`;
    }
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedFilesCount++;
  }
});

console.log(`✅ 规范更新完成！共修改了 ${updatedFilesCount} 个文件中的 ${totalUpdatedTags} 处 /go/ 链接标签。`);
