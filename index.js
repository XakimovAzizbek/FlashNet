// ============================================================
//  FlashNet — index.js
//
//  Yangi kontent qo'shish: quyidagi ITEMS massiviga qo'shing.
//
//  {
//    id:     "noyob-id",
//    type:   "music",        // music | video | app | other
//    name:   "Nom",
//    author: "Muallif",      // ixtiyoriy
//    cover:  "https://...",  // muqova (ixtiyoriy)
//    link:   "https://..."   // to'g'ridan-to'g'ri fayl linki
//  }
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
    name: "O'zbekiston tabiati 4K",
    author: "Nature Uz",
    cover: "",
    link: "https://example.com/uzbekistan-nature.mp4"
  },
  {
    id: "v2", type: "video",
    name: "Lo-fi Hip Hop Mix",
    author: "ChillBeats",
    cover: "",
    link: "https://example.com/lofi-mix.mp4"
  },

  // ───── ILOVALAR ─────
  {
    id: "a1", type: "app",
    name: "Telegram",
    author: "Telegram FZ-LLC",
    cover: "",
    link: "https://telegram.org/dl"
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

// ============================================================

const TYPE_CONFIG = {
  music: { label: "Musiqa", icon: "🎵", color: "#f0d45a" },
  video: { label: "Video",  icon: "🎬", color: "#e07aff" },
  app:   { label: "Ilova",  icon: "📱", color: "#5af0c8" },
  other: { label: "Boshqa", icon: "📄", color: "#7abaff" },
};

let activeCategory = "all";
let activeQuery    = "";

// ─── TELEGRAM API ───
// Telegram Mini App SDK dan foydalanamiz (mavjud bo'lsa)
const tg = window.Telegram?.WebApp || null;

// Telegram ichida ekanligini tekshirish
const isTelegram = !!tg && !!tg.initData;

// Telegram'da link ochish — brauzerga chiqmaydi, ichki webview ishlatadi
function tgOpenLink(url) {
  if (isTelegram) {
    // try_instant_view: false — to'g'ridan-to'g'ri link ochadi
    tg.openLink(url, { try_instant_view: false });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ─── YUKLAB OLISH ───
// Telegram Mini App ichida <a download> ishlamaydi.
// Yechim: fetch → Blob → object URL → <a> click
// Bu usul kichik fayllar uchun ishlaydi (musiqa, kichik ilovalar).
// Katta fayllar uchun tgOpenLink ishlatiladi.
async function downloadItem(item) {
  if (!item.link) { showToast("❌ Link topilmadi!"); return; }

  showToast("⏳ Yuklanmoqda...");

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

    showToast("✅ Yuklab olindi!");

  } catch (err) {
    // CORS yoki boshqa xato — Telegram link orqali ochish
    console.warn("fetch failed, fallback to openLink:", err);
    tgOpenLink(item.link);
    showToast("⬇ Brauzerda yuklanmoqda...");
  }
}

function getExtension(url, mimeType) {
  // URL dan extension olishga urinish
  const fromUrl = url.split("?")[0].split(".").pop().toLowerCase();
  if (fromUrl && fromUrl.length <= 5 && /^[a-z0-9]+$/.test(fromUrl)) {
    return "." + fromUrl;
  }
  // MIME dan aniqlash
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
    "application/octet-stream": "",
  };
  return map[mimeType] || "";
}

function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

// ─── AUDIO PLAYER ───
function playAudio(item) {
  const player = document.getElementById("audio-player");
  const audio  = document.getElementById("audio-el");

  document.getElementById("player-name").textContent   = item.name;
  document.getElementById("player-author").textContent = item.author || "";
  audio.src = item.link;
  player.classList.remove("hidden");
  audio.play().catch(() => {});
}

// ─── VIDEO MODAL ───
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

// ─── RENDER CARD ───
function renderCard(item, delay) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;

  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${delay * 0.045}s`;

  // Cover
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

  // Body
  const body = document.createElement("div");
  body.className = "card-body";
  body.innerHTML = `
    <div class="card-type" style="color:${cfg.color}">${cfg.label}</div>
    <div class="card-name">${item.name}</div>
    ${item.author ? `<div class="card-author">${item.author}</div>` : ""}
  `;

  // Footer
  const footer = document.createElement("div");
  footer.className = "card-footer";

  if (item.type === "music") {
    // Tinglash tugmasi
    const btnPlay = document.createElement("button");
    btnPlay.className = "btn-action btn-play";
    btnPlay.textContent = "▶ Tinglash";
    btnPlay.addEventListener("click", () => playAudio(item));
    footer.appendChild(btnPlay);

    // Yuklab olish tugmasi
    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = "⬇ Yukish";
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);

  } else if (item.type === "video") {
    // Ko'rish (ichki player)
    const btnWatch = document.createElement("button");
    btnWatch.className = "btn-action btn-watch";
    btnWatch.textContent = "▶ Ko'rish";
    btnWatch.addEventListener("click", () => playVideo(item));
    footer.appendChild(btnWatch);

    // Yuklab olish
    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = "⬇ Yukish";
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);

  } else {
    // App / Other — faqat yuklab olish
    const btnDl = document.createElement("button");
    btnDl.className = "btn-action btn-dl";
    btnDl.textContent = "⬇ Yuklab olish";
    btnDl.addEventListener("click", () => downloadItem(item));
    footer.appendChild(btnDl);
  }

  card.appendChild(coverDiv);
  card.appendChild(body);
  card.appendChild(footer);
  return card;
}

// ─── RENDER GRID ───
function renderGrid(data) {
  const grid = document.getElementById("main-grid");
  grid.innerHTML = "";

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="e-icon">🔍</span>
        <p>Hech narsa topilmadi.</p>
      </div>`;
    return;
  }

  data.forEach((item, i) => grid.appendChild(renderCard(item, i)));
}

// ─── FILTER ───
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
  const filtered = getFiltered();
  const title = document.getElementById("content-title");
  const count = document.getElementById("content-count");

  if (!activeQuery.trim() && activeCategory === "all") {
    title.textContent = "Barcha kontentlar";
    count.textContent = "";
  } else {
    const catLabel = activeCategory !== "all" ? TYPE_CONFIG[activeCategory]?.label : "";
    title.textContent = activeQuery.trim()
      ? `"${activeQuery}"${catLabel ? " — " + catLabel : ""}`
      : catLabel;
    count.textContent = `${filtered.length} ta natija`;
  }

  renderGrid(filtered);
}

// ─── TOAST ───
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

  // Telegram Mini App sozlamalari
  if (isTelegram) {
    tg.ready();
    tg.expand(); // to'liq ekranda ochish
  }

  refresh();

  // Search
  document.getElementById("search-btn").addEventListener("click", () => {
    activeQuery = document.getElementById("search-input").value;
    refresh();
  });
  document.getElementById("search-input").addEventListener("keydown", e => {
    if (e.key === "Enter") { activeQuery = e.target.value; refresh(); }
  });

  // Pills
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.cat;
      refresh();
    });
  });

  // Logo reset
  document.getElementById("go-home").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    activeQuery = ""; activeCategory = "all";
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    document.querySelector(".pill[data-cat='all']").classList.add("active");
    refresh();
    window.scrollTo({ top:0, behavior:"smooth" });
  });

  // Audio player close
  document.getElementById("player-close").addEventListener("click", () => {
    const audio = document.getElementById("audio-el");
    audio.pause(); audio.src = "";
    document.getElementById("audio-player").classList.add("hidden");
  });

  // Video modal close
  document.getElementById("video-close").addEventListener("click", closeVideo);
  document.getElementById("video-backdrop").addEventListener("click", closeVideo);
});
