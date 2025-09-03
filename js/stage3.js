(function () {
  const board = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const enterBtn = document.getElementById('enter');

  let selected = null;

  // 리터당 픽셀 (비커 높이 차이)
  const PX_PER_LITER = 18;   // 10L=180px, 6L=108px, 5L=90px
  const MIN_GLASS_H  = 90;   // 너무 작지 않게 최소 높이

  const beakers = [...board.querySelectorAll('.beaker')].map(el => ({
    el,
    get cap() { return +el.dataset.capacity; },
    get vol() { return +el.dataset.volume; },
    set vol(v) { el.dataset.volume = String(v); }
  }));

  function findByName(name){
    return beakers.find(b => b.el.dataset.name === name);
  }

  // ① 비커 유리컵 높이(px) 세팅
  function setGlassHeights(){
    beakers.forEach(b => {
      const h = Math.max(MIN_GLASS_H, b.cap * PX_PER_LITER);
      const glass = b.el.querySelector('.glass');
      glass.style.height = h + 'px';
    });
  }

  // ② 볼륨 -> 퍼센트 반영 (바닥에서 차오름)
  function updateUI(){
    beakers.forEach(b => {
      const liq = b.el.querySelector('.liquid');
      const volEl = b.el.querySelector('.vol');

      const ratio = b.cap ? (b.vol / b.cap) : 0;
      liq.style.height = (ratio * 100) + '%';
      volEl.textContent = b.vol + 'L';
      b.el.setAttribute('aria-label', `${b.cap}리터 비커, 현재 ${b.vol}리터`);
    });

    const b10 = findByName('B10');
    if (b10 && b10.vol === 8){
      statusEl.textContent = '성공! 다음 단계로 진행할 수 있어요.';
      enterBtn.classList.add('show');
    } else {
      statusEl.textContent = '';
      enterBtn.classList.remove('show');
    }
  }

  function clearSelection(){
    if (selected) selected.classList.remove('selected');
    selected = null;
  }

  // 즉시 붓기 (애니메이션 없음)
  function pourImmediate(fromEl, toEl){
    const from = beakers.find(b => b.el === fromEl);
    const to   = beakers.find(b => b.el === toEl);
    const capacityLeft = to.cap - to.vol;
    const movable = Math.min(from.vol, capacityLeft);
    if (movable <= 0) return;

    from.vol -= movable;
    to.vol   += movable;
    updateUI();
  }

  // 클릭 핸들
  board.addEventListener('click', (e) => {
    const beakerEl = e.target.closest('.beaker');
    if (!beakerEl){ clearSelection(); return; }

    if (!selected){
      selected = beakerEl;
      beakerEl.classList.add('selected');
      return;
    }
    if (selected === beakerEl){
      clearSelection(); return;
    }
    const from = selected, to = beakerEl;
    clearSelection();
    pourImmediate(from, to);
  });

  document.querySelector('section').addEventListener('click', (e) => {
    if (!e.target.closest('.beaker') && !e.target.closest('#beaker-game')) clearSelection();
  });

  // 초기 렌더
  setGlassHeights();  // ⬅ 반드시 먼저 호출
  updateUI();
})();