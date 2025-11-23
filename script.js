// 30 perguntas A1
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
  { question: "What is the opposite of 'hot'?", answers: ["Cold", "Big", "Tall", "Short"], correct: "Cold" },
  { question: "I ___ a student.", answers: ["am", "is", "are", "be"], correct: "am" },
  { question: "She is my ___", answers: ["friend", "cat", "table", "car"], correct: "friend" },
  { question: "The sun is ___", answers: ["Yellow", "Blue", "Red", "Green"], correct: "Yellow" },
  { question: "I have ___ apples.", answers: ["two", "ten", "five", "four"], correct: "two" },
  { question: "My mother is ___", answers: ["woman", "man", "dog", "chair"], correct: "woman" },
  { question: "I like to ___ music.", answers: ["listen", "eat", "run", "sleep"], correct: "listen" },
  { question: "They ___ happy.", answers: ["are", "is", "am", "be"], correct: "are" },
  { question: "He has a ___", answers: ["car", "book", "chair", "tree"], correct: "car" },
  { question: "We go to school ___ bus.", answers: ["by", "on", "with", "at"], correct: "by" },
  { question: "I eat ___ bread.", answers: ["some", "any", "much", "many"], correct: "some" },
  { question: "The cat is ___ the table.", answers: ["on", "in", "under", "behind"], correct: "on" },
  { question: "My father is a ___", answers: ["doctor", "teacher", "dog", "car"], correct: "doctor" },
  { question: "I ___ football every Sunday.", answers: ["play", "plays", "playing", "played"], correct: "play" },
  { question: "She likes to ___ movies.", answers: ["watch", "eat", "run", "read"], correct: "watch" },
  { question: "It is ___ today.", answers: ["rainy", "blue", "hot", "happy"], correct: "rainy" },
  { question: "I live ___ Brazil.", answers: ["in", "on", "at", "by"], correct: "in" },
  { question: "The dog is ___ the garden.", answers: ["in", "on", "under", "at"], correct: "in" },
  { question: "We ___ happy today.", answers: ["are", "is", "am", "be"], correct: "are" },
  { question: "I ___ water every day.", answers: ["drink", "drinks", "drinking", "drank"], correct: "drink" },
  { question: "She ___ my friend.", answers: ["is", "are", "am", "be"], correct: "is" }
];

let currentQuestion = 0;
let score = 0;
let timePerQuestion = 0;
let timerInterval;
let selectedQuestions = [];

const startBtn = document.getElementById('start-btn');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const timerFill = document.getElementById('timer-fill');
const timerText = document.getElementById('time');
const scoreEl = document.getElementById('score');
const finalNameEl = document.getElementById('final-name');
const rankingListEl = document.getElementById('ranking-list');
const playerNameEl = document.getElementById('player-name');
const numQuestionsEl = document.getElementById('num-questions');
const restartBtn = document.getElementById('restart-btn');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Habilitar botão apenas se nome preenchido
playerNameEl.addEventListener('input', () => {
  startBtn.disabled = playerNameEl.value.trim() === "";
});

startBtn.addEventListener('click', startQuiz);

function startQuiz() {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  score = 0;
  currentQuestion = 0;
  
  const num = parseInt(numQuestionsEl.value);
  selectedQuestions = shuffleArray([...questions]).slice(0, num);
  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  timePerQuestion = 0;
  timerText.textContent = timePerQuestion;

  const q = selectedQuestions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = '';

  q.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.addEventListener('click', () => selectAnswer(btn, answer));
    answersEl.appendChild(btn);
  });

  Array.from(answersEl.children).forEach((btn, index) => {
    setTimeout(() => btn.classList.add('show'), index * 100);
  });

  updateTimerBar();
  timerInterval = setInterval(updateTimer, 1000);
}

function selectAnswer(button, answer) {
  clearInterval(timerInterval);
  const correctAnswer = selectedQuestions[currentQuestion].correct;

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
    if (currentQuestion < selectedQuestions.length) showQuestion();
    else endQuiz();
  }, 1500);
}

function updateTimer() {
  timePerQuestion++;
  timerText.textContent = timePerQuestion;
  updateTimerBar();

  if (timePerQuestion >= 15) {
    clearInterval(timerInterval);
    const correctAnswer = selectedQuestions[currentQuestion].correct;
    Array.from(answersEl.children).forEach(btn => {
      if (btn.textContent === correctAnswer) btn.classList.add('correct');
    });

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < selectedQuestions.length) showQuestion();
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
  finalNameEl.textContent = playerNameEl.value;
  scoreEl.textContent = score;
  showRanking();
}

function showRanking() {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ name: playerNameEl.value, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('ranking', JSON.stringify(ranking));

  rankingListEl.innerHTML = '';
  ranking.slice(0, 5).forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.name}: ${player.score}`;
    rankingListEl.appendChild(li);
  });
}

restartBtn.addEventListener('click', () => {
  playerNameEl.value = '';
  startBtn.disabled = true;
  endScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

function shuffleArray(array) {
  for (let i = array.length -1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
