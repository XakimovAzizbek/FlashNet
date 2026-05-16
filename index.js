// ============================================================
//  FlashNet — index.js
//  Siz qo'shgan Malibu 2 va boshqa kontentlar saqlab qolindi.
// ============================================================

const ITEMS = [
  // ───── MUSIQA ─────
  {
    id: "m1", type: "music",
    name: "Shaxriyor - Qalbim",
    author: "Shaxriyor",
    cover: "",
    link: "https://example.com/shaxriyor-qalbim.mp3"
  },
  {
    id: "m2", type: "music",
    name: "Ulug'bek Rahmatullayev - Sensiz",
    author: "Ulug'bek Rahmatullayev",
    cover: "",
    link: "https://example.com/sensiz.mp3"
  },
  {
    id: "m3", type: "music",
    name: "Jasur Umirov - Yolg'iz",
    author: "Jasur Umirov",
    cover: "",
    link: "https://example.com/yolgiz.mp3"
  },

  // ───── VIDEO ─────
  {
    id: "v1", type: "video",
    name: "Malibu 2 video",
    author: "mp4",
    cover: "",
    link: "https://github.com/XakimovAzizbek/FlashNet/releases/download/2/VID_20260225_121955_224.mp4"
  },
  {
    id: "v2", type: "video",
    name: "SEX VIDEO",
    author: "mp4",
    cover: "",
    link: "https://github.com/XakimovAzizbek/FlashNet/releases/download/3/16968.mp4"
  },

  // ───── ILOVALAR ─────
  {
    id: "a1", type: "app",
    name: "Top follow",
    author: "apk",
    cover: "",
    link: "https://github.com/XakimovAzizbek/FlashNet/releases/download/v1.0.0/TopFollow_v837_Release.apk"
  },
  {
    id: "a2", type: "app",
    name: "VLC Media Player",
    author: "VideoLAN",
    cover: "",
    link: "https://www.videolan.org/vlc/"
  },
  {
    id: "a3", type: "app",
    name: "WhatsApp",
    author: "Meta",
    cover: "",
    link: "https://www.whatsapp.com/download"
  },

  // ───── BOSHQA ─────
  {
    id: "o1", type: "other",
    name: "Ubuntu 24.04 LTS",
    author: "Canonical",
    cover: "",
    link: "https://ubuntu.com/download"
  },
];

// ─── TARJIMA MA'LUMOTLARI (LOKALIZATSIYA) ───
const LANG_DATA = {
  uz: {
    heroTitle: "Hamma narsa<br/><span>bir joyda</span>",
    heroSub: "Musiqa, video, ilova — toping va yuklab oling",
    searchPlaceholder: "Nimani qidirmoqchisiz?...",
    searchBtn: "Qidirish",
    pillAll: "Hammasi",
    pillMusic: "🎵 Musiqa",
    pillVideo: "🎬 Video",
    pillApp: "📱 Ilova",
    pillOther: "📄 Boshqa",
    initialTitle: "Nimani qidirmoqchisiz?",
    emptyStateInitial: "Musiqa, video, apk va boshqa kontentlarni topish uchun qidiruv maydoniga matn kiriting, kategoriyani tanlang va Qidirish tugmasini bosing.",
    emptyStateNotFound: "Hech narsa topilmadi.",
    toastNoText: "⚠️ Iltimos, qidirish uchun matn kiriting!",
    toastNoLink: "❌ Link topilmadi!",
    toastLoading: "⏳ Yuklanmoqda...",
    toastSuccess: "✅ Yuklab olindi!",
    toastFallback: "⬇ Brauzerda yuklanmoqda...",
    btnListen: "▶ Tinglash",
    btnWatch: "▶ Ko'rish",
    btnDlShort: "⬇ Yukish",
    btnDlFull: "⬇ Yuklab olish",
    catAll: "Barcha kontentlar",
    catMusic: "Musiqa",
    catVideo: "Video",
    catApp: "Ilova",
    catOther: "Boshqa",
    resultsText: "ta natija"
  },
  ru: {
    heroTitle: "Всё в<br/><span>одном месте</span>",
    heroSub: "Музыка, видео, приложения — находите и скачивайте",
    searchPlaceholder: "Что вы ищете?...",
    searchBtn: "Поиск",
    pillAll: "Все",
    pillMusic: "🎵 Музыка",
    pillVideo: "🎬 Видео",
    pillApp: "📱 Прил.",
    pillOther: "📄 Другое",
    initialTitle: "Что вы хотите найти?",
    emptyStateInitial: "Чтобы найти музыку, видео, apk и другой контент, введите текст в поле поиска, выберите категорию и нажмите кнопку Поиск.",
    emptyStateNotFound: "Ничего не найдено.",
    toastNoText: "⚠️ Пожалуйста, введите текст для поиска!",
    toastNoLink: "❌ Ссылка не найдена!",
    toastLoading: "⏳ Скачивание...",
    toastSuccess: "✅ Успешно скачано!",
    toastFallback: "⬇ Скачивание в браузере...",
    btnListen: "▶ Слушать",
    btnWatch: "▶ Смотреть",
    btnDlShort: "⬇ Скачать",
    btnDlFull: "⬇ Скачать файл",
    catAll: "Весь контент",
    catMusic: "Музыка",
    catVideo: "Видео",
    catApp: "Приложения",
    catOther: "Другое",
    resultsText: "результатов"
  }
};

const TYPE_CONFIG = {
  music: { labelKey: "catMusic", icon: "🎵", color: "#f0d45a" },
  video: { labelKey: "catVideo", icon: "🎬", color: "#e07aff" },
  app:   { labelKey: "catApp",   icon: "📱", color: "#5af0c8" },
  other: { labelKey: "catOther", icon: "📄", color: "#7abaff" },
};

let currentLang    = "uz"; // Boshlang'ich til o'zbekcha
let activeCategory = "all";
let activeQuery    = "";
let isSearched     = false;

const tg = window.Telegram?.WebApp || null;
const isTelegram = !!tg && !!tg.initData;

function tgOpenLink(url) {
  if (isTelegram) {
    tg.openLink(url, { try_instant_view: false });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ─── INTERFEYS TILINI YANGILASH ───
function updateInterfaceLanguage() {
  const lang = LANG_DATA[currentLang];
  
  document.getElementById("hero-title").innerHTML = lang.heroTitle;
  document.getElementById("hero-sub").textContent = lang.heroSub;
  document.getElementById("search-input").placeholder = lang.searchPlaceholder;
  document.getElementById("search-btn").textContent = lang.searchBtn;
  document.getElementById("pill-all").textContent = lang.pillAll;
  document.getElementById("pill-music").textContent = lang.pillMusic;
  document.getElementById("pill-video").textContent = lang.pillVideo;
  document.getElementById("pill-app").textContent = lang.pillApp;
  document.getElementById("pill-other").textContent = lang.pillOther;
  
  refresh();
}

async function downloadItem(item) {
  const lang = LANG_DATA[currentLang];
  if (!item.link) { showToast(lang.toastNoLink); return; }
  showToast(lang.toastLoading);

  try {
    const response = await fetch(item.link, { mode: "cors" });
    if (!response.ok) throw new Error("fetch failed");

    const blob = await response.blob();
    const ext  = getExtension(item.link, blob.type);
    const filename = sanitize(item.name) + ext;

    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    showToast(lang.toastSuccess);
  } catch (err) {
    console.warn("fetch failed, fallback to openLink:", err);
    tgOpenLink(item.link);
    showToast(lang.toastFallback);
  }
}

function getExtension(url, mimeType) {
  const fromUrl = url.split("?")[0].split(".").pop().toLowerCase();
  if (fromUrl && fromUrl.length <= 5 && /^[a-z0-9]+$/.test(fromUrl)) {
    return "." + fromUrl;
  }
  const map = {
    "audio/mpeg": ".mp3",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "audio/wav": ".wav",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "application/zip": ".zip",
    "application/x-apk": ".apk",
    "application/vnd.android.package-archive": ".apk",
  };
  return map[mimeType] || "";
}

function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

function playAudio(item) {
  const player = document.getElementById("audio-player");
  const audio  = document.getElementById("audio-el");
  document.getElementById("player-name").textContent = item.name;
  document.getElementById("player-author").textContent = item.author || "";
  audio.src = item.link;
  player.classList.remove("hidden");
  audio.play().catch(() => {});
}

function playVideo(item) {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("video-el");
  document.getElementById("video-title").textContent = item.name;
  video.src = item.link;
  modal.classList.remove("hidden");
  video.play().catch(() => {});
}

function closeVideo() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("video-el");
  video.pause(); video.src = "";
  modal.classList.add("hidden");
}

function renderCard(item, delay) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;
  const lang = LANG_DATA[currentLang];
  const typeLabel = lang[cfg.labelKey] || item.type;

  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${delay * 0.045}s`;

  const coverDiv = document.createElement("div");
  coverDiv.className = "card-cover";
  if (item.cover) {
    const img = document.createElement("img");
    img.src = item.cover; img.alt = item.name;
    img.onerror = () => { coverDiv.innerHTML = ""; coverDiv.textContent = cfg.icon; };
    coverDiv.appendChild(img);
  } else {
    coverDiv.textContent = cfg.icon;
  }

  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-type" style="color:${cfg.color}">${typeLabel}</div>
    <div class="card-name">${item.name}</div>
    ${item.author ? `<div class="card-author">${item.author}</div>` : ""}
  `;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  if (item.type === "music") {
    const btnPlay = document.createElement("button");
    btnPlay.className = "btn-action btn-play";
    btnPlay.textContent = lang.btnListen;
    btnPlay.addEventListener("click", () => playAudio(item));
    footer.appendChild(btnPlay);

    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = lang.btnDlShort;
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);
  } else if (item.type === "video") {
    const btnWatch = document.createElement("button");
    btnWatch.className = "btn-action btn-watch";
    btnWatch.textContent = lang.btnWatch;
    btnWatch.addEventListener("click", () => playVideo(item));
    footer.appendChild(btnWatch);

    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = lang.btnDlShort;
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);
  } else {
    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = lang.btnDlFull;
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);
  }

  card.appendChild(coverDiv);
  card.appendChild(body);
  card.appendChild(footer);
  return card;
}

function renderGrid(data) {
  const grid = document.getElementById("main-grid");
  const lang = LANG_DATA[currentLang];
  grid.innerHTML = "";

  if (!isSearched) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="e-icon">📱</span>
        <p>${lang.emptyStateInitial}</p>
      </div>`;
    return;
  }

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="e-icon">🔍</span>
        <p>${lang.emptyStateNotFound}</p>
      </div>`;
    return;
  }

  data.forEach((item, i) => grid.appendChild(renderCard(item, i)));
}

function getFiltered() {
  let res = ITEMS;
  if (activeCategory !== "all") res = res.filter(i => i.type === activeCategory);
  if (activeQuery.trim()) {
    const q = activeQuery.trim().toLowerCase();
    res = res.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.author && i.author.toLowerCase().includes(q))
    );
  }
  return res;
}

function refresh() {
  const title = document.getElementById("content-title");
  const count = document.getElementById("content-count");
  const lang = LANG_DATA[currentLang];

  if (!isSearched) {
    title.textContent = lang.initialTitle;
    count.textContent = "";
    renderGrid([]);
    return;
  }

  const filtered = getFiltered();
  const catLabel = activeCategory !== "all" ? lang[TYPE_CONFIG[activeCategory]?.labelKey] : lang.catAll;
  
  title.textContent = activeQuery.trim() ? `"${activeQuery}" — ${catLabel}` : catLabel;
  count.textContent = `${filtered.length} ${lang.resultsText}`;

  renderGrid(filtered);
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ─── INIT ───
document.addEventListener("DOMContentLoaded", () => {
  if (isTelegram) {
    tg.ready(); tg.expand();
  }

  updateInterfaceLanguage();

  function handleSearch() {
    const inputVal = document.getElementById("search-input").value;
    const lang = LANG_DATA[currentLang];
    
    if (!inputVal.trim()) {
      showToast(lang.toastNoText);
      return;
    }
    
    activeQuery = inputVal;
    isSearched = true;
    refresh();
  }

  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("search-input").addEventListener("keydown", e => {
    if (e.key === "Enter") { handleSearch(); }
  });

  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.cat;
    });
  });

  // Til o'zgartirish tugmalari hodisasi
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      updateInterfaceLanguage(); // Interfeysni yangilash
    });
  });

  document.getElementById("go-home").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    activeQuery = ""; 
    activeCategory = "all";
    isSearched = false;
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    document.querySelector(".pill[data-cat='all']").classList.add("active");
    refresh();
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  document.getElementById("player-close").addEventListener("click", () => {
    const audio = document.getElementById("audio-el");
    audio.pause(); audio.src = "";
    document.getElementById("audio-player").classList.add("hidden");
  });

  document.getElementById("video-close").addEventListener("click", closeVideo);
  document.getElementById("video-backdrop").addEventListener("click", closeVideo);
});
