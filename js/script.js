// script.js - 軽いインタラクションと日付挿入
document.addEventListener('DOMContentLoaded', function () {
  // 発行日を今日の日付にセット（ISO風）
  const publishEl = document.getElementById('publishDate');
  if (publishEl) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    publishEl.textContent = `発行日: ${y}-${m}-${day}`;
  }

  // テーマ切替（ダーク/ライト）
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', function () {
    const root = document.documentElement;
    if (root.classList.contains('light')) {
      root.classList.remove('light');
      localStorage.setItem('site-theme', 'dark');
    } else {
      root.classList.add('light');
      localStorage.setItem('site-theme', 'light');
    }
  });

  // 保存されたテーマを復元
  const saved = localStorage.getItem('site-theme');
  if (saved === 'light') document.documentElement.classList.add('light');

  // 共有ボタン（Web Share API が使えない場合は URL をコピー）
  const shareBtn = document.getElementById('shareBtn');
  shareBtn && shareBtn.addEventListener('click', async function () {
    const title = document.title;
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (e) {
        // ユーザーがキャンセルした場合などは無視
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('ページURLをコピーしました');
      } catch (e) {
        prompt('このページのURLをコピーしてください', url);
      }
    }
  });
});
