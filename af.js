(function () {
  'use strict';
  var d = document;
  // 콘텐츠는 스크립트나 관찰 API가 실패해도 읽을 수 있습니다.
  d.querySelectorAll('.rv,.big20,.bars').forEach(function (el) { el.classList.add('in'); });
  d.querySelectorAll('[data-w]').forEach(function (el) { el.style.width = el.dataset.w; });
  var trackButtons = Array.from(d.querySelectorAll('[data-track]'));
  if (trackButtons.length) {
    var mobile = window.matchMedia('(max-width:760px)');
    var chosenTrack = new URLSearchParams(location.search).get('category') === 'auto' ? 'auto' : 'svc';
    function trackFromHash() {
      var target = d.getElementById(location.hash.slice(1));
      if (target && target.dataset.cat) chosenTrack = target.dataset.cat;
    }
    function showTrack() {
      d.documentElement.classList.add('tracks-ready');
      trackButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.track === chosenTrack)); });
      d.querySelectorAll('.team-group').forEach(function (g) { g.hidden = mobile.matches && g.dataset.group !== chosenTrack; });
    }
    trackButtons.forEach(function (b) { b.addEventListener('click', function () {
      chosenTrack = b.dataset.track;
      var url = new URL(location.href); url.searchParams.set('category', chosenTrack); url.hash = '';
      history.replaceState(null, '', url); showTrack();
    }); });
    mobile.addEventListener('change', showTrack);
    window.addEventListener('hashchange', function () { trackFromHash(); showTrack(); });
    window.addEventListener('popstate', function () { chosenTrack = new URLSearchParams(location.search).get('category') === 'auto' ? 'auto' : 'svc'; trackFromHash(); showTrack(); });
    trackFromHash(); showTrack();
  }
  var grid = d.getElementById('grid');
  if (grid && d.getElementById('q')) {
    var buttons = Array.from(d.querySelectorAll('[data-f]'));
    var search = d.getElementById('q'), empty = d.getElementById('empty');
    var status = d.getElementById('resultCount'), cat = 'all';
    function apply(save) {
      var q = search.value.trim().toLocaleLowerCase().replace(/\s+/g, '');
      var shown = 0;
      Array.from(grid.querySelectorAll('.gallery-card')).forEach(function (card) {
        card.hidden = !((cat === 'all' || card.dataset.cat === cat) && (!q || card.dataset.k.includes(q)));
        if (!card.hidden) shown++;
      });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === cat)); });
      grid.querySelectorAll('.team-group').forEach(function (group) { group.hidden = !group.querySelector('.gallery-card:not([hidden])'); });
      empty.hidden = shown > 0;
      status.textContent = shown + '개 팀' + (q ? ' · “' + search.value.trim() + '” 검색 결과' : ' · 발표 순서');
      if (save) {
        var url = new URL(location.href);
        if (cat === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', cat);
        if (!q) url.searchParams.delete('q'); else url.searchParams.set('q', search.value.trim());
        history.replaceState(null, '', url);
      }
    }
    function restore() {
      var params = new URLSearchParams(location.search);
      cat = ['svc', 'auto'].includes(params.get('category')) ? params.get('category') : 'all';
      search.value = params.get('q') || '';
      apply(false);
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { cat = b.dataset.f; apply(true); }); });
    search.addEventListener('input', function () { apply(true); });
    d.getElementById('resetFilters').addEventListener('click', function () { cat = 'all'; search.value = ''; apply(true); search.focus(); });
    window.addEventListener('popstate', restore);
    restore();
  }
  var tabs = Array.from(d.querySelectorAll('.gal-tabs button'));
  if (tabs.length) {
    var img = d.getElementById('galImg'), cap = d.getElementById('galCap');
    var panel = img.parentElement;
    panel.id = 'gallery-panel'; panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0;
    cap.setAttribute('aria-live', 'polite');
    function select(b, focus) {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      panel.setAttribute('aria-labelledby', b.id);
      img.src = b.dataset.src; img.alt = b.dataset.cap; cap.textContent = b.dataset.cap;
      if (focus) b.focus();
    }
    tabs.forEach(function (b, i) {
      b.id = 'gallery-tab-' + i; b.setAttribute('aria-controls', 'gallery-panel');
      b.addEventListener('click', function () { select(b, false); });
      b.addEventListener('keydown', function (event) {
        var next = event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
        if (next >= 0) { event.preventDefault(); select(tabs[next], true); }
      });
    });
    select(tabs[0], false);
  }
  var toast = d.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); d.body.appendChild(toast);
  function say(text) { toast.textContent = text; toast.classList.add('on'); clearTimeout(toast.timer); toast.timer = setTimeout(function () { toast.classList.remove('on'); }, 4000); }
  var dialog = d.createElement('dialog'); dialog.className = 'share-dialog';
  dialog.innerHTML = '<form method="dialog"><h2>이 프로젝트를 알려 주세요</h2><p id="shareHint">아래 주소를 복사해 동료에게 보내 주세요.</p><label for="shareUrl">공유할 주소</label><input id="shareUrl" readonly aria-describedby="shareHint"><div class="btns"><button class="btn btn-solid" type="button" id="copyLink">주소 복사</button><button class="btn btn-line" value="close">닫기</button></div></form>';
  d.body.appendChild(dialog);
  var urlInput = dialog.querySelector('input');
  dialog.querySelector('#copyLink').addEventListener('click', async function () {
    urlInput.select();
    try { await navigator.clipboard.writeText(urlInput.value); say('링크를 복사했습니다'); dialog.close(); }
    catch (_) { dialog.querySelector('#shareHint').textContent = '주소를 선택했습니다. Ctrl+C 또는 길게 눌러 복사해 주세요.'; }
  });
  d.querySelectorAll('[data-share]').forEach(function (button) {
    button.addEventListener('click', async function () {
      if (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)) {
        say('로컬 미리보기입니다. 공개 주소로 배포한 뒤 링크를 공유할 수 있습니다.'); return;
      }
      var data = {title: d.title, text: button.dataset.share || d.title, url: location.href};
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (error) { if (error.name === 'AbortError') return; }
      }
      try { await navigator.clipboard.writeText(location.href); say('링크를 복사했습니다'); }
      catch (_) { urlInput.value = location.href; dialog.showModal(); urlInput.focus(); urlInput.select(); }
    });
  });
})();
