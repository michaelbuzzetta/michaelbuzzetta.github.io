const STORAGE_KEY = "quizUnlocker_unlockedMediaIds";

const MEDIA_BASE_PATH = "./public/prize";

const PHOTO_COUNT = 1954;
const VIDEO_COUNT = 20;

function buildMediaList() {
  const media = [];

  for (let i = 1; i <= PHOTO_COUNT; i++) {
    media.push({
      id: `photo${i}`,
      type: "image",
      src: `${MEDIA_BASE_PATH}/photo${i}.jpg`,
      title: `Photo ${i}`
    });
  }

  for (let i = 1; i <= VIDEO_COUNT; i++) {
    media.push({
      id: `video${i}`,
      type: "video",
      src: `${MEDIA_BASE_PATH}/video${i}.mp4`,
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
    // ignore storage errors
  }
}

export function getUnlockedMedia() {
  const allMedia = buildMediaList();
  return allMedia.filter((item) => unlockedIds.includes(item.id));
}

export function getAllMediaCount() {
  return buildMediaList().length;
}

// count = how many new items to unlock (based on difficulty)
export function unlockMedia(count) {
  const allMedia = buildMediaList();
  const locked = allMedia.filter((item) => !unlockedIds.includes(item.id));
  if (locked.length === 0 || count <= 0) return [];

  const toUnlock = locked.slice(0, count);

  toUnlock.forEach((item) => {
    if (!unlockedIds.includes(item.id)) {
      unlockedIds.push(item.id);
    }
  });

  saveUnlockedIds();
  return toUnlock;
}
