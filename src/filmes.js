// filmes.js

// As funções fetchMoviesFromBackend e createMovieCard são carregadas de global-functions.js.

document.addEventListener('DOMContentLoaded', async () => {
    const allMoviesGrid = document.getElementById('all-movies-grid');
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Carregar Mais Filmes';
    loadMoreButton.classList.add('load-more-btn');

    let currentPage = 1;

    async function loadMovies(page) {
        // Exibe um feedback de carregamento
        allMoviesGrid.innerHTML += '<div class="loading-message">Carregando...</div>';

        const movies = await fetchMoviesFromBackend(`/api/movies/popular?page=${page}`);
        
        const loadingMessage = allMoviesGrid.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                allMoviesGrid.appendChild(createMovieCard(movie));
            });
            currentPage++;
            if (movies.length < 20) { // TMDB retorna 20 por página, se for menos, não tem mais
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        } else if (page === 1) { // Se não houver filmes na primeira página
            loadMoreButton.style.display = 'none';
            const noMoviesMessage = document.createElement('p');
            noMoviesMessage.textContent = 'Nenhum filme encontrado no momento.';
            noMoviesMessage.style.color = 'var(--light-text)';
            noMoviesMessage.style.textAlign = 'center';
            allMoviesGrid.appendChild(noMoviesMessage);
        } else { // Não há mais filmes
            loadMoreButton.style.display = 'none';
            const noMoreMoviesMessage = document.createElement('p');
            noMoreMoviesMessage.textContent = 'Não há mais filmes para carregar.';
            noMoreMoviesMessage.style.color = 'var(--light-text)';
            noMoreMoviesMessage.style.textAlign = 'center';
            allMoviesGrid.appendChild(noMoreMoviesMessage);
        }
    }

    allMoviesGrid.innerHTML = '';
    await loadMovies(currentPage);

    // Adiciona o botão "Carregar Mais" à página, se ainda não estiver lá
    if (!document.querySelector('.load-more-btn')) {
        allMoviesGrid.parentNode.appendChild(loadMoreButton);
    }

    loadMoreButton.addEventListener('click', () => {
        loadMovies(currentPage);
    });
});