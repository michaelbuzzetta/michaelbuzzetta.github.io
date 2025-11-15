const QUESTIONS_URL = "../public/questions.json";

let allQuestions = [];
let questionsLoaded = false;
let currentGame = null;

async function loadQuestions() {
  if (questionsLoaded) return;
  const res = await fetch(QUESTIONS_URL);
  const data = await res.json();
  allQuestions = Array.isArray(data) ? data : [];
  questionsLoaded = true;
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

/**
 * Start a new game
 * @param {number} numQuestions  how many questions to include
 * @param {string} difficulty    "easy" | "medium" | "hard"
 * @param {string} category      category name or "any"
 */
export async function startNewGame(numQuestions, difficulty, category = "any") {
  await loadQuestions();

  // filter by difficulty first
  let filtered = allQuestions.filter(
    (q) => q.difficulty === difficulty
  );

  // optionally filter by category if not "any"
  if (category && category !== "any") {
    const byDiffAndCat = filtered.filter((q) => q.category === category);
    if (byDiffAndCat.length > 0) {
      filtered = byDiffAndCat;
    }
  }

  // if nothing found, fall back to all questions
  if (filtered.length === 0) {
    filtered = allQuestions.slice();
  }

  const shuffled = shuffleArray(filtered);
  const count = Math.min(numQuestions, shuffled.length);

  currentGame = {
    difficulty,
    category: category || "any",
    totalQuestions: count,
    currentIndex: 0,
    correctCount: 0,
    questions: shuffled.slice(0, count)
  };

  return getCurrentQuestion();
}

export function getCurrentGame() {
  return currentGame;
}

export function getCurrentQuestion() {
  if (!currentGame) return null;
  return currentGame.questions[currentGame.currentIndex] || null;
}

export function getGameProgress() {
  if (!currentGame) {
    return { index: 0, total: 0, correct: 0, difficulty: "easy", category: "any" };
  }

  return {
    index: currentGame.currentIndex + 1,
    total: currentGame.totalQuestions,
    correct: currentGame.correctCount,
    difficulty: currentGame.difficulty,
    category: currentGame.category
  };
}

export function answerQuestion(optionIndex) {
  if (!currentGame) return { correct: false, done: true };

  const question = getCurrentQuestion();
  if (!question) return { correct: false, done: true };

  const isCorrect = optionIndex === question.answer; // uses new "answer" field

  if (isCorrect) {
    currentGame.correctCount += 1;
  }

  const isLast = currentGame.currentIndex >= currentGame.totalQuestions - 1;
  if (!isLast) {
    currentGame.currentIndex += 1;
  }

  return { correct: isCorrect, done: isLast };
}
