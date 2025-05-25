document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('headerSearchInput');
  const btn   = document.getElementById('headerSearchBtn');
  if (!input || !btn) return;

  const go = () => {
    const q = input.value.trim();
    if (!q) return;
    // redireciona para Estante com parâmetro
    const base = '/literalis/bookshelf/';
    window.location.href = `${base}?remoteSearch=${encodeURIComponent(q)}`;
  };

  btn.addEventListener('click', go);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') go();
  });
});