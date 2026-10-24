const fs = require('fs');
const path = require('path');

const providers = [
  {
    name: '环球梯',
    slugs: ['huanqiuti'],
    url: 'https://123pps01.huanqiutiaff.com/#/?code=j5VBUvw0',
    coupon: 'HQ66',
    discount: '7折'
  },
  {
    name: '神行加速',
    slugs: ['shenxing'],
    url: 'https://pps123.shenxingaff.com/#/?code=6tQ7zHUc',
    coupon: 'sx0077',
    discount: '7折'
  },
  {
    name: '榴莲云',
    slugs: ['liulianyun', 'duriancloud'],
    url: 'https://123pp01.liulianyunaff.com/#/?code=MsZP3u7G',
    coupon: 'll88',
    discount: '7折'
  },
  {
    name: '云界线',
    slugs: ['yunjiexian'],
    url: 'https://pp01.yunjiexianaff.com/#/?code=bp0ZSKBV',
    coupon: 'yjx888',
    discount: '7折'
  },
  {
    name: '闪电鼠',
    slugs: ['shandianshu'],
    url: 'https://ppsvip01.shandianshuaff.com/#/?code=QbLF8tjB',
    coupon: 'sds88',
    discount: '7折'
  },
  {
    name: '大佬云',
    slugs: ['dalaoyun'],
    url: 'https://ppsvip01.dalaoyunaff.com/#/?code=Iz1GlCVa',
    coupon: 'dly88',
    discount: '7折'
  },
  {
    name: '极连云',
    slugs: ['jilianyun', 'jiliancloud'],
    url: 'https://haozevpn.jlyvipaff.com/#/?code=jwCMOvQO',
    coupon: 'JLY888',
    discount: '8折'
  },
  {
    name: '光年梯',
    slugs: ['guangnianti'],
    url: 'https://gnt001.gntvipaff.cc/#/?code=PQhPFDhO',
    coupon: 'GNT80',
    discount: '8折'
  },
  {
    name: '可信云',
    slugs: ['kexinyun'],
    url: 'https://everett7623.kosingaff.com/#/?code=sFKkfEYs',
    coupon: 'kxy80',
    discount: '8折'
  },
  {
    name: '云图机场',
    slugs: ['yuntu'],
    url: 'https://super.ytjcok.org/#/register?code=poKwFVtv',
    coupon: 'yt88',
    discount: '8折'
  },
  {
    name: '鲲鹏加速',
    slugs: ['kunpeng'],
    url: 'https://kunpengjiasu.com/#/register?code=WPugVZUe',
    coupon: 'WPugVZUe',
    discount: '专属'
  },
  {
    name: '速界',
    slugs: ['sujie'],
    url: 'https://pygllc.speedworldaff.cc/#/?code=kcoensXG',
    coupon: 'sujie888',
    discount: '专属'
  },
  {
    name: '快狸快狸',
    slugs: ['kuaili'],
    url: 'https://fanxiaobin.kuailiaff.com/#/?code=e0cAmK7F',
    coupon: 'kl888',
    discount: '专属'
  },
  {
    name: '边缘节点',
    slugs: ['bianyuan'],
    url: 'https://wep.edgenovaaff.com/#/?code=mLLL6h6F',
    coupon: 'xk808',
    discount: '专属'
  },
  {
    name: '瞬云',
    slugs: ['shunyun'],
    url: 'https://ddd.jichang.best/#/register?code=nldUZaYc',
    coupon: 'nldUZaYc',
    discount: '官网'
  }
];

function generateRedirectHtml(name, url, coupon, discount) {
  const couponText = coupon ? `（结账时输入专属优惠码 <strong>${coupon}</strong> 享${discount}优惠）` : '';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="refresh" content="0;url=${url}">
  <title>正在安全跳转至${name}官网...</title>
  <script>
    window.location.replace("${url}");
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #FFF5F7; color: #475569;">
  <div style="text-align: center; padding: 32px 28px; background: #FFFFFF; border-radius: 20px; box-shadow: 0 8px 30px rgba(255,142,167,0.18); max-width: 440px; border: 2px dashed #FFD6E0;">
    <div style="font-size: 2.4rem; margin-bottom: 12px;">✈️</div>
    <h2 style="font-size: 1.25rem; color: #0F172A; margin: 0 0 10px 0; font-weight: 800;">正在安全前往 ${name} 官网...</h2>
    <p style="font-size: 0.88rem; color: #64748B; line-height: 1.6; margin: 0 0 16px 0;">
      咻咻小站正在为您分配专属安全加速通道${couponText}。如浏览器未自动跳转，请点击下方粉色按钮直达：
    </p>
    <a href="${url}" rel="nofollow sponsored" style="display: inline-block; background: linear-gradient(135deg, #FF8EA7, #FF6B8B); color: #FFFFFF; text-decoration: none; padding: 11px 28px; border-radius: 999px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(255,107,139,0.35);">
      立即前往 ${name} 官网 ↗
    </a>
  </div>
</body>
</html>
`;
}

// Write to both root go/ and xiuxiuxiaozhan/go/
const targetRoots = ['.', 'xiuxiuxiaozhan'];

targetRoots.forEach(root => {
  providers.forEach(p => {
    p.slugs.forEach(slug => {
      const dir = path.join(root, 'go', slug);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, 'index.html');
      const html = generateRedirectHtml(p.name, p.url, p.coupon, p.discount);
      fs.writeFileSync(filePath, html, 'utf-8');
      console.log(`[OK] Created ${filePath} -> ${p.url}`);
    });
  });
});

console.log('✅ 全部 15 家服务商安全跳转中转页面创建完成！');
