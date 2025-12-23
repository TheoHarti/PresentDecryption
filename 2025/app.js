// Navigation
function showPage(event) {
  if (event) event.preventDefault();
  const target = event ? event.target.getAttribute('data-target') : 'start';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(target);
  if (el) el.classList.add('active');
}
