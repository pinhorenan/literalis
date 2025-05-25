/* /scripts/bookshelf.js */

document.addEventListener("DOMContentLoaded", () => {

  // 1) Busca remota?
  const params = new URLSearchParams(window.location.search);
  const term   = params.get("remoteSearch");
  if (term) {
    // Esconde controles locais
    document.querySelector('.bookshelf-controls')?.classList.add('hidden');

    // Faz o fetch pra sua API no Heroku
    fetch(`https://literalis-backend-e05dd5a2404f.herokuapp.com/books/search?q=${encodeURIComponent(term)}`)
      .then(r => r.json())
      .then(renderRemote)
      .catch(err => {
        console.error("Erro na busca remota:", err);
        const grid = document.getElementById('bookshelfGrid');
        grid.innerHTML = '<p>Erro ao buscar livros. Tente novamente.</p>';
      });

    // Não roda o filtro local
    return;
  }

  // 2) Se não houve termo remoto, segue o filtro/ordenação local
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
      return a.dataset[key]
        .localeCompare(b.dataset[key], "pt-BR", {numeric:true});
    }).forEach(card => grid.appendChild(card));
  }

  filter.addEventListener("input", apply);
  sort  .addEventListener("change", apply);

  // Função de renderização local, se houver
  function renderLocal(books) {
    // ...seu código, se precisar...
  }

  // 3) Função de renderização remota
  function renderRemote(books){
    const grid = document.getElementById('bookshelfGrid');
    grid.innerHTML = '';

    // Placeholder definido via Jekyll
    const placeholder = '{{ "/assets/images/placeholder.jpg" | relative_url }}';

    if (!books.length){
      grid.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }

    books.forEach(b => {
      // força HTTPS em capas que venham como http://
      let imgUrl = b.thumbnail || placeholder;
      if (imgUrl.startsWith('http://')) {
        imgUrl = imgUrl.replace(/^http:\/\//i, 'https://');
      }

      const card = document.createElement('article');
      card.className = 'book-card';
      card.innerHTML = `
        <div class="book-cover-wrapper">
          <img src="${imgUrl}"
               alt="Capa de ${b.title}"
               class="book-cover">
        </div>
        <div class="book-info">
          <h2 class="book-title">${b.title}</h2>
          <p class="book-author">${b.author}</p>
        </div>`;
      grid.appendChild(card);
    });
  }

});
