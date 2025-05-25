// literalis/scripts/search.js
const BACKEND_URL = 'https://literalis-backend-e05dd5a2404f.herokuapp.com';

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (query) searchBooks(query);
});

async function searchBooks(query) {
  const res = await fetch(`${BACKEND_URL}/books/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  renderResults(data);
}

function renderResults(books) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  if (!books.length) {
    container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.thumbnail || 'assets/images/placeholder.jpg'}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.author}</p>
    `;
    container.appendChild(card);
  });
}
