document.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
  const i = document.getElementById(b.dataset.toggle);
  const show = i.type === 'password';
  i.type = show ? 'text' : 'password';
  b.textContent = show ? 'Hide' : 'Show';
}));
const pw = document.getElementById('pw'), bar = document.getElementById('bar'), hint = document.getElementById('hint');
if (pw && bar) pw.addEventListener('input', () => {
  const v = pw.value;
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const lv = [['#f87171', 'Very weak'], ['#f87171', 'Weak'], ['#fbbf24', 'Fair'], ['#a3e635', 'Good'], ['#34d399', 'Strong'], ['#22d3ee', 'Excellent']][v ? s : 0];
  bar.style.width = (v ? Math.max(s, 1) * 20 : 0) + '%';
  bar.style.background = lv[0];
  hint.textContent = v ? 'Strength: ' + lv[1] : 'Use 8+ characters with a mix of types.';
});
const note = document.getElementById('note'), count = document.getElementById('count');
if (note && count) note.addEventListener('input', () => { count.textContent = note.value.length + ' / 280'; });
