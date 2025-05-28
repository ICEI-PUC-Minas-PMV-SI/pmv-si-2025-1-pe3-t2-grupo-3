// cadastro.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            if (!termsAccepted) {
                alert('Você deve aceitar os Termos de Uso e Política de Privacidade.');
                return;
            }

            try {
                // Em um ambiente real, você enviaria esses dados para um servidor.
                // Aqui, vamos simular a adição de um novo usuário ao JSON.
                // ATENÇÃO: Esta simulação NÃO PERSISTIRÁ os dados após o recarregamento da página.
                // Para persistência, seria necessário um backend.

                const response = await fetch('users.json');
                let users = await response.json();

                // Verifica se o email já existe (ou username, se fosse o caso)
                if (users.some(u => u.email === email)) {
                    alert('Este e-mail já está cadastrado. Tente outro ou faça login.');
                    return;
                }

                const newUser = {
                    id: 'user' + (users.length + 1), // ID simples baseado no número de usuários
                    email: email,
                    username: email.split('@')[0], // Gera um username simples a partir do email
                    password: password, // Em um ambiente real, a senha seria HASHED!
                    profile: {
                        name: name,
                        memberSince: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
                        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Avatar padrão
                    },
                    moodPreferences: "" // Inicializa vazio
                };

                // Para simulação, você pode ver o novo usuário no console
                console.log("Novo usuário a ser 'cadastrado':", newUser);
                users.push(newUser); // Adiciona ao array (temporariamente)

                alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
                window.location.href = 'login.html'; // Redireciona para a página de login
                
            } catch (error) {
                console.error('Erro ao processar o cadastro:', error);
                alert('Ocorreu um erro ao tentar cadastrar. Tente novamente mais tarde.');
            }
        });
    }
});