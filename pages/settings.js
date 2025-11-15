import { startNewGame } from "../routes/game.js";
import { showGameForNewSession } from "./game.js";

let selectedDifficulty = "easy";

export function initSettings() {
  const settingsView = document.getElementById("settings-view");
  if (!settingsView) return;

  const homeView = document.getElementById("home-view");
  const gameView = document.getElementById("game-view");

  const numInput = document.getElementById("num-questions");
  const startBtn = document.getElementById("settings-start");
  const cancelBtn = document.getElementById("settings-cancel");
  const difficultyButtons = Array.from(
    settingsView.querySelectorAll(".difficulty-btn")
  );

  function show(view) {
    if (homeView) homeView.classList.add("hidden");
    if (settingsView) settingsView.classList.add("hidden");
    if (gameView) gameView.classList.add("hidden");
    if (view) view.classList.remove("hidden");
  }

  difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      difficultyButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedDifficulty = btn.getAttribute("data-difficulty") || "easy";
    });
  });

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      const value = parseInt(numInput.value, 10);
      const numQuestions = Number.isNaN(value) ? 5 : Math.max(1, Math.min(20, value));
      await startNewGame(numQuestions, selectedDifficulty);
      show(gameView);
      showGameForNewSession();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      show(homeView);
    });
  }
}
