const fs = require('fs');
const path = require('path');

const updates = {
  'review-huanqiuti.html': {
    title: '【深度评测】2026 环球梯 (HuanQiuTi)：晚高峰压测与 8K 解锁报告 ~ 咻咻小站',
    headline: '【深度评测】2026 环球梯 (HuanQiuTi)：晚高峰压测与 8K 解锁报告'
  },
  'review-dalaoyun.html': {
    title: '【深度评测】2026 大佬云 (DaLaoYun)：2.5G 不限设备与全线 IPLC 专线实测 ~ 咻咻小站',
    headline: '【深度评测】2026 大佬云 (DaLaoYun)：2.5G 不限设备与全线 IPLC 专线实测'
  },
  'review-duriancloud.html': {
    title: '【深度评测】2026 榴莲云 (LiuLianYun)：原生双 ISP 家宽与 8K 影音实测 ~ 咻咻小站',
    headline: '【深度评测】2026 榴莲云 (LiuLianYun)：原生双 ISP 家宽与 8K 影音实测'
  },
  'review-guangnianti.html': {
    title: '【深度评测】2026 光年梯 (GuangNianTi)：老牌专线与高性价比实测 ~ 咻咻小站',
    headline: '【深度评测】2026 光年梯 (GuangNianTi)：老牌专线与高性价比实测'
  },
  'review-jiliancloud.html': {
    title: '【深度评测】2026 极连云 (JiLianYun)：月付8元全 IPLC 专线实测 ~ 咻咻小站',
    headline: '【深度评测】2026 极连云 (JiLianYun)：月付8元全 IPLC 专线实测'
  },
  'review-yunjiexian.html': {
    title: '【深度评测】2026 云界线 (YunJieXian)：23ms 超低延迟与按量付费实测 ~ 咻咻小站',
    headline: '【深度评测】2026 云界线 (YunJieXian)：23ms 超低延迟与按量付费实测'
  },
  'review-shandianshu.html': {
    title: '【深度评测】2026 闪电鼠 (ShanDianShu)：移动联通优化与 2.5G 实测 ~ 咻咻小站',
    headline: '【深度评测】2026 闪电鼠 (ShanDianShu)：移动联通优化与 2.5G 实测'
  },
  'review-shenxing.html': {
    title: '【深度评测】2026 神行加速 (ShenXing)：50+ 节点晚高峰不限速实测 ~ 咻咻小站',
    headline: '【深度评测】2026 神行加速 (ShenXing)：50+ 节点晚高峰不限速实测'
  }
};

const roots = ['.', 'xiuxiuxiaozhan'];

roots.forEach(root => {
  Object.keys(updates).forEach(filename => {
    const filePath = path.join(root, filename);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    const { title, headline } = updates[filename];

    // 1. Update <title>...</title>
    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

    // 2. Update og:title
    content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i, `<meta property="og:title" content="${title}"`);

    // 3. Update twitter:title
    content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i, `<meta name="twitter:title" content="${title}"`);

    // 4. Update JSON-LD headline if present
    content = content.replace(/"headline":\s*"[^"]*"/g, `"headline": "${headline}"`);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[UPDATED] ${filePath} -> len: ${title.length} chars`);
  });
});

console.log('✅ 8 个核心评测页面标题、社交图谱与结构化数据更新完毕！');
