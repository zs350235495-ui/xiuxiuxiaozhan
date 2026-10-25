const fs = require('fs');
const path = require('path');

// 1. 创建 /go/tg/ 与 /go/telegram/ 中转页面
function generateTgRedirectHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="refresh" content="0;url=https://t.me/huanqiuti8899">
  <title>正在连接官方客服...</title>
  <script>
    window.location.replace("https://t.me/huanqiuti8899");
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #FFF5F7; color: #475569;">
  <div style="text-align: center; padding: 32px 28px; background: #FFFFFF; border-radius: 20px; box-shadow: 0 8px 30px rgba(43,160,227,0.18); max-width: 440px; border: 2px dashed #B8E4FB;">
    <div style="font-size: 2.4rem; margin-bottom: 12px;">✈️</div>
    <h2 style="font-size: 1.25rem; color: #0F172A; margin: 0 0 10px 0; font-weight: 800;">正在安全连接官方客服...</h2>
    <p style="font-size: 0.88rem; color: #64748B; line-height: 1.6; margin: 0 0 16px 0;">
      咻咻小站正在为您唤起 Telegram 官方在线客服通道。如浏览器未自动跳转，请点击下方蓝色按钮直达：
    </p>
    <a href="https://t.me/huanqiuti8899" rel="nofollow noopener" style="display: inline-block; background: linear-gradient(135deg, #2BA0E3, #1A8CD8); color: #FFFFFF; text-decoration: none; padding: 11px 28px; border-radius: 999px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(43,160,227,0.35);">
      立即前往官方客服 ↗
    </a>
  </div>
</body>
</html>
`;
}

const targetRoots = ['.', 'xiuxiuxiaozhan'];
const tgSlugs = ['tg', 'telegram'];

targetRoots.forEach(root => {
  tgSlugs.forEach(slug => {
    const dir = path.join(root, 'go', slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, 'index.html');
    fs.writeFileSync(filePath, generateTgRedirectHtml(), 'utf-8');
    console.log(`[OK] Created ${filePath} -> https://t.me/huanqiuti8899`);
  });
});

// 2. 遍历全站 HTML 文件，更新官方客服跳转链接
function walkHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes(path.join('go', ''))) {
        results = results.concat(walkHtmlFiles(file));
      }
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

let modifiedCount = 0;
const allHtmls = walkHtmlFiles('.');

allHtmls.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // 1. 悬浮按钮更新
  content = content.replace(
    /<a href="\/guide\.html" target="_blank" rel="noopener" class="tg-float-btn"[^>]*>💬 官方客服<\/a>/g,
    '<a href="/go/tg/" target="_blank" rel="nofollow noopener noreferrer" class="tg-float-btn" title="点击联系官方客服">💬 官方客服</a>'
  );

  // 2. 页脚客服链接更新
  content = content.replace(
    /<a href="\/guide\.html" target="_blank" rel="noopener" style="color: #2BA0E3; font-weight: 700;">💬 官方客服<\/a>/g,
    '<a href="/go/tg/" target="_blank" rel="nofollow noopener noreferrer" style="color: #2BA0E3; font-weight: 700;">💬 官方客服</a>'
  );
  content = content.replace(
    /<a href="\/guide\.html" target="_blank" rel="noopener" style="color: #FF8FAB; font-weight: 700;">💬 官方客服<\/a>/g,
    '<a href="/go/tg/" target="_blank" rel="nofollow noopener noreferrer" style="color: #2BA0E3; font-weight: 700;">💬 官方客服</a>'
  );

  // 3. Hero 区域客服按钮更新
  content = content.replace(
    /<a href="\/guide\.html" target="_blank" rel="noopener" class="btn btn-outline">💬 官方客服<\/a>/g,
    '<a href="/go/tg/" target="_blank" rel="nofollow noopener noreferrer" class="btn btn-outline" style="border-color: #2BA0E3; color: #2BA0E3;">💬 官方客服</a>'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    modifiedCount++;
    console.log(`[UPDATED] ${file}`);
  }
});

console.log(`🎉 任务完成！共更新了 ${modifiedCount} 个 HTML 文件中的官方客服跳转链接。`);
