import { getReports, removeReport, addCustomQuestion } from './storage.js';

const pw = prompt('Passwort:');
if (pw !== '123') {
  alert('Falsches Passwort');
  window.location.href = 'index.html';
}

const reportsContainer = document.getElementById('reports');
const form = document.getElementById('questionForm');
const frage = document.getElementById('frage');
const a1 = document.getElementById('a1');
const a2 = document.getElementById('a2');
const a3 = document.getElementById('a3');
const a4 = document.getElementById('a4');
const korrekt = document.getElementById('korrekt');
const begruendung = document.getElementById('begruendung');
let editId = null;
let editReportIndex = null;

function renderReports() {
  const reports = getReports();
  reportsContainer.innerHTML = '<h2>Gemeldete Fragen</h2>';
  if (!reports.length) {
    reportsContainer.innerHTML += '<p>Keine Meldungen vorhanden.</p>';
    return;
  }
  const list = document.createElement('ul');
  reports.forEach((r, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${r.question.frage}</strong><br>${r.message}`;
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Bearbeiten';
    editBtn.addEventListener('click', () => {
      editId = r.question.id;
      editReportIndex = idx;
      frage.value = r.question.frage;
      a1.value = r.question.antworten[0] || '';
      a2.value = r.question.antworten[1] || '';
      a3.value = r.question.antworten[2] || '';
      a4.value = r.question.antworten[3] || '';
      korrekt.value = r.question.korrekt;
      begruendung.value = r.question.begruendung || '';
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Löschen';
    delBtn.addEventListener('click', () => {
      removeReport(idx);
      renderReports();
    });
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
  reportsContainer.appendChild(list);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const q = {
    id: editId || Date.now(),
    frage: frage.value,
    antworten: [a1.value, a2.value, a3.value, a4.value],
    korrekt: parseInt(korrekt.value, 10),
    begruendung: begruendung.value
  };
  addCustomQuestion(q);
  if (editReportIndex !== null) {
    removeReport(editReportIndex);
  }
  form.reset();
  editId = null;
  editReportIndex = null;
  renderReports();
  alert('Gespeichert');
});

renderReports();
