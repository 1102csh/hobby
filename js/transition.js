// /js/transition.js  (localStorage 버전)
(() => {
  const OVERLAY_ID = 'page-transition';
  const FLAG_KEY = 'pt_should_open';        // localStorage 플래그
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  const readMs = (prop) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    if (!v) return 0;
    if (v.endsWith('ms')) return parseFloat(v);
    if (v.endsWith('s')) return parseFloat(v) * 1000;
    return parseFloat(v) || 0;
  };
  const DUR_SHRINK = readMs('--dur-shrink') || 900;
  const DUR_EXPAND = readMs('--dur-expand') || 900;
  const HOLD_BLACK = readMs('--hold-black') || 200;

  // 도착 시: 검정(닫힘) → 작은원 → 큰원
  const openIfFlag = () => {
    const hasHeadClass = document.documentElement.classList.contains('pt-opening');
    const hasFlag = localStorage.getItem(FLAG_KEY) === '1';
    const shouldOpen = hasHeadClass || hasFlag;

    // 플래그 소모
    localStorage.removeItem(FLAG_KEY);

    overlay.classList.remove('is-frozen', 'is-shrinking');

    if (shouldOpen) {
      // head에서 붙인 표시 클래스 제거
      document.documentElement.classList.remove('pt-opening');

      // 닫힌 상태에서 보이게 시작 (--r: 0)
      overlay.classList.add('is-visible', 'is-closed-initial');

      // 다음 프레임에 열림 시작 (--r: 0 → 60vmax)
      requestAnimationFrame(() => {
        void overlay.offsetWidth;
        requestAnimationFrame(() => {
          overlay.classList.remove('is-closed-initial');
          setTimeout(() => {
            overlay.classList.remove('is-visible','is-shrinking','is-closed-initial','is-frozen');
          }, DUR_EXPAND + 50);
        });
      });
    } else {
      // 플래그가 없으면 그냥 보이도록 초기화(검정 고정 방지)
      overlay.classList.remove('is-visible','is-closed-initial','is-shrinking','is-frozen');
      document.documentElement.classList.remove('pt-opening');
    }
  };

  // 떠날 때: 큰원 → 작은원(검정) → 유지 → 이동
  function startPageTransition(href, extraDelay = 0) {
    if (!href) return;
    localStorage.setItem(FLAG_KEY, '1');

    overlay.classList.add('is-visible', 'is-shrinking');

    setTimeout(() => {
      overlay.classList.add('is-frozen'); // --r:0 고정
      setTimeout(() => {
        setTimeout(() => { window.location.href = href; }, extraDelay);
      }, HOLD_BLACK);
    }, DUR_SHRINK);
  }
  window.startPageTransition = startPageTransition;

  // a / data-transition-* 자동 가로채기(옵션)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-transition-href], [data-transition-link], a');
    if (!el) return;
    const dataHref = el.getAttribute('data-transition-href');
    const href = dataHref || el.getAttribute('href');
    if (!href || href.startsWith('#') || el.target === '_blank' || el.hasAttribute('download')) return;
    e.preventDefault();
    startPageTransition(href);
  }, true);

  // 첫 로드/히스토리 복원
  openIfFlag();
  window.addEventListener('pageshow', openIfFlag);
})();
