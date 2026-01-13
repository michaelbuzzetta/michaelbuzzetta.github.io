const STORAGE_KEY = "quizUnlocker_unlockedMediaIds";

const MEDIA_BASE = "./public/prize";

const PHOTO_COUNT = 1954;
const VIDEO_COUNT = 20;

const PHOTO_EXT = ".jpg";
const VIDEO_EXT = ".mp4";

function buildMediaList() {
  const media = [];

  for (let i = 1; i <= PHOTO_COUNT; i++) {
    media.push({
      id: `photo-${i}`,
      type: "image",
      src: `${MEDIA_BASE}/photo${i}${PHOTO_EXT}`,
      title: `Photo ${i}`
    });
  }

  for (let i = 1; i <= VIDEO_COUNT; i++) {
    media.push({
      id: `video-${i}`,
      type: "video",
      src: `${MEDIA_BASE}/video${i}${VIDEO_EXT}`,
      title: `Video ${i}`
    });
  }

  return media;
}

function loadUnlockedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

let unlockedIds = loadUnlockedIds();

function saveUnlockedIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds));
  } catch {
  }
}

export function getUnlockedMedia() {
  const allMedia = buildMediaList();
  return allMedia.filter((item) => unlockedIds.includes(item.id));
}

export function getAllMediaCount() {
  return buildMediaList().length;
}

export function unlockMedia(count) {
  if (count <= 0) return [];

  const allMedia = buildMediaList();
  const locked = allMedia.filter((item) => !unlockedIds.includes(item.id));

  if (locked.length === 0) return [];

  const pool = locked.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  const toUnlock = pool.slice(0, count);

  toUnlock.forEach((item) => {
    if (!unlockedIds.includes(item.id)) {
      unlockedIds.push(item.id);
    }
  });

  saveUnlockedIds();
  return toUnlock;
}