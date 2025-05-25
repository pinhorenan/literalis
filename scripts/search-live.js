// scripts/search-live.js
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('headerSearchInput');
  const btn   = document.getElementById('headerSearchBtn');
  const ul    = document.getElementById('liveSuggestions');
  const BACK = 'https://literalis-backend-e05dd5a2404f.herokuapp.com';

  let timer = null;

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(timer);
    ul.innerHTML = '';
    if (q.length < 2) return;  // só começa em 2 caracteres

    timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BACK}/books/search?q=${encodeURIComponent(q)}`);
        const books = await res.json();
        ul.innerHTML = books.slice(0,5).map(b => 
          `<li data-title="${b.title}">${b.title} — ${b.author}</li>`
        ).join('');
      } catch(e) {
        console.error('Live search error', e);
      }
    }, 300);  // debounce 300ms
  });

  // Clicar na sugestão
  ul.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      const title = e.target.dataset.title;
      window.location.href = `/literalis/search/?q=${encodeURIComponent(title)}`;
    }
  });

  // Enter no input: vai para página completa
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (!q) return;
      window.location.href = `/literalis/search/?q=${encodeURIComponent(q)}`;
    }
  });

  // Botão de busca segue redirecionamento igual
  btn.addEventListener('click', () => {
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `/literalis/search/?q=${encodeURIComponent(q)}`;
  });
});
