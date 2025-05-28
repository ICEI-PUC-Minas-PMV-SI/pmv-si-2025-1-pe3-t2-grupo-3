// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const emailOrUsername = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Carrega o arquivo JSON de usuários
                const response = await fetch('users.json');
                const users = await response.json();

                // Procura pelo usuário
                const user = users.find(u =>
                    (u.email === emailOrUsername || u.username === emailOrUsername) &&
                    u.password === password
                );

                if (user) {
                    // Login bem-sucedido
                    alert('Login realizado com sucesso! Bem-vindo, ' + user.profile.name + '!');
                    // O ideal aqui seria armazenar o ID do usuário em localStorage/sessionStorage
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'index.html'; // Redireciona APENAS se o login for bem-sucedido
                } else {
                    // Credenciais inválidas
                    alert('Email/Usuário ou Senha inválidos.');
                    // Permanece na página de login
                }
            } catch (error) {
                console.error('Erro ao carregar ou processar usuários:', error);
                alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
            }
        });
    }
});