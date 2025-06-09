// series.js

// As funções fetchMoviesFromBackend e createMovieCard são carregadas de global-functions.js.

document.addEventListener('DOMContentLoaded', async () => {
    const allSeriesGrid = document.getElementById('all-series-grid');
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Carregar Mais Séries';
    loadMoreButton.classList.add('load-more-btn');

    let currentPage = 1;

    async function loadSeries(page) {
        allSeriesGrid.innerHTML += '<div class="loading-message">Carregando...</div>';

        // Endpoint para buscar séries populares (TV) da TMDB via backend
        const series = await fetchMoviesFromBackend(`/api/tv/popular?page=${page}`);
        
        const loadingMessage = allSeriesGrid.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (series && series.length > 0) {
            series.forEach(item => {
                allSeriesGrid.appendChild(createMovieCard(item)); // createMovieCard já mapeia corretamente
            });
            currentPage++;
            if (series.length < 20) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        } else if (page === 1) { // Se não houver séries na primeira página
            loadMoreButton.style.display = 'none';
            const noSeriesMessage = document.createElement('p');
            noSeriesMessage.textContent = 'Nenhuma série encontrada no momento.';
            noSeriesMessage.style.color = 'var(--light-text)';
            noSeriesMessage.style.textAlign = 'center';
            allSeriesGrid.appendChild(noSeriesMessage);
        } else { // Não há mais séries
            loadMoreButton.style.display = 'none';
            const noMoreSeriesMessage = document.createElement('p');
            noMoreSeriesMessage.textContent = 'Não há mais séries para carregar.';
            noMoreSeriesMessage.style.color = 'var(--light-text)';
            noMoreSeriesMessage.style.textAlign = 'center';
            allSeriesGrid.appendChild(noMoreSeriesMessage);
        }
    }

    allSeriesGrid.innerHTML = '';
    await loadSeries(currentPage);

    if (!document.querySelector('.load-more-btn')) { // Evita duplicar o botão se já existir
        allSeriesGrid.parentNode.appendChild(loadMoreButton);
    }

    loadMoreButton.addEventListener('click', () => {
        loadSeries(currentPage);
    });
});