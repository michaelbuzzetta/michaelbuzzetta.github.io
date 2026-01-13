import { getUnlockedMedia } from "../routes/gallery.js";

export function initGalleryPage() {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  const modal = document.getElementById("gallery-modal");
  const modalBody = document.getElementById("gallery-modal-body");
  const modalClose = document.getElementById("gallery-modal-close");

  if (!grid || !empty || !modal || !modalBody || !modalClose) return;

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function openModalForItem(item) {
    clear(modalBody);

    const title = document.createElement("h3");
    title.className = "gallery-modal-title";
    title.textContent = item.title;
    modalBody.appendChild(title);

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.className = "gallery-modal-media";
      modalBody.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.alt = item.title;
      img.className = "gallery-modal-media";
      img.src = item.src;
      modalBody.appendChild(img);
    }

    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modal.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    clear(modalBody);
  }

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      event.target.classList.contains("gallery-modal-backdrop")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  function renderGallery() {
    const items = getUnlockedMedia();
    clear(grid);

    if (items.length === 0) {
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "gallery-item";

      const thumb = document.createElement(item.type === "video" ? "video" : "img");
      thumb.className = "gallery-thumb";

      if (item.type === "video") {
        thumb.src = item.src;
        thumb.muted = true;
        thumb.loop = true;
        thumb.autoplay = true;
      } else {
        thumb.alt = item.title;
        thumb.src = item.src;
      }

      const title = document.createElement("div");
      title.className = "gallery-item-title";
      title.textContent = item.title;

      card.appendChild(thumb);
      card.appendChild(title);

      card.addEventListener("click", () => openModalForItem(item));

      grid.appendChild(card);
    });
  }

  renderGallery();

  window.addEventListener("storage", (event) => {
    if (event.key === "quizUnlocker_unlockedMediaIds") {
      renderGallery();
    }
  });
}
