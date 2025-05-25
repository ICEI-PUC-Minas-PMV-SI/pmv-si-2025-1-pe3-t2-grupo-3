// mood-popup.js

document.addEventListener('DOMContentLoaded', () => {
    const moodPopup = document.getElementById('mood-popup');
    const closeButton = moodPopup.querySelector('.close-button');
    const moodButtons = moodPopup.querySelectorAll('.mood-button');
    const skipButton = moodPopup.querySelector('.skip-button');

    // Função para mostrar o pop-up
    function showPopup() {
        moodPopup.classList.add('show');
    }

    // Função para esconder o pop-up
    function hidePopup() {
        moodPopup.classList.remove('show');
    }

    // Exibe o pop-up 1 segundo após o carregamento da página
    // Você pode ajustar este tempo
    setTimeout(() => {
        showPopup();
    }, 1000); 

    // Evento para fechar o pop-up ao clicar no X
    closeButton.addEventListener('click', hidePopup);

    // Evento para fechar o pop-up ao clicar em Pular
    skipButton.addEventListener('click', hidePopup);

    // Evento para selecionar um humor e fechar o pop-up
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'selected' de todos os botões
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Adiciona a classe 'selected' ao botão clicado
            button.classList.add('selected');

            const selectedMood = button.dataset.mood;
            console.log(`Humor selecionado: ${selectedMood}`);
            // Aqui você faria a lógica para filtrar o conteúdo
            // Por exemplo: carregar filmes/séries baseados em 'selectedMood'
            
            // Esconde o pop-up após a seleção
            hidePopup();

            // Opcional: Salvar o humor no localStorage para não mostrar o pop-up novamente
            // localStorage.setItem('userMood', selectedMood);
        });
    });

    // Opcional: Se você quiser que o pop-up apareça apenas uma vez
    // descomente as linhas abaixo e as linhas com localStorage.setItem acima
    /*
    if (localStorage.getItem('userMood')) {
        // Se o usuário já selecionou um humor, não mostre o pop-up
        hidePopup();
    } else {
        // Mostra o pop-up se ainda não houver humor salvo
        setTimeout(() => {
            showPopup();
        }, 1000);
    }
    */
});