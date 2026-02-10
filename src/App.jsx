import { useState, useRef } from "react";

/* ─── TEMPLATES ─── */
const TEMPLATES = {
  dark_glass: {
    name: "Тёмное стекло", preview: "🌑",
    bg: "radial-gradient(ellipse at 30% 0%, #1a1a2e 0%, #0a0a0f 50%, #0d0d1a 100%)",
    cardBg: "rgba(255,255,255,0.07)", cardBorder: "rgba(255,255,255,0.1)",
    cardHover: "rgba(255,255,255,0.13)", textColor: "#e8e8e8", nameColor: "#ffffff",
    accent: "#6c63ff", avatarBorder: "#ffffff", cardRadius: 14, cardBlur: 12,
  },
  neon_night: {
    name: "Неон", preview: "🟣",
    bg: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    cardBg: "rgba(130,80,255,0.1)", cardBorder: "rgba(130,80,255,0.3)",
    cardHover: "rgba(130,80,255,0.2)", textColor: "#d4c6ff", nameColor: "#ffffff",
    accent: "#a855f7", avatarBorder: "#a855f7", cardRadius: 14, cardBlur: 8,
  },
  ocean_mist: {
    name: "Океан", preview: "🌊",
    bg: "linear-gradient(170deg, #0c1b33 0%, #0d2b45 40%, #1a3a5c 100%)",
    cardBg: "rgba(56,189,248,0.08)", cardBorder: "rgba(56,189,248,0.15)",
    cardHover: "rgba(56,189,248,0.18)", textColor: "#b8d8e8", nameColor: "#e0f2fe",
    accent: "#38bdf8", avatarBorder: "#38bdf8", cardRadius: 14, cardBlur: 10,
  },
  warm_sunset: {
    name: "Закат", preview: "🌅",
    bg: "linear-gradient(160deg, #1a0a00 0%, #2d1810 40%, #1a0f0a 100%)",
    cardBg: "rgba(251,146,60,0.08)", cardBorder: "rgba(251,146,60,0.2)",
    cardHover: "rgba(251,146,60,0.15)", textColor: "#fcd9b8", nameColor: "#fff1e0",
    accent: "#fb923c", avatarBorder: "#fb923c", cardRadius: 14, cardBlur: 10,
  },
  minimal_light: {
    name: "Светлый", preview: "☀️",
    bg: "linear-gradient(180deg, #f8f6f3 0%, #ece8e1 100%)",
    cardBg: "rgba(0,0,0,0.04)", cardBorder: "rgba(0,0,0,0.08)",
    cardHover: "rgba(0,0,0,0.08)", textColor: "#3d3d3d", nameColor: "#1a1a1a",
    accent: "#1a1a1a", avatarBorder: "#1a1a1a", cardRadius: 14, cardBlur: 0,
  },
  forest: {
    name: "Лес", preview: "🌲",
    bg: "linear-gradient(170deg, #0a1a0a 0%, #0f2a15 40%, #1a3320 100%)",
    cardBg: "rgba(74,222,128,0.07)", cardBorder: "rgba(74,222,128,0.15)",
    cardHover: "rgba(74,222,128,0.15)", textColor: "#b8e8c8", nameColor: "#d4f5dc",
    accent: "#4ade80", avatarBorder: "#4ade80", cardRadius: 14, cardBlur: 10,
  },
};

/* ─── SOCIAL ICONS (SVG) ─── */
const SOCIAL_ICONS = {
  vk: { label: "VK", color: "#0077FF", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M21.547 7c-.065-.098-.2-.148-.4-.148h-2.67c-.247 0-.382.098-.406.295-.024.049-.122.344-.295.886-.172.541-.369 1.05-.59 1.525-.222.476-.44.873-.656 1.191-.215.32-.382.512-.5.578-.118.065-.207.05-.267-.042-.06-.094-.09-.296-.09-.607V8.066c0-.296-.025-.497-.074-.607-.05-.109-.172-.214-.368-.312-.148-.074-.369-.123-.664-.148a5.63 5.63 0 0 0-.859-.037c-.615 0-1.058.008-1.33.025-.271.016-.468.074-.59.172-.172.148-.123.222.148.222.271 0 .468.074.59.222.074.098.123.32.148.664.05.689.05 1.181 0 1.476-.024.148-.073.222-.148.222-.05 0-.147-.057-.295-.172-.148-.115-.32-.295-.517-.541-.197-.246-.398-.557-.603-.934-.206-.377-.403-.82-.591-1.33l-.222-.59c-.074-.196-.172-.303-.295-.32H7.023c-.295 0-.443.148-.443.443 0 .05.008.098.025.148.41 1.033.852 1.992 1.328 2.879.476.886.87 1.525 1.181 1.918.312.393.59.664.836.812.246.148.419.24.517.271.098.033.172.05.222.05h.074c.197 0 .345-.075.443-.223.098-.147.148-.418.148-.812v-1.624c0-.295-.05-.505-.148-.627-.1-.123-.246-.172-.443-.148-.098 0-.148-.05-.148-.148 0-.148.098-.246.295-.295.197-.05.517-.074.96-.074.394 0 .713.017.96.05.245.033.418.098.516.197.098.098.16.222.185.37.025.148.037.345.037.59v1.772c0 .197.042.345.123.443.082.098.168.148.258.148.09 0 .205-.05.345-.148.14-.098.32-.279.54-.541.37-.443.714-.974 1.034-1.59.32-.616.603-1.28.848-1.993.05-.148.115-.258.197-.332.082-.074.197-.111.345-.111z"/></svg> },
  telegram: { label: "Telegram", color: "#2AABEE", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
  yandex_music: { label: "Яндекс Музыка", color: "#FFCC00", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg> },
  instagram: { label: "Instagram", color: "#E4405F", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z"/></svg> },
  youtube: { label: "YouTube", color: "#FF0000", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  tiktok: { label: "TikTok", color: "#000000", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
  spotify: { label: "Spotify", color: "#1DB954", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  twitter: { label: "X (Twitter)", color: "#000000", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  github: { label: "GitHub", color: "#333333", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  whatsapp: { label: "WhatsApp", color: "#25D366", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  website: { label: "Сайт", color: "#8b5cf6", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
  custom: { label: "Другое", color: "#666666", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg> },
};

const DEFAULT_LINKS = [
  { id: "1", platform: "vk", url: "https://vk.com", label: "VK", customIcon: null, iconBgColor: null },
  { id: "2", platform: "telegram", url: "https://t.me", label: "Telegram", customIcon: null, iconBgColor: null },
  { id: "3", platform: "yandex_music", url: "https://music.yandex.ru", label: "Яндекс Музыка", customIcon: null, iconBgColor: null },
  { id: "4", platform: "instagram", url: "https://instagram.com", label: "Instagram", customIcon: null, iconBgColor: null },
  { id: "5", platform: "youtube", url: "https://youtube.com", label: "YouTube", customIcon: null, iconBgColor: null },
  { id: "6", platform: "tiktok", url: "https://tiktok.com", label: "TikTok", customIcon: null, iconBgColor: null },
];

/* ─── FILE UPLOAD HELPER ─── */
function useFileUpload(onLoad) {
  const ref = useRef(null);
  const trigger = () => ref.current?.click();
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onLoad(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const input = <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={onChange} />;
  return { trigger, input };
}

/* ─── SMALL ICONS ─── */
const PenIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const UpIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;
const DownIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ImageIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>;
const XIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PaletteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const CameraIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;

/* ─── RANGE SLIDER ─── */
function Slider({ label, value, min, max, step = 1, onChange, unit = "", accent }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, opacity: 0.6 }}>
        <span>{label}</span><span>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: accent, height: 4 }} />
    </div>
  );
}

/* ─── COLOR PICKER ROW ─── */
function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 12, opacity: 0.6, minWidth: 100 }}>{label}</span>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 32, height: 24, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }} />
      <span style={{ fontSize: 11, opacity: 0.4, fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

/* ─── ACCORDION SECTION ─── */
function Section({ title, icon, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
        background: "rgba(128,128,128,0.06)", border: "1px solid rgba(128,128,128,0.1)",
        borderRadius: open ? "10px 10px 0 0" : 10, cursor: "pointer",
        color: "inherit", fontFamily: "inherit", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
      }}>
        {icon} {title}
        <span style={{ marginLeft: "auto", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <DownIcon />
        </span>
      </button>
      {open && (
        <div style={{
          padding: 14, border: "1px solid rgba(128,128,128,0.1)", borderTop: "none",
          borderRadius: "0 0 10px 10px", background: "rgba(128,128,128,0.03)",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function LinkPage() {
  const [mode, setMode] = useState("preview");
  const [profileName, setProfileName] = useState("Глеб Картер");
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [templateKey, setTemplateKey] = useState("dark_glass");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(0.6);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgScale, setBgScale] = useState(100);

  /* design overrides */
  const [customCardBg, setCustomCardBg] = useState(null);
  const [customCardBorder, setCustomCardBorder] = useState(null);
  const [customTextColor, setCustomTextColor] = useState(null);
  const [customNameColor, setCustomNameColor] = useState(null);
  const [customAccent, setCustomAccent] = useState(null);
  const [cardRadius, setCardRadius] = useState(14);
  const [cardPaddingV, setCardPaddingV] = useState(14);
  const [cardPaddingH, setCardPaddingH] = useState(18);
  const [cardGap, setCardGap] = useState(12);
  const [iconRadius, setIconRadius] = useState(10);
  const [iconSize, setIconSize] = useState(40);
  const [nameFontSize, setNameFontSize] = useState(22);
  const [avatarSize, setAvatarSize] = useState(96);
  const [bgGradientColor1, setBgGradientColor1] = useState("#0a0a0f");
  const [bgGradientColor2, setBgGradientColor2] = useState("#1a1a2e");
  const [useCustomBgGradient, setUseCustomBgGradient] = useState(false);

  /* editor state */
  const [addingLink, setAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [newPlatform, setNewPlatform] = useState("telegram");
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [openSections, setOpenSections] = useState({ templates: true, profile: false, design: false, links: false });
  const [animKey, setAnimKey] = useState(0);

  const tBase = TEMPLATES[templateKey];
  const t = {
    ...tBase,
    cardBg: customCardBg || tBase.cardBg,
    cardBorder: customCardBorder || tBase.cardBorder,
    textColor: customTextColor || tBase.textColor,
    nameColor: customNameColor || tBase.nameColor,
    accent: customAccent || tBase.accent,
    cardRadius,
  };
  const isLight = templateKey === "minimal_light";

  const resetCustomColors = () => {
    setCustomCardBg(null); setCustomCardBorder(null); setCustomTextColor(null);
    setCustomNameColor(null); setCustomAccent(null);
  };

  const toggleSection = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));

  /* file uploads */
  const avatarUpload = useFileUpload(setAvatarUrl);
  const bgUpload = useFileUpload(setBgImageUrl);
  const iconUploadRef = useRef(null);
  const [iconUploadTarget, setIconUploadTarget] = useState(null);

  const handleIconFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !iconUploadTarget) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLinks(prev => prev.map(l => l.id === iconUploadTarget ? { ...l, customIcon: ev.target.result } : l));
      setIconUploadTarget(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const triggerIconUpload = (linkId) => {
    setIconUploadTarget(linkId);
    setTimeout(() => iconUploadRef.current?.click(), 50);
  };

  const removeCustomIcon = (linkId) => {
    setLinks(prev => prev.map(l => l.id === linkId ? { ...l, customIcon: null } : l));
  };

  /* link CRUD */
  const addLink = () => {
    if (!newUrl) return;
    const label = newLabel || SOCIAL_ICONS[newPlatform]?.label || "Ссылка";
    setLinks(p => [...p, { id: Date.now().toString(), platform: newPlatform, url: newUrl, label, customIcon: null, iconBgColor: null }]);
    setNewUrl(""); setNewLabel(""); setAddingLink(false);
  };
  const removeLink = (id) => setLinks(p => p.filter(l => l.id !== id));
  const moveLink = (id, dir) => {
    const idx = links.findIndex(l => l.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === links.length - 1)) return;
    const n = [...links]; [n[idx], n[idx + dir]] = [n[idx + dir], n[idx]]; setLinks(n);
  };
  const updateLink = (id, field, value) => setLinks(p => p.map(l => l.id === id ? { ...l, [field]: value } : l));

  const applyTemplate = (key) => {
    setTemplateKey(key); resetCustomColors();
    setCardRadius(TEMPLATES[key].cardRadius);
    setAnimKey(k => k + 1);
  };

  const bgStyle = bgImageUrl
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: `${bgScale}%`, backgroundPosition: "center", backgroundRepeat: "no-repeat" }
    : {};
  const bgGradient = useCustomBgGradient
    ? `linear-gradient(160deg, ${bgGradientColor1} 0%, ${bgGradientColor2} 100%)`
    : t.bg;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: rgba(128,128,128,0.2); border-radius: 4px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${t.accent}; cursor: pointer; }
        input[type="color"] { -webkit-appearance: none; padding: 0; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 6px; }
      `}</style>
      {avatarUpload.input}
      {bgUpload.input}
      <input ref={iconUploadRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconFile} />

      <div style={{
        minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: t.textColor,
        position: "relative", overflow: "hidden",
        background: bgImageUrl ? "#000" : bgGradient,
      }}>
        {/* BG IMAGE LAYER */}
        {bgImageUrl && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 0,
            ...bgStyle,
            filter: `blur(${bgBlur}px)`,
            transform: bgScale > 100 ? `scale(${bgScale / 100})` : undefined,
            backgroundSize: bgScale <= 100 ? `${bgScale}%` : "cover",
          }} />
        )}
        {/* BG OVERLAY */}
        {bgImageUrl && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 0,
            background: `rgba(0,0,0,${bgOverlayOpacity})`,
          }} />
        )}

        {/* MODE TOGGLE */}
        <div style={{
          position: "fixed", top: 12, right: 12, zIndex: 100, display: "flex", gap: 3,
          background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderRadius: 10, padding: 3, border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
        }}>
          {[["preview", <EyeIcon key="e" />, "Просмотр"], ["edit", <PenIcon key="p" />, "Редактор"]].map(([m, ico, lbl]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 12px",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500,
              fontFamily: "inherit", color: mode === m ? t.nameColor : t.textColor,
              background: mode === m ? (isLight ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.11)") : "transparent",
              transition: "all 0.2s",
            }}>{ico} {lbl}</button>
          ))}
        </div>

        {/* ─── PAGE CONTENT ─── */}
        <div style={{
          position: "relative", zIndex: 1, maxWidth: 440, margin: "0 auto",
          padding: `48px 20px ${mode === "edit" ? "56vh" : "40px"}`,
          minHeight: "100vh",
        }}>
          {/* AVATAR */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div
              onClick={mode === "edit" ? avatarUpload.trigger : undefined}
              style={{
                width: avatarSize, height: avatarSize, borderRadius: "50%",
                border: `3px solid ${t.avatarBorder}`, background: "rgba(128,128,128,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", cursor: mode === "edit" ? "pointer" : "default",
                transition: "transform 0.3s", position: "relative",
                fontSize: avatarSize * 0.38, color: t.nameColor,
              }}
              onMouseEnter={e => { if (mode === "edit") e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                profileName ? profileName.charAt(0).toUpperCase() : "?"
              )}
              {mode === "edit" && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s", borderRadius: "50%",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <CameraIcon />
                </div>
              )}
            </div>
          </div>

          {/* NAME */}
          <div style={{
            textAlign: "center", fontSize: nameFontSize, fontWeight: 600,
            color: t.nameColor, marginBottom: bio ? 4 : 24, letterSpacing: "-0.01em",
          }}>{profileName || "Имя"}</div>
          {bio && <div style={{ textAlign: "center", fontSize: 14, opacity: 0.65, marginBottom: 26, lineHeight: 1.5 }}>{bio}</div>}

          {/* LINKS */}
          <div key={animKey} style={{ display: "flex", flexDirection: "column", gap: cardGap }}>
            {links.map((link, i) => {
              const social = SOCIAL_ICONS[link.platform];
              const bgColor = link.iconBgColor || social?.color || "#666";
              return (
                <a key={link.id} href={mode === "preview" ? link.url : undefined}
                  target={mode === "preview" ? "_blank" : undefined} rel="noopener noreferrer"
                  onClick={e => { if (mode === "edit") { e.preventDefault(); setEditingLink(link.id); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: `${cardPaddingV}px ${cardPaddingH}px`,
                    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                    borderRadius: t.cardRadius, cursor: mode === "edit" ? "default" : "pointer",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    textDecoration: "none", color: "inherit",
                    backdropFilter: `blur(${tBase.cardBlur}px)`, WebkitBackdropFilter: `blur(${tBase.cardBlur}px)`,
                    opacity: 0, transform: "translateY(16px)",
                    animation: `cardIn 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s forwards`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.cardHover; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.cardBg; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    width: iconSize, height: iconSize, borderRadius: iconRadius,
                    background: bgColor, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, overflow: "hidden", color: "#fff",
                  }}>
                    {link.customIcon ? (
                      <img src={link.customIcon} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      social?.icon || <span style={{ fontSize: 16 }}>🔗</span>
                    )}
                  </div>
                  <div style={{ flex: 1, fontSize: 15, fontWeight: 500, textAlign: "center", paddingRight: iconSize }}>{link.label}</div>
                </a>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 40, fontSize: 11, opacity: 0.2 }}>Сделано с ❤️</div>
        </div>

        {/* ─── EDITOR PANEL ─── */}
        {mode === "edit" && (
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
            background: isLight ? "rgba(248,246,243,0.97)" : "rgba(12,12,20,0.97)",
            backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
            borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"}`,
            maxHeight: "55vh", overflowY: "auto", borderRadius: "18px 18px 0 0",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
          }}>
            <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 24px" }}>
              <div style={{ width: 32, height: 4, background: "rgba(128,128,128,0.2)", borderRadius: 2, margin: "0 auto 14px" }} />

              {/* SECTION: TEMPLATES */}
              <Section title="Шаблоны" icon={<PaletteIcon />} open={openSections.templates} onToggle={() => toggleSection("templates")}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                    <button key={key} onClick={() => applyTemplate(key)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                      padding: "9px 4px", background: templateKey === key ? (isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)") : "transparent",
                      border: `2px solid ${templateKey === key ? t.accent : "transparent"}`,
                      borderRadius: 10, cursor: "pointer", fontSize: 11, fontFamily: "inherit", color: "inherit", transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 20 }}>{tmpl.preview}</span>
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </Section>

              {/* SECTION: PROFILE */}
              <Section title="Профиль" icon={<CameraIcon />} open={openSections.profile} onToggle={() => toggleSection("profile")}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
                  <div onClick={avatarUpload.trigger} style={{
                    width: 56, height: 56, borderRadius: "50%", border: `2px solid ${t.accent}`,
                    overflow: "hidden", cursor: "pointer", flexShrink: 0, background: "rgba(128,128,128,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                  }}>
                    {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <CameraIcon />}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={avatarUpload.trigger} className="ed-btn">Загрузить аватар</button>
                    {avatarUrl && <button onClick={() => setAvatarUrl(null)} className="ed-btn-danger">Удалить аватар</button>}
                  </div>
                </div>
                <input className="ed-input" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Имя" />
                <input className="ed-input" value={bio} onChange={e => setBio(e.target.value)} placeholder="Описание" style={{ marginTop: 6 }} />
                <Slider label="Размер аватара" value={avatarSize} min={48} max={140} onChange={setAvatarSize} unit="px" accent={t.accent} />
                <Slider label="Размер имени" value={nameFontSize} min={14} max={36} onChange={setNameFontSize} unit="px" accent={t.accent} />
              </Section>

              {/* SECTION: DESIGN */}
              <Section title="Дизайн и фон" icon={<ImageIcon />} open={openSections.design} onToggle={() => toggleSection("design")}>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Фоновое изображение</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <button onClick={bgUpload.trigger} className="ed-btn" style={{ flex: 1 }}><ImageIcon /> Загрузить фон</button>
                  {bgImageUrl && <button onClick={() => setBgImageUrl(null)} className="ed-btn-danger">✕</button>}
                </div>
                {bgImageUrl && (
                  <>
                    <Slider label="Затемнение" value={bgOverlayOpacity} min={0} max={1} step={0.05} onChange={setBgOverlayOpacity} accent={t.accent} />
                    <Slider label="Размытие фона" value={bgBlur} min={0} max={30} onChange={setBgBlur} unit="px" accent={t.accent} />
                    <Slider label="Масштаб фона" value={bgScale} min={50} max={200} onChange={setBgScale} unit="%" accent={t.accent} />
                  </>
                )}
                {!bgImageUrl && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <input type="checkbox" checked={useCustomBgGradient} onChange={e => setUseCustomBgGradient(e.target.checked)} style={{ accentColor: t.accent }} />
                      <span style={{ fontSize: 12 }}>Свой градиент фона</span>
                    </div>
                    {useCustomBgGradient && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <ColorRow label="Цвет 1" value={bgGradientColor1} onChange={setBgGradientColor1} />
                        <ColorRow label="Цвет 2" value={bgGradientColor2} onChange={setBgGradientColor2} />
                      </div>
                    )}
                  </>
                )}

                <div style={{ height: 1, background: "rgba(128,128,128,0.12)", margin: "12px 0" }} />

                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Цвета</div>
                <ColorRow label="Текст" value={customTextColor || tBase.textColor} onChange={setCustomTextColor} />
                <ColorRow label="Имя" value={customNameColor || tBase.nameColor} onChange={setCustomNameColor} />
                <ColorRow label="Акцент" value={customAccent || tBase.accent} onChange={setCustomAccent} />
                <ColorRow label="Карточки" value={customCardBg || (isLight ? "#f0f0f0" : "#1a1a2e")} onChange={v => setCustomCardBg(`${v}18`)} />
                <ColorRow label="Обводка" value={customCardBorder || (isLight ? "#dddddd" : "#333355")} onChange={v => setCustomCardBorder(`${v}40`)} />
                <button onClick={resetCustomColors} className="ed-btn" style={{ marginTop: 4, fontSize: 11 }}>Сбросить цвета к шаблону</button>

                <div style={{ height: 1, background: "rgba(128,128,128,0.12)", margin: "12px 0" }} />

                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Карточки</div>
                <Slider label="Скругление карточек" value={cardRadius} min={0} max={28} onChange={setCardRadius} unit="px" accent={t.accent} />
                <Slider label="Вертикальный отступ" value={cardPaddingV} min={6} max={24} onChange={setCardPaddingV} unit="px" accent={t.accent} />
                <Slider label="Горизонтальный отступ" value={cardPaddingH} min={8} max={30} onChange={setCardPaddingH} unit="px" accent={t.accent} />
                <Slider label="Расстояние между" value={cardGap} min={4} max={24} onChange={setCardGap} unit="px" accent={t.accent} />

                <div style={{ height: 1, background: "rgba(128,128,128,0.12)", margin: "12px 0" }} />

                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Иконки</div>
                <Slider label="Размер иконок" value={iconSize} min={24} max={56} onChange={setIconSize} unit="px" accent={t.accent} />
                <Slider label="Скругление иконок" value={iconRadius} min={0} max={28} onChange={setIconRadius} unit="px" accent={t.accent} />
              </Section>

              {/* SECTION: LINKS */}
              <Section title={`Ссылки (${links.length})`} icon={<PlusIcon />} open={openSections.links} onToggle={() => toggleSection("links")}>
                {links.map(link => {
                  const social = SOCIAL_ICONS[link.platform];
                  return (
                    <div key={link.id} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "8px 10px",
                      background: "rgba(128,128,128,0.04)", borderRadius: 8, marginBottom: 5,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: Math.min(iconRadius, 8), overflow: "hidden",
                        background: link.iconBgColor || social?.color || "#666",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff",
                      }}>
                        {link.customIcon
                          ? <img src={link.customIcon} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ transform: "scale(0.65)", display: "flex" }}>{social?.icon}</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.label}</div>
                        <div style={{ fontSize: 10, opacity: 0.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</div>
                      </div>
                      <button className="ed-icon-btn" onClick={() => moveLink(link.id, -1)}><UpIcon /></button>
                      <button className="ed-icon-btn" onClick={() => moveLink(link.id, 1)}><DownIcon /></button>
                      <button className="ed-icon-btn" onClick={() => setEditingLink(link.id)}><PenIcon /></button>
                      <button className="ed-icon-btn danger" onClick={() => removeLink(link.id)}><TrashIcon /></button>
                    </div>
                  );
                })}

                {!addingLink ? (
                  <button onClick={() => setAddingLink(true)} style={{
                    width: "100%", padding: 10, marginTop: 4,
                    background: "transparent", border: `2px dashed rgba(128,128,128,0.2)`,
                    borderRadius: 10, cursor: "pointer", color: "inherit", fontFamily: "inherit",
                    fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}><PlusIcon /> Добавить ссылку</button>
                ) : (
                  <div style={{ padding: 12, background: "rgba(128,128,128,0.04)", borderRadius: 10, marginTop: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                    <select className="ed-input" value={newPlatform} onChange={e => { setNewPlatform(e.target.value); setNewLabel(SOCIAL_ICONS[e.target.value]?.label || ""); }} style={{ appearance: "none" }}>
                      {Object.entries(SOCIAL_ICONS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                    </select>
                    <input className="ed-input" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Название кнопки" />
                    <input className="ed-input" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setAddingLink(false)} className="ed-btn" style={{ flex: 1 }}>Отмена</button>
                      <button onClick={addLink} className="ed-btn-primary" style={{ flex: 1 }}>Добавить</button>
                    </div>
                  </div>
                )}
              </Section>
            </div>
          </div>
        )}

        {/* ─── EDIT LINK MODAL ─── */}
        {editingLink && (() => {
          const link = links.find(l => l.id === editingLink);
          if (!link) return null;
          const social = SOCIAL_ICONS[link.platform];
          return (
            <div onClick={() => setEditingLink(null)} style={{
              position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            }}>
              <div onClick={e => e.stopPropagation()} style={{
                background: isLight ? "#fff" : "#151520", borderRadius: 16, padding: 22, width: "90%", maxWidth: 380,
                display: "flex", flexDirection: "column", gap: 10,
                border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
                maxHeight: "80vh", overflowY: "auto",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.nameColor }}>Редактировать</span>
                  <button onClick={() => setEditingLink(null)} className="ed-icon-btn"><XIcon /></button>
                </div>

                {/* Icon preview & upload */}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: iconRadius, overflow: "hidden",
                    background: link.iconBgColor || social?.color || "#666",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    cursor: "pointer", position: "relative", color: "#fff",
                  }} onClick={() => triggerIconUpload(link.id)}>
                    {link.customIcon
                      ? <img src={link.customIcon} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : social?.icon || <span>🔗</span>
                    }
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.15s", borderRadius: iconRadius,
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    ><ImageIcon /></div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={() => triggerIconUpload(link.id)} className="ed-btn" style={{ fontSize: 11 }}>
                      <ImageIcon /> Своя иконка
                    </button>
                    {link.customIcon && (
                      <button onClick={() => removeCustomIcon(link.id)} className="ed-btn-danger" style={{ fontSize: 11 }}>Убрать свою иконку</button>
                    )}
                  </div>
                </div>

                {/* Icon BG color */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>Цвет фона иконки</span>
                  <input type="color" value={link.iconBgColor || social?.color || "#666666"}
                    onChange={e => updateLink(link.id, "iconBgColor", e.target.value)}
                    style={{ width: 28, height: 22, border: "none", borderRadius: 4, cursor: "pointer", background: "transparent" }} />
                  {link.iconBgColor && (
                    <button onClick={() => updateLink(link.id, "iconBgColor", null)} style={{
                      background: "transparent", border: "none", cursor: "pointer", color: t.textColor, opacity: 0.4, fontSize: 11, fontFamily: "inherit",
                    }}>сброс</button>
                  )}
                </div>

                <select className="ed-input" value={link.platform} onChange={e => updateLink(link.id, "platform", e.target.value)} style={{ appearance: "none" }}>
                  {Object.entries(SOCIAL_ICONS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
                <input className="ed-input" value={link.label} onChange={e => updateLink(link.id, "label", e.target.value)} placeholder="Название" />
                <input className="ed-input" value={link.url} onChange={e => updateLink(link.id, "url", e.target.value)} placeholder="URL" />

                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <button onClick={() => setEditingLink(null)} className="ed-btn-primary" style={{ flex: 1 }}>Готово</button>
                  <button onClick={() => { removeLink(link.id); setEditingLink(null); }}
                    style={{
                      padding: "10px 16px", background: "rgba(239,68,68,0.12)", color: "#ef4444",
                      border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    }}>Удалить</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─── GLOBAL EDITOR STYLES ─── */}
      <style>{`
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .ed-input {
          width: 100%; padding: 9px 12px;
          background: ${isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)"};
          border: 1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"};
          border-radius: 9px; color: ${t.textColor}; font-size: 13px; font-family: inherit; outline: none;
          transition: border-color 0.2s;
        }
        .ed-input:focus { border-color: ${t.accent}; }
        .ed-input::placeholder { opacity: 0.3; }
        .ed-btn {
          display: flex; align-items: center; justify-content: center; gap: 5;
          padding: 8px 12px;
          background: ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)"};
          border: 1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"};
          border-radius: 8px; color: ${t.textColor}; font-size: 12px; font-weight: 500;
          font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .ed-btn:hover { background: ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}; }
        .ed-btn-primary {
          padding: 10px 16px; background: ${t.accent};
          color: ${isLight || t.accent === "#FFCC00" ? "#000" : "#fff"};
          border: none; border-radius: 10px; cursor: pointer; font-family: inherit;
          font-size: 13px; font-weight: 600; transition: all 0.15s;
        }
        .ed-btn-primary:hover { opacity: 0.85; }
        .ed-btn-danger {
          display: flex; align-items: center; justify-content: center; gap: 5;
          padding: 7px 10px; background: rgba(239,68,68,0.08); color: #ef4444;
          border: 1px solid rgba(239,68,68,0.15); border-radius: 8px;
          font-size: 11px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .ed-btn-danger:hover { background: rgba(239,68,68,0.15); }
        .ed-icon-btn {
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; border-radius: 6px; cursor: pointer;
          color: ${t.textColor}; opacity: 0.4; transition: all 0.12s; flex-shrink: 0;
        }
        .ed-icon-btn:hover { opacity: 1; background: ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.07)"}; }
        .ed-icon-btn.danger:hover { color: #ef4444; }
      `}</style>
    </>
  );
}
