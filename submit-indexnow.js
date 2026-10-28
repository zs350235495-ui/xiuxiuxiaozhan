/**
 * 🐾 咻咻小站 (xiuxiuxiaozhan.com) - IndexNow 搜索引擎即时推送工具
 * 协议规范：https://www.indexnow.org/
 * 密钥文件：a3f0e7922585497583684b1a575cf97c.txt
 * 支持引擎：Microsoft Bing, Yandex, Seznam, Naver 等 IndexNow 联盟搜索引擎
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = 'xiuxiuxiaozhan.com';
const KEY_FILE = 'a3f0e7922585497583684b1a575cf97c.txt';
const KEY_PATH = path.join(__dirname, KEY_FILE);
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// 校验与提取 Key
function getApiKey() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(`未找到 IndexNow 密钥文件: ${KEY_FILE}`);
  }
  const key = fs.readFileSync(KEY_PATH, 'utf8').trim();
  if (!key) {
    throw new Error(`IndexNow 密钥文件内容为空: ${KEY_FILE}`);
  }
  return key;
}

// 从 sitemap.xml 提取所有需要推送的绝对物理 URL
function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error('未找到 sitemap.xml 文件，无法提取推送 URL');
  }
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim());
  const uniqueUrls = Array.from(new Set(urls));
  
  if (uniqueUrls.length === 0) {
    throw new Error('sitemap.xml 中未匹配到任何有效 <loc> URL');
  }
  return uniqueUrls;
}

function postToIndexNow(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(endpoint);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'xiuxiuxiaozhan-IndexNow-Bot/1.0'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          body: data,
          endpoint: urlObj.hostname
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`请求超时 (${endpoint})`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function submitIndexNow() {
  const key = getApiKey();
  const keyLocation = `https://${HOST}/${KEY_FILE}`;
  const urlList = getUrlsFromSitemap();

  console.log(`\n======================================================`);
  console.log(`🚀 咻咻小站 IndexNow 自动化即时推送`);
  console.log(`📌 目标站点: https://${HOST}`);
  console.log(`🔑 验证密钥: ${key}`);
  console.log(`📄 密钥验证路径: ${keyLocation}`);
  console.log(`📊 准备推送 URL 数量: ${urlList.length} 条`);
  console.log(`======================================================\n`);

  const payload = JSON.stringify({
    host: HOST,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
  });

  // 主端点：api.indexnow.org (会自动分发同步到 Bing, Yandex, Seznam, Naver 等所有联盟搜索引擎)
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  let successCount = 0;

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 正在向 [${endpoint}] 提交推送请求...`);
      const result = await postToIndexNow(endpoint, payload);
      
      // IndexNow 规范响应：
      // 200: OK (URL submitted successfully)
      // 202: Accepted (URL submitted, key validation pending)
      if (result.statusCode === 200 || result.statusCode === 202) {
        console.log(`✅ [${result.endpoint}] 推送成功！HTTP 状态码: ${result.statusCode} (${result.statusMessage})`);
        successCount++;
      } else {
        console.warn(`⚠️ [${result.endpoint}] 响应异常: HTTP ${result.statusCode} (${result.statusMessage})`);
        if (result.body) {
          console.warn(`   详细返回: ${result.body}`);
        }
      }
    } catch (err) {
      console.error(`❌ [${endpoint}] 请求失败: ${err.message}`);
    }
  }

  console.log(`\n------------------------------------------------------`);
  if (successCount > 0) {
    console.log(`🎉 索引推送完成！已成功广播给主流搜索引擎。`);
    console.log(`🌐 微软 Bing 及伙伴网络已登记并调度即时抓取更新：`);
    urlList.slice(0, 8).forEach(u => console.log(`   ➜ ${u}`));
    if (urlList.length > 8) {
      console.log(`   ... 以及其他 ${urlList.length - 8} 个核心页面与评测长文。`);
    }
    console.log(`------------------------------------------------------\n`);
    return true;
  } else {
    console.error(`🚨 所有 IndexNow 端点推送均未成功，请检查网络或配置。`);
    console.log(`------------------------------------------------------\n`);
    process.exit(1);
  }
}

submitIndexNow().catch(err => {
  console.error('执行出错:', err);
  process.exit(1);
});
