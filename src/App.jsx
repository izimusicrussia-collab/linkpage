import { useState, useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════════
   LINKPAGE — мульти-профильный линк-ин-био
   /#/slug   — публичная страница
   /#/admin  — админка (пароль admin123)
   ══════════════════════════════════════════════════ */

const ADMIN_PW = 'admin123';

const THEMES = {
  midnight: { n:'Полночь', bg:'linear-gradient(135deg,#0a0a1a,#1a1a3e,#0d0d2b)', c:'rgba(255,255,255,0.07)', cb:'rgba(255,255,255,0.12)', t:'#fff', ts:'rgba(255,255,255,0.6)', a:'#6c5ce7' },
  ocean:    { n:'Океан',   bg:'linear-gradient(135deg,#0c1b33,#1a3a5c,#0d2137)', c:'rgba(255,255,255,0.08)', cb:'rgba(100,200,255,0.15)', t:'#fff', ts:'rgba(255,255,255,0.6)', a:'#0984e3' },
  sunset:   { n:'Закат',   bg:'linear-gradient(135deg,#2d1b3d,#4a1942,#1a0a2e)', c:'rgba(255,255,255,0.08)', cb:'rgba(255,100,150,0.15)', t:'#fff', ts:'rgba(255,255,255,0.6)', a:'#e84393' },
  forest:   { n:'Лес',     bg:'linear-gradient(135deg,#0a1a0f,#1a3a1f,#0d2512)', c:'rgba(255,255,255,0.07)', cb:'rgba(100,255,150,0.12)', t:'#fff', ts:'rgba(255,255,255,0.6)', a:'#00b894' },
  light:    { n:'Светлая', bg:'linear-gradient(135deg,#f5f7fa,#e8ecf1,#f0f2f5)', c:'rgba(255,255,255,0.9)',  cb:'rgba(0,0,0,0.08)',       t:'#1a1a2e', ts:'rgba(0,0,0,0.5)',      a:'#6c5ce7' },
  neon:     { n:'Неон',    bg:'linear-gradient(135deg,#000,#0a0a0a,#050510)',      c:'rgba(255,255,255,0.04)', cb:'rgba(0,255,136,0.2)',     t:'#fff', ts:'rgba(255,255,255,0.5)', a:'#00ff88' },
  cream:    { n:'Крем',    bg:'linear-gradient(135deg,#fdf6e3,#f5e6cc,#faf0d7)',  c:'rgba(255,255,255,0.8)',  cb:'rgba(139,90,43,0.12)',    t:'#3d2c1e', ts:'rgba(61,44,30,0.6)',  a:'#d4830e' },
  arctic:   { n:'Арктика', bg:'linear-gradient(135deg,#e8f4f8,#d1ecf4,#e0f0f6)',  c:'rgba(255,255,255,0.85)', cb:'rgba(0,120,180,0.1)',     t:'#1a3a4a', ts:'rgba(26,58,74,0.55)', a:'#0078b4' },
};

const ICONS = {
  vk:        { c:'#0077FF', l:'VK',        p:'M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2m3.08 14.27h-1.61c-.61 0-.8-.49-1.9-1.61-1.07-1.06-1.47-1.17-1.73-1.17-.37 0-.47.1-.47.59v1.47c0 .42-.14.67-1.26.67-1.9 0-4-1.15-5.47-3.3C3.63 9.72 3.15 7.94 3.15 7.5c0-.26.1-.49.59-.49h1.61c.44 0 .6.2.77.67.85 2.43 2.27 4.56 2.85 4.56.22 0 .32-.1.32-.67V9.46c-.07-1.16-.68-1.26-.68-1.67 0-.2.17-.39.44-.39h2.54c.37 0 .49.19.49.65v3.05c0 .37.17.49.27.49.22 0 .39-.12.8-.54 1.24-1.39 2.12-3.53 2.12-3.53.12-.26.32-.49.76-.49h1.61c.49 0 .59.24.49.65-.2.95-2.17 3.72-2.17 3.72-.17.27-.24.39 0 .7.17.22.73.7 1.12 1.12.71.76 1.24 1.41 1.39 1.85.14.44-.07.67-.51.67' },
  telegram:  { c:'#26A5E4', l:'Telegram',  p:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z' },
  instagram: { c:'#E4405F', l:'Instagram', p:'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z' },
  youtube:   { c:'#FF0000', l:'YouTube',   p:'M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.56 31.56 0 000 12a31.56 31.56 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.56 31.56 0 0024 12a31.56 31.56 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
  tiktok:    { c:'#111',    l:'TikTok',    p:'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.8a8.18 8.18 0 004.77 1.53V6.86a4.84 4.84 0 01-1-.17z' },
  spotify:   { c:'#1DB954', l:'Spotify',   p:'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.55 2 12 2zm4.59 14.41c-.2.29-.59.39-.89.19-2.49-1.49-5.59-1.89-9.29-1.09-.36.09-.7-.15-.79-.49-.09-.35.15-.7.49-.79 4.01-.89 7.49-.49 10.29 1.19.3.21.39.61.19.99zm1.2-2.71c-.25.37-.75.49-1.12.24-2.82-1.75-7.12-2.25-10.44-1.22-.41.12-.85-.12-.97-.53-.12-.41.12-.85.53-.97 3.81-1.15 8.53-.59 11.76 1.39.37.24.49.75.24 1.09z' },
  whatsapp:  { c:'#25D366', l:'WhatsApp',  p:'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.52-.08-.15-.68-1.64-.93-2.25-.25-.58-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.38-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34M12.05 2C6.53 2 2.06 6.45 2.05 11.97c0 1.76.46 3.47 1.34 4.99L2 22l5.23-1.37c1.45.79 3.08 1.21 4.74 1.21h.01c5.51 0 9.99-4.49 10-10a9.94 9.94 0 00-2.92-7.07A9.87 9.87 0 0012.05 2' },
  github:    { c:'#888',    l:'GitHub',    p:'M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z' },
  twitter:   { c:'#000',    l:'X',         p:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  yandex:    { c:'#FF5722', l:'Я.Музыка',  p:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5v-9l5 4.5-5 4.5z' },
  website:   { c:'#607D8B', l:'Сайт',      p:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
  link:      { c:'#9E9E9E', l:'Ссылка',    p:'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z' },
  music:     { c:'#E91E63', l:'Музыка',    p:'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
};

const mksvg = (n, s=22) => `<svg viewBox="0 0 24 24" fill="currentColor" width="${s}" height="${s}"><path d="${(ICONS[n]||ICONS.link).p}"/></svg>`;
const TH = (k) => THEMES[k] || THEMES.midnight;

const LS_KEY = 'lp_v5';
const load = () => { try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : null; } catch { return null; } };
const save = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} };

const INIT = {
  profiles: [
    {
      id: 'gleb', slug: 'gleb',
      name: 'Глеб Картер', bio: 'Музыкант • Продюсер • Автор', avatar: '',
      theme: 'midnight', customBg: '', bgBlur: 0, bgOpacity: 0.5, cardStyle: 'glass',
      blocks: [
        { id: '1', icon: 'vk', customIcon: '', title: 'VK', url: 'https://vk.com/', on: true },
        { id: '2', icon: 'telegram', customIcon: '', title: 'Telegram', url: 'https://t.me/', on: true },
        { id: '3', icon: 'yandex', customIcon: '', title: 'Яндекс Музыка', url: 'https://music.yandex.ru/', on: true },
        { id: '4', icon: 'instagram', customIcon: '', title: 'Instagram', url: 'https://instagram.com/', on: true },
        { id: '5', icon: 'youtube', customIcon: '', title: 'YouTube', url: 'https://youtube.com/', on: true },
        { id: '6', icon: 'tiktok', customIcon: '', title: 'TikTok', url: 'https://tiktok.com/', on: true },
      ],
    },
  ],
};

const ghash = () => window.location.hash.replace(/^#\/?/, '');

// ── Icon component (outside App to avoid remount) ──
function BIco({ b, size, radius }) {
  const sz = size || 40;
  const r = radius || 10;
  if (b.customIcon) return <div style={{ width: sz, height: sz, borderRadius: r, overflow: 'hidden', flexShrink: 0 }}><img src={b.customIcon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>;
  const ic = ICONS[b.icon] || ICONS.link;
  return <div style={{ width: sz, height: sz, borderRadius: r, background: ic.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }} dangerouslySetInnerHTML={{ __html: mksvg(b.icon, Math.round(sz * 0.55)) }} />;
}

// Styles (outside App)
const inpS = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: 14, fontFamily: 'inherit' };
const btnSFn = (bg) => ({ background: bg || 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' });

export default function App() {
  const [data, setData] = useState(() => load() || INIT);
  const [route, setRoute] = useState(ghash);
  const [logged, setLogged] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('blocks');
  const [editBlock, setEditBlock] = useState(null);
  const [toast, setToast] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(() => { save(data); }, [data]);
  useEffect(() => {
    const fn = () => setRoute(ghash());
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);

  const go = (s) => { window.location.hash = '#/' + s; };
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2e3); };

  const profiles = data.profiles;
  const findP = (id) => profiles.find(p => p.id === id);
  const editP = findP(editId);
  const setProfiles = (fn) => setData(d => ({ ...d, profiles: fn(d.profiles) }));

  const updateP = (id, key, val) => setProfiles(ps => ps.map(p => p.id === id ? { ...p, [key]: val } : p));
  const updateBlock = (pid, bid, upd) => {
    setProfiles(ps => ps.map(p => p.id === pid ? { ...p, blocks: p.blocks.map(b => b.id === bid ? { ...b, ...upd } : b) } : p));
    if (editBlock?.id === bid) setEditBlock(prev => ({ ...prev, ...upd }));
  };

  const addProfile = () => {
    const id = Date.now().toString(36);
    setProfiles(ps => [...ps, { id, slug: id, name: 'Новый профиль', bio: '', avatar: '', theme: 'midnight', customBg: '', bgBlur: 0, bgOpacity: 0.5, cardStyle: 'glass', blocks: [] }]);
    setEditId(id); setTab('profile'); setEditBlock(null); flash('Создан!');
  };
  const deleteProfile = (id) => { setProfiles(ps => ps.filter(p => p.id !== id)); if (editId === id) { setEditId(null); setEditBlock(null); } setConfirmDel(null); flash('Удалён'); };
  const dupProfile = (id) => { const s = findP(id); if (!s) return; const nid = Date.now().toString(36); setProfiles(ps => [...ps, { ...JSON.parse(JSON.stringify(s)), id: nid, slug: nid, name: s.name + ' (копия)' }]); setEditId(nid); flash('Скопирован!'); };
  const addBlock = (pid) => { const b = { id: Date.now().toString(), icon: 'link', customIcon: '', title: 'Новая ссылка', url: 'https://', on: true }; setProfiles(ps => ps.map(p => p.id === pid ? { ...p, blocks: [...p.blocks, b] } : p)); setEditBlock(b); };
  const deleteBlock = (pid, bid) => { setProfiles(ps => ps.map(p => p.id === pid ? { ...p, blocks: p.blocks.filter(b => b.id !== bid) } : p)); setEditBlock(null); setConfirmDel(null); flash('Ссылка удалена'); };
  const moveBlock = (pid, bid, dir) => { setProfiles(ps => ps.map(p => { if (p.id !== pid) return p; const bl = [...p.blocks]; const i = bl.findIndex(b => b.id === bid); if (dir < 0 && i > 0) [bl[i], bl[i-1]] = [bl[i-1], bl[i]]; if (dir > 0 && i < bl.length - 1) [bl[i], bl[i+1]] = [bl[i+1], bl[i]]; return { ...p, blocks: bl }; })); };

  const readFile = (cb) => (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => cb(ev.target.result); r.readAsDataURL(f); e.target.value = ''; };
  const doLogin = () => { if (pw === ADMIN_PW) { setLogged(true); setPw(''); setPwErr(''); } else setPwErr('Неверный пароль'); };
  const doLogout = () => { setLogged(false); setEditId(null); setEditBlock(null); go(''); };
  const exportAll = () => { const b = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'linkpage-backup.json'; a.click(); URL.revokeObjectURL(u); flash('Экспортировано!'); };
  const importAll = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { try { setData(JSON.parse(ev.target.result)); flash('Импорт OK!'); } catch { flash('Ошибка файла'); } }; r.readAsText(f); e.target.value = ''; };

  // Routing
  const isAdmin = route === 'admin';
  const curProfile = !isAdmin ? profiles.find(p => p.slug === route) : null;
  const showHome = !isAdmin && !curProfile && route === '';
  const show404 = !isAdmin && !curProfile && route !== '';

  const ep = editP;
  const et = ep ? TH(ep.theme) : THEMES.midnight;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased;font-family:'Outfit',sans-serif}
        .lc{animation:fu .4s ease both;transition:transform .2s,filter .2s}.lc:hover{transform:translateY(-2px)!important;filter:brightness(1.1)}
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input:focus,textarea:focus{outline:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
      `}</style>

      {/* ═══ PUBLIC PROFILE ═══ */}
      {curProfile && (() => {
        const p = curProfile, t = TH(p.theme);
        return (
          <div style={{ minHeight: '100vh', background: p.customBg ? '#000' : t.bg, display: 'flex', justifyContent: 'center', position: 'relative', fontFamily: "'Outfit',sans-serif" }}>
            {p.customBg && <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${p.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: `blur(${p.bgBlur}px)`, transform: 'scale(1.1)' }} />}
            {p.customBg && <div style={{ position: 'fixed', inset: 0, background: `rgba(0,0,0,${p.bgOpacity})` }} />}
            <div style={{ maxWidth: 440, width: '100%', padding: '40px 20px 80px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: t.c, border: `3px solid ${t.a}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: t.t, margin: '0 auto 16px', overflow: 'hidden', boxShadow: `0 0 30px ${t.a}33` }}>
                {p.avatar ? <img src={p.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.name?.charAt(0)?.toUpperCase()||'?')}
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: t.t, textAlign: 'center', margin: '0 0 6px' }}>{p.name}</h1>
              {p.bio && <p style={{ fontSize: 14, color: t.ts, textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>{p.bio}</p>}
              {p.blocks.filter(b => b.on).map((b, i) => (
                <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="lc" style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  background: p.cardStyle === 'outline' ? 'transparent' : t.c,
                  border: `1px solid ${t.cb}`, borderRadius: 14, marginBottom: 10,
                  textDecoration: 'none', transition: 'all .2s',
                  backdropFilter: p.cardStyle === 'glass' ? 'blur(12px)' : 'none',
                  animationDelay: `${i*.05}s`,
                }}>
                  <BIco b={b} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.t, flex: 1 }}>{b.title}</span>
                  <span style={{ color: t.ts, fontSize: 18 }}>›</span>
                </a>
              ))}
            </div>
            <button onClick={() => go('admin')} style={{ position: 'fixed', bottom: 20, right: 20, width: 44, height: 44, borderRadius: '50%', background: t.a, border: 'none', color: '#fff', fontSize: 17, cursor: 'pointer', boxShadow: `0 4px 20px ${t.a}66`, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙</button>
          </div>
        );
      })()}

      {/* ═══ HOME ═══ */}
      {showHome && (
        <div style={{ minHeight: '100vh', background: THEMES.midnight.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', fontFamily: "'Outfit',sans-serif", color: '#fff' }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>LinkPage</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40, fontSize: 14 }}>Выбери профиль</p>
          {profiles.map(p => (
            <div key={p.id} onClick={() => go(p.slug)} className="lc" style={{ width: '100%', maxWidth: 400, padding: '16px 20px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: TH(p.theme).a, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                {p.avatar ? <img src={p.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/{p.slug} · {p.blocks.length} ссылок</div>
              </div>
            </div>
          ))}
          {profiles.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Пока нет профилей</p>}
          <button onClick={() => go('admin')} style={{ marginTop: 30, padding: '12px 28px', background: '#6c5ce7', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>⚙ Админка</button>
        </div>
      )}

      {/* ═══ 404 ═══ */}
      {show404 && (
        <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Outfit',sans-serif" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🤷</div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Не найдено</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>/{route}</p>
          <button onClick={() => go('')} style={{ padding: '10px 24px', background: '#6c5ce7', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>На главную</button>
        </div>
      )}

      {/* ═══ ADMIN LOGIN ═══ */}
      {isAdmin && !logged && (
        <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif" }}>
          <div style={{ background: '#1a1a2e', padding: 32, borderRadius: 16, width: 320, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#fff', marginBottom: 20, fontSize: 18 }}>🔐 Войти в админку</h3>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Пароль" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
              style={{ ...inpS, marginBottom: 12 }} />
            {pwErr && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10 }}>{pwErr}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={doLogin} style={{ flex: 1, padding: 12, background: '#6c5ce7', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Войти</button>
              <button type="button" onClick={() => go('')} style={btnSFn()}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADMIN PANEL ═══ */}
      {isAdmin && logged && (
        <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#fff', fontFamily: "'Outfit',sans-serif" }}>
          {/* Header */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b style={{ fontSize: 17 }}>⚙️ Админка</b>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={exportAll} style={btnSFn()}>📥 Экспорт</button>
              <label style={{ ...btnSFn(), cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>📤 Импорт<input type="file" accept=".json" onChange={importAll} style={{ display: 'none' }} /></label>
              <button onClick={doLogout} style={btnSFn('rgba(255,50,50,0.2)')}>Выйти</button>
            </div>
          </div>

          <div style={{ display: 'flex', height: 'calc(100vh - 49px)' }}>
            {/* LEFT — list */}
            <div style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', padding: 14, flexShrink: 0 }}>
              <button onClick={addProfile} style={{ width: '100%', padding: 11, background: '#6c5ce7', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14 }}>+ Новый профиль</button>
              {profiles.map(p => (
                <div key={p.id} onClick={() => { setEditId(p.id); setTab('blocks'); setEditBlock(null); }}
                  style={{ padding: '10px 12px', background: editId === p.id ? 'rgba(108,92,231,0.2)' : 'rgba(255,255,255,0.04)', border: editId === p.id ? '1px solid rgba(108,92,231,0.4)' : '1px solid transparent', borderRadius: 10, marginBottom: 6, cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>/{p.slug} · {p.blocks.length} ссылок</div>
                </div>
              ))}
            </div>

            {/* RIGHT — editor */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {!ep ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>← Выбери или создай профиль</div>
              ) : (
                <>
                  {/* Tabs */}
                  <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: '#0a0a1a', zIndex: 10 }}>
                    {[['blocks','📋 Ссылки'],['profile','👤 Профиль'],['design','🎨 Дизайн']].map(([id,lb]) => (
                      <button key={id} onClick={() => { setTab(id); setEditBlock(null); }} style={{
                        flex: 1, padding: '12px 6px', background: tab === id ? 'rgba(255,255,255,0.06)' : 'transparent',
                        border: 'none', borderBottom: tab === id ? `2px solid ${et.a}` : '2px solid transparent',
                        color: tab === id ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                      }}>{lb}</button>
                    ))}
                  </div>

                  <div style={{ padding: 20 }}>
                    {/* Header bar */}
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 6 }}>/{ep.slug}</span>
                      <button onClick={() => go(ep.slug)} style={btnSFn()}>👁 Смотреть</button>
                      <button onClick={() => dupProfile(ep.id)} style={btnSFn()}>📋 Копия</button>
                      <button onClick={() => setConfirmDel({ type: 'profile', id: ep.id })} style={btnSFn('rgba(255,50,50,0.2)')}>🗑</button>
                    </div>

                    {/* ── BLOCKS ── */}
                    {tab === 'blocks' && !editBlock && (
                      <>
                        <button onClick={() => addBlock(ep.id)} style={{ width: '100%', padding: 12, background: et.a, border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14 }}>+ Добавить ссылку</button>
                        {ep.blocks.map(b => (
                          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 5, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <button onClick={() => moveBlock(ep.id, b.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 18, height: 14, borderRadius: 3, cursor: 'pointer', fontSize: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▲</button>
                              <button onClick={() => moveBlock(ep.id, b.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 18, height: 14, borderRadius: 3, cursor: 'pointer', fontSize: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▼</button>
                            </div>
                            <BIco b={b} size={28} radius={7} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                            </div>
                            <div onClick={() => updateBlock(ep.id, b.id, { on: !b.on })} style={{ width: 34, height: 18, borderRadius: 9, background: b.on ? et.a : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'all .2s', flexShrink: 0 }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: b.on ? 18 : 2, transition: 'all .2s' }} />
                            </div>
                            <button onClick={() => setEditBlock(b)} style={btnSFn()}>✎</button>
                          </div>
                        ))}
                        {ep.blocks.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 20 }}>Пока нет ссылок</div>}
                      </>
                    )}

                    {tab === 'blocks' && editBlock && (
                      <div>
                        <button onClick={() => setEditBlock(null)} style={{ ...btnSFn(), marginBottom: 14 }}>← Назад к списку</button>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Название</div>
                            <input value={editBlock.title} onChange={e => updateBlock(ep.id, editBlock.id, { title: e.target.value })} style={inpS} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>URL</div>
                            <input value={editBlock.url} onChange={e => updateBlock(ep.id, editBlock.id, { url: e.target.value })} style={inpS} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Иконка</div>
                            {editBlock.customIcon && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={editBlock.customIcon} style={{ width: 32, height: 32, borderRadius: 7, objectFit: 'cover' }} />
                                <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Своя иконка</span>
                                <button onClick={() => updateBlock(ep.id, editBlock.id, { customIcon: '' })} style={{ ...btnSFn('rgba(255,0,0,0.2)'), color: '#ff6b6b', fontSize: 11 }}>✕ Убрать</button>
                              </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
                              {Object.entries(ICONS).map(([k, ic]) => (
                                <button key={k} onClick={() => updateBlock(ep.id, editBlock.id, { icon: k, customIcon: '' })} style={{
                                  padding: '6px 2px', borderRadius: 7, cursor: 'pointer', textAlign: 'center',
                                  background: !editBlock.customIcon && editBlock.icon === k ? `${et.a}33` : 'rgba(255,255,255,0.05)',
                                  border: !editBlock.customIcon && editBlock.icon === k ? `2px solid ${et.a}` : '2px solid transparent', fontFamily: 'inherit',
                                }}>
                                  <div style={{ width: 20, height: 20, margin: '0 auto 2px', color: ic.c }} dangerouslySetInnerHTML={{ __html: mksvg(k, 20) }} />
                                  <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>{ic.l}</div>
                                </button>
                              ))}
                              <label style={{ padding: '6px 2px', borderRadius: 7, cursor: 'pointer', textAlign: 'center', background: editBlock.customIcon ? `${et.a}33` : 'rgba(255,255,255,0.05)', border: editBlock.customIcon ? `2px solid ${et.a}` : '2px solid transparent' }}>
                                <div style={{ width: 20, height: 20, margin: '0 auto 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📷</div>
                                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>Своя</div>
                                <input type="file" accept="image/*" onChange={readFile(v => updateBlock(ep.id, editBlock.id, { customIcon: v }))} style={{ display: 'none' }} />
                              </label>
                            </div>
                          </div>
                          <button onClick={() => setConfirmDel({ type: 'block', id: editBlock.id })} style={{ padding: 11, background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, color: '#ff6b6b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>🗑 Удалить ссылку</button>
                        </div>
                      </div>
                    )}

                    {/* ── PROFILE ── */}
                    {tab === 'profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ width: 80, height: 80, borderRadius: '50%', background: et.c, border: `3px solid ${et.a}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: et.t, margin: '0 auto 10px', overflow: 'hidden' }}>
                            {ep.avatar ? <img src={ep.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : ep.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <label style={{ ...btnSFn(), display: 'inline-block', cursor: 'pointer' }}>📷 Фото<input type="file" accept="image/*" onChange={readFile(v => updateP(ep.id, 'avatar', v))} style={{ display: 'none' }} /></label>
                          {ep.avatar && <button onClick={() => updateP(ep.id, 'avatar', '')} style={{ ...btnSFn('rgba(255,0,0,0.2)'), color: '#ff6b6b', marginLeft: 6 }}>✕</button>}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Slug (адрес)</div>
                          <input value={ep.slug} onChange={e => updateP(ep.id, 'slug', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} style={inpS} />
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>сайт.com/#/{ep.slug}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Имя</div>
                          <input value={ep.name} onChange={e => updateP(ep.id, 'name', e.target.value)} style={inpS} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Описание</div>
                          <textarea value={ep.bio} onChange={e => updateP(ep.id, 'bio', e.target.value)} rows={3} style={{ ...inpS, resize: 'vertical' }} />
                        </div>
                      </div>
                    )}

                    {/* ── DESIGN ── */}
                    {tab === 'design' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Тема</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
                            {Object.entries(THEMES).map(([k, th]) => (
                              <button key={k} onClick={() => updateP(ep.id, 'theme', k)} style={{ padding: 9, borderRadius: 9, border: ep.theme === k ? `2px solid ${th.a}` : '2px solid rgba(255,255,255,0.08)', background: th.bg, cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: th.t }}>{th.n}</div>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.a, marginTop: 4 }} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Фон</div>
                          <label style={{ display: 'block', padding: 11, background: 'rgba(255,255,255,0.05)', borderRadius: 10, textAlign: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.2)', fontSize: 13 }}>
                            🖼 Загрузить фон<input type="file" accept="image/*" onChange={readFile(v => updateP(ep.id, 'customBg', v))} style={{ display: 'none' }} />
                          </label>
                          {ep.customBg && <>
                            <button onClick={() => updateP(ep.id, 'customBg', '')} style={{ marginTop: 6, width: '100%', background: 'rgba(255,0,0,0.15)', border: 'none', color: '#ff6b6b', padding: 6, borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Удалить фон</button>
                            <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Затемнение {Math.round(ep.bgOpacity*100)}%</div>
                            <input type="range" min={0} max={1} step={0.05} value={ep.bgOpacity} onChange={e => updateP(ep.id, 'bgOpacity', +e.target.value)} style={{ width: '100%', accentColor: et.a }} />
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Размытие {ep.bgBlur}px</div>
                            <input type="range" min={0} max={30} step={1} value={ep.bgBlur} onChange={e => updateP(ep.id, 'bgBlur', +e.target.value)} style={{ width: '100%', accentColor: et.a }} />
                          </>}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Стиль карточек</div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[['glass','Стекло'],['solid','Заливка'],['outline','Контур']].map(([k,lb]) => (
                              <button key={k} onClick={() => updateP(ep.id, 'cardStyle', k)} style={{ flex: 1, padding: 9, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', background: ep.cardStyle === k ? et.a : 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 500 }}>{lb}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRM DELETE ═══ */}
      {confirmDel && (() => {
        const isProf = confirmDel.type === 'profile';
        const nm = isProf ? findP(confirmDel.id)?.name : editBlock?.title;
        return (
          <div onClick={() => setConfirmDel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(6px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#1a1a2e', padding: 28, borderRadius: 14, width: 320, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🗑</div>
              <h3 style={{ color: '#fff', marginBottom: 8, fontSize: 16 }}>Удалить {isProf ? 'профиль' : 'ссылку'}?</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>{nm}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmDel(null)} style={{ flex: 1, padding: 11, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Отмена</button>
                <button onClick={() => { if (isProf) deleteProfile(confirmDel.id); else deleteBlock(editId, confirmDel.id); }} style={{ flex: 1, padding: 11, background: '#e74c3c', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Удалить</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast */}
      {toast && <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: '#6c5ce7', color: '#fff', padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 10000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{toast}</div>}
    </>
  );
}
