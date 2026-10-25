/**
 * 咻咻小站 (xiuxiuxiaozhan.com) - SEO 权重、架构安全与平台合规自动化 CI 审计门禁
 * 
 * 校验范围：
 * 1. 结构化数据 (Schema.org JSON-LD) 语法、@graph 架构与 inLanguage: zh-CN 校验
 * 2. Canonical 规范标签与 Clean URL 格式校验（杜绝哈希、参数、权重分散）
 * 3. 社交图谱元数据 (og:title, og:description, og:url, og:image, twitter:card) 100% 覆盖
 * 4. 标题语义化：全站页面严格且仅有 1 个 <h1>
 * 5. 零死链原则：站内所有内链对应真实物理文件，静态资源 100% 根绝对路径 (/css, /js, /images)
 * 6. 平台风控合规红线：严禁任何外部推广邀请链接 (?aff=, ?code=, ?ref=) 及外部社交群组直连
 * 7. 自定义 404 页面加固：包含 noindex, follow 及有效内链
 * 8. robots.txt 规范：放行静态资源及主流 AI 爬虫 (GPTBot, ClaudeBot, PerplexityBot 等)
 * 9. sitemap.xml 物理对齐：100% 对应真实物理静态页面，无虚拟锚点路由
 * 10. llms.txt & LICENSE：合规协议与 AI 引用规范完整
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

// 获取所有 HTML 文件
function getHtmlFiles() {
  const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  const blogFiles = fs.readdirSync('blog').filter(f => f.endsWith('.html')).map(f => 'blog/' + f);
  return rootFiles.concat(blogFiles);
}

const htmlFiles = getHtmlFiles();
console.log(`🔍 扫描到 ${htmlFiles.length} 个核心静态 HTML 页面进行深度审计...`);

// 1. 核心合规与协议文件检查
assert(fs.existsSync('LICENSE'), '根目录必须包含 LICENSE 文件');
if (fs.existsSync('LICENSE')) {
  const licenseContent = fs.readFileSync('LICENSE', 'utf-8');
  assert(licenseContent.includes('MIT License'), 'LICENSE 文件必须声明 MIT 协议');
}
if (fs.existsSync('README.md')) {
  const readme = fs.readFileSync('README.md', 'utf-8');
  assert(!readme.includes('tizishequ.com'), 'README.md 中严禁遗留 tizishequ.com 外部死链');
  assert(!readme.includes('?aff=') && !readme.includes('?code=') && !readme.includes('?ref='), 'README.md 中严禁包含商业返利邀请参数');
  assert(!readme.includes('t.me/'), 'README.md 中严禁包含外部社交群组直连');
  assert(readme.includes('环球梯') && readme.includes('大佬云'), 'README.md 必须包含 TOP 1 环球梯 与 TOP 2 大佬云');
  assert(readme.includes('闪电鼠'), 'README.md 必须正确声明闪电鼠（严禁误写为闪电云）');
}

// 2. robots.txt 检查
assert(fs.existsSync('robots.txt'), '根目录必须包含 robots.txt');
if (fs.existsSync('robots.txt')) {
  const robots = fs.readFileSync('robots.txt', 'utf-8');
  assert(robots.includes('Allow: /css/'), 'robots.txt 必须显式放行 /css/ 资源');
  assert(robots.includes('Allow: /js/'), 'robots.txt 必须显式放行 /js/ 资源');
  assert(robots.includes('Allow: /images/'), 'robots.txt 必须显式放行 /images/ 资源');
  assert(robots.includes('User-agent: GPTBot'), 'robots.txt 必须显式放行 GPTBot');
  assert(robots.includes('User-agent: ClaudeBot'), 'robots.txt 必须显式放行 ClaudeBot');
  assert(robots.includes('User-agent: PerplexityBot'), 'robots.txt 必须显式放行 PerplexityBot');
  assert(robots.includes('Sitemap: https://xiuxiuxiaozhan.com/sitemap.xml'), 'robots.txt 必须包含标准的 sitemap 声明');
}

// 3. llms.txt 检查
assert(fs.existsSync('llms.txt'), '根目录必须包含 llms.txt AI 知识索引文件');
if (fs.existsSync('llms.txt')) {
  const llms = fs.readFileSync('llms.txt', 'utf-8');
  assert(llms.includes('xiuxiuxiaozhan.com'), 'llms.txt 必须包含站点主域名');
  assert(llms.includes('环球梯') && llms.includes('大佬云') && llms.includes('闪电鼠'), 'llms.txt 必须包含核心服务商场景化细分推荐');
  assert(llms.includes('Benchmarking Methodology') || llms.includes('评测方法论'), 'llms.txt 必须包含客观评测方法论');
}

// 4. sitemap.xml 检查
assert(fs.existsSync('sitemap.xml'), '根目录必须包含 sitemap.xml 网站地图');
if (fs.existsSync('sitemap.xml')) {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf-8');
  assert(!sitemap.includes('#'), 'sitemap.xml 中严禁包含虚拟 # 锚点路由');
  const locMatches = sitemap.match(/<loc>([\s\S]*?)<\/loc>/g) || [];
  assert(locMatches.length >= 30, `sitemap.xml 收录条目数必须充足，当前为 ${locMatches.length}`);

  locMatches.forEach(m => {
    const loc = m.replace(/<\/?loc>/g, '').trim();
    assert(loc.startsWith('https://xiuxiuxiaozhan.com'), `sitemap URL 必须以规范域名开头: ${loc}`);
    
    // 验证物理文件对应关系
    let rel = loc.replace('https://xiuxiuxiaozhan.com', '');
    if (!rel || rel === '/') rel = '/index.html';
    const filePath = path.join('.', rel);
    assert(fs.existsSync(filePath), `sitemap 中的 URL 必须真实存在本地物理静态文件: ${loc} -> ${filePath}`);
  });
}

// 5. 自定义 404 页面加固检查
assert(fs.existsSync('404.html'), '必须包含 404.html 自定义页面');
if (fs.existsSync('404.html')) {
  const content404 = fs.readFileSync('404.html', 'utf-8');
  assert(content404.includes('content="noindex, follow"'), '404.html 必须包含 <meta name="robots" content="noindex, follow">');
  assert(content404.includes('href="/css/style.css"'), '404.html 样式必须采用根绝对路径');
  assert(content404.includes('href="/"'), '404.html 必须提供返回首页的有效内链');
  assert(content404.includes('href="/reviews.html"'), '404.html 必须提供核心栏目内链');
}

// 6. 全站 HTML 深度审计
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');

  // A. 标题层级审计：严格且仅有 1 个 <h1>
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  assert(h1Matches.length === 1, `页面 ${file} 必须严格且仅有 1 个 <h1> 标签，当前有 ${h1Matches.length} 个`);

  // B. Canonical 规范标签审计
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  assert(canonicalMatch !== null, `页面 ${file} 必须包含 <link rel="canonical"> 规范标签`);
  if (canonicalMatch) {
    const canonicalHref = canonicalMatch[1];
    assert(canonicalHref.startsWith('https://xiuxiuxiaozhan.com'), `页面 ${file} canonical 必须使用主域名绝对路径: ${canonicalHref}`);
    assert(!canonicalHref.includes('#'), `页面 ${file} canonical 严禁包含 # 锚点: ${canonicalHref}`);
    assert(!canonicalHref.includes('?'), `页面 ${file} canonical 严禁包含 query 参数: ${canonicalHref}`);
  }

  // C. 社交图谱与 Twitter Card 审计
  assert(content.includes('property="og:title"'), `页面 ${file} 必须包含 og:title`);
  assert(content.includes('property="og:description"'), `页面 ${file} 必须包含 og:description`);
  assert(content.includes('property="og:url"'), `页面 ${file} 必须包含 og:url`);
  assert(content.includes('property="og:image"'), `页面 ${file} 必须包含 og:image`);
  assert(content.includes('name="twitter:card"'), `页面 ${file} 必须包含 twitter:card`);

  // D. JSON-LD 结构化数据与 E-E-A-T 实体审计
  const jsonLdMatches = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
  assert(jsonLdMatches.length >= 1, `页面 ${file} 必须包含 Schema.org JSON-LD 结构化数据`);
  jsonLdMatches.forEach((scriptTag, idx) => {
    const rawJson = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '').trim();
    try {
      const parsed = JSON.parse(rawJson);
      assert(parsed['@context'] === 'https://schema.org', `页面 ${file} 第 ${idx+1} 个 JSON-LD 必须声明 @context: "https://schema.org"`);
      const jsonStr = JSON.stringify(parsed);
      assert(jsonStr.includes('zh-CN'), `页面 ${file} 结构化数据必须声明 inLanguage: zh-CN`);
    } catch (e) {
      assert(false, `页面 ${file} JSON-LD 无法解析为有效 JSON: ${e.message}`);
    }
  });

  // E. 静态资源根绝对路径校验
  const relCss = content.match(/href=["'](?:\.\/|\.\.\/)+[^"']*\.css["']/gi) || [];
  assert(relCss.length === 0, `页面 ${file} 严禁使用相对路径引入 CSS，必须使用根绝对路径: ${JSON.stringify(relCss)}`);

  const relJs = content.match(/src=["'](?:\.\/|\.\.\/)+[^"']*\.js["']/gi) || [];
  assert(relJs.length === 0, `页面 ${file} 严禁使用相对路径引入 JS，必须使用根绝对路径: ${JSON.stringify(relJs)}`);

  const relImg = content.match(/src=["'](?:\.\/|\.\.\/)+[^"']*\.(?:png|jpg|jpeg|svg|webp)["']/gi) || [];
  assert(relImg.length === 0, `页面 ${file} 严禁使用相对路径引入图片或图标，必须使用根绝对路径: ${JSON.stringify(relImg)}`);

  // F. 平台风控合规红线检查
  const affLinks = content.match(/href=["']https?:\/\/[^"']*(?:aff|\?code=|\?ref=)[^"']*["']/gi) || [];
  assert(affLinks.length === 0, `页面 ${file} 严禁包含商业推广返利外链: ${JSON.stringify(affLinks)}`);

  const tgLinks = content.match(/href=["']https?:\/\/t\.me\/[^"']*["']/gi) || [];
  assert(tgLinks.length === 0, `页面 ${file} 严禁包含外部 Telegram 社交群组直连: ${JSON.stringify(tgLinks)}`);
});

// 7. 站内内链健康度与零死链校验
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const hrefMatches = content.match(/href=["']([^"']+)["']/g) || [];

  hrefMatches.forEach(m => {
    const href = m.replace(/^href=["']|["']$/g, '').trim();
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
    
    let internalPath = null;
    if (href.startsWith('https://xiuxiuxiaozhan.com')) {
      internalPath = href.replace('https://xiuxiuxiaozhan.com', '') || '/';
    } else if (href.startsWith('/')) {
      internalPath = href;
    }

    if (internalPath) {
      let clean = internalPath.split('#')[0].split('?')[0];
      if (!clean || clean === '/') clean = '/index.html';
      const targetDiskFile = path.join('.', clean);
      assert(fs.existsSync(targetDiskFile), `内链死链检测失败！在 ${file} 中的链接 ${href} (映射为 ${targetDiskFile}) 本地不存在`);
    }
  });
});

console.log('\n========================================');
console.log(`✅ CI 门禁检查完成！共执行 ${passedChecks} 项断言，发现 ${errors.length} 项违规/错误。`);
console.log('========================================\n');

if (errors.length > 0) {
  console.error(`💥 门禁未通过，存在 ${errors.length} 项错误，请修复后再提交！`);
  process.exit(1);
} else {
  console.log('🎉 恭喜！全站 SEO 权重挖掘、技术架构规范与平台合规门禁 100% 全部通过！');
  process.exit(0);
}
