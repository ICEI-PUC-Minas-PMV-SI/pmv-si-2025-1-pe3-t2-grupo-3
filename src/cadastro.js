// cadastro.js

// As funções hashString e showMessage agora são carregadas de global-functions.js.

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    const messageDisplayId = 'register-message';

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showMessage(messageDisplayId, '', 'none'); // Limpa mensagens anteriores

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;

            if (name === '' || email === '' || password === '' || confirmPassword === '') {
                showMessage(messageDisplayId, 'Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (password !== confirmPassword) {
                showMessage(messageDisplayId, 'As senhas não coincidem!');
                return;
            }

            if (password.length < 6) {
                showMessage(messageDisplayId, 'A senha deve ter no mínimo 6 caracteres.');
                return;
            }

            if (!termsAccepted) {
                showMessage(messageDisplayId, 'Você deve aceitar os Termos de Uso e Política de Privacidade.');
                return;
            }

            try {
                const hashedPassword = await hashString(password);

                const newUser = {
                    name: name,
                    email: email,
                    username: email.split('@')[0],
                    hashedPassword: hashedPassword,
                    memberSince: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                };

                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage(messageDisplayId, data.message + ' Redirecionando para o login...', 'success', 2000);
                    registerForm.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(messageDisplayId, data.error || 'Erro desconhecido ao cadastrar.');
                }

            } catch (error) {
                console.error('Erro ao processar o cadastro:', error);
                showMessage(messageDisplayId, 'Ocorreu um erro de comunicação com o servidor. Tente novamente mais tarde.');
            }
        });
    }
});