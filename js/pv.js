// 紹介の動画(PV) 最初のページだけで使う $ や svg() は main.js のものを使う
const NM = {shoot: 'shoot', kizamu: 'kizamu', speedial: 'speedial', timer: 'THE TIMER', abc: 'abc'};
// 場面と、その長さ(ミリ秒)
const SC = [['op', 4800], ['shoot', 7000], ['kizamu', 6800], ['speedial', 6800], ['timer', 7000], ['abc', 7000], ['end', 6500]];
let ts = [];   // 仕掛けたタイマー(最初からやり直すときに全部止める)

function init() {
  // abc のロゴは1文字ずつ並べる
  let i = 0;
  for (const w of ['Amount', 'Build', 'Calculate']) {
    const d = $('al').appendChild(document.createElement('div'));
    [...w].forEach((c, j) => {
      const sp = d.appendChild(document.createElement('span'));
      sp.textContent = c;
      sp.style.setProperty('--i', i++);
      if (!j) sp.className = 'key';
    });
  }
  // 最後に並ぶ5つ
  Object.keys(NM).forEach((k, n) => {
    const d = $('e5').appendChild(document.createElement('div'));
    d.style.setProperty('--i', n);
    d.innerHTML = `<span class="ib">${svg(k)}</span><b>${NM[k]}</b>`;
  });
}

const at = (ms, fn) => ts.push(setTimeout(fn, ms));
function show(id) {
  for (const s of document.querySelectorAll('.sc')) s.classList.toggle('on', s.id === id);
}
function play() {
  ts.forEach(clearTimeout);
  ts = [];
  show('');
  void $('st').offsetWidth;   // 動きを全部最初からやり直す
  let t = 100;
  for (const [id, d] of SC) {
    const t0 = t;
    at(t0, () => show(id));
    if (id === 'timer') {
      // 3 → M と押すと 3:00 になって、すぐ減りはじめる
      at(t0, () => {
        $('tv').textContent = '0:00';
        $('tv').className = 'ph';
      });
      at(t0 + 3900, () => {
        $('tv').textContent = '3';
        $('tv').className = '';
      });
      ['3:00', '2:59', '2:58', '2:57'].forEach((v, n) => at(t0 + 4500 + n * 700, () => {
        $('tv').textContent = v;
      }));
    }
    if (id === 'abc') {
      // 100 と打って ㎡→坪 で 30.25坪
      const set = (v, u, x) => {
        $('av').innerHTML = v + (u ? `<small>${u}</small>` : '');
        $('ax').textContent = x || '';
      };
      at(t0, () => set('0'));
      ['1', '10', '100'].forEach((v, n) => at(t0 + 3600 + n * 260, () => set(v)));
      at(t0 + 4750, () => set('30.25', '坪', '100㎡ ＝'));
    }
    t += d;
  }
  at(t, pvEnd);
}
init();
