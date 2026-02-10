import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════
// MULTI-PROFILE LINKPAGE — как Taplink
// Каждый профиль = своя страница по адресу /#/slug
// ═══════════════════════════════════════════════

const EMPTY_PROFILE = {
  slug: '',
  profile: { name: '', bio: '', avatar: '' },
  design: { theme: 'midnight', customBg: '', bgBlur: 0, bgOpacity: 0.5, cardStyle: 'glass' },
  blocks: [],
  visible: true,
};

const DEFAULT_PROFILES = [
  {
    slug: 'gleb',
    profile: { name: 'Глеб Картер', bio: 'Музыкант • Продюсер • Автор', avatar: '' },
    design: { theme: 'midnight', customBg: '', bgBlur: 0, bgOpacity: 0.5, cardStyle: 'glass' },
    blocks: [
      { id: '1', icon: 'vk', title: 'VK', url: 'https://vk.com/', visible: true },
      { id: '2', icon: 'telegram', title: 'Telegram', url: 'https://t.me/', visible: true },
      { id: '3', icon: 'yandex', title: 'Яндекс Музыка', url: 'https://music.yandex.ru/', visible: true },
      { id: '4', icon: 'instagram', title: 'Instagram', url: 'https://instagram.com/', visible: true },
      { id: '5', icon: 'youtube', title: 'YouTube', url: 'https://youtube.com/', visible: true },
      { id: '6', icon: 'tiktok', title: 'TikTok', url: 'https://tiktok.com/', visible: true },
    ],
    visible: true,
  },
];

const DEFAULT_SETTINGS = {
  adminPassword: 'admin123',
  siteName: 'LinkPage',
  hideWatermark: false,
};

const THEMES = {
  midnight: { name: 'Полночь', bg: 'linear-gradient(135deg,#0a0a1a,#1a1a3e,#0d0d2b)', card: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)', text: '#fff', sub: 'rgba(255,255,255,0.6)', accent: '#6c5ce7' },
  ocean: { name: 'Океан', bg: 'linear-gradient(135deg,#0c1b33,#1a3a5c,#0d2137)', card: 'rgba(255,255,255,0.08)', border: 'rgba(100,200,255,0.15)', text: '#fff', sub: 'rgba(255,255,255,0.6)', accent: '#0984e3' },
  sunset: { name: 'Закат', bg: 'linear-gradient(135deg,#2d1b3d,#4a1942,#1a0a2e)', card: 'rgba(255,255,255,0.08)', border: 'rgba(255,100,150,0.15)', text: '#fff', sub: 'rgba(255,255,255,0.6)', accent: '#e84393' },
  forest: { name: 'Лес', bg: 'linear-gradient(135deg,#0a1a0f,#1a3a1f,#0d2512)', card: 'rgba(255,255,255,0.07)', border: 'rgba(100,255,150,0.12)', text: '#fff', sub: 'rgba(255,255,255,0.6)', accent: '#00b894' },
  light: { name: 'Светлая', bg: 'linear-gradient(135deg,#f5f7fa,#e8ecf1,#f0f2f5)', card: 'rgba(255,255,255,0.9)', border: 'rgba(0,0,0,0.08)', text: '#1a1a2e', sub: 'rgba(0,0,0,0.5)', accent: '#6c5ce7' },
  neon: { name: 'Неон', bg: 'linear-gradient(135deg,#000,#0a0a0a,#050510)', card: 'rgba(255,255,255,0.04)', border: 'rgba(0,255,136,0.2)', text: '#fff', sub: 'rgba(255,255,255,0.5)', accent: '#00ff88' },
  cream: { name: 'Крем', bg: 'linear-gradient(135deg,#fdf6e3,#f5e6cc,#faf0d7)', card: 'rgba(255,255,255,0.8)', border: 'rgba(139,90,43,0.12)', text: '#3d2c1e', sub: 'rgba(61,44,30,0.6)', accent: '#d4830e' },
  arctic: { name: 'Арктика', bg: 'linear-gradient(135deg,#e8f4f8,#d1ecf4,#e0f0f6)', card: 'rgba(255,255,255,0.85)', border: 'rgba(0,120,180,0.1)', text: '#1a3a4a', sub: 'rgba(26,58,74,0.55)', accent: '#0078b4' },
};

const ICONS = {
  vk: { c: '#0077FF', l: 'VK', s: '<path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2m3.08 14.27h-1.61c-.61 0-.8-.49-1.9-1.61-1.07-1.06-1.47-1.17-1.73-1.17-.37 0-.47.1-.47.59v1.47c0 .42-.14.67-1.26.67-1.9 0-4-1.15-5.47-3.3C3.63 9.72 3.15 7.94 3.15 7.5c0-.26.1-.49.59-.49h1.61c.44 0 .6.2.77.67.85 2.43 2.27 4.56 2.85 4.56.22 0 .32-.1.32-.67V9.46c-.07-1.16-.68-1.26-.68-1.67 0-.2.17-.39.44-.39h2.54c.37 0 .49.19.49.65v3.05c0 .37.17.49.27.49.22 0 .39-.12.8-.54 1.24-1.39 2.12-3.53 2.12-3.53.12-.26.32-.49.76-.49h1.61c.49 0 .59.24.49.65-.2.95-2.17 3.72-2.17 3.72-.17.27-.24.39 0 .7.17.22.73.7 1.12 1.12.71.76 1.24 1.41 1.39 1.85.14.44-.07.67-.51.67"/>' },
  telegram: { c: '#26A5E4', l: 'Telegram', s: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>' },
  instagram: { c: '#E4405F', l: 'Instagram', s: '<path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/>' },
  youtube: { c: '#FF0000', l: 'YouTube', s: '<path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.56 31.56 0 000 12a31.56 31.56 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.56 31.56 0 0024 12a31.56 31.56 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>' },
  tiktok: { c: '#111', l: 'TikTok', s: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.8a8.18 8.18 0 004.77 1.53V6.86a4.84 4.84 0 01-1-.17z"/>' },
  spotify: { c: '#1DB954', l: 'Spotify', s: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.55 2 12 2zm4.59 14.41c-.2.29-.59.39-.89.19-2.49-1.49-5.59-1.89-9.29-1.09-.36.09-.7-.15-.79-.49-.09-.35.15-.7.49-.79 4.01-.89 7.49-.49 10.29 1.19.3.21.39.61.19.99zm1.2-2.71c-.25.37-.75.49-1.12.24-2.82-1.75-7.12-2.25-10.44-1.22-.41.12-.85-.12-.97-.53-.12-.41.12-.85.53-.97 3.81-1.15 8.53-.59 11.76 1.39.37.24.49.75.24 1.09z"/>' },
  whatsapp: { c: '#25D366', l: 'WhatsApp', s: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.52-.08-.15-.68-1.64-.93-2.25-.25-.58-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.38-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34M12.05 2C6.53 2 2.06 6.45 2.05 11.97c0 1.76.46 3.47 1.34 4.99L2 22l5.23-1.37c1.45.79 3.08 1.21 4.74 1.21h.01c5.51 0 9.99-4.49 10-10a9.94 9.94 0 00-2.92-7.07A9.87 9.87 0 0012.05 2"/>' },
  github: { c: '#888', l: 'GitHub', s: '<path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>' },
  twitter: { c: '#1DA1F2', l: 'X', s: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
  yandex: { c: '#FF5722', l: 'Я.Музыка', s: '<circle cx="12" cy="12" r="10"/>' },
  website: { c: '#607D8B', l: 'Сайт', s: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  link: { c: '#9E9E9E', l: 'Ссылка', s: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>' },
  music: { c: '#E91E63', l: 'Музыка', s: '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>' },
};

const IC = (n, sz = 22) => `<svg viewBox="0 0 24 24" fill="currentColor" width="${sz}" height="${sz}">${(ICONS[n]||ICONS.link).s}</svg>`;
const KEY = 'lp_multi_v1';

const loadAll = () => {
  try {
    const s = localStorage.getItem(KEY);
    if (s) { const p = JSON.parse(s); return { profiles: p.profiles || DEFAULT_PROFILES, settings: { ...DEFAULT_SETTINGS, ...p.settings } }; }
  } catch(e){}
  return { profiles: DEFAULT_PROFILES, settings: DEFAULT_SETTINGS };
};
const saveAll = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e){} };

const getHash = () => window.location.hash.replace('#/', '').replace('#', '') || '';

export default function App() {
  const [store, setStore] = useState(loadAll);
  const [route, setRoute] = useState(getHash);
  const [admin, setAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [adminView, setAdminView] = useState('list'); // list | edit
  const [editSlug, setEditSlug] = useState(null);
  const [editTab, setEditTab] = useState('blocks');
  const [editingBlock, setEditingBlock] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { saveAll(store); }, [store]);
  useEffect(() => {
    const h = () => setRoute(getHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2000); };

  const curProfile = store.profiles.find(p => p.slug === route);
  const editProfile = store.profiles.find(p => p.slug === editSlug);

  const updateProfile = (slug, path, val) => {
    setStore(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.slug !== slug) return p;
        const n = JSON.parse(JSON.stringify(p));
        const k = path.split('.');
        let o = n;
        for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
        o[k[k.length - 1]] = val;
        return n;
      }),
    }));
  };

  const addProfile = () => {
    const id = Date.now().toString(36);
    const newP = { ...JSON.parse(JSON.stringify(EMPTY_PROFILE)), slug: id, profile: { name: 'Новый профиль', bio: '', avatar: '' }, blocks: [], visible: true };
    setStore(p => ({ ...p, profiles: [...p.profiles, newP] }));
    setEditSlug(id);
    setAdminView('edit');
    setEditTab('profile');
  };

  const deleteProfile = (slug) => {
    if (!confirm('Удалить этот профиль?')) return;
    setStore(p => ({ ...p, profiles: p.profiles.filter(pr => pr.slug !== slug) }));
    setEditSlug(null);
    setAdminView('list');
  };

  const dupProfile = (slug) => {
    const src = store.profiles.find(p => p.slug === slug);
    if (!src) return;
    const id = Date.now().toString(36);
    const dup = { ...JSON.parse(JSON.stringify(src)), slug: id };
    dup.profile.name += ' (копия)';
    setStore(p => ({ ...p, profiles: [...p.profiles, dup] }));
    flash('Профиль скопирован!');
  };

  const addBlock = (slug) => {
    const b = { id: Date.now().toString(), icon: 'link', title: 'Новая ссылка', url: 'https://', visible: true };
    setStore(p => ({ ...p, profiles: p.profiles.map(pr => pr.slug === slug ? { ...pr, blocks: [...pr.blocks, b] } : pr) }));
    setEditingBlock(b);
  };

  const upBlock = (slug, id, u) => {
    setStore(p => ({ ...p, profiles: p.profiles.map(pr => pr.slug === slug ? { ...pr, blocks: pr.blocks.map(b => b.id === id ? { ...b, ...u } : b) } : pr) }));
  };

  const delBlock = (slug, id) => {
    setStore(p => ({ ...p, profiles: p.profiles.map(pr => pr.slug === slug ? { ...pr, blocks: pr.blocks.filter(b => b.id !== id) } : pr) }));
    setEditingBlock(null);
  };

  const moveBlock = (slug, id, dir) => {
    setStore(p => ({
      ...p, profiles: p.profiles.map(pr => {
        if (pr.slug !== slug) return pr;
        const bl = [...pr.blocks]; const i = bl.findIndex(b => b.id === id);
        if (dir === 'up' && i > 0) [bl[i], bl[i-1]] = [bl[i-1], bl[i]];
        if (dir === 'down' && i < bl.length - 1) [bl[i], bl[i+1]] = [bl[i+1], bl[i]];
        return { ...pr, blocks: bl };
      }),
    }));
  };

  const uploadFile = (cb) => (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => cb(ev.target.result); r.readAsDataURL(f); };

  const doLogin = () => { if (pw === store.settings.adminPassword) { setAdmin(true); setShowLogin(false); setPw(''); setPwErr(''); setAdminView('list'); } else setPwErr('Неверный пароль'); };

  const exportAll = () => { const b = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'linkpage-all.json'; a.click(); URL.revokeObjectURL(u); flash('Экспортировано!'); };
  const importAll = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { try { setStore(JSON.parse(ev.target.result)); flash('Импортировано!'); } catch { flash('Ошибка'); } }; r.readAsText(f); };

  const t = curProfile ? (THEMES[curProfile.design.theme] || THEMES.midnight) : THEMES.midnight;
  const inpS = { width: '100%', padding: '11px 13px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: "'Outfit',sans-serif", resize: 'vertical' };

  const Inp = ({ label, value, onChange, multi }) => (
    <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{label}</div>
    {multi ? <textarea value={value||''} onChange={e => onChange(e.target.value)} rows={3} style={inpS} />
    : <input value={value||''} onChange={e => onChange(e.target.value)} style={inpS} />}</div>
  );

  // ═══ HOME PAGE — список профилей ═══
  const HomePage = () => {
    const th = THEMES.midnight;
    return (
      <div style={{ minHeight: '100vh', background: th.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ maxWidth: 440, width: '100%', padding: '40px 20px' }}>
          <h1 style={{ color: th.text, fontSize: 26, textAlign: 'center', marginBottom: 8 }}>{store.settings.siteName}</h1>
          <p style={{ color: th.sub, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>Выберите профиль</p>
          {store.profiles.filter(p => p.visible).map(p => {
            const pt = THEMES[p.design.theme] || THEMES.midnight;
            return (
              <a key={p.slug} href={`#/${p.slug}`} className="lc" style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                background: th.card, border: `1px solid ${th.border}`, borderRadius: 14,
                marginBottom: 10, textDecoration: 'none', transition: 'all .2s', backdropFilter: 'blur(12px)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: pt.accent + '33', border: `2px solid ${pt.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: th.text, overflow: 'hidden', flexShrink: 0 }}>
                  {p.profile.avatar ? <img src={p.profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.profile.name?.charAt(0)?.toUpperCase() || '?')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: th.text }}>{p.profile.name}</div>
                  {p.profile.bio && <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{p.profile.bio}</div>}
                </div>
                <span style={{ color: th.sub, fontSize: 18 }}>›</span>
              </a>
            );
          })}
          {store.profiles.filter(p => p.visible).length === 0 && <div style={{ color: th.sub, textAlign: 'center', padding: 40 }}>Нет профилей</div>}
        </div>
      </div>
    );
  };

  // ═══ PROFILE PAGE ═══
  const ProfilePage = ({ p }) => {
    const th = THEMES[p.design.theme] || THEMES.midnight;
    return (
      <div style={{ flex: admin ? '0 0 440px' : 1, maxWidth: 440, padding: '40px 20px 80px', margin: admin ? 0 : '0 auto' }}>
        <a href="#/" style={{ display: 'inline-block', marginBottom: 20, color: th.sub, fontSize: 13, textDecoration: 'none' }}>← Назад</a>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: th.card, border: `3px solid ${th.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: th.text, margin: '0 auto 16px', overflow: 'hidden', boxShadow: `0 0 30px ${th.accent}33` }}>
          {p.profile.avatar ? <img src={p.profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.profile.name?.charAt(0)?.toUpperCase() || '?')}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: th.text, textAlign: 'center', margin: '0 0 6px' }}>{p.profile.name}</h1>
        <p style={{ fontSize: 14, color: th.sub, textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5 }}>{p.profile.bio}</p>
        {p.blocks.filter(b => b.visible).map((b, i) => (
          <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="lc" style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
            background: p.design.cardStyle === 'outline' ? 'transparent' : th.card,
            border: `1px solid ${th.border}`, borderRadius: 14, marginBottom: 10,
            cursor: 'pointer', transition: 'all .2s', textDecoration: 'none',
            backdropFilter: p.design.cardStyle === 'glass' ? 'blur(12px)' : 'none',
            animationDelay: `${i * .05}s`,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: (ICONS[b.icon]||ICONS.link).c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }} dangerouslySetInnerHTML={{ __html: IC(b.icon) }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: th.text, flex: 1 }}>{b.title}</span>
            <span style={{ color: th.sub, fontSize: 18 }}>›</span>
          </a>
        ))}
        {!store.settings.hideWatermark && <div style={{ textAlign: 'center', marginTop: 30, fontSize: 11, color: th.sub, opacity: .4 }}>Создано с LinkPage</div>}
      </div>
    );
  };

  // ═══ ADMIN — Profile List ═══
  const AdminList = () => (
    <div>
      <button onClick={addProfile} style={{ width: '100%', padding: 13, background: THEMES.midnight.accent, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>+ Новый профиль</button>
      {store.profiles.map(p => (
        <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: (THEMES[p.design.theme]||THEMES.midnight).accent + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#fff', overflow: 'hidden', flexShrink: 0 }}>
            {p.profile.avatar ? <img src={p.profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.profile.name?.charAt(0)?.toUpperCase())}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.profile.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/{p.slug} • {p.blocks.length} ссылок</div>
          </div>
          <button onClick={() => { window.location.hash = `#/${p.slug}`; }} style={smallBtnS} title="Открыть">👁</button>
          <button onClick={() => dupProfile(p.slug)} style={smallBtnS} title="Копировать">📋</button>
          <button onClick={() => { setEditSlug(p.slug); setAdminView('edit'); setEditTab('blocks'); setEditingBlock(null); }} style={{ ...smallBtnS, background: 'rgba(108,92,231,0.3)' }}>✎</button>
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 16, paddingTop: 16 }}>
        <Inp label="Пароль админки" value={store.settings.adminPassword} onChange={v => setStore(p => ({ ...p, settings: { ...p.settings, adminPassword: v } }))} />
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <button onClick={exportAll} style={actS}>📥 Экспорт</button>
          <label style={{ ...actS, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📤 Импорт<input type="file" accept=".json" onChange={importAll} style={{ display: 'none' }} /></label>
        </div>
      </div>
    </div>
  );

  // ═══ ADMIN — Profile Editor ═══
  const AdminEdit = () => {
    if (!editProfile) return <div style={{ color: 'rgba(255,255,255,0.5)' }}>Профиль не найден</div>;
    const p = editProfile;
    const th = THEMES[p.design.theme] || THEMES.midnight;
    return (
      <div>
        <button onClick={() => { setAdminView('list'); setEditSlug(null); setEditingBlock(null); }} style={closeBtnS}>← Все профили</button>
        <h3 style={{ margin: '12px 0', fontSize: 16 }}>{p.profile.name}</h3>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {[['blocks','📋'],['profile','👤'],['design','🎨']].map(([id,ic]) => (
            <button key={id} onClick={() => { setEditTab(id); setEditingBlock(null); }} style={{
              padding: '10px 14px', background: editTab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none', borderBottom: editTab === id ? `2px solid ${th.accent}` : '2px solid transparent',
              color: editTab === id ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
            }}>{ic} {id === 'blocks' ? 'Ссылки' : id === 'profile' ? 'Профиль' : 'Дизайн'}</button>
          ))}
        </div>

        {/* BLOCKS */}
        {editTab === 'blocks' && !editingBlock && (
          <>
            <button onClick={() => addBlock(p.slug)} style={{ width: '100%', padding: 12, background: th.accent, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>+ Ссылка</button>
            {p.blocks.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 9, marginBottom: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <button onClick={() => moveBlock(p.slug, b.id, 'up')} style={arrS}>▲</button>
                  <button onClick={() => moveBlock(p.slug, b.id, 'down')} style={arrS}>▼</button>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: (ICONS[b.icon]||ICONS.link).c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }} dangerouslySetInnerHTML={{ __html: IC(b.icon, 14) }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                </div>
                <label style={{ cursor: 'pointer' }}>
                  <input type="checkbox" checked={b.visible} onChange={e => upBlock(p.slug, b.id, { visible: e.target.checked })} style={{ display: 'none' }} />
                  <div style={{ width: 32, height: 17, borderRadius: 9, background: b.visible ? th.accent : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'all .2s' }}>
                    <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: b.visible ? 17 : 2, transition: 'all .2s' }} />
                  </div>
                </label>
                <button onClick={() => setEditingBlock(b)} style={smallBtnS}>✎</button>
              </div>
            ))}
          </>
        )}

        {editTab === 'blocks' && editingBlock && (
          <div>
            <button onClick={() => setEditingBlock(null)} style={{ ...closeBtnS, marginBottom: 12 }}>← Назад</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Inp label="Название" value={editingBlock.title} onChange={v => { upBlock(p.slug, editingBlock.id, { title: v }); setEditingBlock({ ...editingBlock, title: v }); }} />
              <Inp label="URL" value={editingBlock.url} onChange={v => { upBlock(p.slug, editingBlock.id, { url: v }); setEditingBlock({ ...editingBlock, url: v }); }} />
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Иконка</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                  {Object.entries(ICONS).map(([k, ic]) => (
                    <button key={k} onClick={() => { upBlock(p.slug, editingBlock.id, { icon: k }); setEditingBlock({ ...editingBlock, icon: k }); }} style={{
                      padding: '6px 2px', borderRadius: 6, cursor: 'pointer', textAlign: 'center',
                      background: editingBlock.icon === k ? `${th.accent}33` : 'rgba(255,255,255,0.05)',
                      border: editingBlock.icon === k ? `2px solid ${th.accent}` : '2px solid transparent', fontFamily: 'inherit',
                    }}>
                      <div style={{ width: 20, height: 20, margin: '0 auto 2px', color: ic.c }} dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">${ic.s}</svg>` }} />
                      <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>{ic.l}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => delBlock(p.slug, editingBlock.id)} style={{ padding: 10, background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, color: '#ff6b6b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>🗑 Удалить</button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {editTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: th.card, border: `3px solid ${th.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', margin: '0 auto 10px', overflow: 'hidden' }}>
                {p.profile.avatar ? <img src={p.profile.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.profile.name?.charAt(0)?.toUpperCase())}
              </div>
              <label style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>📷 Фото<input type="file" accept="image/*" onChange={uploadFile(v => updateProfile(p.slug, 'profile.avatar', v))} style={{ display: 'none' }} /></label>
              {p.profile.avatar && <button onClick={() => updateProfile(p.slug, 'profile.avatar', '')} style={{ marginLeft: 6, background: 'rgba(255,0,0,0.2)', border: 'none', color: '#ff6b6b', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>✕</button>}
            </div>
            <Inp label="Slug (адрес)" value={p.slug} onChange={v => {
              const clean = v.toLowerCase().replace(/[^a-z0-9_-]/g, '');
              setStore(prev => ({ ...prev, profiles: prev.profiles.map(pr => pr.slug === p.slug ? { ...pr, slug: clean } : pr) }));
              setEditSlug(clean);
            }} />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: -8 }}>Адрес: сайт.com/#/{p.slug}</div>
            <Inp label="Имя" value={p.profile.name} onChange={v => updateProfile(p.slug, 'profile.name', v)} />
            <Inp label="Описание" value={p.profile.bio} onChange={v => updateProfile(p.slug, 'profile.bio', v)} multi />
            <button onClick={() => deleteProfile(p.slug)} style={{ marginTop: 10, padding: 10, background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, color: '#ff6b6b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>🗑 Удалить профиль</button>
          </div>
        )}

        {/* DESIGN */}
        {editTab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Тема</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
                {Object.entries(THEMES).map(([k, th2]) => (
                  <button key={k} onClick={() => updateProfile(p.slug, 'design.theme', k)} style={{ padding: 9, borderRadius: 8, border: p.design.theme === k ? `2px solid ${th2.accent}` : '2px solid rgba(255,255,255,0.1)', background: th2.bg, cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: th2.text }}>{th2.name}</div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: th2.accent, marginTop: 4 }} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Фон</div>
              <label style={{ display: 'block', padding: 11, background: 'rgba(255,255,255,0.05)', borderRadius: 10, textAlign: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.2)', fontSize: 12 }}>
                🖼 Загрузить фон<input type="file" accept="image/*" onChange={uploadFile(v => updateProfile(p.slug, 'design.customBg', v))} style={{ display: 'none' }} />
              </label>
              {p.design.customBg && <button onClick={() => updateProfile(p.slug, 'design.customBg', '')} style={{ marginTop: 6, width: '100%', background: 'rgba(255,0,0,0.15)', border: 'none', color: '#ff6b6b', padding: 7, borderRadius: 8, cursor: 'pointer', fontSize: 11 }}>Удалить фон</button>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'rgba(255,255,255,0.6)' }}>Карточки</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[['glass','Стекло'],['solid','Заливка'],['outline','Контур']].map(([k,lb]) => (
                  <button key={k} onClick={() => updateProfile(p.slug, 'design.cardStyle', k)} style={{ flex: 1, padding: 8, borderRadius: 8, fontFamily: 'inherit', background: p.design.cardStyle === k ? th.accent : 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}>{lb}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══ RENDER ═══
  const curTh = curProfile ? (THEMES[curProfile.design.theme] || THEMES.midnight) : THEMES.midnight;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased;font-family:'Outfit',sans-serif}
        .lc:hover{transform:translateY(-2px)!important;filter:brightness(1.1)}
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.lc{animation:fu .4s ease both}
        input:focus,textarea:focus{outline:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
      `}</style>

      {!curProfile && !admin ? (
        <>
          <HomePage />
          {!showLogin && <button onClick={() => setShowLogin(true)} style={fabS(THEMES.midnight.accent)} title="Админка">⚙</button>}
        </>
      ) : (
        <div style={{ minHeight: '100vh', background: curProfile?.design.customBg ? '#000' : curTh.bg, fontFamily: "'Outfit',sans-serif", position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {curProfile?.design.customBg && <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${curProfile.design.customBg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: `blur(${curProfile.design.bgBlur || 0}px)`, transform: 'scale(1.1)' }} />}
          {curProfile?.design.customBg && <div style={{ position: 'fixed', inset: 0, background: `rgba(0,0,0,${curProfile.design.bgOpacity || 0.5})` }} />}

          <div style={{ width: '100%', maxWidth: admin ? '100%' : 440, display: 'flex', position: 'relative', zIndex: 1 }}>
            {curProfile && <ProfilePage p={curProfile} />}
            {!curProfile && admin && <div style={{ flex: '0 0 440px', maxWidth: 440, padding: '60px 20px', color: '#fff' }}><h2>← Выбери профиль</h2><p style={{ marginTop: 10, color: 'rgba(255,255,255,0.5)' }}>Или создай новый в админке</p></div>}
            {admin && (
              <div style={{ flex: 1, background: '#0e0e1a', borderLeft: '1px solid rgba(255,255,255,0.08)', height: '100vh', overflowY: 'auto', position: 'sticky', top: 0, color: '#fff' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ fontSize: 16 }}>⚙️ Админка</b>
                  <button onClick={() => { setAdmin(false); setAdminView('list'); }} style={closeBtnS}>✕</button>
                </div>
                <div style={{ padding: 20 }}>
                  {adminView === 'list' ? <AdminList /> : <AdminEdit />}
                </div>
              </div>
            )}
          </div>

          {!admin && !showLogin && <button onClick={() => setShowLogin(true)} style={fabS(curTh.accent)} title="Админка">⚙</button>}
        </div>
      )}

      {/* LOGIN */}
      {showLogin && (
        <div onClick={e => { if (e.target === e.currentTarget) { setShowLogin(false); setPw(''); setPwErr(''); } }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#1a1a2e', padding: 28, borderRadius: 14, width: 300, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 17 }}>🔐 Админка</h3>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Пароль" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') doLogin(); }}
              style={{ width: '100%', padding: '11px 13px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'inherit', marginBottom: 10 }} />
            {pwErr && <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 8 }}>{pwErr}</div>}
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={doLogin} style={{ flex: 1, padding: 11, background: THEMES.midnight.accent, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Войти</button>
              <button type="button" onClick={() => { setShowLogin(false); setPw(''); setPwErr(''); }} style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: THEMES.midnight.accent, color: '#fff', padding: '9px 22px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 10000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{toast}</div>}
    </>
  );
}

const arrS = { background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 18, height: 14, borderRadius: 3, cursor: 'pointer', fontSize: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const closeBtnS = { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif" };
const actS = { flex: 1, padding: 9, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', textAlign: 'center', fontFamily: "'Outfit',sans-serif" };
const smallBtnS = { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11 };
const fabS = (accent) => ({ position: 'fixed', bottom: 20, right: 20, width: 46, height: 46, borderRadius: '50%', background: accent, border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', boxShadow: `0 4px 20px ${accent}66`, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' });
