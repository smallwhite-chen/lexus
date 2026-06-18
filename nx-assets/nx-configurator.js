/* ============================================================
   NX 賞車選擇器 · Configurator 互動層
   ------------------------------------------------------------
   合併備註（Merge notes）
   1. 與 nx-configurator.css 自成一組，零外部相依（除 DS token / wf class）。
   2. 車款頁取代「360 賞車」段落時：放一個容器並呼叫
        NXConfigurator.renderEntry('#nx-selector')
      其餘（overlay、完成頁）由本檔自行掛載於 document.body。
   3. 裝置切換：頁面在 device 改變時呼叫 NXConfigurator.setDevice(dev)。
   4. 視角＝360 左右拖曳旋轉（連續 frame）。CONFIG 為示意資料，
      合併時可整段移入 nx-data.js（window.NXData.configurator）。
   ============================================================ */
(function () {
  'use strict';

  /* ---- 1 · 資料模型（示意；可移入 nx-data.js）-------------- */
  const EXT_COLORS = [
    { id: 'white',    hex: '#f5f5f2', name: 'LFA白',  spec: '全車型適用' },
    { id: 'titanium', hex: '#837e78', name: '極光鈦', spec: 'F SPORT版專屬' },
    { id: 'gray',     hex: '#54565e', name: '星耀灰', spec: '全車型適用' },
    { id: 'blue',     hex: '#1f54c4', name: '星空藍', spec: 'F SPORT版、旗艦版、頂級版、豪華版、菁英版專屬' },
    { id: 'black',    hex: '#0c0c0d', name: '星熠黑', spec: '全車型適用' },
    { id: 'red',      hex: '#d11f1f', name: '燦艷紅', spec: 'F SPORT版、頂級版專屬' },
    { id: 'green',    hex: '#1f3a2a', name: '大地綠', spec: '旗艦版、豪華版專屬' },
    { id: 'champagne',hex: '#b9a888', name: '香檳金', spec: '頂級版、豪華版專屬' },
    { id: 'silver',   hex: '#c5c9ce', name: '月光銀', spec: '全車型適用' },
    { id: 'deepblue', hex: '#1d2b40', name: '深海藍', spec: 'F SPORT版、旗艦版專屬' },
  ];
  const WHEELS = [
    { id: 'w18', name: '18吋 節能輪圈',        en: '18" AERO' },
    { id: 'w20', name: '20吋 鋁合金輪圈',       en: '20" ALLOY' },
    { id: 'w21', name: '21吋 F SPORT 切削雙色', en: '21" F SPORT' },
  ];
  const INT_COLORS = [
    { id: 'noir', hex: '#1c1f24', name: '曜黑真皮', en: 'NAPPA BLACK' },
    { id: 'igry', hex: '#3a3f47', name: '岩灰真皮', en: 'GRANITE' },
    { id: 'burg', hex: '#6b3a3a', name: '勃艮地',   en: 'BURGUNDY' },
    { id: 'flax', hex: '#c7b79b', name: '亞麻白',   en: 'FLAXEN' },
  ];
  const TRIMS = [
    { id: 'metal', name: '黑質金屬', en: 'BLACK METALLIC' },
    { id: 'wood',  name: '深棕木紋', en: 'DARK WOOD' },
    { id: 'alu',   name: '鋁質髮絲紋', en: 'ALUMINUM' },
  ];
  // 版本為 gate：限定後續每步可選範圍
  const VERSIONS = [
    { id: '450h', name: 'NX 450h+', power: 'PHEV 插電油電', diff: '純電續航最長 · E-Four 電子四驅', price: 'NT$ 237.5 萬',
      colors: ['white','titanium','gray','blue','black','red','green','champagne','silver','deepblue'],
      wheels: ['w18','w20','w21'], intColors: ['noir','igry','burg','flax'], trims: ['metal','wood','alu'] },
    { id: '350h', name: 'NX 350h', power: 'HEV 油電', diff: 'E-Four 四驅 · 電動記憶座椅', price: 'NT$ 184.0 萬',
      colors: ['white','titanium','gray','blue','black','red','silver'],
      wheels: ['w18','w20'], intColors: ['noir','igry','flax'], trims: ['metal','wood'] },
    { id: '350', name: 'NX 350', power: '2.4T 汽油渦輪', diff: '渦輪增壓 · 跑格取向', price: 'NT$ 162.0 萬',
      colors: ['white','gray','blue','black','green','deepblue'],
      wheels: ['w18','w20'], intColors: ['noir','igry'], trims: ['metal','wood'] },
    { id: '200', name: 'NX 200', power: '2.0 自然進氣', diff: '入門動力 · 前輪驅動', price: 'NT$ 142.0 萬',
      colors: ['white','silver','gray','black'],
      wheels: ['w18'], intColors: ['noir','igry'], trims: ['metal'] },
  ];

  // 360 視角：連續 frame（拖曳旋轉）。外觀整圈、內裝半圈示意
  const EXT_FRAMES = 24, INT_FRAMES = 12;
  // 步驟自動聚焦：切到對應視角與旋轉位置
  const STEPS = [
    { id: 'version',  label: '車型版本', short: '車型', en: 'VERSION',  view: 'ext', frame: 0,  interior: false,
      desc: '先選版本。版本決定後續可選的車色、輪圈與內裝範圍。' },
    { id: 'extColor', label: '外觀配色', short: '外觀', en: 'EXTERIOR', view: 'ext', frame: 6,  interior: false,
      desc: '選擇外觀車色，左右拖曳即可 360 旋轉檢視。' },
    { id: 'wheel',    label: '輪圈樣式', short: '輪圈', en: 'WHEEL',    view: 'ext', frame: 3,  interior: false, detail: '輪圈特寫',
      desc: '選擇輪圈樣式，鏡頭自動帶到輪圈視角。' },
    { id: 'intColor', label: '內裝配色', short: '內裝', en: 'INTERIOR', view: 'int', frame: 0,  interior: true,
      desc: '舞台切換至內裝視角，左右拖曳檢視座艙。' },
    { id: 'trim',     label: '內裝飾板', short: '飾版', en: 'TRIM',     view: 'int', frame: 4,  interior: true, detail: '飾板特寫',
      desc: '選擇飾板材質，鏡頭自動帶到飾板區。' },
  ];

  /* ---- 2 · 工具 ------------------------------------------- */
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const byId = (arr, id) => arr.find(x => x.id === id);
  const ver = () => byId(VERSIONS, state.version);
  const device = () => (window.__wf && window.__wf.device) || 'desktop';

  const state = {
    version: '450h', extColor: 'green', wheel: 'w21', intColor: 'noir', trim: 'metal',
    step: 0, view: 'ext', frameExt: 0, frameInt: 0, detail: null, mode: 'config',
  };
  let overlay = null, entryMount = null;

  const extName = () => (byId(EXT_COLORS, state.extColor) || {}).name || '—';
  const extHex  = () => (byId(EXT_COLORS, state.extColor) || {}).hex || '#ccc';
  const wheelObj = () => byId(WHEELS, state.wheel) || {};
  const intName = () => (byId(INT_COLORS, state.intColor) || {}).name || '—';
  const intHex  = () => (byId(INT_COLORS, state.intColor) || {}).hex || '#ccc';
  const trimObj = () => byId(TRIMS, state.trim) || {};

  const framesOf = (view) => view === 'ext' ? EXT_FRAMES : INT_FRAMES;
  const curFrame = (view) => view === 'ext' ? state.frameExt : state.frameInt;
  function setFrame(view, f) {
    const n = framesOf(view); f = ((Math.round(f) % n) + n) % n;
    if (view === 'ext') state.frameExt = f; else state.frameInt = f;
  }
  // frame → 視角名稱
  function angleInfo(view, frame) {
    if (view === 'ext') {
      const cn = ['正前', '前 3/4', '側面', '後 3/4', '正後', '後 3/4', '側面', '前 3/4'];
      const en = ['FRONT', 'FRONT 3/4', 'SIDE', 'REAR 3/4', 'REAR', 'REAR 3/4', 'SIDE', 'FRONT 3/4'];
      const i = Math.round(frame / EXT_FRAMES * 8) % 8;
      return { cn: cn[i], en: en[i] };
    }
    const cn = ['中控台', '前座艙', '中央扶手', '後座', '飾板', '車門板'];
    const en = ['DASH', 'CABIN', 'CONSOLE', 'REAR', 'TRIM', 'DOOR'];
    const i = Math.round(frame / INT_FRAMES * 6) % 6;
    return { cn: cn[i], en: en[i] };
  }

  // 版本切換 → 重新框定可選範圍 + 套用預設（gate）
  function applyVersionGate() {
    const v = ver(); const changed = [];
    if (v.colors.indexOf(state.extColor) === -1) { state.extColor = v.colors[0]; changed.push('外觀色'); }
    if (v.wheels.indexOf(state.wheel) === -1) { state.wheel = v.wheels[0]; changed.push('輪圈'); }
    if (v.intColors.indexOf(state.intColor) === -1) { state.intColor = v.intColors[0]; changed.push('內裝色'); }
    if (v.trims.indexOf(state.trim) === -1) { state.trim = v.trims[0]; changed.push('飾板'); }
    return changed;
  }

  /* ---- 3 · 舞台（圖層合成 + 360 拖曳旋轉）----------------- */
  // view 固定（'ext' / 'int'）。回傳 wrap，內含可拖曳車圖 + 旋轉刻度軸 + 圖層註解
  function buildStage(view) {
    const wrap = el('div', 'nxc-stage-wrap'); wrap.dataset.view = view;
    const canvas = el('div', 'nxc-canvas');
    canvas.innerHTML =
      '<div class="wf-img wf-img--plain" data-stageimg>' +
        '<span class="nxc-stage__hint"><span class="ic">↔</span> 左右拖曳旋轉</span>' +
        '<span class="wf-img__label" data-stagelabel></span>' +
        '<button class="nxc-stage__zoom" data-zoom><span class="ic">⤢</span> 放大看細節</button>' +
      '</div>';
    // 旋轉刻度軸
    wrap.appendChild(canvas);

    canvas.querySelector('[data-zoom]').addEventListener('click', openZoom);
    attachDrag(wrap, view);
    return wrap;
  }

  // 在車圖上左右拖曳 → 旋轉 frame
  function attachDrag(wrap, view) {
    const imgEl = wrap.querySelector('[data-stageimg]');
    let dragging = false, lastX = 0, acc = 0;
    const step = () => Math.max(10, (imgEl.clientWidth || 320) / framesOf(view));
    imgEl.addEventListener('pointerdown', e => {
      if (e.target.closest('[data-zoom]')) return;
      dragging = true; lastX = e.clientX; acc = 0; imgEl.classList.add('is-drag');
      imgEl.setPointerCapture(e.pointerId);
    });
    imgEl.addEventListener('pointermove', e => {
      if (!dragging) return;
      acc += (e.clientX - lastX); lastX = e.clientX;
      const s = step();
      while (Math.abs(acc) >= s) {
        setFrame(view, curFrame(view) + (acc > 0 ? 1 : -1));
        acc += acc > 0 ? -s : s;
        paintStage(wrap, view);
      }
    });
    const end = () => { dragging = false; imgEl.classList.remove('is-drag'); };
    imgEl.addEventListener('pointerup', end);
    imgEl.addEventListener('pointercancel', end);
  }

  // 依目前 state 更新舞台（含淡入回饋）
  function paintStage(wrap, view) {
    const interior = view === 'int';
    const frame = curFrame(view);
    const ang = angleInfo(view, frame);
    const v = ver();
    const imgEl = wrap.querySelector('[data-stageimg]');
    const labelEl = wrap.querySelector('[data-stagelabel]');

    if (interior) {
      labelEl.textContent = v.name + ' · ' + ang.cn + ' · ' + intName() + ' · ' + trimObj().name;
    } else {
      labelEl.textContent = v.name + ' · ' + ang.cn + ' · ' + extName() + ' · ' + wheelObj().en;
    }

    imgEl.classList.remove('nxc-fade'); void imgEl.offsetWidth; imgEl.classList.add('nxc-fade');
  }

  /* ---- 4 · 車款頁入口卡 ----------------------------------- */
  function renderEntry(sel) {
    entryMount = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!entryMount) return;
    entryMount.innerHTML = '';

    const root = el('div', 'nxc-entry');
    const stageCol = el('div', 'nxc-entry__stage');
    state.view = 'ext';
    const stageWrap = buildStage('ext');
    stageCol.appendChild(stageWrap);

    // 置中色票列 + 選中色名
    const picker = el('div', 'nxc-entry__picker');
    const sw = el('div', 'nxc-swatches'); sw.dataset.entrySw = '1';
    const cname = el('div', 'nxc-entry__cname'); cname.dataset.cname = '1';
    const cspec = el('div', 'nxc-entry__cspec'); cspec.dataset.cspec = '1';
    picker.appendChild(sw);
    picker.appendChild(cname);
    picker.appendChild(cspec);

    const ctaWrap = el('div', 'nxc-entry__cta');
    const cta = el('button', 'wf-btn wf-btn--primary', '自訂我的 NX ›');
    cta.addEventListener('click', () => open());
    ctaWrap.appendChild(cta);

    root.appendChild(stageCol);
    root.appendChild(picker);
    root.appendChild(ctaWrap);
    entryMount.appendChild(root);

    function paintEntrySwatches() {
      const v = ver(); sw.innerHTML = '';
      v.colors.forEach(cid => {
        const c = byId(EXT_COLORS, cid);
        const item = el('button', 'nxc-sw');
        item.innerHTML = '<span class="nxc-sw__dot" style="background:' + c.hex + '"></span>';
        item.setAttribute('aria-selected', cid === state.extColor ? 'true' : 'false');
        item.title = c.name;
        item.addEventListener('click', () => {
          state.extColor = cid; setFrame('ext', 6); // 轉到側面
          paintEntrySwatches();
          paintStage(stageWrap, 'ext');
        });
        sw.appendChild(item);
      });
      const c = byId(EXT_COLORS, state.extColor) || {};
      cname.textContent = c.name || '—';
      cspec.textContent = c.spec ? '（' + c.spec + '）' : '';
    }
    paintEntrySwatches();
    paintStage(stageWrap, 'ext');
    entryMount._repaint = () => { paintEntrySwatches(); paintStage(stageWrap, 'ext'); };
  }

  /* ---- 5 · 全螢幕 OVERLAY 狀態機 -------------------------- */
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = el('div', 'nxc-overlay');
    overlay.dataset.device = device();
    overlay.innerHTML = '<div class="nxc-screen"><div class="nxc-toast" data-toast></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    setScreenWidth();
    return overlay;
  }
  function setScreenWidth() {
    const W = (window.WF_WIDTHS || { mobile: 390, tablet: 834, desktop: 1440 });
    overlay.querySelector('.nxc-screen').style.setProperty('--nxc-w', (W[device()] || 1440) + 'px');
  }

  function open() {
    ensureOverlay();
    state.step = 0; state.mode = 'config';
    renderConfig();
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (entryMount && entryMount._repaint) entryMount._repaint();
  }

  // 套用某步驟的自動聚焦（視角 + 旋轉位置）
  function applyFocus(s) {
    state.view = s.view; state.detail = s.detail || null;
    setFrame(s.view, s.frame);
  }

  // 渲染「設定」狀態（步驟流程）
  function renderConfig() {
    const screen = overlay.querySelector('.nxc-screen');
    const toast = screen.querySelector('[data-toast]');
    screen.innerHTML = ''; screen.appendChild(toast);

    const stepObj = STEPS[state.step];
    applyFocus(stepObj); // 自動聚焦

    const bar = el('div', 'nxc-bar');
    bar.innerHTML =
      '<button class="nxc-bar__x" data-x aria-label="關閉">✕</button>';
    bar.querySelector('[data-x]').addEventListener('click', close);
    screen.appendChild(bar);

    const body = el('div', 'nxc-body');
    const stagecol = el('div', 'nxc-stagecol');
    const inner = el('div', 'nxc-stage-inner');
    const stageWrap = buildStage(stepObj.view);
    inner.appendChild(stageWrap);
    stagecol.appendChild(inner);

    const panel = el('div', 'nxc-panel');
    panel.appendChild(buildSteps());
    panel.appendChild(buildStepContent(stageWrap));
    body.appendChild(stagecol);
    body.appendChild(panel);
    screen.appendChild(body);

    const foot = el('div', 'nxc-foot');
    const back = el('button', 'wf-btn wf-btn--secondary wf-btn--sm nxc-foot__btn', '關閉');
    back.addEventListener('click', close);
    const sp = el('span', 'sp');
    const done = el('button', 'wf-btn wf-btn--primary wf-btn--sm nxc-foot__btn', '完成自訂');
    done.addEventListener('click', renderReveal);
    foot.appendChild(back); foot.appendChild(sp); foot.appendChild(done);
    screen.appendChild(foot);

    paintStage(stageWrap, stepObj.view);
  }

  function buildSteps() {
    const row = el('div', 'nxc-steps');
    STEPS.forEach((s, i) => {
      const st = i === state.step ? 'current' : (i < state.step ? 'done' : 'todo');
      const b = el('button', 'nxc-step', s.short);
      b.dataset.state = st;
      b.addEventListener('click', () => { state.step = i; renderConfig(); });
      row.appendChild(b);
    });
    return row;
  }

  function buildStepContent(stageWrap) {
    const s = STEPS[state.step];
    const view = s.view;
    const box = el('div', 'nxc-stepc');
    box.innerHTML =
      '<div class="nxc-stepc__head"><h4>' + s.label + '</h4></div>';
    const repaint = () => paintStage(stageWrap, view);

    if (s.id === 'version') {
      const grid = el('div', 'nxc-vcards');
      VERSIONS.forEach(v => {
        const card = el('button', 'nxc-vcard');
        card.setAttribute('aria-selected', v.id === state.version ? 'true' : 'false');
        card.innerHTML =
          '<div class="nxc-vcard__top"><span class="nxc-vcard__name">' + v.name + '</span>' +
          '<span class="wf-tag">' + v.power.split(' ')[0] + '</span></div>' +
          '<span class="nxc-vcard__diff">' + v.diff + '</span>';
        card.addEventListener('click', () => {
          if (v.id === state.version) return;
          state.version = v.id;
          const changed = applyVersionGate();
          grid.querySelectorAll('.nxc-vcard').forEach((c, idx) =>
            c.setAttribute('aria-selected', VERSIONS[idx].id === state.version ? 'true' : 'false'));
          repaint();
          if (changed.length) showToast('已套用 <b>' + v.name + '</b>，' + changed.join('、') + '已重設為可選範圍預設');
          else showToast('已切換至 <b>' + v.name + '</b>');
        });
        grid.appendChild(card);
      });
      box.appendChild(grid);

    } else if (s.id === 'extColor') {
      // 外觀配色：參照入口完整 10 色，一列兩個、加寬色框
      const grid = el('div', 'nxc-swatches nxc-swatches--2col');
      EXT_COLORS.forEach(c => {
        const item = el('button', 'nxc-sw',
          '<span class="nxc-sw__dot" style="background:' + c.hex + '"></span>' +
          '<span class="nxc-sw__name">' + c.name + '</span>' +
          (c.spec ? '<span class="nxc-sw__spec">' + c.spec + '</span>' : ''));
        item.setAttribute('aria-selected', c.id === state.extColor ? 'true' : 'false');
        item.addEventListener('click', () => {
          state.extColor = c.id;
          grid.querySelectorAll('.nxc-sw').forEach((n, idx) =>
            n.setAttribute('aria-selected', EXT_COLORS[idx].id === state.extColor ? 'true' : 'false'));
          repaint();
        });
        grid.appendChild(item);
      });
      box.appendChild(grid);

    } else if (s.id === 'intColor') {
      // 內裝配色：參照輪圈，圖片 + 圖說卡片
      const allowed = ver().intColors;
      const grid = el('div', 'nxc-thumbs');
      allowed.forEach(cid => {
        const c = byId(INT_COLORS, cid);
        const card = el('button', 'nxc-thumb');
        card.setAttribute('aria-selected', cid === state.intColor ? 'true' : 'false');
        card.innerHTML =
          '<div class="wf-img" style="background:' + c.hex + '"><span class="wf-img__label">' + c.en + '</span></div>' +
          '<span class="nxc-thumb__name">' + c.name + '</span>' +
          '<span class="nxc-thumb__en">' + c.en + '</span>';
        card.addEventListener('click', () => {
          state.intColor = cid;
          grid.querySelectorAll('.nxc-thumb').forEach((n, idx) =>
            n.setAttribute('aria-selected', allowed[idx] === state.intColor ? 'true' : 'false'));
          repaint();
        });
        grid.appendChild(card);
      });
      box.appendChild(grid);

    } else if (s.id === 'wheel' || s.id === 'trim') {
      const isWheel = s.id === 'wheel';
      const pool = isWheel ? WHEELS : TRIMS;
      const allowed = isWheel ? ver().wheels : ver().trims;
      const grid = el('div', 'nxc-thumbs');
      allowed.forEach(tid => {
        const t = byId(pool, tid);
        const card = el('button', 'nxc-thumb');
        card.setAttribute('aria-selected', tid === (isWheel ? state.wheel : state.trim) ? 'true' : 'false');
        card.innerHTML =
          '<div class="wf-img"><span class="wf-img__label">' + t.en + '</span></div>' +
          '<span class="nxc-thumb__name">' + t.name + '</span>' +
          '<span class="nxc-thumb__en">' + t.en + '</span>';
        card.addEventListener('click', () => {
          if (isWheel) state.wheel = tid; else state.trim = tid;
          grid.querySelectorAll('.nxc-thumb').forEach((n, idx) =>
            n.setAttribute('aria-selected', allowed[idx] === (isWheel ? state.wheel : state.trim) ? 'true' : 'false'));
          repaint();
        });
        grid.appendChild(card);
      });
      box.appendChild(grid);
    }
    return box;
  }

  function showToast(html) {
    const t = overlay.querySelector('[data-toast]');
    if (!t) return;
    t.innerHTML = html; t.classList.add('is-show');
    clearTimeout(t._tmr);
    t._tmr = setTimeout(() => t.classList.remove('is-show'), 2600);
  }

  /* ---- 6 · 完成 / 揭曉（全幅車圖 + 上層資訊）-------------- */
  function renderReveal() {
    state.mode = 'reveal';
    state.view = 'ext'; state.detail = null; setFrame('ext', 6);
    const screen = overlay.querySelector('.nxc-screen');
    const toast = screen.querySelector('[data-toast]');
    screen.innerHTML = ''; screen.appendChild(toast);

    // 頂列：關閉 + 繼續調整（浮在車圖上）
    const bar = el('div', 'nxc-bar nxc-bar--float');
    bar.innerHTML =
      '<button class="nxc-bar__x" data-x aria-label="關閉">✕</button>' +
      '<button class="wf-btn wf-btn--ghost wf-btn--sm" data-edit style="margin-left:auto">‹ 繼續自訂</button>';
    bar.querySelector('[data-x]').addEventListener('click', close);
    bar.querySelector('[data-edit]').addEventListener('click', () => { state.mode = 'config'; renderConfig(); });

    // 全幅車圖
    const reveal = el('div', 'nxc-reveal');
    const photo = el('div', 'wf-img wf-img--plain nxc-reveal__photo');
    photo.innerHTML = '<span class="wf-img__label">' + ver().name + ' · ' + extName() + ' · 側面 KEY VISUAL</span>';

    // 上層資訊：車款 / 車型 / 售價 / 所選規格
    const overlayInfo = el('div', 'nxc-reveal__overlay');
    const specPairs = [
      ['外觀配色', extName()],
      ['輪圈樣式', wheelObj().name],
      ['內裝配色', intName()],
      ['內裝飾板', trimObj().name],
      ['動力型式', ver().power],
    ];
    overlayInfo.innerHTML =
      '<div class="nxc-reveal__brand">LEXUS</div>' +
      '<div class="nxc-reveal__model">' + ver().name + '</div>' +
      '<div class="nxc-reveal__price">' + ver().price + ' 起</div>' +
      '<div class="nxc-reveal__specs">' +
        specPairs.map(([k, v]) =>
          '<div class="nxc-reveal__spec"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'
        ).join('') +
      '</div>';

    reveal.appendChild(photo);
    reveal.appendChild(bar);
    reveal.appendChild(overlayInfo);

    // 底部兩顆按鈕
    const cta = el('div', 'nxc-reveal__cta');
    cta.appendChild(el('button', 'wf-btn wf-btn--secondary', '分享儲存'));
    cta.appendChild(el('button', 'wf-btn wf-btn--primary', '預約試乘 ›'));

    screen.appendChild(reveal);
    screen.appendChild(cta);
  }

  /* ---- 7 · 放大看細節 ------------------------------------- */
  function openZoom() {
    let lb = document.getElementById('nxc-zoom');
    if (!lb) {
      lb = el('div', 'nx-lb'); lb.id = 'nxc-zoom';
      lb.innerHTML = '<div class="nx-lb__bd" data-close></div>' +
        '<div class="nx-lb__box"><button class="nx-lb__x" data-close>✕</button>' +
        '<div class="wf-img" style="width:100%;height:100%"><span class="wf-img__label" data-zlabel></span></div></div>';
      document.body.appendChild(lb);
      lb.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) lb.classList.remove('is-open'); });
    }
    const ang = angleInfo(state.view, curFrame(state.view));
    lb.querySelector('[data-zlabel]').textContent =
      'PINCH ZOOM · ' + ver().name + ' · ' + ang.cn + ' · ' + (state.view === 'int' ? intName() : extName());
    lb.classList.add('is-open');
  }

  /* ---- 8 · 對外介面 -------------------------------------- */
  window.NXConfigurator = {
    renderEntry: renderEntry,
    open: open,
    close: close,
    setDevice: function (dev) { if (overlay) { overlay.dataset.device = dev; setScreenWidth(); } },
    _data: { VERSIONS, EXT_COLORS, WHEELS, INT_COLORS, TRIMS, STEPS },
  };
})();
