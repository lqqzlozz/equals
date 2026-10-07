// EQuals のどのページでも使う動き

// ---- 設定(書き換えるのはここだけ) ----

const BASE = '/equals/';   // 置き場所
// ダウンロードの行き先(Googleドライブの共有リンク) 空のものは「準備中」になる
const DL = {
  shoot: 'https://drive.google.com/drive/folders/1TQiym21RNJThiK46CDHctVie5WEDn9n7',
  kizamu: 'https://drive.google.com/drive/folders/1lniazBh-9ynsROLKMyJPzGAGNAhY97D_',
  speedial: 'https://drive.google.com/drive/folders/12PWYIFcWnKJue94CMmySVvGI8O9QfbXS',
  thetimer: 'https://drive.google.com/drive/folders/1V00g1dBkWRb9IUJ9IyjaQE5PUhWrPzj9',
  abc: 'https://drive.google.com/drive/folders/1csYCzbXSujslK1E2aKlIFc0kiJvnS8Sp'
};
// 外へ出るボタンの行き先 空のものは「（準備中）」がつく
// rq = こんなアプリつくって(フォーム) ig = インスタ sp = 応援(支払いのページ)
const LK = {
  rq: 'https://docs.google.com/forms/d/e/1FAIpQLSeBECwSBWIHNec_0mWHS62W6fYnQ_UAPl-U9oRMd6TBm2QqaQ/viewform',
  ig: 'https://www.instagram.com/moriki_akira_desu/',
  sp: 'https://ofuse.me/equals'
};
const GA = 'G-H6PET5EEKK';   // GA4 の測定ID 空にすると何も送らない

// ---- 部品 ----

const $ = id => document.getElementById(id);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOP = !!$('hr');   // いま開いてるのが最初のページか
// アイコンの絵(5つのアプリと、eq = EQuals)
const WH = 'stroke="#dddbd0" stroke-linecap="round" stroke-linejoin="round"';
const IC = {
  shoot: `<circle cx="96" cy="96" r="52" stroke="#dddbd0" stroke-width="20"/><path d="M96 80V128M84 96H118" stroke="#ff6a1f" stroke-width="9" stroke-linecap="round"/>`,
  kizamu: `<path d="M60 56V136M84 56V136M108 56V136M132 56V136" stroke="#dddbd0" stroke-width="12" stroke-linecap="round"/><path d="M42 126L150 66" stroke="#ff6a1f" stroke-width="12" stroke-linecap="round"/>`,
  speedial: `<circle cx="96" cy="96" r="10" fill="#ff6a1f"/><circle cx="96" cy="96" r="32" ${WH} stroke-width="14"/><circle cx="96" cy="96" r="60" stroke="#77776e" stroke-width="10"/>`,
  timer: `<circle cx="96" cy="96" r="52" ${WH} stroke-width="20" stroke-dasharray="222 105" transform="rotate(-90 96 96)"/>` + [[44.3, 90.6], [52.9, 66.9], [71.6, 50.1]].map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="#ff6a1f"/>`).join(''),
  abc: `<path d="M54 76h84" ${WH} stroke-width="22"/><path d="M54 118h84" stroke="#ff6a1f" stroke-linecap="round" stroke-width="22"/>`,
  eq: `<path d="M46 77H146M46 115H146" stroke="#ff6a1f" stroke-width="27" stroke-linecap="round"/><path transform="translate(152 136) scale(0.72) translate(-132 -97)" d="M149 81C142 68 114 69 114 84C114 98 150 94 150 109C150 124 122 125 114 113" stroke="#1a1b18" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path transform="translate(152 136) scale(0.72) translate(-132 -97)" d="M149 81C142 68 114 69 114 84C114 98 150 94 150 109C150 124 122 125 114 113" stroke="#dddbd0" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
};
const svg = k => `<svg viewBox="0 0 192 192" fill="none" aria-hidden="true"><rect width="192" height="192" fill="#1a1b18"/>${IC[k]}</svg>`;
let cur = null;          // 重ねて開いてるページのアドレス なければ null
let dp = 0;              // このページの中で、戻れる回数
const mem = new Map();   // 取ってきたページの中身(アドレス → main の中身)

// 明るい・暗いの切り替え(何もしなければ暗いほう 選んだほうは覚えておいて、どのページでも同じにする)
let lt = false;
function tm() {
  document.documentElement.dataset.th = lt ? 'l' : 'd';
  document.querySelector('meta[name="theme-color"]').content = lt ? '#e9e7dd' : '#1a1b18';
  for (const el of document.querySelectorAll('.tg')) el.setAttribute('aria-checked', lt);
}
try {
  lt = localStorage.getItem('th') === 'l';
} catch (x) {}
tm();

// アクセス解析(GA4) 重ねて開いたときのアドレスの変化は、GA4 側が自分で拾う
if (GA) {
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
  document.head.append(t);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag('js', new Date());
  gtag('config', GA);
}
// 押した・見終わった などの印を送る(GA が空なら何もしない)
const tk = (n, p) => {
  if (window.gtag) gtag('event', n, p || {});
};

// 差し込んだ中身に動きをつける(アイコンの絵・外へのリンク・画像の読み込み表示・コピー) 同じものに2度はつけない
function wire(r) {
  const each = (q, f) => {
    for (const el of r.querySelectorAll(q)) {
      if (el.dataset.w) continue;
      el.dataset.w = 1;
      f(el);
    }
  };
  each('[data-i]', el => {
    el.innerHTML = svg(el.dataset.i);
  });
  const out = (el, u) => {
    el.href = u;
    el.target = '_blank';
    el.rel = 'noopener';
  };
  each('.dl[data-k]', el => {
    if (DL[el.dataset.k]) out(el, DL[el.dataset.k]);
    else el.textContent = '準備中';
    el.onclick = () => tk('download', {app: el.dataset.k});   // どのアプリのダウンロードが押されたか
  });
  each('.lk', el => {
    if (LK[el.dataset.l]) out(el, LK[el.dataset.l]);
    else el.textContent += '（準備中）';
    el.onclick = () => tk('link', {to: el.dataset.l});
  });
  // 画像が届いたら、ふわっと出す(届かなかったときも枠は外して、代わりの文字を見せる)
  each('.sw img', im => {
    const f = () => im.parentNode.classList.add('ok');
    if (im.complete && im.naturalWidth) f();
    else for (const e of ['load', 'error']) im.addEventListener(e, f);
  });
  // 上の帯の切り替えスイッチ
  each('.tg', el => {
    el.setAttribute('aria-checked', lt);
    el.onclick = () => {
      lt = !lt;
      tm();
      try {
        localStorage.setItem('th', lt ? 'l' : 'd');
      } catch (x) {}
    };
  });
  // 埋め込みのフォーム: 行き先は上の設定(LK.rq)から作る
  each('.gf', fr => {
    let n = 0;
    fr.onload = () => {
      fr.parentNode.classList.add('ok');   // フォームが届いたので、待ってる間の線を消す
      if (++n > 1) sent();   // 2回目の読み込み = 送信が終わって、フォームの中のページが切り替わった
    };
    if (LK.rq) fr.src = LK.rq.split('?')[0] + '?embedded=true';
  });
  // 「リンクをコピーする」: このサイトの一番上のアドレスをクリップボードへ
  each('.cp', el => {
    el.onclick = async () => {
      const u = location.origin + BASE;
      let ok = true;
      try {
        await navigator.clipboard.writeText(u);
      } catch (x) {
        // 新しいやり方が許されてない場所では、昔ながらのやり方で
        const t = document.createElement('textarea');
        t.value = u;
        document.body.append(t);
        t.select();
        ok = document.execCommand('copy');
        t.remove();
      }
      el.textContent = ok ? 'コピーしました' : 'コピーできませんでした';
      setTimeout(() => {
        el.textContent = 'リンクをコピーする';
      }, 2000);
    };
  });
}

// フォームが送信されたとき: 「ありがとう」のページへ移る
// (重ねた中身の差し替えにはしない フォームの中のページ移動がブラウザの履歴に1つ積まれるので、✕ や戻るの数え方がずれる)
function sent() {
  tk('request_sent');
  location.replace(BASE + 'thanks/');
}

// ---- 上の帯と一番下(parts/ にあるものを差し込む) ----

async function parts() {
  try {
    const [h, f] = await Promise.all(['header', 'footer'].map(n => fetch(BASE + 'parts/' + n + '.html').then(r => r.text())));
    $('hd').innerHTML = h;
    $('ft').innerHTML = f;
  } catch (x) {}   // 取れなくても、ページの中身だけは見せる
  wire(document);
}

// ---- 重ねて開く(読み込みを挟まず、そのページの中身だけ取ってきて上に重ねる) ----

document.body.insertAdjacentHTML('beforeend', '<div id="ov" hidden><button type="button" id="ox" aria-label="閉じる">✕</button><div id="oc"></div></div>');

async function get(u) {
  if (!mem.has(u)) {
    const t = await fetch(u).then(r => r.text());
    const m = new DOMParser().parseFromString(t, 'text/html').querySelector('main');
    mem.set(u, m ? m.outerHTML : '');
  }
  return mem.get(u);
}
// アイコンが膨らんで画面になる / 画面がしぼんでアイコンに戻る
function zoom(el, open, fn) {
  const r = el.getBoundingClientRect();
  const z = document.createElement('div');
  const full = {left: '0px', top: '0px', width: innerWidth + 'px', height: innerHeight + 'px', borderRadius: '0px'};
  const small = {left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: r.width * .26 + 'px'};
  const o = {duration: 340, easing: 'cubic-bezier(.3, .9, .3, 1)', fill: 'forwards'};
  z.className = 'zm';
  z.innerHTML = el.innerHTML;
  document.body.append(z);
  const done = () => z.animate([{opacity: 1}, {opacity: 0}], 140).onfinish = () => z.remove();
  if (open) {
    z.animate([small, full], o).onfinish = () => {
      fn();
      done();
    };
    z.firstChild.animate([{transform: 'none', opacity: 1}, {transform: 'scale(3.2)', opacity: 0}], {...o, easing: 'ease-in'});
  } else {
    Object.assign(z.style, full);
    z.firstChild.style.opacity = 0;
    fn();
    z.animate([full, small], o).onfinish = done;
    z.firstChild.animate([{transform: 'scale(3.2)', opacity: 0}, {transform: 'none', opacity: 1}], {...o, easing: 'ease-out'});
  }
}
// 最初のページに浮いてるアイコン(そのアドレスのアプリのもの) なければ null
const ico = u => document.querySelector(`.fi[href="${u}"] .ic`);
// u を重ねて開く q = 動きなしで切り替えるだけ
async function opn(u, q) {
  cur = u;
  const h = await get(u);
  if (cur !== u) return;   // 取ってくる間に閉じられてた
  if (!h) return location.assign(u);   // 中身が取れなかったら、普通にそのページへ行く
  const f = () => {
    $('oc').innerHTML = h;
    wire($('oc'));
    $('ov').hidden = false;
    $('ov').scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';   // 後ろのページが一緒に動かないように
  };
  if (!q && !calm() && $('ov').hidden && ico(u)) zoom(ico(u), true, f);
  else f();
}
function cls(q) {
  if (!cur) return;
  const el = ico(cur);
  const f = () => {
    $('ov').hidden = true;
    $('oc').textContent = '';
    document.documentElement.style.overflow = '';
  };
  cur = null;
  if (!q && !calm() && el && !$('ov').hidden) zoom(el, false, f);
  else f();
}
function go(u) {
  opn(u);
  history.pushState({u}, '', u);
  dp++;
}
// ✕: 1つ前に戻る(導入手順をアプリの上に開いてたら、アプリに戻る)
function bck() {
  if (dp > 0) return history.back();   // 中身の切り替えは下の popstate がやる
  cls();
}
addEventListener('popstate', ev => {
  const u = ev.state && ev.state.u;
  dp = Math.max(0, dp - 1);
  if (u) opn(u, true);
  else cls();
});
$('ox').onclick = bck;
addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && cur) bck();
});

// 最初のページの中の場所(#つき)へ動く 重ねた画面の中から押されたら、閉じて、積んだ履歴も戻してから
function jump(h) {
  const f = () => {
    const el = h && $(h.slice(1));
    if (el) el.scrollIntoView({behavior: calm() ? 'auto' : 'smooth'});
    else scrollTo({top: 0, behavior: calm() ? 'auto' : 'smooth'});
  };
  if (!cur) return f();
  const n = dp;
  cls(true);
  dp = 0;
  if (n) history.go(-n);
  setTimeout(f, 80);
}

// リンクを押したとき: data-ov つきは重ねて開く / 最初のページの中の場所なら、そこまで動くだけ / それ以外は普通に移動
document.addEventListener('click', ev => {
  const a = ev.target.closest('a[href]');
  if (!a || a.target || ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
  const u = new URL(a.href);
  if (u.origin !== location.origin) return;
  if (a.hasAttribute('data-ov')) {
    ev.preventDefault();
    if (u.pathname !== (cur || location.pathname)) go(u.pathname);
  } else if (TOP && u.pathname === BASE) {
    ev.preventDefault();
    jump(u.hash);
  }
});

// ---- 読み込み画面: 上の帯・一番下・文字の形がそろったら外す(長くても2.5秒で外す) ----

Promise.race([Promise.all([parts(), document.fonts.ready]), new Promise(r => setTimeout(r, 2500))]).then(() => {
  $('ld').classList.add('off');
  setTimeout(() => $('ld').remove(), 350);
  if (window.rdy) rdy();
  // 先読み: 少ししたら、重ねて開くページの中身と、その中の画像を裏で2つずつ取っておく(開いたときに待たせない)
  setTimeout(async () => {
    const q = [];
    for (const u of new Set([...document.querySelectorAll('a[data-ov]')].map(a => new URL(a.href).pathname))) {
      for (const m of (await get(u)).matchAll(/<img src="([^"]+)"/g)) q.push(m[1]);
    }
    const nx = () => {
      const u = q.shift();
      if (!u) return;
      const im = new Image();
      im.onload = im.onerror = nx;
      im.src = u;
    };
    nx();
    nx();
  }, 1200);
});
