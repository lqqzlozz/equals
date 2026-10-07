// 最初のページだけの動き(名前を押す → 言葉が伸びる → PV) main.js と pv.js のあとに読む

history.scrollRestoration = 'manual';   // 戻ったときにブラウザが勝手に位置を動かさないように
const hr = $('hr');

// 名前を押す → 言葉がずらずら伸びる → 少し見せてからPVへ
$('go').onclick = () => {
  if (hr.className) return;
  hr.className = 'w';
  tk('tap');
  ts.push(setTimeout(pvGo, calm() ? 1200 : 2600));
};
function pvGo() {
  hr.className = 'p';
  play();
}
// PVが終わったとき(pv.js の play の最後から呼ばれる) まだ上にいたら、アイコンの画面へ降りる
function pvEnd() {
  hr.className = 'p e';
  tk('pv_end');
  if (!cur && scrollY < innerHeight * .5) $('hm').scrollIntoView({behavior: calm() ? 'auto' : 'smooth'});
}
$('ag').onclick = pvGo;

// 最初の画面を離れたら、上の帯に名前を出す
new IntersectionObserver(es => document.body.classList.toggle('dn', !es[0].isIntersecting), {threshold: .35}).observe(hr);

// 読み込みが終わったとき(main.js から呼ばれる) #つきのアドレスで来てたら、その場所へ(ほかのページの「応援はこちら」など)
function rdy() {
  const el = location.hash && $(location.hash.slice(1));
  if (el) el.scrollIntoView();
}

// ---- full cord の動く見本(「新規作成中のアプリ」のところ) ----
// 左: HTML が打たれて、次に JS が打たれる(頭を打つと締めが入るところも見せる)
// 右: 左とは関係なく、ずっと +1 が押されて数字が増えていく(自分で押しても増える)
// 見本に出すコードは、そのまま full cord に書けば本当に動くものにする(HTML だけで数字が増えるように見せない)
(() => {
  const dc = $('xc'), dn = $('xn'), dp = $('xp'), xf = document.querySelector('.xf');
  if (!dc) return;
  const e = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // 色をつける HTML: タグの名前・属性の名前・"文字" / JS: 決まり文句と数字
  const CL = [
    t => e(t).replace(/(&lt;\/?)(\w+)|([\w-]+)(=)("[^"]*"?)/g, (m, a, b, c, d, s) => a !== undefined ? `${a}<b class="k">${b}</b>` : `<b class="n">${c}</b>${d}<b class="s">${s}</b>`),
    t => e(t).replace(/\b(let)\b|\b(\d+)\b/g, (m, a, b) => a ? `<b class="k">${a}</b>` : `<b class="s">${b}</b>`)
  ];
  let md = 0;             // いま見せてるのは 0 = HTML / 1 = JS
  const col = t => CL[md](t);
  const tab = v => {
    md = v;
    [...xf.children].forEach((el, i) => el.classList.toggle('on', i === v * 2));
  };
  let a = '', b = '';     // カーソルの前と後ろ
  let n = 0, last = 0;    // 数字と、最後に自分で押された時刻
  let go = false, run = false;
  const draw = () => {
    dc.innerHTML = col(a) + '<i class="xr"></i>' + col(b);
  };
  const num = (v, bump) => {
    n = v;
    dn.textContent = n;
    if (!bump) return;
    for (const el of [dn, dp]) {
      el.classList.remove('xq');
      void el.offsetWidth;
      el.classList.add('xq');
    }
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // 打つ手順 t = 1文字ずつ打つ / c = 締めが自動で入る / e = 締めの後ろへ出る / n = かっこの間で改行(締めは次の行へ) / j = JS のタブに切り替える
  // JS は「id をつけたものは、その名前でそのまま呼べる」決まりを使って短く書いてある(b = ボタン、n = 数字の場所)
  const ST = [
    ['t', '<h1>'], ['c', '</h1>'], ['t', 'full cord.'], ['e'], ['t', '\n<p id="n">'], ['c', '</p>'], ['t', '0'], ['e'], ['t', '\n<button id="b">'], ['c', '</button>'], ['t', '+1'], ['e'],
    ['j'],
    ['t', 'let c = 0;\nb.onclick = () => {'], ['c', '}'], ['n'], ['t', 'n.textContent = ++c;'], ['e'], ['t', ';']
  ];
  async function loop() {
    if (run) return;
    run = true;
    while (go) {
      a = b = '';
      tab(0);
      draw();
      await wait(700);
      for (const [k, s] of ST) {
        if (!go) break;
        if (k === 't') {
          for (const ch of s) {
            a += ch;
            draw();
            await wait(ch === '\n' ? 300 : 62);
            if (!go) break;
          }
        } else if (k === 'c') {
          b = s + b;
          draw();
          await wait(420);
        } else if (k === 'j') {
          // HTML を書き終えたら、少し見せてから JS のタブへ
          await wait(900);
          a = b = '';
          tab(1);
          draw();
          await wait(600);
        } else if (k === 'n') {
          a += '\n  ';
          b = '\n' + b;
          draw();
          await wait(300);
        } else {
          a += b;
          b = '';
          draw();
          await wait(260);
        }
      }
      await wait(2600);
    }
    run = false;
  }
  dp.onclick = () => {
    dp.classList.add('ud');   // 押せるとわかったら、「tap」の合図は消す
    last = Date.now();
    num(n > 98 ? 0 : n + 1, true);
  };
  // 右は、見えてる間ずっと自動で押される 9 の次は 0 に戻る 自分で押したあとは、少しのあいだ手を出さない
  setInterval(() => {
    if (go && Date.now() - last > 2500) num(n > 8 ? 0 : n + 1, true);
  }, 1100);
  if (calm()) {
    // 動きを減らす設定のときは、HTML を書き終わった形を出しておく(押せば数字は増える)
    a = '<h1>full cord.</h1>\n<p id="n">0</p>\n<button id="b">+1</button>';
    return draw();
  }
  // 見えてるときだけ動かす
  new IntersectionObserver(es => {
    go = es[0].isIntersecting;
    if (go) loop();
  }, {threshold: .3}).observe(dc);
})();
