// login.js

// As funções hashString e showMessage agora são carregadas de global-functions.js.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const messageDisplayId = 'login-message';

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showMessage(messageDisplayId, '', 'none'); // Limpa mensagens anteriores

            const emailOrUsername = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (emailOrUsername === '' || password === '') {
                showMessage(messageDisplayId, 'Por favor, preencha todos os campos.');
                return;
            }

            try {
                const hashedPasswordInput = await hashString(password);

                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ emailOrUsername, hashedPassword: hashedPasswordInput })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(messageDisplayId, data.message + ' Redirecionando...', 'success', 2000);
                    loginForm.reset();
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showMessage(messageDisplayId, data.error || 'Erro desconhecido ao fazer login.');
                }
            } catch (error) {
                console.error('Erro ao comunicar com o backend para login:', error);
                showMessage(messageDisplayId, 'Ocorreu um erro de comunicação com o servidor. Tente novamente mais tarde.');
            }
        });
    }
});