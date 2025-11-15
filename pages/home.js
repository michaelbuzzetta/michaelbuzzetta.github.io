export function initHome() {
  const homeView = document.getElementById("home-view");
  if (!homeView) return;

  const enterGameBtn = document.getElementById("home-enter-game");
  if (!enterGameBtn) return;

  const settingsView = document.getElementById("settings-view");
  const gameView = document.getElementById("game-view");

  function show(view) {
    if (homeView) homeView.classList.add("hidden");
    if (settingsView) settingsView.classList.add("hidden");
    if (gameView) gameView.classList.add("hidden");
    if (view) view.classList.remove("hidden");
  }

  enterGameBtn.addEventListener("click", () => {
    show(settingsView);
  });

  show(homeView);
}
