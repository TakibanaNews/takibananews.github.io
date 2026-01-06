// list.js 記事一覧の読み込みとインタラクション
document.addEventListener('DOMContentLoaded', () => {
  const DATA_URL = 'data/articles.json';
  const perPage = 6;
  let articles = [];
  let filtered = [];
  let currentPage = 1;
  let activeTag = null;

  const qEl = document.getElementById('q');
  const listEl = document.getElementById('list');
  const paginationEl = document.getElementById('pagination');
  const tagFiltersEl = document.getElementById('tagFilters');

  // ユーティリティ
  const formatDate = d => {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  };

  // 記事カードをレンダリング
  function renderList(page = 1) {
    currentPage = page;
    const start = (page - 1) * perPage;
    const pageItems = filtered.slice(start, start + perPage);

    listEl.innerHTML = '';
    if (pageItems.length === 0) {
      listEl.innerHTML = '<p style="color:var(--muted);padding:24px">該当する記事はありません。</p>';
      paginationEl.innerHTML = '';
      return;
    }

    pageItems.forEach(a => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        ${a.thumb ? `<img class="thumb" src="${a.thumb}" alt="${a.title}">` : `<div class="thumb" aria-hidden="true"></div>`}
        <div class="card-body">
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <div class="meta">
            <span>${formatDate(a.date)}</span>
            <div class="tags">${(a.tags||[]).map(t=>`<span class="t">${t}</span>`).join('')}</div>
            <a href="${a.url}" class="read-more" style="margin-left:auto;color:var(--accent);text-decoration:none;font-weight:700">続きを読む</a>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    renderPagination();
  }

  // ページネーション
  function renderPagination() {
    const total = Math.ceil(filtered.length / perPage);
    paginationEl.innerHTML = '';
    if (total <= 1) return;

    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => renderList(i));
      paginationEl.appendChild(btn);
    }
  }

  // タグ一覧を生成
  function renderTags() {
    const tags = new Set();
    articles.forEach(a => (a.tags||[]).forEach(t => tags.add(t)));
    tagFiltersEl.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'tag-btn' + (activeTag === null ? ' active' : '');
    allBtn.textContent = 'すべて';
    allBtn.addEventListener('click', () => { activeTag = null; applyFilters(); });
    tagFiltersEl.appendChild(allBtn);

    Array.from(tags).sort().forEach(t => {
      const b = document.createElement('button');
      b.className = 'tag-btn' + (t === activeTag ? ' active' : '');
      b.textContent = t;
      b.addEventListener('click', () => {
        activeTag = (activeTag === t) ? null : t;
        applyFilters();
      });
      tagFiltersEl.appendChild(b);
    });
  }

  // フィルタ適用
  function applyFilters() {
    const q = qEl.value.trim().toLowerCase();
    filtered = articles.filter(a => {
      const inTag = activeTag ? (a.tags||[]).includes(activeTag) : true;
      const inText = q === '' ? true : (a.title + ' ' + (a.excerpt||'') + ' ' + (a.content||'')).toLowerCase().includes(q);
      return inTag && inText;
    });
    renderTags();
    renderList(1);
  }

  // 初期化
  fetch(DATA_URL).then(r => r.json()).then(data => {
    // 期待するデータ形式: [{id,title,excerpt,date,tags,thumb,url,content}, ...]
    articles = data.sort((a,b) => new Date(b.date) - new Date(a.date));
    filtered = articles.slice();
    renderTags();
    renderList(1);
  }).catch(err => {
    listEl.innerHTML = '<p style="color:var(--muted);padding:24px">記事データの読み込みに失敗しました。</p>';
    console.error(err);
  });

  // イベント
  qEl.addEventListener('input', () => applyFilters());
});
