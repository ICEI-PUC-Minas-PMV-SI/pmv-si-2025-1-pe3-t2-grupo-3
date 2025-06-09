// index.js

document.addEventListener('DOMContentLoaded', async () => {
    const destaqueGrid = document.getElementById('destaque-grid');
    const recomendacoesGrid = document.getElementById('recomendacoes-grid');

    if (destaqueGrid) destaqueGrid.innerHTML = '';
    if (recomendacoesGrid) recomendacoesGrid.innerHTML = '';

    // Carregar filmes para a seção "Em Destaque" (Filmes de 2025 e final de 2024)
    const movies2025 = await fetchMoviesFromBackend('/api/movies/by-year/2025');
    const movies2024 = await fetchMoviesFromBackend('/api/movies/by-year/2024');

    const featuredMovies = [...movies2025.slice(0, 10), ...movies2024.slice(0, 10)];
    featuredMovies.forEach(movie => {
        destaqueGrid.appendChild(createMovieCard(movie));
    });

    // Carregar filmes para a seção "Recomendações baseadas no seu humor"
    // Inicialmente, vamos usar filmes populares.
    const popularMovies = await fetchMoviesFromBackend('/api/movies/popular');
    popularMovies.slice(0, 10).forEach(movie => {
        recomendacoesGrid.appendChild(createMovieCard(movie));
    });

    // Mapeamento de humor para IDs de gênero do TMDB
    const moodGenreMap = {
        feliz: 35,       
        relaxado: 10749, 
        animado: 28,     
        pensativo: 18,   
        aventureiro: 12, 
        triste: 18       
    };

    window.filterMoviesByMood = async (mood) => {
        recomendacoesGrid.innerHTML = '';
        let moviesToDisplay = [];

        if (mood && mood !== 'skipped' && mood !== 'default') {
            const genreId = moodGenreMap[mood];
            if (genreId) {
                moviesToDisplay = await fetchMoviesFromBackend(`/api/movies/by-genre/${genreId}`);
                console.log(`Recomendações atualizadas para o humor: ${mood}`);
            } else {
                console.warn(`Humor '${mood}' não mapeado para um gênero. Exibindo populares.`);
                moviesToDisplay = popularMovies;
            }
        } else {
            moviesToDisplay = popularMovies;
            console.log('Exibindo recomendações populares (humor não selecionado/pulado).');
        }

        moviesToDisplay.slice(0, 10).forEach(movie => {
            recomendacoesGrid.appendChild(createMovieCard(movie));
        });
    };

    const storedMood = localStorage.getItem('userSelectedMood');
    const userMoodInteraction = sessionStorage.getItem('userMoodInteraction');

    if (storedMood && userMoodInteraction === 'selected') {
        window.filterMoviesByMood(storedMood);
    } else {
        window.filterMoviesByMood('default');
    }
});