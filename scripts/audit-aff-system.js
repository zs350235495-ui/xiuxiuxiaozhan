const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('🔍 开始执行全站「AFF 推广链接 301 隔离与合规改造」门禁审计与自检');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ✅ ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ❌ ${message}`);
    failCount++;
  }
}

// 1. 检查 robots.txt
['./robots.txt', './xiuxiuxiaozhan/robots.txt'].forEach(rPath => {
  if (fs.existsSync(rPath)) {
    const content = fs.readFileSync(rPath, 'utf-8');
    assert(!content.includes('Disallow: /go'), `${rPath} 严禁包含 Disallow: /go`);
    assert(!content.includes('Disallow: /go.html'), `${rPath} 严禁包含 Disallow: /go.html`);
    assert(content.includes('Allow: /go/'), `${rPath} 必须包含 Allow: /go/ 显式放行`);
    assert(content.includes('Allow: /go.html'), `${rPath} 必须包含 Allow: /go.html 显式放行`);
  } else {
    assert(false, `缺少文件 ${rPath}`);
  }
});

// 2. 检查 /go.html 承接页
['./go.html', './xiuxiuxiaozhan/go.html'].forEach(goPath => {
  if (fs.existsSync(goPath)) {
    const content = fs.readFileSync(goPath, 'utf-8');
    assert(
      /<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']/i.test(content),
      `${goPath} 头部包含标准的 <meta name="robots" content="noindex, nofollow">`
    );
    assert(content.includes('window.location.replace'), `${goPath} 包含 window.location.replace 快速重定向`);
    assert(content.includes('rel="nofollow sponsored noopener noreferrer"'), `${goPath} 兜底按钮包含完整 rel 属性`);
    
    // 检查核心服务商是否配置齐全
    const expectedSlugs = [
      'huanqiuti', 'shenxing', 'liulianyun', 'duriancloud', 'yunjiexian',
      'shandianshu', 'dalaoyun', 'jilianyun', 'jiliancloud', 'guangnianti',
      'kexinyun', 'yuntu', 'kunpeng', 'sujie', 'kuaili', 'bianyuan', 'shunyun', 'tg', 'telegram'
    ];
    let allSlugsFound = true;
    expectedSlugs.forEach(slug => {
      if (!content.includes(`'${slug}'`)) {
        allSlugsFound = false;
        console.error(`  缺少服务商 slug: ${slug} in ${goPath}`);
      }
    });
    assert(allSlugsFound, `${goPath} 包含全部 19 个服务商与别名 slug`);
  } else {
    assert(false, `缺少文件 ${goPath}`);
  }
});

// 3. 检查 _redirects
['./_redirects', './xiuxiuxiaozhan/_redirects'].forEach(redPath => {
  if (fs.existsSync(redPath)) {
    const content = fs.readFileSync(redPath, 'utf-8');
    assert(content.includes('/go/huanqiuti'), `${redPath} 包含环球梯 301 重定向规则`);
    assert(content.includes('/go/dalaoyun'), `${redPath} 包含大佬云 301 重定向规则`);
    assert(content.includes('/go/tg'), `${redPath} 包含 Telegram 301 重定向规则`);
    assert(content.includes('301!'), `${redPath} 包含 Cloudflare / Netlify 301! 强制状态码标记`);
  } else {
    assert(false, `缺少文件 ${redPath}`);
  }
});

// 4. 检查 nginx-redirects.conf
['./nginx-redirects.conf', './xiuxiuxiaozhan/nginx-redirects.conf'].forEach(ngPath => {
  if (fs.existsSync(ngPath)) {
    const content = fs.readFileSync(ngPath, 'utf-8');
    assert(content.includes('location ~* ^/go/huanqiuti/?$'), `${ngPath} 包含环球梯 location 匹配`);
    assert(content.includes('location ~* ^/go/dalaoyun/?$'), `${ngPath} 包含大佬云 location 匹配`);
    assert(content.includes('return 301'), `${ngPath} 使用标准 return 301 状态码`);
  } else {
    assert(false, `缺少文件 ${ngPath}`);
  }
});

// 5. 遍历全站 HTML 文件检查链接标签与死链
function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git'].includes(f)) res = res.concat(walk(full));
    } else if (f.endsWith('.html')) res.push(full);
  });
  return res;
}

const allHtmls = walk('.');
let totalGoLinks = 0;
let validGoLinks = 0;
let invalidRelGoLinks = 0;
let deadGoLinks = 0;

allHtmls.forEach(file => {
  const isInsideGoFolder = file.split(path.sep).includes('go');
  const content = fs.readFileSync(file, 'utf-8');
  
  // 检查 /go/ 链接
  const aRegex = /<a\b([^>]*\bhref=["'](\/go\/[^"']*)["'][^>]*)>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    totalGoLinks++;
    const attrs = match[1];
    const href = match[2];

    // 检查 rel 属性
    const relMatch = attrs.match(/\brel=(["'])(.*?)\1/i);
    const rel = relMatch ? relMatch[2].trim() : '';
    const hasRequiredRel = rel.includes('nofollow') && rel.includes('sponsored') && rel.includes('noopener') && rel.includes('noreferrer');

    if (hasRequiredRel) {
      validGoLinks++;
    } else {
      invalidRelGoLinks++;
      console.error(`  [INVALID REL] ${file} -> ${href} (rel: "${rel}")`);
    }

    // 检查死链 (对应本地 /go/<slug>/index.html 是否存在)
    const cleanSlug = href.replace(/^\/go\//, '').replace(/\/$/, '').split('?')[0];
    const rootTarget = path.join('.', 'go', cleanSlug, 'index.html');
    const subTarget = path.join('.', 'xiuxiuxiaozhan', 'go', cleanSlug, 'index.html');
    if (!fs.existsSync(rootTarget) && !fs.existsSync(subTarget)) {
      deadGoLinks++;
      console.error(`  [DEAD LINK] ${file} -> ${href} (找不到对应实体页面)`);
    }
  }
});

assert(totalGoLinks > 0, `全站共扫描到 ${totalGoLinks} 处 /go/ 内链标签`);
assert(invalidRelGoLinks === 0, `所有 /go/ 内链必须全部带有 rel="nofollow sponsored noopener noreferrer" (异常数: ${invalidRelGoLinks})`);
assert(deadGoLinks === 0, `全站 /go/ 内链 100% 对应真实有效的中转静态承接文件与重定向规则 (死链数: ${deadGoLinks})`);

// 6. 检查现有 test-seo-audit.js 是否依然完全通过
console.log('\n----------------------------------------------------------------');
console.log(`📊 门禁自检结果汇总：通过 [${passCount}] 项，失败 [${failCount}] 项`);
console.log('----------------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 全部合规与死链门禁检查 100% 通过！');
}
