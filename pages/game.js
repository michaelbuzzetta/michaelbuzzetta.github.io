import {
  getCurrentQuestion,
  getGameProgress,
  answerQuestion,
  getCurrentGame
} from "../routes/game.js";
import { unlockMedia } from "../routes/gallery.js";

let questionTextEl;
let optionsListEl;
let progressEl;
let feedbackEl;
let summaryEl;
let summaryTextEl;
let playAgainBtn;
let exitBtn;

function difficultyRewardCount(difficulty) {
  if (difficulty === "hard") return 3;
  if (difficulty === "medium") return 2;
  return 1;
}

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function updateProgress() {
  const progress = getGameProgress();
  if (!progressEl) return;
  if (!progress.total) {
    progressEl.textContent = "";
    return;
  }

  const difficultyLabel =
    progress.difficulty.charAt(0).toUpperCase() +
    progress.difficulty.slice(1);
  const categoryLabel =
    progress.category && progress.category !== "any"
      ? " • Category: " + progress.category
      : "";

  progressEl.textContent =
    "Question " +
    progress.index +
    " of " +
    progress.total +
    " • Correct: " +
    progress.correct +
    " • Difficulty: " +
    difficultyLabel +
    categoryLabel;
}

function renderQuestion() {
  const question = getCurrentQuestion();
  const game = getCurrentGame();

  if (
    !question ||
    !questionTextEl ||
    !optionsListEl ||
    !feedbackEl ||
    !summaryEl
  ) {
    return;
  }

  summaryEl.classList.add("hidden");
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("correct");
  feedbackEl.classList.remove("incorrect");

  questionTextEl.textContent = question.q; // uses "q"
  clearElement(optionsListEl);

  const correctIndex = question.answer;

  question.choices.forEach((choice, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => {
      handleAnswerClick(index, correctIndex, game.difficulty);
    });
    li.appendChild(btn);
    optionsListEl.appendChild(li);
  });

  updateProgress();
}

function handleAnswerClick(selectedIndex, correctIndex, difficulty) {
  if (!optionsListEl || !feedbackEl || !summaryEl || !summaryTextEl) return;

  const result = answerQuestion(selectedIndex);

  const optionButtons = Array.from(
    optionsListEl.querySelectorAll("button")
  );

  optionButtons.forEach((b, index) => {
    b.disabled = true;
    if (index === correctIndex) {
      b.classList.add("correct");
    } else if (index === selectedIndex && index !== correctIndex) {
      b.classList.add("incorrect");
    }
  });

  if (result.correct) {
    const rewardCount = difficultyRewardCount(difficulty);
    const newlyUnlocked = unlockMedia(rewardCount);
    const count = newlyUnlocked.length;

    if (count > 0) {
      feedbackEl.textContent =
        "Correct! You unlocked " +
        count +
        " new item" +
        (count === 1 ? "" : "s") +
        " in the gallery.";
    } else {
      feedbackEl.textContent = "Correct!";
    }

    feedbackEl.classList.remove("incorrect");
    feedbackEl.classList.add("correct");
  } else {
    feedbackEl.textContent = "Incorrect.";
    feedbackEl.classList.remove("correct");
    feedbackEl.classList.add("incorrect");
  }

  updateProgress();

  setTimeout(() => {
    if (result.done) {
      showSummary();
    } else {
      renderQuestion();
    }
  }, 900);
}

function showSummary() {
  const game = getCurrentGame();
  if (!game || !summaryEl || !summaryTextEl || !feedbackEl) return;

  const progress = getGameProgress();
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("correct");
  feedbackEl.classList.remove("incorrect");

  summaryTextEl.textContent =
    "You answered " +
    progress.correct +
    " out of " +
    progress.total +
    " questions correctly.";
  summaryEl.classList.remove("hidden");
}

export function showGameForNewSession() {
  const game = getCurrentGame();
  if (!game) return;
  renderQuestion();
}

export function initGamePage() {
  const gameView = document.getElementById("game-view");
  if (!gameView) return;

  questionTextEl = document.getElementById("game-question-text");
  optionsListEl = document.getElementById("game-options");
  progressEl = document.getElementById("game-progress");
  feedbackEl = document.getElementById("game-feedback");
  summaryEl = document.getElementById("game-summary");
  summaryTextEl = document.getElementById("game-summary-text");
  playAgainBtn = document.getElementById("game-play-again");
  exitBtn = document.getElementById("game-exit");

  const homeView = document.getElementById("home-view");
  const settingsView = document.getElementById("settings-view");

  function show(view) {
    if (homeView) homeView.classList.add("hidden");
    if (settingsView) settingsView.classList.add("hidden");
    if (gameView) gameView.classList.add("hidden");
    if (view) view.classList.remove("hidden");
  }

  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      show(homeView);
    });
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      show(settingsView);
    });
  }
}
