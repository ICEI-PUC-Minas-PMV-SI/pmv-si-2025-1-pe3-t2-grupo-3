async function hashString(text) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
}

function showMessage(elementId, msg, type = 'error', timeout = 5000) {
    const messageDisplay = document.getElementById(elementId);
    if (messageDisplay) {
        messageDisplay.textContent = msg;
        messageDisplay.className = `message ${type}`;
        messageDisplay.style.display = 'block';
        if (messageDisplay._timeoutId) {
            clearTimeout(messageDisplay._timeoutId);
        }
        messageDisplay._timeoutId = setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, timeout);
    }
}

async function fetchMoviesFromBackend(endpoint) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}. Detalhe: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();

        return data.results.map(item => ({
            id: item.id,
            title: item.title || item.name,
            year: (item.release_date || item.first_air_date || '').substring(0, 4),
            imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem',
            media_type: item.media_type || (endpoint.includes('/tv/') ? 'tv' : 'movie')
        })) || [];
    } catch (error) {
        console.error(`Erro ao carregar dados do backend (${endpoint}):`, error);
        showMessage('main-message-display', `Erro ao carregar conteúdo: ${error.message}`, 'error', 7000);
        return [];
    }
}

function createMovieCard(item) {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.dataset.id = item.id;
    movieItem.dataset.title = item.title;
    movieItem.dataset.year = item.year;
    movieItem.dataset.imageUrl = item.imageUrl;
    movieItem.dataset.mediaType = item.media_type;

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = `Capa do ${item.title}`;
    img.onerror = function() {
        this.onerror=null;
        this.src='https://via.placeholder.com/200x300?text=Imagem+Nao+Disponivel';
    };

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    const h3 = document.createElement('h3');
    h3.textContent = item.title;

    const p = document.createElement('p');
    p.textContent = `Ano: ${item.year || 'N/A'}`;

    const addToListBtn = document.createElement('button');
    addToListBtn.classList.add('add-to-list-btn');
    addToListBtn.innerHTML = '&#9733; Adicionar à Lista';

    addToListBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (window.addToMyList) {
                window.addToMyList(currentUser.id, {
                    id: item.id,
                    title: item.title,
                    year: item.year,
                    imageUrl: item.imageUrl,
                    media_type: item.media_type
                });
            } else {
                showMessage('minha-lista-message', 'Erro: Função de adicionar à lista não disponível. Verifique o console.', 'error', 3000);
                console.error("window.addToMyList não está definida. minhalista.js pode não ter carregado na ordem correta.");
            }
        } else {
            showMessage('login-message', 'Você precisa estar logado para adicionar itens à lista!', 'error', 5000);
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        }
    });

    movieInfo.appendChild(h3);
    movieInfo.appendChild(p);
    movieInfo.appendChild(addToListBtn);
    movieItem.appendChild(img);
    movieItem.appendChild(movieInfo);

    return movieItem;
}