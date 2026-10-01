(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EMAIL = 'rushikeshit4003@gmail.com';

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  const toast = (m) => {
    toastEl.textContent = m;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('on'), 1800);
  };
  const copyMail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); toast('Address copied'); }
    catch { toast(EMAIL); }
  };
  $('#copyMail').addEventListener('click', copyMail);

  /* ---------- theme ---------- */
  let recolor = () => {};
  const onTheme = [];
  const setTheme = (t) => {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch {}
    $('meta[name="theme-color"]').content = t === 'dark' ? '#0c0d0f' : '#f2f0ea';
    recolor(); onTheme.forEach((f) => f());
  };
  const toggleTheme = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  $('#themeBtn').addEventListener('click', toggleTheme);

  /* ---------- hero dot field ---------- */
  (() => {
    const c = $('#field'), hero = $('.hero');
    const ctx = c.getContext('2d');
    let w = 0, h = 0, gap = 30, cols = 0, rows = 0, mx = -1e4, my = -1e4, ink, acc, raf = 0, visible = true;
    recolor = () => {
      const s = getComputedStyle(root);
      ink = s.getPropertyValue('--ink').trim();
      acc = s.getPropertyValue('--accent').trim();
      if (!raf) draw(0);
    };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 700 ? 24 : 30;
      cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1;
      if (!raf) draw(0);
    };
    const R = 180;
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      let cur = '';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        let x = i * gap, y = j * gap, s = 1.2, col = ink;
        let a = 0.13 + 0.05 * (Math.sin(i * 0.35 + t * 0.0009) + Math.cos(j * 0.42 - t * 0.0007));
        const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
        if (d < R && d > 0) {
          const f = 1 - d / R;
          x += (dx / d) * f * 14; y += (dy / d) * f * 14;
          a += f * 0.7; s += f * 1.8;
          if (f > 0.4) col = acc;
        }
        if (col !== cur) ctx.fillStyle = cur = col;
        ctx.globalAlpha = a < 0.04 ? 0.04 : a > 1 ? 1 : a;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      raf = visible && !reduce && !document.hidden ? requestAnimationFrame(draw) : 0;
    }
    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(draw); };
    new ResizeObserver(size).observe(c);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(hero);
    document.addEventListener('visibilitychange', kick);
    if (fine) {
      hero.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { mx = my = -1e4; });
    }
    recolor(); size();
  })();

  /* ---------- tabs helper (roving tabindex + arrows) ---------- */
  const tabs = (list, onChange) => {
    const ts = $$('[role="tab"]', list);
    const select = (t, focus) => {
      ts.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
      onChange($('#' + t.getAttribute('aria-controls')));
    };
    ts.forEach((t, i) => {
      $('#' + t.getAttribute('aria-controls')).hidden = t.getAttribute('aria-selected') !== 'true';
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(ts[(i + d + ts.length) % ts.length], true);
      });
    });
  };

  /* ---------- living system: stack × career stage ---------- */
  (() => {
    const STAGES = [
      { n: 'Shipped eCommerce and food-delivery apps end to end: API design, database design, deployment and production support.',
        t: ['React', 'Laravel', 'MySQL', 'Deploys'], l: ['React · Redux · Capacitor', 'Laravel · REST · payment gateways', 'MySQL · schema design', 'Deployment · production support'] },
      { n: 'High-traffic Next.js applications. Core Web Vitals, accessibility and SEO work contributed to a 25% lift in organic traffic.',
        t: ['Next.js', 'REST', 'PostgreSQL', 'AWS'], l: ['Next.js · SSR · SSG · accessibility', 'REST integration · caching patterns', null, null] },
      { n: 'Three multi-tenant SaaS products from zero to production, owning architecture, services, databases and AWS.',
        t: ['React', 'Node.js', 'PostgreSQL', 'AWS'], l: ['React · shared component library', 'Node.js · NestJS · REST', 'PostgreSQL · multi-tenant models', 'EC2 · S3 · Lambda · Amplify · CI/CD'] },
      { n: 'Depth over breadth: owns the frontend codebase and leads frontend engineering for an enterprise PPM platform used by global clients.',
        t: ['React', 'Node.js', 'PostgreSQL', 'AWS'], l: ['React · TypeScript · Bryntum Gantt · Capacitor', null, null, null] },
    ];
    const sys = $('#sys'), stack = $('.stack-3d'), plates = $$('.plate'), rows = $$('.layers li'), btns = $$('.rail button'), note = $('#sysNote');
    let cur = 2, auto = 0, seen = false, done = false;
    const set = (i) => {
      cur = i;
      const s = STAGES[i];
      let lo = 3;
      btns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
      rows.forEach((r, k) => {
        const on = !!s.l[k];
        r.classList.toggle('off', !on);
        plates[k].classList.toggle('on', on);
        $('b', r).textContent = s.t[k];
        $('.l-d', r).textContent = on ? s.l[k] : 'Not in scope for this role';
        if (on) lo = 3 - k;
      });
      stack.style.setProperty('--lo', lo);
      stack.classList.toggle('solo', lo === 3);
      note.textContent = s.n;
    };
    const start = () => { if (!auto && !reduce && seen && !done) { sys.classList.add('auto'); auto = setInterval(() => set((cur + 1) % STAGES.length), 4200); } };
    const stop = () => { clearInterval(auto); auto = 0; sys.classList.remove('auto'); };
    btns.forEach((b, i) => b.addEventListener('click', () => { done = true; stop(); note.setAttribute('aria-live', 'polite'); set(i); }));
    rows.forEach((r, k) => {
      r.addEventListener('pointerenter', () => plates[k].style.setProperty('--lift', '16px'));
      r.addEventListener('pointerleave', () => plates[k].style.setProperty('--lift', '0px'));
    });
    if (fine && !reduce) {
      const hero = $('.hero');
      hero.addEventListener('pointermove', (e) => stack.style.setProperty('--tz', ((e.clientX / innerWidth - 0.5) * 14).toFixed(2) + 'deg'), { passive: true });
      hero.addEventListener('pointerleave', () => stack.style.setProperty('--tz', '0deg'));
    }
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; seen ? start() : stop(); }, { threshold: 0.3 }).observe(sys);
    set(cur);
  })();

  /* ---------- DNA helix (canvas, scroll-phased) ---------- */
  (() => {
    const c = $('#helix'), lis = $$('.pairs li');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, n = 12, marks = [], hot = -1, vis = false, raf = 0, ink, acc;
    const colors = () => { const s = getComputedStyle(root); ink = s.getPropertyValue('--ink').trim(); acc = s.getPropertyValue('--accent').trim(); };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      if (!w || !h) return;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const horiz = w > h, len = horiz ? w : h;
      n = Math.max(8, Math.round(len / 24));
      const cr = c.getBoundingClientRect();
      marks = lis.map((li, i) => {
        if (horiz) return Math.round((i + 0.5) / lis.length * (n - 1));
        const r = li.getBoundingClientRect();
        return Math.round(((r.top + r.height / 2 - cr.top) / h) * (n - 1));
      });
      if (!raf) draw(0);
    };
    function draw(t) {
      const horiz = w > h, len = horiz ? w : h, pad = 10;
      const mid = horiz ? h / 2 : w * 0.4, amp = horiz ? h * 0.36 : Math.min(w * 0.28, 64);
      const phase = scrollY * 0.006 + t * 0.0005, step = (len - pad * 2) / (n - 1), k = 0.52;
      const pt = (along, off) => horiz ? [along, mid + off] : [mid + off, along];
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1; ctx.strokeStyle = ink;
      for (const sgn of [1, -1]) {
        ctx.globalAlpha = 0.28; ctx.beginPath();
        for (let u = 0; u <= n - 1; u += 0.1) {
          const [x, y] = pt(pad + u * step, sgn * Math.cos(phase + u * k) * amp);
          u ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      for (let i = 0; i < n; i++) {
        const a = Math.cos(phase + i * k) * amp, z = Math.sin(phase + i * k), along = pad + i * step;
        const m = marks.indexOf(i), on = m > -1, [x1, y1] = pt(along, a), [x2, y2] = pt(along, -a);
        ctx.strokeStyle = ctx.fillStyle = on ? acc : ink;
        ctx.lineWidth = on && m === hot ? 2 : 1;
        ctx.globalAlpha = on ? (hot < 0 || m === hot ? 0.95 : 0.4) : 0.16;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        if (on && !horiz) {
          ctx.globalAlpha = m === hot ? 1 : 0.45;
          ctx.beginPath(); ctx.moveTo(mid + Math.abs(a) + 8, along); ctx.lineTo(w, along); ctx.stroke();
        }
        ctx.globalAlpha = on ? 1 : 0.5 + 0.35 * z;
        ctx.beginPath(); ctx.arc(x1, y1, 2.4 + z * 1.1, 0, 6.3); ctx.fill();
        ctx.globalAlpha = on ? 1 : 0.5 - 0.35 * z;
        ctx.beginPath(); ctx.arc(x2, y2, 2.4 - z * 1.1, 0, 6.3); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = vis && !reduce && !document.hidden ? requestAnimationFrame(draw) : 0;
    }
    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(draw); else if (reduce) draw(0); };
    lis.forEach((li, i) => {
      li.addEventListener('pointerenter', () => { hot = i; if (reduce) draw(0); });
      li.addEventListener('pointerleave', () => { hot = -1; if (reduce) draw(0); });
    });
    onTheme.push(() => { colors(); if (!raf) draw(0); });
    new ResizeObserver(size).observe(c.parentElement);
    new ResizeObserver(size).observe($('.pairs'));
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; kick(); }).observe(c);
    document.addEventListener('visibilitychange', kick);
    colors(); size();
  })();

  /* ---------- career gantt ---------- */
  (() => {
    const g = $('.gantt');
    if (!g) return;
    const now = new Date(), M = (now.getFullYear() - 2019) * 12 + now.getMonth() - 10, total = M + 3;
    $$('.g-rows button', g).forEach((b) => {
      const s = +b.dataset.s, e = b.dataset.e === 'now' ? M : +b.dataset.e;
      b.style.setProperty('--l', (s / total * 100).toFixed(2) + '%');
      b.style.setProperty('--w', ((e - s) / total * 100).toFixed(2) + '%');
    });
    let ticks = '';
    for (let y = 2020; (y - 2019) * 12 - 10 < M - 4; y++) ticks += `<span style="--x:${(((y - 2019) * 12 - 10) / total * 100).toFixed(2)}%">’${String(y).slice(2)}</span>`;
    $('.g-grid', g).innerHTML = ticks + `<span class="now" style="--x:${(M / total * 100).toFixed(2)}%">now</span>`;
    tabs($('.g-rows', g), () => {});
  })();

  /* ---------- story diagrams ---------- */
  (() => {
    const W = 152, H = 52;
    const D = {
      s1: { n: [['React + TypeScript', 'one codebase', 16, 118, 1], ['Web app', 'browser', 392, 24], ['Capacitor', 'native bridge', 204, 190, 1], ['iOS', 'App Store', 392, 150], ['Android', 'Play Store', 392, 232]], e: [[0, 1], [0, 2], [2, 3], [2, 4]] },
      s2: { n: [['Component library', 'shared UI system', 16, 124, 1], ['Eximfiles', 'export docs', 204, 24], ['eBRC', 'certificates', 204, 124], ['Scriphouse', 'marketplace', 204, 224], ['NestJS services', 'REST · multi-tenant', 392, 74], ['PostgreSQL', 'tenant-scoped schema', 392, 190]], e: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5]] },
      s3: { n: [['Legacy PHP site', 'marketing', 16, 124], ['Next.js', 'SSR · SSG · splitting', 204, 124, 1], ['Core Web Vitals', 'faster pages', 392, 54], ['Search indexing', 'technical SEO', 392, 194]], e: [[0, 1], [1, 2], [1, 3]] },
      s4: { n: [['Route', 'entry', 16, 40], ['Split chunk', 'code splitting', 204, 40], ['Lazy Gantt view', 'loaded on demand', 392, 40], ['Memoized rows', 'stable props', 392, 200, 1], ['Render path', 'only what changed', 204, 200], ['Responsive UI', 'data-dense views', 16, 200]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
    };
    const path = (a, b) => {
      const [, , ax, ay] = a, [, , bx, by] = b;
      if (bx >= ax + W) { const m = (ax + W + bx) / 2; return `M${ax + W} ${ay + H / 2}H${m}V${by + H / 2}H${bx}`; }
      if (bx + W <= ax) { const m = (ax + bx + W) / 2; return `M${ax} ${ay + H / 2}H${m}V${by + H / 2}H${bx + W}`; }
      return by > ay ? `M${ax + W / 2} ${ay + H}V${by}` : `M${ax + W / 2} ${ay}V${by + H}`;
    };
    $$('[data-dg]').forEach((el) => {
      const d = D[el.dataset.dg];
      const edges = d.e.map(([a, b], i) => {
        const p = path(d.n[a], d.n[b]);
        const pk = reduce ? '' : `<circle class="pk" r="2.6"><animateMotion dur="2.6s" begin="${1 + i * 0.35}s" repeatCount="indefinite" path="${p}"/></circle>`;
        return `<path class="e" pathLength="1" style="--i:${i}" d="${p}"/>${pk}`;
      }).join('');
      const nodes = d.n.map(([t, s, x, y, a], i) =>
        `<g class="n${a ? ' a' : ''}" style="--i:${i}"><rect x="${x}" y="${y}" width="${W}" height="${H}"/><text x="${x + 12}" y="${y + 22}">${t}</text><text class="s" x="${x + 12}" y="${y + 39}">${s}</text></g>`).join('');
      el.innerHTML = `<svg viewBox="0 0 560 300" aria-hidden="true">${edges}${nodes}</svg>`;
    });
    tabs($('.st-tabs'), (p) => {
      $$('.st-panel').forEach((x) => x.classList.remove('on'));
      requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('on')));
    });
  })();

  /* ---------- reveal + active section ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el, i) => {
    const sibs = el.parentElement.querySelectorAll(':scope > [data-reveal]');
    if (sibs.length > 1) el.style.setProperty('--rd', [...sibs].indexOf(el) * 0.07 + 's');
    io.observe(el);
  });

  const secs = $$('[data-sec]'), stSec = $('#stSec');
  const navLinks = $$('.nav nav a');
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const s = e.target;
    stSec.textContent = `§${s.dataset.sec} ${s.dataset.name}`;
    navLinks.forEach((a) => a.dataset.go === s.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => secIO.observe(s));

  /* ---------- scroll-driven: progress, timeline, word reveal, parallax ---------- */
  const lead = $('#dnaLead');
  if (!reduce) lead.innerHTML = lead.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
  const words = $$('.w', lead), prog = $('#progress'), pct = $('#stPct');
  const ghosts = reduce ? [] : $$('[data-parallax]');
  const clamp = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight, max = root.scrollHeight - vh, p = max > 0 ? clamp(scrollY / max) : 0;
    prog.style.transform = `scaleX(${p})`;
    pct.textContent = Math.round(p * 100);
    if (words.length) {
      const r = lead.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const k = clamp((vh * 0.88 - r.top) / (vh * 0.5 + r.height)) * (words.length + 6);
        words.forEach((w, i) => { w.style.opacity = 0.16 + 0.84 * clamp(k - i); });
      }
    }
    ghosts.forEach((g) => {
      const r = g.parentElement.getBoundingClientRect();
      if (r.top < vh * 1.2 && r.bottom > -vh * 0.5) g.style.transform = `translate3d(0,${((r.top - vh / 2) * -g.dataset.parallax).toFixed(1)}px,0)`;
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ---------- cinematic section transitions ---------- */
  const curtain = $('.curtain'), curtainT = $('#curtainT');
  let busy = false;
  const go = (id) => {
    const el = document.getElementById(id);
    if (!el || busy) return;
    const land = () => {
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      history.replaceState(null, '', id === 'top' ? location.pathname : '#' + id);
      el.focus({ preventScroll: true });
    };
    if (reduce || !curtain.animate) return land();
    busy = true;
    curtainT.textContent = id === 'top' ? 'Index' : el.dataset.name;
    $('.curtain-k').textContent = `§ ${el.dataset.sec}`;
    const ease = 'cubic-bezier(.7,0,.2,1)';
    const a = curtain.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 420, easing: ease, fill: 'forwards' });
    a.onfinish = () => {
      land();
      const b = curtain.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: 520, delay: 140, easing: ease, fill: 'forwards' });
      b.onfinish = () => { a.cancel(); b.cancel(); busy = false; };
    };
  };
  $$('[data-go]').forEach((a) => a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); go(a.dataset.go);
  }));

  /* ---------- magnetic + card spotlight/tilt ---------- */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 22}px,${((e.clientY - r.top) / r.height - 0.5) * 16}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('[data-card]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
        el.style.setProperty('--ry', (x - 0.5) * 4 + 'deg'); el.style.setProperty('--rx', (0.5 - y) * 4 + 'deg');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- arsenal filter ---------- */
  (() => {
    const q = $('#arsQ'), out = $('#arsN'), items = $$('#arsGrid b');
    const run = () => {
      const v = q.value.trim().toLowerCase();
      let n = 0;
      items.forEach((b) => {
        const hit = v && b.textContent.toLowerCase().includes(v);
        b.classList.toggle('hit', !!hit); b.classList.toggle('off', !!v && !hit);
        if (hit) n++;
      });
      out.textContent = v ? `${n} match${n === 1 ? '' : 'es'}` : `${items.length} rows`;
    };
    const pre = $$('.ars-pre button');
    const sync = () => pre.forEach((b) => b.setAttribute('aria-pressed', q.value.trim().toLowerCase() === b.dataset.q));
    pre.forEach((b) => b.addEventListener('click', () => { q.value = q.value === b.dataset.q ? '' : b.dataset.q; run(); sync(); }));
    q.addEventListener('input', () => { run(); sync(); }); run(); sync();
  })();

  /* ---------- command palette ---------- */
  (() => {
    const pal = $('#pal'), q = $('#palQ'), list = $('#palList');
    const cmds = [
      ...secs.map((s) => ({ t: s.id === 'top' ? 'Index' : s.dataset.name, h: `§${s.dataset.sec}`, run: () => go(s.id) })),
      { t: 'Toggle theme', h: 'view', run: toggleTheme },
      { t: 'Copy email address', h: 'action', run: copyMail },
      { t: 'Call mobile', h: 'action', run: () => { location.href = 'tel:+917767838215'; } },
      { t: 'Write an email', h: 'action', run: () => { location.href = 'mailto:' + EMAIL; } },
      { t: 'Open LinkedIn', h: 'link', run: () => open('https://www.linkedin.com/in/rushikesh-shirkar-772a1112a', '_blank', 'noopener') },
      { t: 'Open GitHub', h: 'link', run: () => open('https://github.com/RushiShirkar', '_blank', 'noopener') },
    ];
    let shown = [], sel = 0;
    const paint = () => {
      const v = q.value.trim().toLowerCase();
      shown = cmds.filter((c) => (c.t + ' ' + c.h).toLowerCase().includes(v));
      sel = Math.min(sel, Math.max(shown.length - 1, 0));
      list.innerHTML = shown.length
        ? shown.map((c, i) => `<li role="option" id="pal-${i}" aria-selected="${i === sel}"><span>${c.t}</span><small>${c.h}</small></li>`).join('')
        : '<li class="none">No matching command</li>';
      q.setAttribute('aria-activedescendant', shown.length ? 'pal-' + sel : '');
      $('[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' });
    };
    const openPal = () => { if (pal.open) return; q.value = ''; sel = 0; paint(); pal.showModal(); q.focus(); };
    const exec = (i) => { const c = shown[i]; if (!c) return; pal.close(); c.run(); };
    q.addEventListener('input', () => { sel = 0; paint(); });
    q.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (shown.length) { sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length; paint(); }
      } else if (e.key === 'Enter') { e.preventDefault(); exec(sel); }
    });
    list.addEventListener('click', (e) => { const li = e.target.closest('li[role="option"]'); if (li) exec(+li.id.slice(4)); });
    pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
    $('#openPalette').addEventListener('click', openPal);
    addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); }
    });
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) $('#openPalette kbd').textContent = 'Ctrl K';
  })();

  /* ---------- status clock (Pune) ---------- */
  const clocks = $$('.js-clock'), fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  const tick = () => { const t = fmt.format(new Date()); clocks.forEach((c) => { c.textContent = t; }); };
  tick(); setInterval(tick, 30000);
})();
