// Perguntas A1
const questions = [
  { question: "What color is the sky?", answers: ["Blue", "Green", "Red", "Yellow"], correct: "Blue" },
  { question: "How many fingers do you have?", answers: ["5", "10", "2", "8"], correct: "10" },
  { question: "Choose the correct sentence:", answers: ["I am teacher", "I am a teacher", "I are teacher", "I is teacher"], correct: "I am a teacher" },
  { question: "What day comes after Monday?", answers: ["Sunday", "Tuesday", "Wednesday", "Friday"], correct: "Tuesday" },
  { question: "Which one is an animal?", answers: ["Table", "Dog", "Book", "Chair"], correct: "Dog" },
  { question: "Hello! How ___ you?", answers: ["am", "is", "are", "be"], correct: "are" },
  { question: "What is your name?", answers: ["I am fine", "My name is John", "I am 10", "I like cats"], correct: "My name is John" },
  { question: "I like to ___ books.", answers: ["read", "eat", "run", "sleep"], correct: "read" },
  { question: "Which one is a fruit?", answers: ["Apple", "Car", "Chair", "Table"], correct: "Apple" },
  { question: "What is the opposite of 'hot'?", answers: ["Cold", "Big", "Tall", "Short"], correct: "Cold" }
];

let currentQuestion = 0;
let score = 0;
let timePerQuestion = 15;
let timerInterval;

const startBtn = document.getElementById('start-btn');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timerFill = document.getElementById('timer-fill');
const timerText = document.getElementById('time');
const scoreEl = document.getElementById('score');
const playerNameEl = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const rankingListEl = document.getElementById('ranking-list');
const restartBtn = document.getElementById('restart-btn');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

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
  timerText.textContent = timePerQuestion;

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = '';

  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => selectAnswer(btn, answer));
    answersEl.appendChild(btn);
  });

  // Animação dos botões
  Array.from(answersEl.children).forEach((btn, index) => {
    setTimeout(() => btn.classList.add('show'), index * 100);
  });

  updateTimerBar();
  timerInterval = setInterval(updateTimer, 1000);
}

function selectAnswer(button, answer) {
  clearInterval(timerInterval);
  const correctAnswer = questions[currentQuestion].correct;

  if (answer === correctAnswer) {
    button.classList.add('correct');
    correctSound.play();
    score += 10;
  } else {
    button.classList.add('wrong');
    wrongSound.play();
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
  timerText.textContent = timePerQuestion;
  updateTimerBar();

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

function updateTimerBar() {
  const percent = (timePerQuestion / 15) * 100;
  timerFill.style.width = percent + "%";
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
