const fs = require('fs');
const path = require('path');

const NEW_ARTICLE_URL = 'https://xiuxiuxiaozhan.com/articles/best-airport-ladder-2026-protocol-guide.html';
const NEW_ARTICLE_PATH = '/articles/best-airport-ladder-2026-protocol-guide.html';
const TODAY = '2026-11-19';

console.log('🚀 开始执行全站新文章索引与入口同步...');

// 1. 同步 blog.html 和 xiuxiuxiaozhan/blog.html
const blogCard = `      <!-- 🌟 最新重磅 2026机场推荐与梯子推荐全攻略 -->
      <article class="blog-card" data-category="review" style="border: 2px solid var(--primary); background: #FFFDF8;">
        <div class="blog-header">
          <div class="blog-tags">
            <span class="blog-tag" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: #FFFFFF; font-weight: 800;">🔥 2026 机场推荐</span>
            <span class="blog-tag">#梯子推荐</span>
            <span class="blog-tag" style="background: #DBEAFE; color: #1E40AF; border-color: #BFDBFE;">#VLESS与Hysteria2</span>
            <span class="blog-tag blog-tag-blue">#IEPL物理专线</span>
            <span class="blog-tag" style="background: #E8F5E9; color: #2E7D32; border-color: #A5D6A7;">#AI流媒体精细分流</span>
          </div>
          <span class="blog-date" style="color: var(--primary); font-weight: 700;">📡 2026 全协议横评</span>
        </div>
        <h2 class="blog-title">
          <a href="/articles/best-airport-ladder-2026-protocol-guide.html" style="color: var(--primary);">🚀《2026机场推荐与梯子推荐全攻略：协议架构对比、多端客户端配置与AI流媒体分流指南》</a>
        </h2>
        <p class="blog-excerpt">
          2026年最新机场推荐与梯子推荐全攻略。深度剖析VLESS、Hysteria2与AnyTLS协议底层演进，实测物理专线(IEPL/IPLC)与BGP中转晚高峰稳定性，详解Windows/macOS/iOS/Android全平台客户端TUN分流配置与ChatGPT/4K流媒体解锁方案。
        </p>
        <div class="comment-box" style="margin-bottom: 14px; background: #FFFBF7; border-left-color: var(--primary);">
          💡 <strong>核心看点：</strong> VLESS-Reality抗封锁机理、Hysteria2主动拥塞控制、IEPL物理专线vs多线BGP实测对比、多端客户端TUN模式配置避坑、环球梯与大佬云实测标杆。
        </div>
        <div class="blog-footer">
          <span class="blog-author">🍓 试吃甜心 (协议工程与选型评测组 · 约4200字硬核深度)</span>
          <a href="/articles/best-airport-ladder-2026-protocol-guide.html" class="btn btn-primary" style="padding: 6px 16px; font-size: 0.82rem;">查看 4200字 深度指南 ➔</a>
        </div>
      </article>\r\n\r\n`;

['blog.html', 'xiuxiuxiaozhan/blog.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/24篇/g, '25篇');
  const anchor = '      <!-- 🌟 最新重磅 2026纯IPv6双栈网络翻墙梯子与高速机场推荐指南 -->';
  if (content.includes(anchor) && !content.includes(NEW_ARTICLE_PATH)) {
    content = content.replace(anchor, blogCard + anchor);
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ [blog.html] 成功更新文章卡片与篇数: ${file}`);
  } else if (content.includes(NEW_ARTICLE_PATH)) {
    console.log(`ℹ️ [blog.html] 已存在新文章卡片，跳过插入: ${file}`);
  } else {
    console.error(`❌ [blog.html] 未找到锚点: ${file}`);
  }
});

// 2. 同步 index.html 和 xiuxiuxiaozhan/index.html
const indexCard = `            <div style="background: #EFF6FF; padding: 12px 16px; border-radius: var(--radius-md); border: 1px dashed #3B82F6;">
              <span class="blog-tag" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: #FFFFFF; font-weight: 800; margin-bottom: 4px; display: inline-block;">#2026协议全攻略</span>
              <h4 style="font-size: 0.98rem; font-weight: 700; margin-bottom: 4px;">
                <a href="/articles/best-airport-ladder-2026-protocol-guide.html" style="color: #1D4ED8;">《2026机场推荐与梯子推荐全攻略：协议架构对比、多端客户端配置与AI流媒体分流指南》</a>
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-soft);">VLESS/Hysteria2协议解析、IEPL专线vsBGP中转实测与多端分流避坑。</p>
            </div>\r\n\r\n`;

['index.html', 'xiuxiuxiaozhan/index.html'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  const indexAnchor = '            <div style="background: #FAF5FF; padding: 12px 16px; border-radius: var(--radius-md); border: 1px dashed #8B5CF6;">';
  if (content.includes(indexAnchor) && !content.includes(NEW_ARTICLE_PATH)) {
    content = content.replace(indexAnchor, indexCard + indexAnchor);
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ [index.html] 成功更新首页飞行手帐精选: ${file}`);
  } else if (content.includes(NEW_ARTICLE_PATH)) {
    console.log(`ℹ️ [index.html] 首页已存在新文章推荐，跳过插入: ${file}`);
  } else {
    console.error(`❌ [index.html] 未找到锚点: ${file}`);
  }
});

// 3. 同步 sitemap.xml 和 xiuxiuxiaozhan/sitemap.xml
const sitemapEntry = `  <url>
    <loc>${NEW_ARTICLE_URL}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.88</priority>
  </url>\r\n`;

['sitemap.xml', 'xiuxiuxiaozhan/sitemap.xml'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes(NEW_ARTICLE_URL)) {
    content = content.replace('</urlset>', sitemapEntry + '</urlset>');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ [sitemap.xml] 成功写入新文章站点地图: ${file}`);
  } else {
    console.log(`ℹ️ [sitemap.xml] 已收录该文章，跳过: ${file}`);
  }
});

// 4. 同步 llms.txt 和 xiuxiuxiaozhan/llms.txt
const llmsEntry = `- 2026 机场推荐与梯子推荐全攻略（协议架构对比、多端客户端配置与AI流媒体分流指南）: ${NEW_ARTICLE_URL}\r\n`;

['llms.txt', 'xiuxiuxiaozhan/llms.txt'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  const anchor = '## 5. 核心技术研报与知识库 (Curated Technical Articles)\r\n';
  const anchorLf = '## 5. 核心技术研报与知识库 (Curated Technical Articles)\n';
  if (!content.includes(NEW_ARTICLE_URL)) {
    if (content.includes(anchor)) {
      content = content.replace(anchor, anchor + llmsEntry);
    } else if (content.includes(anchorLf)) {
      content = content.replace(anchorLf, anchorLf + llmsEntry);
    }
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ [llms.txt] 成功写入知识索引: ${file}`);
  } else {
    console.log(`ℹ️ [llms.txt] 已存在知识索引，跳过: ${file}`);
  }
});

console.log('🎉 站内与索引同步脚本执行完成！');
