const STORAGE_KEY = "quizUnlocker_unlockedMediaIds";

// 1) List every prize file in your /prize folder here.
//    Use the real filenames (case-sensitive).
//    Example below assumes files like:
//    prize/photo_dog.jpg, prize/photo_cat.png, prize/video1.mp4, etc.

const allMedia = [
  {
    id: "m1",
    type: "image",
    src: "/prize/photo_dog.jpg",
    title: "Dog Photo"
  },
  {
    id: "m2",
    type: "image",
    src: "/prize/photo_cat.png",
    title: "Cat Photo"
  },
  {
    id: "m3",
    type: "image",
    src: "/prize/beach_sunset.jpg",
    title: "Beach Sunset"
  },
  {
    id: "m4",
    type: "image",
    src: "/prize/mountains.png",
    title: "Mountain View"
  },
  {
    id: "m5",
    type: "video",
    src: "/prize/video1.mp4",
    title: "First Video"
  },
  {
    id: "m6",
    type: "image",
    src: "/prize/random1.jpg",
    title: "Random Shot 1"
  },
  {
    id: "m7",
    type: "image",
    src: "/prize/random2.jpg",
    title: "Random Shot 2"
  },
  {
    id: "m8",
    type: "image",
    src: "/prize/random3.jpg",
    title: "Random Shot 3"
  },
  {
    id: "m9",
    type: "image",
    src: "/prize/random4.jpg",
    title: "Random Shot 4"
  },
  {
    id: "m10",
    type: "image",
    src: "/prize/random5.jpg",
    title: "Random Shot 5"
  }
];

// -------------------------------------------------------------------

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
  return allMedia.filter((item) => unlockedIds.includes(item.id));
}

export function getAllMediaCount() {
  return allMedia.length;
}

// count = how many new items to unlock (based on difficulty)
export function unlockMedia(count) {
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
