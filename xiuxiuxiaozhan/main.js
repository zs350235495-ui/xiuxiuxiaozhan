/* ==========================================================================
   咻咻小站 ~ Shiu Shiu Station (๑•̀ㅂ•́)و✧
   Pure Native JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMascot();
  initCopyButtons();
  initFilterTabs();
  initAccordion();
  initSpeedTestSim();
});

/* --------------------------------------------------------------------------
   1. 萌系吉祥物互动 (Mascot Widget)
   -------------------------------------------------------------------------- */
const mascotQuotes = [
  "今天也要元气满满哦～(๑•̀ㅂ•́)و✧",
  "网络顺畅，开心加倍！🌸",
  "点击小起飞，极速不卡顿～✈️",
  "遇到问题可以看登机指南哦 🎒",
  "晚高峰测评报告实时更新中 🍰",
  "啾咪～咻咻小站为您服务 (｡♥‿♥｡)"
];

function initMascot() {
  const mascot = document.getElementById('mascotWidget');
  const dialog = document.getElementById('mascotDialog');
  if (!mascot || !dialog) return;

  let quoteIndex = 0;

  mascot.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % mascotQuotes.length;
    dialog.textContent = mascotQuotes[quoteIndex];
    
    // 增加可爱跳跃效果
    const avatar = mascot.querySelector('.mascot-avatar');
    if (avatar) {
      avatar.style.transform = 'scale(1.3) rotate(-15deg)';
      setTimeout(() => {
        avatar.style.transform = '';
      }, 300);
    }
  });
}

/* --------------------------------------------------------------------------
   2. 一键复制与 Cute Toast 提示框
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('✨ 复制成功啦！准备起飞吧 (๑•̀ㅂ•́)و✧');
      }).catch(() => {
        // 兼容备用方案
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✨ 复制成功啦！(๑•̀ㅂ•́)و✧');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. 试吃中心卡片筛选功能 (Reviews Filter)
   -------------------------------------------------------------------------- */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 切换 active
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      reviewCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. 手帐折叠面板 (Guide Accordion)
   -------------------------------------------------------------------------- */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item') || header.parentElement;
      const isOpen = header.classList.contains('active');

      // 关闭其他面板
      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        const parent = h.closest('.accordion-item') || h.parentElement;
        if (parent) parent.classList.remove('active');
      });

      // 展开当前点击面板
      if (!isOpen) {
        header.classList.add('active');
        if (item) item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. 实时模拟测速互动 (Speed Test Simulator)
   -------------------------------------------------------------------------- */
function initSpeedTestSim() {
  const testBtns = document.querySelectorAll('.btn-speed-test');
  testBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const pingEl = document.getElementById(`ping-${targetId}`);
      const speedEl = document.getElementById(`speed-${targetId}`);

      if (!pingEl || !speedEl) return;

      btn.disabled = true;
      btn.textContent = '测速中...';

      setTimeout(() => {
        const randomPing = Math.floor(Math.random() * 25) + 35; // 35ms ~ 60ms
        const randomSpeed = (Math.random() * 300 + 400).toFixed(1); // 400Mbps ~ 700Mbps

        pingEl.textContent = `${randomPing} ms`;
        speedEl.textContent = `${randomSpeed} Mbps`;

        btn.disabled = false;
        btn.textContent = '⚡ 重新测速';
        showToast('⚡ 测速完成！延时超低爽快流畅！');
      }, 800);
    });
  });
}
