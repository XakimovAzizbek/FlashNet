// ============================================================
//  FlashNet — index.js
//
//  Yangi kontent qo'shish uchun quyidagi ITEMS massiviga
//  yangi obyekt qo'shing:
//
//  {
//    id:     "noyob-id",          // har biri har xil bo'lsin
//    type:   "music",             // music | video | app | other
//    name:   "Shaxriyor - Qalbim",
//    author: "Shaxriyor",         // ixtiyoriy
//    cover:  "https://...",       // muqova rasmi linki (ixtiyoriy)
//    link:   "https://..."        // yuklab olish / tinglash linki
//  }
//
// ============================================================

const ITEMS = [

  // ───── MUSIQA ─────
  {
    id: "m1",
    type: "music",
    name: "Shaxriyor - Qalbim",
    author: "Shaxriyor",
    cover: "",
    link: "https://example.com/shaxriyor-qalbim.mp3"
  },
  {
    id: "m2",
    type: "music",
    name: "Ulug'bek Rahmatullayev - Sensiz",
    author: "Ulug'bek Rahmatullayev",
    cover: "",
    link: "https://example.com/sensiz.mp3"
  },
  {
    id: "m3",
    type: "music",
    name: "Jasur Umirov - Yolg'iz",
    author: "Jasur Umirov",
    cover: "",
    link: "https://example.com/yolgiz.mp3"
  },

  // ───── VIDEO ─────
  {
    id: "v1",
    type: "video",
    name: "O'zbekiston tabiati 4K",
    author: "Nature Uz",
    cover: "",
    link: "https://example.com/uzbekistan-nature.mp4"
  },
  {
    id: "v2",
    type: "video",
    name: "Lo-fi Hip Hop Mix",
    author: "ChillBeats",
    cover: "",
    link: "https://example.com/lofi-mix.mp4"
  },

  // ───── ILOVALAR ─────
  {
    id: "a1",
    type: "app",
    name: "Top follow",
    author: "apk",
    cover: "",
    link: "https://github.com/XakimovAzizbek/FlashNet/releases/download/v1.0.0/TopFollow_v837_Release.apk"
  },
  {
    id: "a2",
    type: "app",
    name: "VLC Media Player",
    author: "VideoLAN",
    cover: "",
    link: "https://www.videolan.org/vlc/"
  },
  {
    id: "a3",
    type: "app",
    name: "WhatsApp",
    author: "Meta",
    cover: "",
    link: "https://www.whatsapp.com/download"
  },

  // ───── BOSHQA ─────
  {
    id: "o1",
    type: "other",
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
    img.src = item.cover;
    img.alt = item.name;
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

  // Footer buttons
  const footer = document.createElement("div");
  footer.className = "card-footer";

  if (item.type === "music") {
    const btnListen = document.createElement("button");
    btnListen.className = "btn-action btn-listen";
    btnListen.textContent = "▶ Tinglash";
    btnListen.addEventListener("click", () => playAudio(item));
    footer.appendChild(btnListen);
  }

  const btnDl = document.createElement("button");
  btnDl.className = "btn-action btn-download";
  btnDl.textContent = "⬇ Yuklab olish";
  btnDl.addEventListener("click", () => downloadItem(item));
  footer.appendChild(btnDl);

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
        <p>Hech narsa topilmadi. Boshqa so'z bilan urinib ko'ring.</p>
      </div>`;
    return;
  }

  data.forEach((item, i) => {
    grid.appendChild(renderCard(item, i));
  });
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
    const catLabel = activeCategory !== "all"
      ? TYPE_CONFIG[activeCategory]?.label : "";
    title.textContent = activeQuery.trim()
      ? `"${activeQuery}"${catLabel ? " — " + catLabel : ""}`
      : catLabel;
    count.textContent = `${filtered.length} ta natija`;
  }

  renderGrid(filtered);
}

// ─── DOWNLOAD ───
function downloadItem(item) {
  if (!item.link) { showToast("❌ Link topilmadi!"); return; }
  const a = document.createElement("a");
  a.href = item.link;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`⬇ Yuklab olish boshlandi`);
}

// ─── AUDIO PLAYER ───
function playAudio(item) {
  const player = document.getElementById("player");
  const audio  = document.getElementById("audio-el");
  const name   = document.getElementById("player-name");
  const author = document.getElementById("player-author");

  audio.src    = item.link;
  name.textContent   = item.name;
  author.textContent = item.author || "";
  player.classList.remove("hidden");
  audio.play().catch(() => {});
}

// ─── TOAST ───
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

// ─── INIT ───
document.addEventListener("DOMContentLoaded", () => {

  refresh();

  // Search
  document.getElementById("search-btn").addEventListener("click", () => {
    activeQuery = document.getElementById("search-input").value;
    refresh();
  });
  document.getElementById("search-input").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      activeQuery = e.target.value;
      refresh();
    }
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

  // Logo → reset
  document.getElementById("go-home").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    activeQuery = "";
    activeCategory = "all";
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    document.querySelector(".pill[data-cat='all']").classList.add("active");
    refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Player close
  document.getElementById("player-close").addEventListener("click", () => {
    const audio = document.getElementById("audio-el");
    audio.pause();
    audio.src = "";
    document.getElementById("player").classList.add("hidden");
  });
});