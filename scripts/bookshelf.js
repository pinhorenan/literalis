/* /scripts/bookshelf.js */

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const term   = params.get("remoteSearch");
  if (term) {
    fetch ('https://literalis-backend-e05dd5a2404f.herokuapp.com/books/search?q=${encodeURIComponent(term)}')
      .then(r => r.json())
      .then(renderRemote);

    document.querySelector('.bookshelf-controls')?.classList.add('hidden');
    return;
  }

  const grid   = document.getElementById("bookshelfGrid");
  const filter = document.getElementById("filter");
  const sort   = document.getElementById("sort");

  function matches(book, query){
    const q = query.toLowerCase();
    return book.dataset.title.includes(q) || book.dataset.author.includes(q);
  }

  function apply(){
    const query = filter.value.trim();
    const cards = [...grid.children];

    cards.forEach(card => {
      card.classList.toggle("hidden", query && !matches(card, query));
    });

    const key = sort.value;
    cards.sort((a,b) => {
      return a.dataset[key].localeCompare(b.dataset[key], "pt-BR", {numeric:true});
    }).forEach(card => grid.appendChild(card));
  }

  filter.addEventListener("input", apply);
  sort  .addEventListener("change", apply);

  function renderRemote(books){
  const grid = document.getElementById('bookshelfGrid');
  grid.innerHTML = '';
  if (!books.length){
    grid.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }
  books.forEach(b => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-cover-wrapper">
        <img src="${b.thumbnail || '/assets/images/placeholder.jpg'}"
             alt="Capa de ${b.title}" class="book-cover">
      </div>
      <div class="book-info">
        <h2 class="book-title">${b.title}</h2>
        <p class="book-author">${b.author}</p>
      </div>`;
    grid.appendChild(card);
  });
}

});
