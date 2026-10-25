const fs = require('fs');
const path = require('path');

const targetRoots = ['go', 'xiuxiuxiaozhan/go'];

function getBrandName(dirName, content) {
  const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match) {
    const raw = h2Match[1].replace(/<[^>]+>/g, '').trim();
    const brandMatch = raw.match(/正在安全前往\s*(.*?)\s*官网/);
    if (brandMatch) return brandMatch[1].trim();
  }
  return null;
}

let modifiedCount = 0;

targetRoots.forEach(root => {
  if (!fs.existsSync(root)) return;
  const dirs = fs.readdirSync(root);
  dirs.forEach(d => {
    const filePath = path.join(root, d, 'index.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('name="description"')) return;

    const brand = getBrandName(d, content);
    let descriptionText = '';
    if (d === 'tg' || d === 'telegram') {
      descriptionText = '咻咻小站正在为您安全连接 Telegram 官方在线客服通道。如浏览器未自动跳转，请点击直达按钮联系客服。';
    } else if (brand) {
      descriptionText = `咻咻小站正在为您分配专属安全加速通道并跳转至${brand}官网。如未自动跳转，请点击直达按钮前往。`;
    } else {
      descriptionText = '咻咻小站安全跳转中转页面，正在为您安全分配专属直达通道。';
    }

    // Check if viewport exists
    const hasViewport = content.includes('name="viewport"');
    let injectTags = `\n  <meta name="description" content="${descriptionText}">`;
    if (!hasViewport) {
      injectTags = `\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">` + injectTags;
    }

    if (content.includes('<meta name="robots" content="noindex, nofollow">')) {
      content = content.replace(
        '<meta name="robots" content="noindex, nofollow">',
        `<meta name="robots" content="noindex, nofollow">${injectTags}`
      );
    } else if (content.includes('<meta charset="UTF-8">')) {
      content = content.replace(
        '<meta charset="UTF-8">',
        `<meta charset="UTF-8">${injectTags}`
      );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${filePath} -> desc: ${descriptionText}`);
  });
});

console.log(`\nSuccessfully updated ${modifiedCount} files.`);
