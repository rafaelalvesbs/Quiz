const questions = [
  {
    question: "Qual a linguagem usada para web?",
    answers: ["JavaScript", "Python", "C++", "Java"],
    correct: "JavaScript"
  },
  {
    question: "Qual elemento HTML cria um botão?",
    answers: ["<div>", "<button>", "<span>", "<form>"],
    correct: "<button>"
  },
  {
    question: "O que é DOM?",
    answers: ["Documento", "Banco de dados", "Interface de programação", "Modelo de objeto de documento"],
    correct: "Modelo de objeto de documento"
  }
];

let currentQuestion = 0;
let score = 0;
let timePerQuestion = 15;
let timerInterval;

// Elementos do DOM
const startBtn = document.getElementById('start-btn');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timerFill = document.getElementById('timer-fill');
const scoreEl = document.getElementById('score');
const playerNameEl = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const rankingListEl = document.getElementById('ranking-list');
const restartBtn = document.getElementById('restart-btn');

startBtn.addEventListener('click', startQuiz);

function startQuiz() {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  timePerQuestion = 15;
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = '';
  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => selectAnswer(btn, answer));
    answersEl.appendChild(btn);
  });
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function selectAnswer(button, answer) {
  clearInterval(timerInterval);
  const correctAnswer = questions[currentQuestion].correct;
  if (answer === correctAnswer) {
    button.classList.add('correct');
    score += 10;
  } else {
    button.classList.add('wrong');
    Array.from(answersEl.children).forEach(btn => {
      if (btn.textContent === correctAnswer) btn.classList.add('correct');
    });
  }
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else endQuiz();
  }, 1500);
}

function updateTimer() {
  timePerQuestion--;
  const percent = (timePerQuestion / 15) * 100;
  timerFill.style.width = percent + "%";
  if (timePerQuestion <= 0) {
    clearInterval(timerInterval);
    Array.from(answersEl.children).forEach(btn => {
      if (btn.textContent === questions[currentQuestion].correct) btn.classList.add('correct');
    });
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < questions.length) showQuestion();
      else endQuiz();
    }, 1500);
  }
}

function endQuiz() {
  quizScreen.classList.add('hidden');
  endScreen.classList.remove('hidden');
  scoreEl.textContent = score;
  showRanking();
}

saveScoreBtn.addEventListener('click', () => {
  const playerName = playerNameEl.value || 'Anônimo';
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ name: playerName, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('ranking', JSON.stringify(ranking));
  showRanking();
});

function showRanking() {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  rankingListEl.innerHTML = '';
  ranking.slice(0, 5).forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.name}: ${player.score}`;
    rankingListEl.appendChild(li);
  });
}

restartBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  playerNameEl.value = '';
  endScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
