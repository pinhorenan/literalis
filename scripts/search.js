// scripts/search.js

document.addEventListener('DOMContentLoaded', () => {
  const BACKEND = 'https://literalis-backend-e05dd5a2404f.herokuapp.com';
  const input   = document.getElementById('headerSearchInput');
  const btn     = document.getElementById('headerSearchBtn');
  const liveUl  = document.getElementById('liveSuggestions');
  const results = document.getElementById('searchResults');  // existe só em search.html

  // Utility: pega q=... da URL
  const params = new URLSearchParams(window.location.search);
  const qParam = params.get('q') || '';

  // -------------------------------------------------------------------
  // 1) Se estamos NA PÁGINA /search/, renderiza resultados completos
  if (results) {
    // título já é gerado por Liquid, aqui só buscamos os dados
    fetch(`${BACKEND}/books/search?q=${encodeURIComponent(qParam)}`)
      .then(r => r.json())
      .then(books => {
        if (!books.length) {
          results.innerHTML = '<p>Nenhum resultado encontrado.</p>';
          return;
        }
        results.innerHTML = books.map(b => {
          // força HTTPS nas capas
          let img = b.thumbnail || '{{ "/assets/images/placeholder.jpg" | relative_url }}';
          if (img.startsWith('http://')) img = img.replace(/^http:\/\//, 'https://');
          return `
            <article class="book-card">
              <img src="${img}" alt="Capa de ${b.title}">
              <h3>${b.title}</h3>
              <p>${b.author}</p>
            </article>`;
        }).join('');
      })
      .catch(err => {
        console.error('Error loading search results:', err);
        results.innerHTML = '<p>Erro ao buscar resultados.</p>';
      });

    return;  // não inicializa o live-search
  }

  // -------------------------------------------------------------------
  // 2) Se o header existe, ativa o live-search + redirecionamento
  if (!input || !btn || !liveUl) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(debounceTimer);
    liveUl.innerHTML = '';
    if (q.length < 2) return;

    debounceTimer = setTimeout(async () => {
      try {
        const res   = await fetch(`${BACKEND}/books/search?q=${encodeURIComponent(q)}`);
        const books = await res.json();
        liveUl.innerHTML = books.slice(0,5).map(b =>
          `<li data-q="${encodeURIComponent(b.title)}">
             ${b.title} — ${b.author}
           </li>`
        ).join('');
      } catch(e) {
        console.error('Live search error', e);
      }
    }, 300);
  });

  // clicar sugestão
  liveUl.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      const term = decodeURIComponent(e.target.dataset.q);
      window.location.href = `/literalis/search/?q=${encodeURIComponent(term)}`;
    }
  });

  // Enter no input ou botão
  function goToSearch() {
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `/literalis/search/?q=${encodeURIComponent(q)}`;
  }
  input.addEventListener('keypress', e => { if (e.key === 'Enter') goToSearch(); });
  btn.addEventListener('click', goToSearch);
});
