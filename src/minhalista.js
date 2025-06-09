// minhalista.js

document.addEventListener('DOMContentLoaded', async () => {
    const myListGrid = document.getElementById('my-list-grid');
    const emptyListMessage = document.getElementById('empty-list-message');
    const messageDisplayId = 'minha-lista-message';

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        showMessage(messageDisplayId, 'Você precisa estar logado para ver sua lista. Redirecionando para o login...', 'error', 3000);
        myListGrid.innerHTML = '';
        emptyListMessage.textContent = 'Faça login para gerenciar sua lista.';
        emptyListMessage.style.display = 'block';
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        return;
    }

    // Função para carregar e exibir a lista do usuário
    async function loadMyList() {
        myListGrid.innerHTML = ''; // Limpa o grid antes de recarregar
        emptyListMessage.style.display = 'none';

        // Pega a lista do usuário do localStorage, que é o "banco de dados" local para a lista
        const userList = JSON.parse(localStorage.getItem(`userList_${currentUser.id}`) || '[]');

        if (userList.length === 0) {
            emptyListMessage.style.display = 'block';
        } else {
            // Para cada item na lista do usuário, vamos recriar o card
            // Os dados completos do filme/série já estão salvos na lista
            userList.forEach(item => {
                const movieCard = createMovieCard(item); // Reutiliza createMovieCard
                
                // Remove o botão "Adicionar à Lista" para itens já na lista
                const addBtn = movieCard.querySelector('.add-to-list-btn');
                if (addBtn) addBtn.remove();

                // Adiciona um botão de remover
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remover da Lista';
                removeBtn.classList.add('remove-from-list-btn');
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede que o clique no botão ative o clique no card
                    removeFromMyList(currentUser.id, item.id);
                });
                // Adiciona o botão ao elemento .movie-info dentro do card
                movieCard.querySelector('.movie-info').appendChild(removeBtn); 
                myListGrid.appendChild(movieCard);
            });
        }
    }

    // Define a função global para adicionar à lista (chamada por createMovieCard)
    window.addToMyList = (userId, itemData) => {
        if (!userId) {
            showMessage('minha-lista-message', 'Erro: Usuário não logado. Por favor, faça login.', 'error', 3000);
            return;
        }

        let userList = JSON.parse(localStorage.getItem(`userList_${userId}`) || '[]');
        
        // Verifica se o item já está na lista usando o ID
        if (!userList.some(item => item.id === itemData.id)) {
            userList.push(itemData);
            localStorage.setItem(`userList_${userId}`, JSON.stringify(userList));
            showMessage('minha-lista-message', `"${itemData.title}" adicionado à sua lista!`, 'success', 3000);
        } else {
            showMessage('minha-lista-message', `"${itemData.title}" já está na sua lista.`, 'error', 3000);
        }
        // Opcional: Recarrega a lista se o usuário estiver na página "Minha Lista"
        if (window.location.pathname.includes('minhalista.html')) {
            loadMyList();
        }
    };

    function removeFromMyList(userId, itemId) {
        let userList = JSON.parse(localStorage.getItem(`userList_${userId}`) || '[]');
        const updatedList = userList.filter(item => item.id !== itemId);
        localStorage.setItem(`userList_${userId}`, JSON.stringify(updatedList));
        showMessage('minha-lista-message', 'Item removido da sua lista.', 'success', 3000);
        loadMyList(); // Recarrega a lista após a remoção
    }

    // Carrega a lista do usuário ao entrar na página
    loadMyList();
});