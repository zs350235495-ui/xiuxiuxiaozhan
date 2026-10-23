/**
 * 咻咻小站 (xiuxiuxiaozhan.com) - SEO 权重、架构安全与平台合规自动化 CI 审计门禁
 */
const fs = require('fs');
const path = require('path');

let errors = [];
let passedChecks = 0;

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
    console.error(`❌ [FAIL] ${message}`);
  } else {
    passedChecks++;
  }
}

console.log('🚀 开始执行 咻咻小站 (xiuxiuxiaozhan.com) 全面 SEO 权重与合规门禁测试...\n');

function getHtmlFiles() {
  const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => 'blog/' + f);
  return rootFiles.concat(blogFiles);
}

const htmlFiles = getHtmlFiles();
console.log(`🔍 扫描到 ${htmlFiles.length} 个核心静态 HTML 页面进行深度审计...`);

assert(fs.existsSync('LICENSE'), '根目录必须包含 LICENSE 文件');
assert(fs.existsSync('README.md'), '根目录必须包含 README.md');
assert(fs.existsSync('robots.txt'), '根目录必须包含 robots.txt');
assert(fs.existsSync('llms.txt'), '根目录必须包含 llms.txt');
assert(fs.existsSync('sitemap.xml'), '根目录必须包含 sitemap.xml');
assert(fs.existsSync('404.html'), '必须包含 404.html 自定义页面');

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  assert(h1Matches.length === 1, `页面 ${file} 必须严格且仅有 1 个 <h1> 标签，当前有 ${h1Matches.length} 个`);

  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  assert(canonicalMatch !== null, `页面 ${file} 必须包含 <link rel="canonical"> 规范标签`);

  assert(content.includes('property="og:title"'), `页面 ${file} 必须包含 og:title`);
  assert(content.includes('name="twitter:card"'), `页面 ${file} 必须包含 twitter:card`);

  const jsonLdMatches = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
  assert(jsonLdMatches.length >= 1, `页面 ${file} 必须包含 Schema.org JSON-LD 结构化数据`);

  const relCss = content.match(/href=["'](?:\.\/|\.\.\/)+[^"']*\.css["']/gi) || [];
  assert(relCss.length === 0, `页面 ${file} 严禁使用相对路径引入 CSS`);

  const affLinks = content.match(/href=["']https?:\/\/[^"']*(?:aff|\?code=|\?ref=)[^"']*["']/gi) || [];
  assert(affLinks.length === 0, `页面 ${file} 严禁包含商业推广返利外链`);

  const tgLinks = content.match(/href=["']https?:\/\/t\.me\/[^"']*["']/gi) || [];
  assert(tgLinks.length === 0, `页面 ${file} 严禁包含外部 Telegram 社交群组直连`);
});

console.log('\n========================================');
console.log(`✅ CI 门禁检查完成！共执行 ${passedChecks} 项断言，发现 ${errors.length} 项违规/错误。`);
console.log('========================================\n');

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 恭喜！全站 SEO 权重挖掘、技术架构规范与平台合规门禁 100% 全部通过！');
  process.exit(0);
}
