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
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export async function startNewGame(numQuestions, difficulty) {
  await loadQuestions();
  const filtered = allQuestions.filter(q => q.difficulty === difficulty);
  const pool = filtered.length > 0 ? filtered : allQuestions;
  const shuffled = shuffleArray(pool);
  const count = Math.min(numQuestions, shuffled.length);
  currentGame = {
    difficulty,
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
    return { index: 0, total: 0, correct: 0, difficulty: "easy" };
  }
  return {
    index: currentGame.currentIndex + 1,
    total: currentGame.totalQuestions,
    correct: currentGame.correctCount,
    difficulty: currentGame.difficulty
  };
}

export function answerQuestion(optionIndex) {
  if (!currentGame) return { correct: false, done: true };
  const question = getCurrentQuestion();
  if (!question) return { correct: false, done: true };

  const isCorrect = optionIndex === question.answerIndex;
  if (isCorrect) {
    currentGame.correctCount += 1;
  }

  const isLast = currentGame.currentIndex >= currentGame.totalQuestions - 1;
  if (!isLast) {
    currentGame.currentIndex += 1;
  }

  return { correct: isCorrect, done: isLast };
}
