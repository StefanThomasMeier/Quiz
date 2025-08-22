const REPORTS_KEY = 'reports';
const CUSTOM_KEY = 'customQuestions';

export function getReports() {
  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveReports(arr) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(arr));
}

export function addReport(report) {
  const reports = getReports();
  reports.push(report);
  saveReports(reports);
}

export function removeReport(index) {
  const reports = getReports();
  reports.splice(index, 1);
  saveReports(reports);
}

export function getCustomQuestions() {
  const raw = localStorage.getItem(CUSTOM_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomQuestions(arr) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(arr));
}

export function addCustomQuestion(q) {
  const arr = getCustomQuestions();
  const idx = arr.findIndex(item => item.id === q.id);
  if (idx >= 0) arr[idx] = q; else arr.push(q);
  saveCustomQuestions(arr);
}
