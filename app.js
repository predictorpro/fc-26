(function () {
  'use strict';

  var C = window.CONFIG || {};
  var INVITEES = C.INVITEES || [];
  var WORLD = window.WORLD || [];
  var FLAGS = window.FLAGS || {};
  var NOTES = window.CLUB_NOTES || {};
  var DEMO = !C.API_URL;
  var DEMO_KEY = 'fc26-demo-responses-v2';
  var ME_KEY = 'fc26-me';
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  /* ---------- утилиты ---------- */
  function $(id) { return document.getElementById(id); }
  function norm(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
  function store(op, key, val) {
    try { return op === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  function el(tag, props, children) {
    var n = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
        else if (v === true) n.setAttribute(k, '');
        else if (v !== false && v != null) n.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  /* ---------- справочники ---------- */
  var COUNTRY = {};
  var CLUBS = {};
  WORLD.forEach(function (c) {
    COUNTRY[c.id] = c;
    c.total = 0;
    c.leagues.forEach(function (l) {
      l.clubs.forEach(function (n) {
        var label = l.women ? n + ' (жен.)' : n;
        var key = norm(label);
        if (CLUBS[key]) return;
        CLUBS[key] = { label: label, name: n, country: c.id, countryName: c.name, league: l.id, leagueName: l.name, note: NOTES[label] || '' };
        c.total++;
      });
    });
  });
  function labelOf(l, n) { return l.women ? n + ' (жен.)' : n; }
  function findInvitee(slug) {
    for (var i = 0; i < INVITEES.length; i++) if (INVITEES[i].slug === slug) return INVITEES[i];
    return null;
  }

  /* ---------- эмблемы: свои, сгенерированные (не настоящие логотипы клубов) ---------- */
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  var SKIP = /^(fc|afc|cf|sc|sk|fk|if|ik|bk|sv|vfl|vfb|tsv|tsg|ssv|us|ss|ac|as|rc|ud|cd|sd|sl|de|la|le|el|der|di|da|do|of|the|\d+)$/i;
  function initials(name) {
    var t = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[\s\-.\/&']+/).filter(Boolean);
    var core = t.filter(function (w) { return !SKIP.test(w); });
    if (!core.length) core = t;
    var out;
    if (core.length === 1) out = core[0].slice(0, 3);
    else out = core.slice(0, 3).map(function (w) { return w[0]; }).join('');
    out = out.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return out || '?';
  }
  function badgeSvg(label, name) {
    var h = hash(label), hue = h % 360, sat = 52 + ((h >> 8) % 22), lig = 30 + ((h >> 16) % 10);
    var c1 = 'hsl(' + hue + ',' + sat + '%,' + lig + '%)';
    var c2 = 'hsl(' + ((hue + 38) % 360) + ',' + (sat + 8) + '%,' + (lig + 28) + '%)';
    var txt = initials(name || label);
    var fs = txt.length > 2 ? 12 : 15;
    return '<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M4 4h32v20c0 10-8 16-16 20C12 40 4 34 4 24z" fill="' + c1 +
      '" stroke="rgba(255,255,255,.85)" stroke-width="2"/><path d="M4 4h32v9H4z" fill="' + c2 + '" opacity=".95"/>' +
      '<text x="20" y="' + (txt.length > 2 ? 32 : 33) + '" text-anchor="middle" font-family="Russo One,Arial Black,sans-serif" font-size="' + fs +
      '" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width=".6" paint-order="stroke">' + txt + '</text></svg>';
  }
  function slug(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  /* Если в config.js задан LOGOS_DIR и там лежит файл <slug>.png, показываем его вместо эмблемы. */
  function badgeEl(label, name) {
    var b = el('span', { class: 'badge' });
    b.innerHTML = badgeSvg(label, name);
    if (C.LOGOS_DIR) {
      var img = new Image();
      img.alt = '';
      img.onload = function () { b.replaceChildren(img); };
      img.src = String(C.LOGOS_DIR).replace(/\/$/, '') + '/' + slug(label) + '.png';
    }
    return b;
  }
  function flagEl(id) {
    var f = el('span', { class: 'flag' });
    f.innerHTML = '<svg viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">' + (FLAGS[id] || '') + '</svg>';
    return f;
  }
  function chevron() {
    var s = document.createElement('span');
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    return s.firstChild;
  }

  /* ---------- состояние ---------- */
  var S = {
    me: null, responses: [], loaded: false, loadError: false,
    country: null, league: null, team: null, saving: false, introDone: false
  };
  var current = null;      // { name, el }
  var nav = { stack: [], useHistory: true };
  var timerIv = null;

  /* ---------- закрытие выбора клуба ---------- */
  var lockTs = C.TEAM_LOCK_ISO ? Date.parse(C.TEAM_LOCK_ISO) : NaN;
  function hasLock() { return !isNaN(lockTs); }
  function isLocked() { return hasLock() && Date.now() >= lockTs; }
  function fmtClock(iso) { var m = /T(\d{2}):(\d{2})/.exec(iso || ''); return m ? m[1] + ':' + m[2] : ''; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtLeft(ms) {
    var t = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60);
    return (h ? h + ':' : '') + pad2(m) + ':' + pad2(t % 60);
  }
  function renderLock(node) {
    if (!hasLock()) { node.hidden = true; return; }
    node.hidden = false;
    if (isLocked()) { node.classList.add('locked'); node.textContent = 'Выбор клуба зафиксирован'; }
    else { node.classList.remove('locked'); node.textContent = 'Выбор и смена клуба закроются через ' + fmtLeft(lockTs - Date.now()); }
  }
  var startTs = C.EVENT_ISO ? Date.parse(C.EVENT_ISO) : NaN;
  function renderStart(node) {
    var diff = startTs - Date.now();
    var timer = node.querySelector('.timer'), started = node.querySelector('.started'), label = node.querySelector('.timer-label');
    if (diff <= 0) { timer.hidden = true; label.hidden = true; started.hidden = false; return; }
    timer.hidden = false; label.hidden = false; started.hidden = true;
    var total = Math.floor(diff / 1000), d = Math.floor(total / 86400);
    node.querySelector('.u-d').hidden = d === 0;
    node.querySelector('.t-d').textContent = d;
    node.querySelector('.t-h').textContent = pad2(Math.floor((total % 86400) / 3600));
    node.querySelector('.t-m').textContent = pad2(Math.floor((total % 3600) / 60));
    node.querySelector('.t-s').textContent = pad2(total % 60);
  }
  function startEl() {
    if (isNaN(startTs)) return null;
    var n = el('div', { class: 'startbox', 'data-start': '1' });
    n.innerHTML = '<p class="timer-label">До начала турнира</p><div class="timer">' +
      '<div class="unit u-d" hidden><b class="t-d">0</b><span>дн</span></div><div class="unit"><b class="t-h">00</b><span>ч</span></div>' +
      '<div class="unit"><b class="t-m">00</b><span>мин</span></div><div class="unit"><b class="t-s">00</b><span>сек</span></div></div>' +
      '<p class="started" hidden>Турнир уже начался</p>';
    renderStart(n);
    return n;
  }
  function lockEl() {
    var n = el('p', { class: 'lockbar', 'data-lock': '1' });
    renderLock(n);
    return n;
  }

  function myResponse() {
    if (!S.me) return null;
    for (var i = 0; i < S.responses.length; i++) if (S.responses[i].slug === S.me.slug) return S.responses[i];
    return null;
  }
  function takenMap() {
    var m = {};
    S.responses.forEach(function (r) {
      if (r.status === 'yes' && r.team && (!S.me || r.slug !== S.me.slug)) m[norm(r.team)] = r.slug;
    });
    return m;
  }
  function nameOf(slugv) { var p = findInvitee(slugv); return p ? p.name : slugv; }

  /* ---------- слой данных ---------- */
  function fetchJson(url, opts) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 20000);
    opts = opts || {};
    opts.signal = ctrl.signal;
    return fetch(url, opts).then(function (r) { return r.json(); }).finally(function () { clearTimeout(t); });
  }
  function demoRead() { try { return JSON.parse(store('get', DEMO_KEY) || '[]'); } catch (e) { return []; } }
  function apiList() {
    if (DEMO) return Promise.resolve(demoRead());
    return fetchJson(C.API_URL, { cache: 'no-store' }).then(function (j) {
      if (!j || !j.ok) throw new Error('bad');
      return j.responses || [];
    });
  }
  function apiSave(p) {
    if (DEMO) {
      var all = demoRead(), idx = -1;
      for (var k = 0; k < all.length; k++) if (all[k].slug === p.slug) idx = k;
      var own = idx >= 0 ? all[idx] : null;
      if (own && (own.status === 'no' || p.status === 'no')) return Promise.resolve({ ok: false, error: 'locked', responses: all });
      if (p.status === 'yes' && own && norm(own.team) === norm(p.team)) return Promise.resolve({ ok: true, responses: all });
      if (p.status === 'yes' && isLocked()) return Promise.resolve({ ok: false, error: 'team_locked', responses: all });
      for (var i = 0; i < all.length; i++) {
        if (all[i].slug !== p.slug && p.status === 'yes' && all[i].team && norm(all[i].team) === norm(p.team)) {
          return Promise.resolve({ ok: false, error: 'team_taken', responses: all });
        }
      }
      var row = { slug: p.slug, name: p.name, status: p.status, team: p.status === 'yes' ? p.team : '',
        country: p.status === 'yes' ? p.country : '', league: p.status === 'yes' ? p.league : '', updatedAt: new Date().toISOString() };
      if (idx >= 0) all[idx] = row; else all.push(row);
      store('set', DEMO_KEY, JSON.stringify(all));
      return Promise.resolve({ ok: true, responses: all });
    }
    return fetchJson(C.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p) });
  }
  function save(extra) {
    if (S.saving || !S.me) return Promise.resolve({ ok: false, error: 'busy_local' });
    S.saving = true;
    var p = { slug: S.me.slug, name: S.me.name, status: extra.status, team: extra.team || '', country: extra.country || '', league: extra.league || '' };
    return apiSave(p).then(function (j) {
      S.saving = false;
      if (j && j.responses) S.responses = j.responses;
      return j && j.ok ? { ok: true } : { ok: false, error: j && j.error };
    }).catch(function () { S.saving = false; return { ok: false, error: 'network' }; });
  }
  function errText(code) {
    if (code === 'team_taken') return 'Этот клуб только что взял другой участник. Выбери другой.';
    if (code === 'locked') return 'Ответ уже записан и не меняется.';
    if (code === 'team_locked') return 'Время выбора клуба закончилось, выбор зафиксирован.';
    if (code === 'not_invited') return 'Тебя нет в списке приглашённых.';
    if (code === 'busy') return 'Сервер занят. Попробуй ещё раз через пару секунд.';
    if (code === 'network') return 'Не удалось отправить. Проверь интернет и попробуй ещё раз.';
    return 'Не получилось сохранить. Попробуй ещё раз.';
  }

  /* ---------- менеджер экранов ---------- */
  var stage = $('stage');

  function show(name, dir) {
    var el_ = SCREENS[name]();
    el_.classList.add('screen');
    stage.appendChild(el_);
    if (el_._after) el_._after();
    var old = current;
    current = { name: name, el: el_ };
    if (!old) return;
    if (old.name === 'invite' && timerIv) { clearInterval(timerIv); timerIv = null; }
    var fwd = dir !== 'back';
    el_.classList.add(fwd ? 'enter-right' : 'enter-left');
    old.el.classList.add(fwd ? 'leave-left' : 'leave-right');
    el_.getBoundingClientRect();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el_.classList.remove('enter-right', 'enter-left'); });
    });
    setTimeout(function () { if (old.el.parentNode) old.el.parentNode.removeChild(old.el); }, 460);
  }
  function go(name) {
    if (current) nav.stack.push(current.name);
    if (nav.useHistory) { try { history.pushState({ n: nav.stack.length }, ''); } catch (e) { nav.useHistory = false; } }
    show(name, 'fwd');
  }
  function goRoot(name) {
    nav.stack = [];
    if (current && current.name === name && (name === 'who' || name === 'loading' || name === 'error')) return;
    show(name, 'fwd');
  }
  function popShow() { var prev = nav.stack.pop(); if (prev) show(prev, 'back'); }
  function back() {
    if (!nav.stack.length) return;
    if (nav.useHistory) history.back(); else popShow();
  }
  window.addEventListener('popstate', function () { if (nav.stack.length) popShow(); });

  function backBtn() {
    return el('button', { class: 'back', type: 'button', 'aria-label': 'Назад', onclick: back }, [chevron()]);
  }

  /* ---------- экраны ---------- */
  var SCREENS = {};

  SCREENS.loading = function () {
    return el('section', { class: 'center' }, [el('p', { text: 'Загружаю приглашение…' })]);
  };

  SCREENS.error = function () {
    return el('section', { class: 'center' }, [
      el('h2', { text: 'Не удалось загрузить' }),
      el('p', { text: 'Проверь интернет и попробуй ещё раз.' }),
      el('button', { class: 'btn', type: 'button', text: 'Повторить', onclick: function () { S.loadError = false; S.loaded = false; goRoot('loading'); load(); } })
    ]);
  };

  SCREENS.who = function () {
    var list = el('div', { class: 'pickers' + (INVITEES.length > 6 ? ' two' : '') });
    INVITEES.forEach(function (p) {
      list.appendChild(el('button', { class: 'btn', type: 'button', text: p.name, onclick: function () { setMe(p); } }));
    });
    return el('section', { class: 'center' }, [el('h2', { text: 'Кто ты?' }), el('p', { text: 'Нажми на своё имя, чтобы открыть приглашение.' }), list]);
  };

  var HERO_HTML =
    '<div class="hero">' +
    '<svg class="lines" viewBox="0 0 430 640" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect x="18" y="18" width="394" height="604"/><line x1="18" y1="320" x2="412" y2="320"/><circle cx="215" cy="320" r="58"/>' +
    '<circle class="dot" cx="215" cy="320" r="4"/><rect x="95" y="18" width="240" height="96"/><rect x="150" y="18" width="130" height="38"/>' +
    '<path d="M165 114 A52 52 0 0 0 265 114"/><rect x="95" y="526" width="240" height="96"/><rect x="150" y="584" width="130" height="38"/>' +
    '<path d="M165 526 A52 52 0 0 1 265 526"/></svg>' +
    '<div class="goal" aria-hidden="true"></div><div class="ball-shadow" aria-hidden="true"></div>' +
    '<div class="ball" aria-hidden="true"><svg viewBox="0 0 100 100"><g class="spin">' +
    '<circle cx="50" cy="50" r="47" fill="#f5f3ea" stroke="#0f2418" stroke-width="3"/><polygon points="50,30 68,43 61,64 39,64 32,43" fill="#0f2418"/>' +
    '<g stroke="#0f2418" stroke-width="3" stroke-linecap="round"><line x1="50" y1="30" x2="50" y2="8"/><line x1="68" y1="43" x2="90" y2="36"/>' +
    '<line x1="61" y1="64" x2="75" y2="84"/><line x1="39" y1="64" x2="25" y2="84"/><line x1="32" y1="43" x2="10" y2="36"/></g>' +
    '<circle cx="50" cy="8" r="9" fill="#0f2418"/><circle cx="91" cy="38" r="9" fill="#0f2418"/><circle cx="76" cy="86" r="9" fill="#0f2418"/>' +
    '<circle cx="24" cy="86" r="9" fill="#0f2418"/><circle cx="9" cy="38" r="9" fill="#0f2418"/></g></svg></div>' +
    '<div class="flash" aria-hidden="true"></div>' +
    '<div class="hero-content">' +
    '<p class="kicker reveal">Тебе пришло приглашение</p><h1 class="name reveal"></h1><p class="lead reveal"></p>' +
    '<div class="event reveal"><b></b><span class="fmt"></span><span class="dur"></span></div>' +
    '<p class="when reveal"><span class="when-t"></span><span class="where"></span></p>' +
    '<div class="timer reveal" role="timer" aria-label="Время до начала турнира" hidden>' +
    '<div class="unit u-d" hidden><b class="t-d">0</b><span>дн</span></div><div class="unit"><b class="t-h">00</b><span>ч</span></div>' +
    '<div class="unit"><b class="t-m">00</b><span>мин</span></div><div class="unit"><b class="t-s">00</b><span>сек</span></div></div>' +
    '<p class="started reveal" hidden>Турнир уже начался</p><p class="lockline reveal" hidden></p><p class="rule reveal"></p></div></div>' +
    '<div class="cta"><p class="msg" role="alert" hidden></p><div class="row">' +
    '<button class="btn green yes" type="button">Принимаю</button><button class="btn no" type="button">Не смогу</button></div>' +
    '<p class="cta-hint" hidden>Демо-режим: ответы видны только на этом устройстве</p></div>';

  function fmtEvent() {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(C.EVENT_ISO || '');
    if (!m) return null;
    return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] + ', ' + m[4] + ':' + m[5] + (C.TZ_LABEL ? ' (' + C.TZ_LABEL + ')' : '');
  }

  SCREENS.invite = function () {
    var first = !S.introDone;
    S.introDone = true;
    var scr = el('section', { class: 'invite ' + (first ? 'go' : 'still') });
    scr.innerHTML = HERO_HTML;
    var q = function (s) { return scr.querySelector(s); };

    var name = S.me ? S.me.name : '';
    var h = q('.name');
    h.textContent = name;
    h.className = 'name reveal' + (name.length >= 9 ? ' long' : name.length >= 7 ? ' mid' : '');
    q('.lead').textContent = 'Ты приглашён на турнир по ' + (C.GAME || 'FC 26');
    q('.event b').textContent = C.TOURNAMENT || C.GAME || 'FC 26';
    q('.fmt').textContent = C.FORMAT || '';
    q('.dur').textContent = C.DURATION || '';
    if (!C.DURATION) q('.dur').hidden = true;
    var ll = q('.lockline');
    if (hasLock()) { ll.textContent = 'Выбрать и сменить клуб можно до ' + fmtClock(C.TEAM_LOCK_ISO); ll.hidden = false; }
    q('.where').textContent = C.PLACE ? 'Место: ' + C.PLACE : '';
    var rule = q('.rule');
    rule.textContent = C.RULE || '';
    if (!C.RULE) rule.hidden = true;
    var when = fmtEvent();
    q('.when-t').textContent = when || 'Дату и время сообщим отдельно';
    // подгоняем размер имени под ширину экрана (длинные имена, например «Батырджамаль»)
    function fit() {
      h.style.fontSize = '';
      var size = parseFloat(getComputedStyle(h).fontSize), avail = h.parentElement.clientWidth * 0.86, guard = 0;
      while (h.scrollWidth > avail && size > 22 && guard++ < 40) { size -= 2; h.style.fontSize = size + 'px'; }
    }
    scr._after = function () { fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); };
    document.title = 'Приглашение для ' + name + ' — ' + (C.TOURNAMENT || C.GAME || 'FC 26');

    if (when) {
      var target = Date.parse(C.EVENT_ISO);
      var timer = q('.timer'), started = q('.started');
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      var tick = function () {
        var diff = target - Date.now();
        if (isNaN(target)) return false;
        if (diff <= 0) { timer.hidden = true; started.hidden = false; return false; }
        timer.hidden = false;
        var total = Math.floor(diff / 1000), d = Math.floor(total / 86400);
        q('.u-d').hidden = d === 0;
        q('.t-d').textContent = d;
        q('.t-h').textContent = pad(Math.floor((total % 86400) / 3600));
        q('.t-m').textContent = pad(Math.floor((total % 3600) / 60));
        q('.t-s').textContent = pad(total % 60);
        return true;
      };
      if (timerIv) clearInterval(timerIv);
      if (tick()) timerIv = setInterval(function () { if (!tick()) { clearInterval(timerIv); timerIv = null; } }, 1000);
    }

    // тап по шапке пропускает анимацию
    q('.hero').addEventListener('click', function () {
      if (scr.classList.contains('go')) { scr.classList.remove('go'); scr.classList.add('still'); }
    });

    var msg = q('.cta .msg'), yes = q('.yes'), no = q('.no');
    q('.cta-hint').hidden = !DEMO;
    function applyLock() {
      if (isLocked()) {
        yes.disabled = true;
        msg.textContent = 'Время выбора клуба закончилось, принять приглашение уже нельзя. Можно только отказаться.';
        msg.hidden = false;
      }
    }
    applyLock();
    scr._update = applyLock;
    yes.addEventListener('click', function () {
      if (isLocked()) { applyLock(); return; }
      msg.hidden = true;
      S.team = null;
      go('country');
    });
    no.addEventListener('click', function () {
      msg.hidden = true; yes.disabled = no.disabled = true; no.textContent = 'Отправляю…';
      save({ status: 'no' }).then(function (r) {
        yes.disabled = no.disabled = false; no.textContent = 'Не смогу';
        if (r.ok || r.error === 'locked') { goRoot('done'); return; }
        msg.textContent = errText(r.error); msg.hidden = false;
        applyLock();
      });
    });
    return scr;
  };

  SCREENS.country = function () {
    var scr = el('section', { class: 'col' });
    scr.appendChild(el('header', { class: 'bar' }, [
      backBtn(),
      el('div', {}, [el('h2', { text: 'Выбери страну' }), el('p', { class: 'bar-sub', text: 'Потом выберешь клуб' })])
    ]));
    var input = el('input', { type: 'search', placeholder: 'Поиск страны', 'aria-label': 'Поиск страны', autocomplete: 'off' });
    scr.appendChild(el('div', { class: 'search' }, [input]));
    var grid = el('div', { class: 'countries' });
    var cards = [];
    WORLD.forEach(function (c) {
      var card = el('button', { class: 'country', type: 'button', onclick: function () { openCountry(c); } }, [
        flagEl(c.id),
        el('span', { class: 'cname', text: c.name }),
        el('span', { class: 'ccount', text: c.total + ' ' + plural(c.total, 'клуб', 'клуба', 'клубов') })
      ]);
      card._n = norm(c.name);
      cards.push(card);
      grid.appendChild(card);
    });
    var empty = el('p', { class: 'empty', text: 'Такой страны нет в списке', hidden: true });
    grid.appendChild(empty);
    input.addEventListener('input', function () {
      var v = norm(input.value), shown = 0;
      cards.forEach(function (cd) { var ok = !v || cd._n.indexOf(v) !== -1; cd.hidden = !ok; if (ok) shown++; });
      empty.hidden = shown > 0;
    });
    scr.appendChild(el('div', { class: 'scroll' }, [grid]));
    return scr;
  };

  function openCountry(c) {
    S.country = c.id;
    var info = S.team && CLUBS[norm(S.team)];
    S.league = info && info.country === c.id ? info.league : c.leagues[0].id;
    go('teams');
  }

  SCREENS.teams = function () {
    var c = COUNTRY[S.country];
    var scr = el('section', { class: 'col' });
    var sub = el('p', { class: 'bar-sub' });
    scr.appendChild(el('header', { class: 'bar' }, [backBtn(), flagEl(c.id), el('div', {}, [el('h2', { text: c.name }), sub])]));
    var clubs = el('div', { class: 'clubs' });
    var msg = el('p', { class: 'msg', role: 'alert', hidden: true });
    var confirm = el('button', { class: 'confirm', type: 'button' });
    var tabs = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Лига' });
    scr.appendChild(clubs);
    scr.appendChild(el('div', { class: 'dock' }, [msg, lockEl(), confirm, tabs]));

    function league() { for (var i = 0; i < c.leagues.length; i++) if (c.leagues[i].id === S.league) return c.leagues[i]; return c.leagues[0]; }

    function syncConfirm() {
      confirm.disabled = S.saving || !S.team || isLocked();
      confirm.textContent = S.saving ? 'Сохраняю…' : S.team ? 'Подтвердить: ' + S.team : 'Выбери клуб';
    }
    function syncTabs() {
      Array.prototype.forEach.call(tabs.children, function (t) { t.setAttribute('aria-selected', t._id === S.league ? 'true' : 'false'); });
    }
    function renderClubs() {
      var l = league();
      var taken = takenMap();
      var responded = !!myResponse();
      sub.textContent = l.name;
      clubs.replaceChildren();
      l.clubs.forEach(function (n) {
        var label = labelOf(l, n);
        var key = norm(label);
        var owner = taken[key];
        var info = CLUBS[key];
        var small = owner ? (responded ? 'занял ' + nameOf(owner) : 'занят') : (info && info.note) || '';
        var btn = el('button', { class: 'club', type: 'button', disabled: !!owner,
          'aria-pressed': S.team && norm(S.team) === key ? 'true' : 'false',
          onclick: function () { S.team = label; msg.hidden = true; refreshPressed(); syncConfirm(); } }, [
          badgeEl(label, n),
          el('span', { class: 'cn' }, [el('b', { text: n + (l.women ? ' (жен.)' : '') }), small ? el('small', { text: small }) : null])
        ]);
        btn._key = key;
        clubs.appendChild(btn);
      });
    }
    function refreshPressed() {
      Array.prototype.forEach.call(clubs.children, function (b) {
        b.setAttribute('aria-pressed', S.team && norm(S.team) === b._key ? 'true' : 'false');
      });
    }
    c.leagues.forEach(function (l) {
      var t = el('button', { class: 'tab', type: 'button', role: 'tab', text: l.name, onclick: function () {
        S.league = l.id; renderClubs(); syncTabs(); clubs.scrollTop = 0;
      } });
      t._id = l.id;
      tabs.appendChild(t);
    });

    confirm.addEventListener('click', function () {
      if (!S.team || S.saving) return;
      if (isLocked()) { goRoot(myResponse() ? 'done' : 'invite'); return; }
      var info = CLUBS[norm(S.team)];
      var picked = S.team;
      msg.hidden = true;
      confirm.disabled = true; confirm.textContent = 'Сохраняю…';
      save({ status: 'yes', team: picked, country: info ? info.countryName : '', league: info ? info.leagueName : '' }).then(function (r) {
        if (r.ok) { goRoot('done'); return; }
        if (r.error === 'team_locked' || r.error === 'locked') { goRoot(myResponse() ? 'done' : 'invite'); return; }
        if (r.error === 'team_taken') { S.team = null; renderClubs(); }
        msg.textContent = errText(r.error); msg.hidden = false;
        syncConfirm();
      });
    });

    scr._update = function () {
      // кто-то мог занять выбранный клуб, пока мы выбирали
      if (S.team && takenMap()[norm(S.team)]) {
        S.team = null; msg.textContent = 'Этот клуб только что занял другой участник. Выбери другой.'; msg.hidden = false;
      }
      renderClubs(); syncConfirm();
    };

    renderClubs(); syncTabs(); syncConfirm();
    return scr;
  };

  function participantsPanel() {
    var yes = [], no = [], wait = [];
    INVITEES.forEach(function (p) {
      var r = null;
      S.responses.forEach(function (x) { if (x.slug === p.slug) r = x; });
      if (!r) wait.push({ p: p, r: null });
      else if (r.status === 'yes') yes.push({ p: p, r: r });
      else no.push({ p: p, r: r });
    });
    var ul = el('ul', { class: 'people' });
    yes.concat(no, wait).forEach(function (row) {
      var isMe = S.me && row.p.slug === S.me.slug;
      var who = el('span', { class: 'who' }, [row.p.name, isMe ? el('i', { text: 'ты' }) : null]);
      var right;
      if (!row.r) right = el('span', { class: 'tag wait', text: 'Ещё не ответил' });
      else if (row.r.status === 'yes') {
        right = el('span', { class: 'pteam' }, [badgeEl(row.r.team, String(row.r.team).replace(/ \(жен\.\)$/, '')), el('span', { text: row.r.team })]);
      } else right = el('span', { class: 'tag no', text: 'Не придёт' });
      ul.appendChild(el('li', { class: 'person' + (isMe ? ' me' : '') }, [who, right]));
    });
    return el('div', { class: 'panel' }, [
      el('h2', { text: 'Участники' }),
      el('p', { class: 'sub', text: 'Идут: ' + yes.length + ' · Отказались: ' + no.length + ' · Не ответили: ' + wait.length }),
      ul
    ]);
  }

  SCREENS.done = function () {
    var wrap = el('div', { class: 'done-wrap' });
    var scr = el('section', {}, [wrap]);
    function fill() {
      wrap.replaceChildren();
      var mine = myResponse();
      if (mine && mine.status === 'yes') {
        var info = CLUBS[norm(mine.team)];
        var meta = info ? info.countryName + ' · ' + info.leagueName : (mine.country ? mine.country + (mine.league ? ' · ' + mine.league : '') : '');
        wrap.appendChild(el('div', { class: 'panel' }, [
          el('h2', { text: 'Ты в турнире' }),
          el('p', { class: 'sub', text: 'Ответ записан. Участники видят твой выбор.' }),
          startEl(),
          el('div', { class: 'mine' }, [badgeEl(mine.team, info ? info.name : mine.team), el('div', {}, [el('b', { text: mine.team }), meta ? el('small', { text: meta }) : null])]),
          lockEl(),
          isLocked() ? null : el('div', { class: 'acts' }, [
            el('button', { class: 'link', type: 'button', text: 'Сменить клуб', onclick: function () { S.team = mine.team; go('country'); } })
          ])
        ]));
      } else {
        wrap.appendChild(el('div', { class: 'panel' }, [
          el('h2', { text: 'Ты не придёшь' }),
          el('p', { class: 'sub', text: 'Ответ записан. Спасибо, что предупредил.' })
        ]));
      }
      wrap.appendChild(participantsPanel());
      if (DEMO) wrap.appendChild(el('p', { class: 'demo-note', text: 'Демо-режим: сайт ещё не подключён к таблице, поэтому ответы видны только на этом устройстве.' }));
    }
    fill();
    scr._update = fill;
    return scr;
  };

  /* ---------- запуск ---------- */
  function setMe(p) {
    S.me = p;
    store('set', ME_KEY, p.slug);
    try { history.replaceState(null, '', '?to=' + encodeURIComponent(p.slug)); } catch (e) {}
    route();
  }

  function route() {
    if (!S.me) return goRoot('who');
    if (S.loadError) return goRoot('error');
    if (!S.loaded) return goRoot('loading');
    goRoot(myResponse() ? 'done' : 'invite');
  }

  function load() {
    apiList().then(function (list) {
      S.responses = list; S.loaded = true; S.loadError = false;
      route();
    }).catch(function () {
      S.loadError = true; route();
    });
  }

  function poll() {
    if (DEMO || S.saving || document.hidden || !S.loaded || !current) return;
    var a = document.activeElement;
    if (a && a.tagName === 'INPUT') return;
    apiList().then(function (list) {
      if (JSON.stringify(list) !== JSON.stringify(S.responses) && !S.saving) {
        S.responses = list;
        if (current.el._update) current.el._update();
      }
    }).catch(function () {});
  }

  function start() {
    var q = '';
    try { q = new URLSearchParams(location.search).get('to') || ''; } catch (e) {}
    S.me = findInvitee(q) || findInvitee(store('get', ME_KEY) || '');
    if (!S.me) { goRoot('who'); load(); }
    else { goRoot('loading'); load(); }
    setInterval(poll, 20000);
  }
  var wasLocked = isLocked();
  setInterval(function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-lock]'), renderLock);
    Array.prototype.forEach.call(document.querySelectorAll('[data-start]'), renderStart);
    var now = isLocked();
    if (now && !wasLocked) {
      wasLocked = true;
      if (!current) return;
      if (current.name === 'country' || current.name === 'teams') goRoot(myResponse() ? 'done' : 'invite');
      else if (current.el._update) current.el._update();
    }
  }, 1000);
  start();
})();
