// scripts/search-results.js
document.addEventListener('DOMContentLoaded', async () => {
  // Extrai q=… da URL
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const grid = document.getElementById('searchResults');
  if (!q) {
    grid.innerHTML = '<p>Termo de busca vazio.</p>';
    return;
  }

  try {
    const res = await fetch(`https://literalis-backend-e05dd5a2404f.herokuapp.com/books/search?q=${encodeURIComponent(q)}`);
    const books = await res.json();
    if (!books.length) {
      grid.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }
    grid.innerHTML = books.map(b => `
      <article class="book-card">
        <img src="${b.thumbnail.replace(/^http:\/\//, 'https://')}" alt="Capa de ${b.title}">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
      </article>
    `).join('');
  } catch (e) {
    console.error('Error loading search results:', e);
    grid.innerHTML = '<p>Erro ao buscar resultados.</p>';
  }
});
