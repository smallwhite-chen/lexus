/* ============================================================
   NX 車款介紹 Wireframe · 互動層
   ============================================================ */
(function () {
  const D = window.NXData;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const device = () => (window.__wf && window.__wf.device) || 'desktop';

  // 條件分類可見性（由 Tweaks 控制）
  window.NXState = window.NXState || { showCharge: true, showLink: true, carStyle: 'full', layout360: 'side' };

  function visibleFeatures() {
    return D.features.filter(f => {
      if (f.id === 'charge' && !window.NXState.showCharge) return false;
      if (f.id === 'link' && !window.NXState.showLink) return false;
      return true;
    });
  }

  /* ---- IMG placeholder helper ---- */
  function img(label, opts = {}) {
    const v = opts.variant ? ' wf-img--' + opts.variant : '';
    const n = el('div', 'wf-img nx-zoom' + v);
    if (opts.ratio) n.style.aspectRatio = opts.ratio;
    n.innerHTML = '<span class="wf-img__label">' + label + '</span>';
    n.dataset.zoom = label;
    return n;
  }

  /* ============================================================
     車款亮點
     ============================================================ */
  function renderHighlights() {
    const mount = $('#nx-highlights'); if (!mount) return;
    const spanClass = ['nx-hl--feature', '', '', 'nx-hl--banner'];
    D.highlights.forEach((h, i) => {
      const card = el('article', 'nx-hl ' + (spanClass[i] || ''));
      const media = img(h.cat + ' · ' + h.en, { ratio: '16/10' });
      media.classList.add('nx-hl__media');
      var lbl = media.querySelector('.wf-img__label'); if (lbl) lbl.remove();
      card.appendChild(media);
      const body = el('div', 'nx-hl__content');
      body.innerHTML =
        '<span class="wf-eyebrow">' + h.en + '</span>' +
        '<div class="nx-hl__big">' + (h.bigHtml || ('<b>' + h.value + '</b><span>' + h.title + '</span>')) + '</div>';
      card.appendChild(body);
      mount.appendChild(card);
    });
  }

  /* ============================================================
     360 賞車（兩層切換 + 拖曳旋轉）
     ============================================================ */
  function render360() {
    const mount = $('#nx-360'); if (!mount) return;
    const S = D.threeSixty;
    let view = 'ext', frame = 0, colorIdx = 0;

    mount.innerHTML =
      '<div class="nx-360__views" data-views></div>' +
      '<div class="nx-360__stage">' +
        '<div class="nx-360__viewer wf-img wf-img--plain" data-viewer>' +
          '<div class="nx-360__hint"><span class="ic">↔</span> 拖曳旋轉</div>' +
          '<span class="wf-img__label" data-vlabel></span>' +
        '</div>' +
      '</div>' +
      '<div class="nx-360__swatchwrap"><span class="wf-eyebrow" data-cname></span>' +
        '<div class="wf-swatches" data-swatches></div></div>';

    const viewsEl = $('[data-views]', mount);
    S.views.forEach(v => {
      const b = el('button', 'nx-360__view', '<span class="ic">' + (v.id === 'ext' ? '◧' : '◫') + '</span>' + v.label);
      b.dataset.view = v.id;
      b.addEventListener('click', () => { view = v.id; colorIdx = 0; sync(); });
      viewsEl.appendChild(b);
    });

    function sync() {
      $$('[data-view]', mount).forEach(b => b.setAttribute('aria-selected', b.dataset.view === view ? 'true' : 'false'));
      const cols = S.colors[view];
      const sw = $('[data-swatches]', mount); sw.innerHTML = '';
      cols.forEach((c, i) => {
        const s = el('span', 'wf-swatch'); s.style.background = c.hex;
        if (i === colorIdx) s.setAttribute('aria-current', 'true');
        s.title = c.name;
        s.addEventListener('click', () => { colorIdx = i; sync(); });
        sw.appendChild(s);
      });
      const c = cols[colorIdx];
      $('[data-cname]', mount).textContent = (view === 'ext' ? '外觀色 · ' : '內裝色 · ') + c.name;
      $('[data-vlabel]', mount).textContent = (view === 'ext' ? 'EXTERIOR' : 'INTERIOR') + ' · ' + c.name;
    }

    // 拖曳旋轉
    const viewer = $('[data-viewer]', mount);
    let dragging = false, lastX = 0;
    const start = (x) => { dragging = true; lastX = x; viewer.classList.add('is-drag'); };
    const move = (x) => {
      if (!dragging) return;
      const dx = x - lastX;
      if (Math.abs(dx) > 8) { frame = (frame + (dx > 0 ? 1 : -1) + S.frames) % S.frames; lastX = x; sync(); }
    };
    const end = () => { dragging = false; viewer.classList.remove('is-drag'); };
    viewer.addEventListener('pointerdown', e => { start(e.clientX); viewer.setPointerCapture(e.pointerId); });
    viewer.addEventListener('pointermove', e => move(e.clientX));
    viewer.addEventListener('pointerup', end);
    viewer.addEventListener('pointercancel', end);

    sync();
  }

  /* ============================================================
     特色 — 分類區段 + carousel
     ============================================================ */
  function renderFeatures() {
    const mount = $('#nx-features'); if (!mount) return;
    mount.innerHTML = '';
    visibleFeatures().forEach((f, fi) => {
      const sec = el('section', 'nx-feat' + (fi % 2 ? ' nx-feat--alt' : ''));
      sec.id = 'feat-' + f.id;
      sec.dataset.cat = f.cat;
      sec.dataset.screenLabel = '特色 · ' + f.cat;

      const head = el('div', 'wf-container');
      head.innerHTML =
        '<div class="nx-feat__head">' +
          '<div class="wf-sectiontitle"><span class="word word--outline">' + f.en + '</span>' +
          '<span class="sub">' + f.sub + '</span><span class="cn">' + f.cn + '</span></div>' +
          (f.optional ? '<span class="wf-tag wf-tag--solid">本車型配備</span>' : '') +
        '</div>';
      const moreBtn = el('button', 'wf-btn wf-btn--secondary wf-btn--sm nx-feat__more', '查看更詳細 ›');
      head.appendChild(moreBtn);
      sec.appendChild(head);

      const wrap = el('div', 'wf-container');

      // 特色主視覺（16:9 圖片／影片，附右下播放鈕）
      const hero = img(f.cat + ' · 主視覺 KEY VISUAL', { ratio: '16/9' });
      hero.classList.add('nx-feat__hero');
      const heroPlay = el('button', 'nx-play nx-play--onimg', '<span class="ic">▶</span>');
      heroPlay.setAttribute('data-play', '');
      hero.appendChild(heroPlay);
      wrap.appendChild(hero);

      const car = el('div', 'nx-car');
      car.innerHTML = '<div class="nx-car__viewport"><div class="nx-car__track"></div></div>';
      const track = $('.nx-car__track', car);
      f.items.forEach((it, idx) => {
        const card = el('article', 'nx-fcard');
        const m = img(f.cat + ' · ' + it.en, { ratio: '4/3' });
        const play = el('button', 'nx-play nx-play--onimg', '<span class="ic">▶</span>');
        play.setAttribute('data-play', '');
        m.appendChild(play);
        card.appendChild(m);
        const tx = el('div', 'nx-fcard__txt');
        tx.innerHTML =
          '<span class="wf-eyebrow">' + it.en + '</span>' +
          '<h4 class="nx-fcard__title">' + it.t + '</h4>';
        const desc = el('p', 'wf-body'); desc.style.fontSize = '14px'; desc.textContent = it.d;
        tx.appendChild(desc);
        card.appendChild(tx);
        track.appendChild(card);
      });
      wrap.appendChild(car);
      // 單一「查看更詳細」按鈕：開啟目前所在的特色項目
      moreBtn.addEventListener('click', () => openDetail(f.id, parseInt(car.dataset.index || '0', 10)));

      // nav: arrows + count + dots
      const nav = el('div', 'nx-car__nav');
      nav.innerHTML =
        '<div class="wf-arrows"><button data-prev>‹</button><button data-next>›</button></div>' +
        '<div class="nx-car__meta"><span class="nx-car__count" data-count></span>' +
        '<div class="wf-dots" data-dots></div></div>';
      wrap.appendChild(nav);
      sec.appendChild(wrap);
      mount.appendChild(sec);

      initCarousel(car, nav, f.items.length);
    });
    buildFeatNav();
  }

  function initCarousel(car, nav, total) {
    const viewport = $('.nx-car__viewport', car);
    const track = $('.nx-car__track', car);
    const countEl = $('[data-count]', nav);
    const dotsEl = $('[data-dots]', nav);
    let index = 0;
    for (let i = 0; i < total; i++) { const d = el('i'); dotsEl.appendChild(d); }
    const dots = $$('i', dotsEl);
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

    function step() {
      const card = track.children[0];
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 16) || 16;
      return card.offsetWidth + gap;
    }
    function maxScroll() { return Math.max(0, track.scrollWidth - viewport.clientWidth); }
    function apply(animate = true) {
      track.style.transition = animate ? 'transform .42s cubic-bezier(.4,0,.1,1)' : 'none';
      const t = Math.min(index * step(), maxScroll());
      track.style.transform = 'translateX(' + (-t) + 'px)';
      countEl.textContent = String(index + 1) + ' / ' + total;
      car.dataset.index = index;
      dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    }
    function go(i) { index = Math.max(0, Math.min(total - 1, i)); apply(); }
    $('[data-prev]', nav).addEventListener('click', () => go(index - 1));
    $('[data-next]', nav).addEventListener('click', () => go(index + 1));

    // swipe
    let down = false, sx = 0, base = 0;
    viewport.addEventListener('pointerdown', e => { down = true; sx = e.clientX; base = Math.min(index * step(), maxScroll()); track.style.transition = 'none'; viewport.setPointerCapture(e.pointerId); });
    viewport.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      track.style.transform = 'translateX(' + (-(base - dx)) + 'px)';
    });
    function release(e) {
      if (!down) return; down = false;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); else apply();
    }
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);

    car._recalc = () => apply(false);
    apply(false);
  }

  /* ============================================================
     特色詳細 — Modal / BottomSheet（上一項 / 下一項）
     ============================================================ */
  let detailCtx = null;
  function openDetail(catId, idx) {
    const f = D.features.find(x => x.id === catId); if (!f) return;
    detailCtx = { catId, idx };
    let overlay = $('#nx-detail');
    if (!overlay) {
      overlay = el('div', 'nx-overlay'); overlay.id = 'nx-detail';
      overlay.innerHTML = '<div class="nx-overlay__bd" data-close></div><div class="nx-panel" data-panel></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) closeDetail(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });
    }
    overlay.className = 'nx-overlay is-open ' + (device() === 'mobile' ? 'nx-overlay--sheet' : 'nx-overlay--modal');
    paintDetail();
    document.body.style.overflow = 'hidden';
  }
  function paintDetail() {
    const overlay = $('#nx-detail'); const panel = $('[data-panel]', overlay);
    const f = D.features.find(x => x.id === detailCtx.catId);
    const it = f.items[detailCtx.idx];
    panel.innerHTML =
      '<div class="nx-panel__top">' +
        '<div><span class="wf-eyebrow">' + f.cat + ' · ' + it.en + '</span>' +
        '<div class="wf-anno" style="margin-top:4px">' + (detailCtx.idx + 1) + ' / ' + f.items.length + '</div></div>' +
        '<button class="nx-panel__x" data-close aria-label="close">✕</button>' +
      '</div>' +
      '<div class="nx-panel__scroll">' +
        '<h2 class="wf-h2" style="margin-bottom:8px">' + it.t + '</h2>' +
        '<p class="nx-panel__lead">' + it.a.lead + '</p>' +
        '<div class="wf-img" style="aspect-ratio:16/9;margin:20px 0"><span class="wf-img__label">' + f.cat + ' DETAIL · ' + it.en + '</span></div>' +
        it.a.paras.map(p => '<p class="wf-body" style="margin-bottom:14px">' + p + '</p>').join('') +
        '<div class="wf-img" style="aspect-ratio:21/9;margin:14px 0"><span class="wf-img__label">' + it.en + ' · 情境</span></div>' +
      '</div>' +
      '<div class="nx-panel__foot">' +
        '<button class="wf-btn wf-btn--ghost wf-btn--sm" data-pv>↑ 上一項</button>' +
        '<button class="wf-btn wf-btn--ghost wf-btn--sm" data-nx>下一項 ↓</button>' +
      '</div>';
    $('[data-pv]', panel).addEventListener('click', () => { detailCtx.idx = (detailCtx.idx - 1 + f.items.length) % f.items.length; paintDetail(); });
    $('[data-nx]', panel).addEventListener('click', () => { detailCtx.idx = (detailCtx.idx + 1) % f.items.length; paintDetail(); });
    $('.nx-panel__x', panel).addEventListener('click', closeDetail);
    $('.nx-panel__scroll', panel).scrollTop = 0;
  }
  function closeDetail() { const o = $('#nx-detail'); if (o) o.classList.remove('is-open'); document.body.style.overflow = ''; }

  /* ============================================================
     重點比較（水平捲動卡片）
     ============================================================ */
  function renderCompare() {
    const mount = $('#nx-compare'); if (!mount) return;
    const car = el('div', 'nx-car');
    car.innerHTML = '<div class="nx-car__viewport"><div class="nx-car__track"></div></div>';
    const track = $('.nx-car__track', car);
    D.compare.forEach(c => {
      const card = el('article', 'nx-cmp');
      card.innerHTML =
        '<div class="wf-img" style="aspect-ratio:16/10"><span class="wf-img__label">' + c.grade + '</span></div>' +
        '<div class="nx-cmp__body">' +
          '<div class="nx-cmp__head"><h4 class="nx-cmp__name">' + c.grade + '</h4>' +
          '<span class="wf-tag wf-tag--solid">' + c.power + '</span></div>' +
          '<div class="nx-cmp__price"><span class="wf-anno">建議售價</span><b>NT$ ' + c.price + ' 萬</b></div>' +
          '<span class="wf-eyebrow" style="display:block;margin:6px 0 4px">重點功能</span>' +
          '<ul class="nx-cmp__diff">' + c.diff.map(d => '<li>' + d + '</li>').join('') + '</ul>' +
        '</div>';
      track.appendChild(card);
    });
    mount.appendChild(car);

    const nav = el('div', 'nx-car__nav');
    nav.innerHTML =
      '<div class="wf-arrows"><button data-prev>‹</button><button data-next>›</button></div>' +
      '<div class="nx-car__meta"><span class="nx-car__count" data-count></span>' +
      '<div class="wf-dots" data-dots></div></div>';
    mount.appendChild(nav);

    initCarousel(car, nav, D.compare.length);
  }

  /* ============================================================
     規格表（僅顯示差異 toggle / 基本·進階收合）
     ============================================================ */
  function renderSpec() {
    const mount = $('#nx-spec'); if (!mount) return;
    const G = D.grades;
    const same = arr => arr.every(v => v === arr[0]);
    let diffOnly = false;
    const advOpen = {};

    function gradeHead() {
      return '<div class="wf-spec__row wf-spec__row--head"><span class="wf-spec__k">車款</span>' +
        G.map(g => '<span class="wf-spec__v">' + g + '</span>').join('') + '</div>';
    }
    function dataRow(r) {
      if (diffOnly && same(r.v)) return '';
      const flag = !same(r.v) ? ' nx-diff' : '';
      return '<div class="wf-spec__row' + flag + '"><span class="wf-spec__k">' + r.k +
        (flag ? '<span class="nx-diff__dot" title="各車型有差異"></span>' : '') + '</span>' +
        r.v.map(v => '<span class="wf-spec__v">' + v + '</span>').join('') + '</div>';
    }
    function build() {
      let html = '<div class="wf-spec">';
      html += '<div class="nx-spec__bar"><span class="wf-eyebrow">基本規格 · BASIC</span>' +
        '<label class="nx-switch"><input type="checkbox" data-diff' + (diffOnly ? ' checked' : '') + '><span class="nx-switch__t"></span>僅顯示差異</label></div>';
      html += gradeHead();
      html += D.spec.basic.map(dataRow).join('');
      D.spec.adv.forEach((grp, gi) => {
        const open = !!advOpen[gi];
        html += '<div class="wf-spec__row wf-spec__row--collapse nx-advhead" data-adv="' + gi + '">' +
          '<span class="wf-spec__k"><span class="wf-tag" style="height:22px">進階</span>' + grp.group + '</span>' +
          '<span class="chev">' + (open ? '▴' : '▾') + '</span></div>';
        if (open) html += grp.rows.map(dataRow).join('');
      });
      html += '</div>';
      mount.innerHTML = html;
      $('[data-diff]', mount).addEventListener('change', e => { diffOnly = e.target.checked; build(); });
      $$('[data-adv]', mount).forEach(h => h.addEventListener('click', () => { const i = h.dataset.adv; advOpen[i] = !advOpen[i]; build(); }));
    }
    build();
  }

  /* ============================================================
     配備表（分類 accordion）
     ============================================================ */
  let equipFilter = '';
  function renderEquip() {
    const mount = $('#nx-equip'); if (!mount) return;
    const bar = $('#nx-equip-filter');
    if (bar && !bar.dataset.ready) {
      bar.dataset.ready = '1';
      bar.innerHTML =
        '<span class="wf-eyebrow">車型篩選</span>' +
        '<div class="nx-eqfilter__select"><select data-eqfilter>' +
          D.equipGrades.map((g, i) => '<option value="' + g + '"' + (i === 0 ? ' selected' : '') + '>' + g + '</option>').join('') +
        '</select><span class="chev">▾</span></div>' +
        '<span class="nx-eqfilter__count" data-eqcount></span>';
      bar.querySelector('[data-eqfilter]').addEventListener('change', e => { equipFilter = e.target.value; paintEquip(); });
    }
    equipFilter = bar.querySelector('[data-eqfilter]').value;
    paintEquip();
  }

  function paintEquip() {
    const mount = $('#nx-equip'); if (!mount) return;
    mount.innerHTML = '';
    let total = 0, shownCats = 0;
    D.equip.forEach(grp => {
      const items = grp.items.filter(it => equipFilter === 'all' || it.grades.includes(equipFilter));
      if (!items.length) return;
      total += items.length;
      const acc = el('div', 'nx-acc' + (shownCats === 0 ? ' is-open' : ''));
      shownCats++;
      const head = el('button', 'nx-acc__head');
      head.innerHTML = '<span class="nx-acc__cat">' + grp.cat + '</span>' +
        '<span class="wf-anno">' + items.length + ' 項</span><span class="chev">▾</span>';
      head.addEventListener('click', () => acc.classList.toggle('is-open'));
      const body = el('div', 'nx-acc__body');
      const list = el('div', 'nx-equip__list');
      items.forEach(it => list.appendChild(equipItem(grp.cat, it)));
      body.appendChild(list);
      acc.appendChild(head); acc.appendChild(body);
      mount.appendChild(acc);
    });
    const cnt = $('[data-eqcount]');
    if (cnt) cnt.textContent = equipFilter === 'all' ? '共 ' + total + ' 項配備' : equipFilter + ' · ' + total + ' 項配備';
  }

  function equipItem(cat, it) {
    const item = el('div', 'nx-eqitem');
    const head = el('button', 'nx-eqitem__head');
    head.innerHTML =
      '<span class="nx-eqitem__ic">＋</span>' +
      '<span class="nx-eqitem__name">' + it.t + '</span>' +
      '<span class="chev">▾</span>';
    const body = el('div', 'nx-eqitem__body');

    // 圖片輪播
    const car = el('div', 'nx-eqcar');
    let frame = 0;
    const media = img(cat + ' · ' + it.t, { ratio: '16/9' });
    media.classList.remove('nx-zoom'); // 由 lightbox 委派處理
    media.classList.add('nx-zoom');
    const counter = el('span', 'nx-eqcar__counter');
    function paintCar() {
      media.querySelector('.wf-img__label').textContent = cat + ' · ' + it.t + '（圖 ' + (frame + 1) + '）';
      media.dataset.zoom = cat + ' · ' + it.t + ' 圖 ' + (frame + 1);
      counter.textContent = (frame + 1) + ' / ' + it.imgs;
    }
    car.appendChild(media);
    if (it.imgs > 1) {
      const prev = el('button', 'nx-eqcar__arrow nx-eqcar__arrow--prev', '‹');
      const next = el('button', 'nx-eqcar__arrow nx-eqcar__arrow--next', '›');
      prev.addEventListener('click', e => { e.stopPropagation(); frame = (frame - 1 + it.imgs) % it.imgs; paintCar(); });
      next.addEventListener('click', e => { e.stopPropagation(); frame = (frame + 1) % it.imgs; paintCar(); });
      car.appendChild(prev); car.appendChild(next); car.appendChild(counter);
    }
    paintCar();
    body.appendChild(car);

    // 說明
    const desc = el('p', 'wf-body'); desc.style.margin = '14px 0 0'; desc.textContent = it.d;
    body.appendChild(desc);

    // 配備車型
    const grades = el('div', 'nx-eqgrades');
    grades.innerHTML = '<span class="wf-eyebrow">配備車型</span>';
    const row = el('div', 'nx-eqgrades__row');
    it.grades.forEach(g => { const chip = el('span', 'nx-eqgrades__chip', '<span class="ck">✓</span>' + g); row.appendChild(chip); });
    grades.appendChild(row);
    body.appendChild(grades);

    item.appendChild(head); item.appendChild(body);
    head.addEventListener('click', () => {
      item.classList.toggle('is-open');
      head.querySelector('.nx-eqitem__ic').textContent = item.classList.contains('is-open') ? '－' : '＋';
    });
    return item;
  }

  /* ============================================================
     FAQ（分類切換 + accordion）
     ============================================================ */
  function renderFaq() {
    const mount = $('#nx-faq'); if (!mount) return;
    let cat = 0;
    const tabs = el('div', 'wf-tabs nx-faq__tabs');
    D.faq.forEach((f, i) => {
      const t = el('button', 'wf-tab', f.cat);
      t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      t.addEventListener('click', () => { cat = i; paint(); });
      tabs.appendChild(t);
    });
    const list = el('div', 'nx-faq__list');
    mount.appendChild(tabs); mount.appendChild(list);
    function paint() {
      $$('.wf-tab', tabs).forEach((t, i) => t.setAttribute('aria-selected', i === cat ? 'true' : 'false'));
      list.innerHTML = '';
      D.faq[cat].items.forEach(qa => {
        const item = el('div', 'nx-qa');
        item.innerHTML =
          '<button class="nx-qa__q"><span>' + qa.q + '</span><span class="chev">＋</span></button>' +
          '<div class="nx-qa__a"><p class="wf-body">' + qa.a + '</p></div>';
        item.querySelector('.nx-qa__q').addEventListener('click', () => { item.classList.toggle('is-open'); item.querySelector('.chev').textContent = item.classList.contains('is-open') ? '－' : '＋'; });
        list.appendChild(item);
      });
    }
    paint();
  }

  /* ============================================================
     特色分類 sticky 導覽 + scrollspy
     ============================================================ */
  let spyObs = null;
  function scrollToFeat(id) {
    const sec = $('#' + id);
    if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  }
  function centerNavBtn(btn) {
    const row = $('.nx-featnav__row'); if (!row || !btn) return;
    const target = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }
  function buildFeatNav() {
    const nav = $('#nx-featnav'); if (!nav) return;
    const inner = $('.nx-featnav__row', nav);
    inner.innerHTML = '';
    const feats = visibleFeatures();
    feats.forEach((f, i) => {
      const b = el('button', 'nx-featnav__btn', f.cat);
      b.dataset.target = 'feat-' + f.id;
      if (i === 0) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', () => { scrollToFeat('feat-' + f.id); centerNavBtn(b); });
      inner.appendChild(b);
    });

    // 「更多」按鈕 → 展開向下分類選單
    const moreBtn = $('[data-featmore]', nav);
    if (moreBtn && !moreBtn.dataset.ready) {
      moreBtn.dataset.ready = '1';
      moreBtn.addEventListener('click', e => { e.stopPropagation(); toggleCatMenu(); });
      document.addEventListener('click', e => { if (!e.target.closest('.nx-catmenu') && !e.target.closest('[data-featmore]')) closeCatMenu(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCatMenu(); });
    }

    if (spyObs) spyObs.disconnect();
    spyObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          let active = null;
          $$('.nx-featnav__btn', nav).forEach(b => {
            const on = b.dataset.target === id;
            b.setAttribute('aria-current', on ? 'true' : 'false');
            if (on) active = b;
          });
          if (active) centerNavBtn(active);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    feats.forEach(f => { const s = $('#feat-' + f.id); if (s) spyObs.observe(s); });
  }

  function toggleCatMenu() {
    const wrap = $('.nx-featnav__wrap'); if (!wrap) return;
    let menu = $('.nx-catmenu', wrap);
    if (menu && menu.classList.contains('is-open')) { closeCatMenu(); return; }
    if (!menu) { menu = el('div', 'nx-catmenu'); wrap.appendChild(menu); }
    const cur = $('.nx-featnav__btn[aria-current="true"]');
    const curId = cur ? cur.dataset.target : null;
    menu.innerHTML =
      '<span class="wf-eyebrow nx-catmenu__hd">特色分類</span>' +
      visibleFeatures().map(f =>
        '<button class="nx-catmenu__item' + ('feat-' + f.id === curId ? ' is-current' : '') + '" data-go="feat-' + f.id + '">' +
        '<span class="nx-catmenu__cn">' + f.cat + '</span>' +
        '<span class="wf-anno">' + f.en + ' · ' + f.items.length + ' 項</span></button>'
      ).join('');
    $$('[data-go]', menu).forEach(b => b.addEventListener('click', () => { closeCatMenu(); setTimeout(() => scrollToFeat(b.dataset.go), 60); }));
    const mb = $('[data-featmore]'); if (mb) mb.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => menu.classList.add('is-open'));
  }
  function closeCatMenu() {
    const menu = $('.nx-catmenu'); if (menu) menu.classList.remove('is-open');
    const mb = $('[data-featmore]'); if (mb) mb.setAttribute('aria-expanded', 'false');
  }

  /* ============================================================
     Lightbox
     ============================================================ */
  function initLightbox() {
    let lb = $('#nx-lb');
    if (!lb) {
      lb = el('div', 'nx-lb'); lb.id = 'nx-lb';
      lb.innerHTML = '<div class="nx-lb__bd" data-close></div><div class="nx-lb__box"><button class="nx-lb__x" data-close>✕</button><div class="wf-img" data-lbimg style="width:100%;height:100%"><span class="wf-img__label" data-lblabel></span></div></div>';
      document.body.appendChild(lb);
      lb.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) lb.classList.remove('is-open'); });
    }
    document.addEventListener('click', e => {
      const z = e.target.closest('.nx-zoom');
      if (z && !e.target.closest('button')) {
        $('[data-lblabel]', lb).textContent = (z.dataset.zoom || 'IMAGE') + ' · 放大檢視';
        lb.classList.add('is-open');
      }
    });
  }

  /* ---- play/stop 佔位按鈕（動畫播放示意）---- */
  function initPlay() {
    document.addEventListener('click', e => {
      const p = e.target.closest('[data-play]');
      if (!p) return;
      e.stopPropagation();
      const on = p.classList.toggle('is-playing');
      p.querySelector('.ic').textContent = on ? '❚❚' : '▶';
    });
  }

  /* ---- 重算 carousel 寬度（裝置切換時）---- */
  window.NXRecalc = function () { $$('.nx-car').forEach(c => c._recalc && c._recalc()); };

  /* ---- rebuild on optional-category change ---- */
  window.NXRebuildFeatures = function () { renderFeatures(); setTimeout(window.NXRecalc, 60); };

  function init() {
    renderHighlights();
    render360();
    renderFeatures();
    renderCompare();
    renderSpec();
    renderEquip();
    renderFaq();
    initLightbox();
    initPlay();
    setTimeout(window.NXRecalc, 80);
    window.addEventListener('resize', () => { clearTimeout(window._nxr); window._nxr = setTimeout(window.NXRecalc, 120); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
