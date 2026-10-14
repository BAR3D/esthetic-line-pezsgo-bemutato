/* Bemutató Gyár – RECEPCIÓ: belépés a szalon (rendelő, spa, stúdió) recepciójára.
   Üvegajtó nyílik → 3D térben körbenézel → a „termek” (a modell igényei) íves portálok → belépve a kezelések árral.
   Bármely szolgáltatónál működik: a termek = C.needs, a kezelések = a termékek (cats szerint). Foglalási rendszer NINCS benne. */
'use strict';

window.LAYOUT_META5 = {
  recepcio: { name: 'Recepció', desc: 'Megérkezel a szalon recepciójára: körbenézel a 3D térben, a termek közül választasz, belépve kezelések és árak.', light: true, shopView: 'racs' },
  'recepcio-arany': { name: 'Recepció – Arany', desc: 'Mentett stílus (Esthetic Line, 2026-10-14): sötét luxus, fekete márvány, arany fények és aranypor, logó-érmes ajtó, legördülő recepciós pult.', light: false, shopView: 'racs' },
  'recepcio-pezsgo': { name: 'Recepció – Pezsgő', desc: 'Világos, napfényes szalon: elefántcsont, pezsgő és rozéarany, levegős fények – ugyanaz az ajtós, 3D-termes érkezés.', light: true, shopView: 'racs' },
  'recepcio-ejkek': { name: 'Recepció – Éjkék', desc: 'Futurisztikus klinika: éjkék üveg, türkiz és ibolya neonfény, hideg fénypor – modern esztétika és technológia.', light: false, shopView: 'racs' },
};
// a Recepció stílusai – mind ugyanaz a felépítés (ajtó, 3D termek, csapat, pult), csak a színvilág és a fények mások
window.RC_TEMAK = {
  arany:  { name: 'Recepció – Arany', desc: 'Sötét luxus: fekete márvány, arany fények, aranypor, logó-érmes ajtó. (Mentett stílus: Esthetic Line, 2026-10-14.)', dark: true, blend: 'lighter',
            por: { mag: '255,250,230', k1: '255,236,170', k2: '240,196,95', k3: '226,170,70', b1: '255,214,140', b2: '255,200,110', csill: '255,250,235', csill0: '255,240,200' } },
  pezsgo: { name: 'Recepció – Pezsgő', desc: 'Világos, napfényes szalon: elefántcsont, pezsgő és rozéarany, levegős, nyugodt fények.', dark: false, blend: 'source-over',
            por: { mag: '255,252,246', k1: '236,200,176', k2: '214,160,130', k3: '196,140,112', b1: '240,214,196', b2: '226,190,168', csill: '255,255,255', csill0: '245,225,210' } },
  ejkek:  { name: 'Recepció – Éjkék', desc: 'Futurisztikus klinika: éjkék üveg, türkiz és ibolya neonfény, hideg fénypor – modern esztétika, technológia.', dark: true, blend: 'lighter',
            por: { mag: '235,252,255', k1: '160,240,255', k2: '80,210,235', k3: '120,110,255', b1: '110,200,255', b2: '150,120,255', csill: '240,252,255', csill0: '170,235,255' } },
};
Object.assign(window.LAYOUT_META, window.LAYOUT_META5);
window.rcTema = () => { const ly = (typeof LY === 'function' ? LY() : (typeof C !== 'undefined' && C.layout)) || ''; const k = String(ly).replace(/^recepcio-?/, '');
  if (window.RC_TEMAK[k]) return k; const t = typeof C !== 'undefined' && C.recepcio && C.recepcio.tema; return t === 'luxus' ? 'arany' : (window.RC_TEMAK[t] ? t : 'vilagos'); };

LAYOUTS.recepcio = function () {
  const rooms = SKINS.slice(0, 8), N = rooms.length || 1;
  const list = (s) => S.products.filter((p) => has(p, s.cats)).sort((a, b) => (b.price > 0) - (a.price > 0));   // a szalon saját sorrendje marad (a kiemelt kezelések elöl)
  const tel = (C.contact && C.contact.phone) || '';
  const LG = C.logo || null, erem = (k) => LG ? `<span class="rc-medal ${k}"><b>${esc(LG.betu || '')}</b><em>${esc(C.name || '')}</em><small>${esc(LG.alcim || '')}</small></span>` : `<span>${esc((C.name || '').charAt(0))}</span>`;
  // a csapat (C.csapat): ki melyik teremben dolgozik – a szemben lévő terem előtt és a terem belsejében is megjelenik
  const csap = (i) => (C.csapat || []).filter((m) => rooms[i] && (m.termek || []).includes(rooms[i].k));
  const mono = (n) => esc(String(n).split(/\s+/).map((w) => w[0]).slice(0, 2).join(''));
  const kartya = (m) => `<article class="rc-tm"><span class="rc-tm-av">${m.kep ? `<img src="${img(m.kep)}" alt="${esc(m.nev)}">` : mono(m.nev)}</span><div class="rc-tm-b"><b>${esc(m.nev)}</b><small>${esc(m.szerep || '')}</small>
      <span class="rc-tm-sz">${(m.szak || []).slice(0, 3).map((x) => `<i>${esc(x)}</i>`).join('')}</span><p>„${esc(m.idezet || '')}”</p>
      <span class="rc-tm-ft"><button type="button" class="rc-tm-more">Tovább ›</button>${m.tel ? `<a href="${telHref(m.tel)}">Bejelentkezés: ${esc(m.tel)}</a>` : m.web ? `<a href="https://${esc(m.web)}" target="_blank" rel="noopener">Bejelentkezés: ${esc(m.web)}</a>` : ''}</span></div></article>`;
  const fontLoad = () => { const f = window.A5F && A5F[C.alapBetu || 'cormorant']; if (f && !document.getElementById('rcFont')) { const l = document.createElement('link'); l.id = 'rcFont'; l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${f[1]}&display=swap`; document.head.appendChild(l); document.body.style.setProperty('--serif', `"${f[0]}", Georgia, serif`); } };

  const tema = rcTema(), TM = RC_TEMAK[tema] || null, lux = !!TM, PC = TM ? TM.por : RC_TEMAK.arany.por;   // lux = a „luxus” szerkezet (aranypor, fénycsóvák, neonív) – mindhárom stílusnál
  window.__lx2Intro = true;   // a saját ajtós érkezés váltja ki az általános nyitófüggönyt
  lx2Start(() => {
    fontLoad();
    if (TM && TM.dark) document.body.classList.remove('light');   // a sötét luxus téma a saját színeit használja
    if (LG) $$('.brand-mark').forEach((m) => { m.textContent = LG.betu || ''; m.classList.add('rc-lg'); });
    const stage = $('.rc-stage'), ring = $('.rc-ring'), doors = $('.rc-doors'), panels = $$('.rc-room'), chips = $$('.rc-chip'), room = $('.rc-open'); if (!stage) return;
    // érkezés: az ajtó szétnyílik
    let paused = false; const busy = () => paused || document.hidden || room.classList.contains('on') || !F3.visible(stage);   // ilyenkor semmi nem rajzol
    const ph = $('.rc-photo', stage); if (ph) { let mx = 0, my = 0, cx = 0, cy = 0; FX.on(window, 'pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
      let lpx = 1e9, lpy = 1e9; FX.tick(() => { if (busy()) return; cx += (mx - cx) * 0.04; cy += (my - cy) * 0.04; const px = Math.round((cx * -16 - ((ang % 360) / 360) * 20) * 10) / 10, py = Math.round(cy * -100) / 10; if (px === lpx && py === lpy) return; lpx = px; lpy = py; ph.style.transform = `scale(1.05) translate3d(${px}px, ${py}px, 0)`; }); }   // a valódi(szerű) recepciókép enyhe mélységgel mozdul
    const quick = FX.reduce || /thumb=1/.test(location.search);
    const varj = (C.recepcio && C.recepcio.ajtoIdo) || 2200;   // ennyi ideig állunk az ajtó előtt (ms) – el lehessen olvasni
    FX.later(() => { doors.classList.add('open'); stage.classList.add('in'); FX.later(() => { doors.style.display = 'none'; }, 1600); }, quick ? 0 : varj);
    let intro = quick ? 1 : 0; const t0 = performance.now() + (quick ? 0 : varj);   // belépő kamera: messziről beúszik
    if (lux) {   // aranypor: éles, előrerajzolt szikrák (mag + glória + csillanás) és puha bokeh-fények – az egér elől szétrebbennek
      const { c, g, dpr } = F3.canvas('rc-dust', stage, false); c.style.position = 'absolute'; F3.trackMouse();
      const fitC = () => { const r = stage.getBoundingClientRect(), d = 1; c.width = r.width * d; c.height = r.height * d; c.style.width = r.width + 'px'; c.style.height = r.height + 'px'; c._d = d; };
      fitC(); FX.on(window, 'resize', fitC);
      const sprite = (sz, star) => { const o = document.createElement('canvas'); o.width = o.height = sz; const x = o.getContext('2d'), h = sz / 2;
        let gr = x.createRadialGradient(h, h, 0, h, h, h); gr.addColorStop(0, `rgba(${PC.mag},1)`); gr.addColorStop(0.08, `rgba(${PC.k1},.95)`); gr.addColorStop(0.22, `rgba(${PC.k2},.45)`); gr.addColorStop(0.55, `rgba(${PC.k3},.12)`); gr.addColorStop(1, `rgba(${PC.k3},0)`); x.fillStyle = gr; x.fillRect(0, 0, sz, sz);
        if (star) { x.globalCompositeOperation = 'lighter'; for (const [w, l] of [[sz * 0.018, h * 0.95], [sz * 0.01, h * 0.6]]) { for (const a of [0, Math.PI / 2]) { x.save(); x.translate(h, h); x.rotate(a + (l < h * 0.7 ? Math.PI / 4 : 0)); const lg = x.createLinearGradient(-l, 0, l, 0); lg.addColorStop(0, `rgba(${PC.csill0},0)`); lg.addColorStop(0.5, `rgba(${PC.csill},.95)`); lg.addColorStop(1, `rgba(${PC.csill0},0)`); x.fillStyle = lg; x.fillRect(-l, -w, l * 2, w * 2); x.restore(); } } }
        return o; };
      const SP = sprite(128, false), ST = sprite(160, true), BK = (() => { const o = document.createElement('canvas'); o.width = o.height = 128; const x = o.getContext('2d'), gr = x.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, `rgba(${PC.b1},.55)`); gr.addColorStop(0.7, `rgba(${PC.b2},.28)`); gr.addColorStop(1, `rgba(${PC.b2},0)`); x.fillStyle = gr; x.beginPath(); x.arc(64, 64, 64, 0, 6.3); x.fill(); return o; })();
      const mob = innerWidth < 760, mk = (k) => ({ k, x: Math.random(), y: Math.random(), z: 0.35 + Math.random() * 0.65, vx: 0, vy: 0, tw: Math.random() * 6.28 });
      const P = [...Array.from({ length: mob ? 6 : 12 }, () => mk('b')), ...Array.from({ length: mob ? 40 : 80 }, () => mk('d')), ...Array.from({ length: mob ? 5 : 10 }, () => mk('s'))]; let lastF = 0;
      FX.tick((t) => { if (busy()) { lastF = 0; return; } const dt = lastF ? Math.min(2.5, (t - lastF) / 16.667) : 1; lastF = t; const d = c._d || 1, W = c.width / d, H = c.height / d, rr = stage.getBoundingClientRect(), mx = F3.mouse.x - rr.left, my = F3.mouse.y - rr.top;
        g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, W, H); g.globalCompositeOperation = TM ? TM.blend : 'lighter'; g.imageSmoothingQuality = 'high';
        for (const p of P) {
          const sp = p.k === 'b' ? 0.00012 : 0.00035; p.y -= sp * (1 + p.z) * dt;   // időarányos mozgás: egy lassabb képkocka után sem ugrik if (p.y < -0.08) { p.y = 1.08; p.x = Math.random(); }
          let x = p.x * W + Math.sin(t / 2400 + p.tw) * 22 * p.z, y = p.y * H; const dx = x - mx, dy = y - my, dd = Math.hypot(dx, dy) || 1;
          if (p.k !== 'b' && dd < 160) { p.vx += (dx / dd) * (160 - dd) * 0.0011 * dt; p.vy += (dy / dd) * (160 - dd) * 0.0011 * dt; } const dmp = Math.pow(0.95, dt); p.vx *= dmp; p.vy *= dmp; p.x += (p.vx / 10) * dt; p.y += (p.vy / 10) * dt;
          const tw = 0.55 + 0.45 * Math.sin(t / (p.k === 's' ? 420 : 760) + p.tw);
          if (p.k === 'b') { const r = 40 + p.z * 70; g.globalAlpha = 0.16 + 0.12 * tw; g.drawImage(BK, x - r, y - r, r * 2, r * 2); }
          else if (p.k === 's') { const r = (14 + p.z * 22) * (0.75 + 0.35 * tw); g.globalAlpha = 0.65 + 0.35 * tw; g.drawImage(ST, x - r, y - r, r * 2, r * 2); }
          else { const r = (5 + p.z * 9) * (0.85 + 0.25 * tw); g.globalAlpha = (0.55 + 0.45 * tw) * (0.6 + p.z * 0.4); g.drawImage(SP, x - r, y - r, r * 2, r * 2); }
        }
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; });
    }
    const R = () => Math.max(380, Math.min(innerWidth * 0.5, 820));
    const team = $('.rc-team', stage); let lastTeam = -1;
    const place = () => { if (!team) return; const sr = stage.getBoundingClientRect(), sg = $('.rc-room.front .rc-sign', stage), dk = $('.rc-desk', stage); if (!sg || !dk) return;
      const top = sg.getBoundingClientRect().bottom - sr.top + 28, bot = dk.getBoundingClientRect().top - sr.top - 18;
      team.style.top = top + 'px'; team.style.height = Math.max(0, bot - top) + 'px'; team.classList.toggle('fit', bot - top > 150 && innerWidth > 760); };
    const showTeam = (i) => { if (!team) return; const L = csap(i); team.classList.remove('in'); FX.later(() => { team.innerHTML = L.length ? `<span class="rc-team-h">${esc(rooms[i].name)} · itt dolgozik</span><div class="rc-team-row">${L.map(kartya).join('')}</div>` : ''; place(); requestAnimationFrame(() => team.classList.add('in')); }, 220); };
    FX.on(window, 'resize', place); FX.every(place, 700);
    // „Tovább”: a teljes bemutatkozás kinyílik (a recepción és a terem belsejében is)
    FX.on(document, 'click', (e) => { const b = e.target.closest('.rc-tm-more'); if (!b) return; const a = b.closest('.rc-tm'); a.classList.toggle('open'); b.textContent = a.classList.contains('open') ? 'Kevesebb ‹' : 'Tovább ›'; });
    panels.forEach((p, i) => p.style.setProperty('--a', (i * 360) / N + 'deg'));
    let ang = 0, target = 0, drag = false, lx = 0, moved = 0, zoom = 0, zt = 0, focus = -1;
    const norm = (a) => ((a % 360) + 360) % 360;
    // húzás csak valódi mozgásnál kapja el az egeret – különben a kattintás eljut a teremhez (pointer capture miatt nem jutott el)
    let down = false, pid = 0;
    FX.on(stage, 'pointerdown', (e) => { moved = 0; if (e.target.closest('button, .rc-desk')) return; down = true;   // minden lenyomás nullázza az előző húzást (különben a nyílra kattintást elnyelte)
     drag = false; lx = e.clientX; moved = 0; pid = e.pointerId; });
    FX.on(stage, 'pointermove', (e) => { if (!down) return; const d = e.clientX - lx; lx = e.clientX; moved += Math.abs(d); if (!drag && moved > 6) { drag = true; try { stage.setPointerCapture(pid); } catch { /* */ } stage.classList.add('drag'); } if (drag) target -= d * 0.22; });
    const up = () => { if (!down) return; down = false; if (drag) { drag = false; stage.classList.remove('drag'); const step = 360 / N; target = Math.round(target / step) * step; } };
    FX.on(stage, 'pointerup', up); FX.on(stage, 'pointercancel', up);
    FX.on(stage, 'click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    $$('.rc-arrow').forEach((b) => FX.on(b, 'click', () => { target += (+b.dataset.d * 360) / N; }));
    const turnTo = (i) => { target = target - norm(target) + (i * 360) / N; if (norm(target) - norm(ang) > 180) target -= 360; };
    chips.forEach((c) => FX.on(c, 'click', () => turnTo(+c.dataset.i)));
    const pick = $('.rc-pick', stage), pb = pick && $('.rc-pick-b', pick), go = $('.rc-go', stage);
    const pickPlace = () => { const l = $('.rc-pick-l', pick), dk = $('.rc-desk', stage), tm = $$('.rc-team.in .rc-tm', stage); if (!l || !dk || innerWidth <= 1250) return;
      const D = dk.getBoundingClientRect(), tl = tm.length ? Math.min(...tm.map((x) => x.getBoundingClientRect().left)) : D.left + 400, edge = Math.min(tl - 14, D.left + 160);
      const tb = tm.length ? Math.max(...tm.map((x) => x.getBoundingClientRect().bottom)) : 0; l.style.bottom = tb ? (D.bottom - tb) + 'px' : '';   // az alja egy vonalban a csapatkártyáéval
      if (edge - 260 < 8) { l.style.right = ''; l.style.left = '0px'; l.style.bottom = ''; } else { l.style.left = 'auto'; l.style.right = (D.right - edge) + 'px'; } };   // a csapatkártyák elé, a bal felső üres részbe
    const pickSet = (on) => { if (!pick) return; if (on) pickPlace(); pick.classList.toggle('on', on); pb.setAttribute('aria-expanded', on ? 'true' : 'false'); };
    if (pick) { FX.on(pb, 'click', () => pickSet(!pick.classList.contains('on')));
      $$('li', pick).forEach((li) => FX.on(li, 'click', () => { turnTo(+li.dataset.i); pickSet(false); }));
      FX.on(document, 'click', (e) => { if (!e.target.closest('.rc-pick')) pickSet(false); }); FX.on(document, 'keydown', (e) => { if (e.key === 'Escape') pickSet(false); }); }
    const pickFront = (i) => { if (pick) { $('span', pb).textContent = rooms[i] ? rooms[i].name : ''; $$('li', pick).forEach((li, k) => li.setAttribute('aria-selected', k === i ? 'true' : 'false')); } if (go) go.dataset.open = i; };
    FX.on(window, 'keydown', (e) => { if (room.classList.contains('on')) { if (e.key === 'Escape') close(); return; } if (e.key === 'ArrowLeft') target -= 360 / N; if (e.key === 'ArrowRight') target += 360 / N; });
    // belépés egy terembe
    const open = (i) => {
      const s = rooms[i], L = list(s); focus = i; zt = 1;
      $('.rc-open-bg', room).style.backgroundImage = `url(${s.img})`;
      $('.rc-open-in', room).innerHTML = `<button class="rc-back" type="button">← Vissza a recepcióra</button>
        <span class="rc-kick">${String(i + 1).padStart(2, '0')} · ${esc(C.name)}</span><h2>${esc(s.name)}</h2><p class="rc-lead">${esc(s.d || '')}</p>
        <div class="rc-menu">${L.map((p, k) => `<a href="#/termek/${p.slug}" style="--d:${Math.min(k, 14) * 40}ms"><span><b>${esc(p.name)}</b>${p.summary ? `<small>${esc(String(p.summary).slice(0, 90))}</small>` : ''}</span><i></i><em>${pft(p)}</em></a>`).join('') || '<p class="muted">Ehhez a teremhez most egyedi ajánlatot adunk – kérdezz a recepción.</p>'}</div>
        ${csap(i).length ? `<div class="rc-team-in"><h3>Akik itt várnak</h3>${csap(i).map(kartya).join('')}</div>` : ''}
        <div class="rc-cta">${tel ? `<a class="btn btn-gold" href="${telHref(tel)}">Bejelentkezés: ${esc(tel)}</a>` : ''}<a class="btn btn-ghost" href="#/kapcsolat">Írj nekünk</a></div>`;
      FX.later(() => { room.classList.add('on'); document.body.classList.add('rc-in'); FX.on($('.rc-back', room), 'click', close); }, FX.reduce ? 0 : 520);
    };
    const close = () => { room.classList.remove('on'); document.body.classList.remove('rc-in'); zt = 0; focus = -1; };
    FX.add({ remove: () => document.body.classList.remove('rc-in') });
    panels.forEach((p, i) => FX.on(p, 'click', (e) => { e.preventDefault(); if (moved > 6) return; const front = Math.round(norm(ang) / (360 / N)) % N; if (front !== i) { turnTo(i); FX.later(() => open(i), 650); } else open(i); }));
    $$('.rc-desk [data-open]').forEach((b) => FX.on(b, 'click', () => { const i = +b.dataset.open; turnTo(i); FX.later(() => open(i), 700); }));
    // a kamera: forgás + enyhe lebegés + belépéskor előre úszás
    let curR = 0; const setR = () => { curR = R(); panels.forEach((p) => p.style.setProperty('--r', curR + 'px')); }; setR(); FX.on(window, 'resize', setR);
    let lastT = '', lastFront = -1;
    FX.tick((t) => {
      if (document.hidden || !F3.visible(stage)) return;
      ang += (target - ang) * 0.08; zoom += (zt - zoom) * 0.07;
      if (Math.abs(target - ang) < 0.01) ang = target; if (Math.abs(zt - zoom) < 0.001) zoom = zt;
      const r = curR;
      if (intro < 1 && t > t0) intro = Math.min(1, (t - t0) / 1800); const ease = 1 - Math.pow(1 - intro, 3);
      const tf = `translateZ(${(r * (0.3 + zoom * 1.05) - (1 - ease) * r * 1.6).toFixed(1)}px) rotateY(${(-ang + (1 - ease) * 40).toFixed(2)}deg)`;
      if (tf !== lastT) { lastT = tf; ring.style.transform = tf; }
      const front = Math.round(norm(ang) / (360 / N)) % N;
      if (front !== lastFront) { lastFront = front; panels.forEach((p, i) => p.classList.toggle('front', i === front)); chips.forEach((c, i) => c.classList.toggle('on', i === front)); pickFront(front); }
      if (front !== lastTeam) { lastTeam = front; showTeam(front); }
    });
  });

  return `<div class="lx2 rc ${lux ? 'rc-luxus ' : ''}rc-${tema}">
    <section class="rc-stage" aria-label="A szalon recepciója – húzd oldalra a körbenézéshez">
      ${C.recepcio && C.recepcio.hatter ? `<div class="rc-photo" style="background-image:url(${img(C.recepcio.hatter)})"></div>` : ''}<div class="rc-sky"></div><div class="rc-wall"></div><div class="rc-brand" aria-hidden="true"><span>${esc(C.name)}</span></div><div class="rc-strip"></div><div class="rc-halo"></div><div class="rc-floor"></div>
      <div class="rc-scene"><div class="rc-ring">
        ${rooms.map((s, i) => `<a class="rc-room" href="#/${NR}/${s.k}" draggable="false"><span class="rc-arch" style="background-image:url(${s.img})"></span><span class="rc-sign"><small>${String(i + 1).padStart(2, '0')}</small><b>${esc(s.name)}</b><em>${LX.needN(s)} ${L_('itemWord', 'kezelés')} · belépek →</em></span><span class="rc-glow"></span></a>`).join('')}
      </div></div>
      <div class="rc-team" aria-live="polite"></div>
      <div class="rc-desk"><span class="rc-avatar${LG ? ' rc-lg' : ''}" aria-hidden="true">${LG ? esc(LG.betu || '') : ''}</span><div><small>RECEPCIÓ · ${esc(C.name)}</small><p>${esc(C.recepcio && C.recepcio.koszones || 'Szép napot! Örülünk, hogy itt vagy. Merre kísérhetünk?')}</p>
        <div class="rc-deskcta"><div class="rc-pick"><button class="rc-pick-b" type="button" aria-haspopup="listbox" aria-expanded="false"><small>Terem</small><span>${esc(rooms[0] ? rooms[0].name : '')}</span><i aria-hidden="true">▾</i></button>
          <ul class="rc-pick-l" role="listbox">${rooms.map((s, i) => `<li role="option" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(s.name)}</li>`).join('')}</ul></div>
          <button class="btn btn-gold rc-go" type="button" data-open="0">Belépek →</button>${tel ? `<a class="btn btn-ghost" href="${telHref(tel)}">${esc(tel)}</a>` : ''}</div></div></div>
      <button class="rc-arrow l" data-d="-1" type="button" aria-label="Balra">‹</button><button class="rc-arrow r" data-d="1" type="button" aria-label="Jobbra">›</button>
      <small class="rc-hint">húzd oldalra – nézz körül a szalonban</small>
      <div class="rc-beam b1"></div><div class="rc-beam b2"></div><div class="rc-beam b3"></div>
      <div class="rc-doors" aria-hidden="true"><i class="l">${erem('l')}</i><i class="r">${erem('r')}</i><b class="rc-seam"></b><div class="rc-welcome"><small>${esc(C.hero.pill || '')}</small><b>Üdvözlünk az ${esc(C.name)}-ban</b></div></div>
    </section>
    <div class="rc-open" role="dialog" aria-modal="true"><div class="rc-open-bg"></div><div class="rc-open-in wrap"></div></div>
    <section class="sec wrap rc-about"><div><span class="sec-num">${esc(C.name)}</span><h2>${fill(C.hero.title)}</h2><p class="lead">${fill(C.hero.lead)}</p></div>
      <div class="rc-perks">${(C.perks || []).map((x) => `<div><span>${esc(x.ico || '✦')}</span><b>${esc(x.b)}</b><small>${esc(x.s || '')}</small></div>`).join('')}</div></section>
    ${LX.steps().length ? `<section class="sec wrap rc-steps"><h2>${esc(C.ritual.title)}</h2><ol>${LX.steps().map((s, i) => `<li data-fx><span>${String(i + 1).padStart(2, '0')}</span><b>${esc(s.t)}</b><p>${esc(s.d)}</p></li>`).join('')}</ol></section>` : ''}
    ${C.quote ? `<section class="sec wrap rc-quote"><p data-split="w">${fill(C.quote)}</p></section>` : ''}
  </div>`;
};

// minden aloldalon (nem csak a főoldalon): logó-betű a menüben; a „termek” és a „csoportok” fül kikerül a menüből,
// mert a recepción a termek pontosan ezt adják (az oldalak a termekből és a linkekről továbbra is elérhetők)
(function rcGlobal() {
  const go = () => { if (typeof C === 'undefined' || !/^recepcio/.test((typeof LY === 'function' && LY()) || C.layout || '')) return;
    if (C.logo) $$('.brand-mark').forEach((m) => { m.textContent = C.logo.betu || ''; m.classList.add('rc-lg'); });
    const tema = rcTema(), TM = RC_TEMAK[tema], lux = !!TM; if (TM && !document.body.classList.contains('rc-t-' + tema)) document.body.classList.add('rc-t-' + tema);
    if (lux && !document.body.__rcLux) { document.body.__rcLux = 1; const fix = () => { const cl = document.body.classList; if (TM.dark && cl.contains('light')) cl.remove('light'); if (!cl.contains('rc-lux')) cl.add('rc-lux'); };   // csak valódi változáskor ír (különben a figyelő önmagát hívná végtelenül)
      if (C.recepcio.hatter) document.body.style.setProperty('--rc-bg', `url(${img(C.recepcio.hatter)})`);   // aloldalak háttere: a recepció fotója, sötétítve
      fix(); new MutationObserver(fix).observe(document.body, { attributes: true, attributeFilter: ['class'] }); }   // a sötét luxus téma MINDEN aloldalon (közvetlen megnyitásnál is) – soha ne villanjon be a világos
    const nl = document.getElementById('navLinks'); if (nl && !nl.querySelector('a.rc-home')) { const a = document.createElement('a'); a.href = '#/'; a.className = 'rc-home'; a.textContent = 'Főoldal'; nl.prepend(a); }
    $$('#navLinks a.rc-home').forEach((a) => a.classList.toggle('on', !location.hash || location.hash === '#/' || location.hash === '#'));
    if (!(C.recepcio && C.recepcio.teljesMenu)) $$('#navLinks a').forEach((a) => { const h = (a.getAttribute('href') || '').slice(2); if (h === 'markak' || h === (typeof NR !== 'undefined' ? NR : '')) a.remove(); }); };
  let n = 0; const iv = setInterval(() => { go(); if (++n > 40) clearInterval(iv); }, 150); window.addEventListener('hashchange', () => { setTimeout(go, 0); setTimeout(go, 400); });   // a config később töltődik be – addig újrapróbálja
})();

// a stílus-változatok ugyanazt a felépítést használják (a színvilágot a rcTema() adja)
for (const k of Object.keys(window.RC_TEMAK)) LAYOUTS['recepcio-' + k] = LAYOUTS.recepcio;
