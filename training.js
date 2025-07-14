import { questions } from './questions.js';

const quizContainer = document.getElementById('quiz');

let selected = [];
let current = 0;
let score = 0;
let results = [];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  selected = shuffle([...questions]).slice(0, 5);
  current = 0;
  score = 0;
  results = [];
  showQuestion();
}

function showQuestion() {
  const q = selected[current];
  quizContainer.innerHTML = '';

  const questionEl = document.createElement('div');
  questionEl.innerHTML = `<p>${current + 1}/5: ${q.frage}</p>`;

  const answersEl = document.createElement('div');
  answersEl.className = 'answers';

  q.antworten.forEach((a, idx) => {
    const btn = document.createElement('button');
    btn.textContent = a;
    btn.addEventListener('click', () => handleAnswer(idx));
    answersEl.appendChild(btn);
  });

  questionEl.appendChild(answersEl);
  quizContainer.appendChild(questionEl);
}

function handleAnswer(index) {
  const q = selected[current];
  const correct = index === q.korrekt;
  if (correct) score++;
  results.push({ q, correct });
  current++;

  if (current < selected.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.innerHTML = `<h2>Ergebnis: ${score}/5 richtig</h2>`;
  const list = document.createElement('div');
  list.className = 'result-list';
  results.forEach(r => {
    if (!r.correct) {
      const item = document.createElement('div');
      item.innerHTML = `<p><strong>Frage:</strong> ${r.q.frage}</p>
        <p><strong>Korrekte Antwort:</strong> ${r.q.antworten[r.q.korrekt]}</p>
        <p><em>${r.q.begruendung}</em></p>`;
      list.appendChild(item);
    }
  });
  if (list.children.length === 0) {
    list.textContent = 'Alle Fragen richtig beantwortet!';
  }
  quizContainer.appendChild(list);

  const backLink = document.createElement('a');
  backLink.textContent = 'Nochmals';
  backLink.href = 'index.html';
  backLink.className = 'back-btn';
  quizContainer.appendChild(backLink);
}

startQuiz();
