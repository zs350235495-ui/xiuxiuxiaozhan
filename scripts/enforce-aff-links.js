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
    } else if (f.endsWith('.html') || f.endsWith('.md')) {
      res.push(full);
    }
  });
  return res;
}

const allFiles = walk('.');
let modifiedFilesCount = 0;
let modifiedTagsCount = 0;

const fileDetails = [];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  let fileChanges = 0;

  // 1. 处理所有包含 /go/ 或 /go.html 的 a 标签
  // 匹配形如 <a ... href="/go/..." ...> 或 <a ... href="/go.html?..." ...>
  content = content.replace(/<a\b([^>]*\bhref=["'](?:\/go\/|\/go\.html)[^"']*["'][^>]*)>/gi, (match, attrs) => {
    const relRegex = /\brel=(["'])(.*?)\1/i;
    const relMatch = attrs.match(relRegex);

    const requiredRel = 'nofollow sponsored noopener noreferrer';

    if (relMatch) {
      const currentRel = relMatch[2];
      if (currentRel.trim() === requiredRel) {
        return match; // 已经完全符合标准，无需修改
      }
      const quote = relMatch[1];
      const newAttrs = attrs.replace(relRegex, `rel=${quote}${requiredRel}${quote}`);
      fileChanges++;
      modifiedTagsCount++;
      return `<a${newAttrs}>`;
    } else {
      fileChanges++;
      modifiedTagsCount++;
      return `<a${attrs} rel="${requiredRel}">`;
    }
  });

  // 2. 如果是 /go/*/index.html 中的兜底外链按钮，也必须严格加上 rel="nofollow sponsored noopener noreferrer"
  if (file.split(path.sep).includes('go') && file.endsWith('.html')) {
    content = content.replace(/<a\b([^>]*\bhref=["']https?:\/\/[^"']*["'][^>]*)>/gi, (match, attrs) => {
      const relRegex = /\brel=(["'])(.*?)\1/i;
      const relMatch = attrs.match(relRegex);
      const requiredRel = 'nofollow sponsored noopener noreferrer';

      if (relMatch) {
        const currentRel = relMatch[2];
        if (currentRel.trim() === requiredRel) return match;
        const quote = relMatch[1];
        const newAttrs = attrs.replace(relRegex, `rel=${quote}${requiredRel}${quote}`);
        fileChanges++;
        modifiedTagsCount++;
        return `<a${newAttrs}>`;
      } else {
        fileChanges++;
        modifiedTagsCount++;
        return `<a${attrs} rel="${requiredRel}">`;
      }
    });
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    modifiedFilesCount++;
    fileDetails.push({ file, fileChanges });
  }
});

console.log(`✅ 链接规范更新完成！`);
console.log(`- 修改文件数：${modifiedFilesCount}`);
console.log(`- 规范化修改标签数：${modifiedTagsCount}`);
fileDetails.forEach(d => {
  console.log(`  [UPDATED] ${d.file} (${d.fileChanges} 处标签)`);
});
