// editar-perfil.js

// As funções hashString e showMessage agora são carregadas de global-functions.js.

document.addEventListener('DOMContentLoaded', () => {
    const currentAvatar = document.getElementById('current-avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const editProfileForm = document.querySelector('.edit-profile-form');
    const cancelBtn = document.querySelector('.cancel-btn');
    const messageDisplayId = 'edit-profile-message';


    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        fullNameInput.value = currentUser.profile.name || '';
        emailInput.value = currentUser.email || '';
        usernameInput.value = currentUser.username || '';

        currentAvatar.src = currentUser.profile.avatar || 'https://via.placeholder.com/150?text=Sem+Foto';
        currentAvatar.alt = `Foto de perfil de ${currentUser.profile.name || 'Usuário'}`;

    } else {
        alert('Nenhum usuário logado. Redirecionando para o login.'); // Mantido alert aqui para redirecionamento crítico
        window.location.href = 'login.html';
        return;
    }

    avatarUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentAvatar.src = e.target.result;
                currentUser.profile.avatar = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showMessage(messageDisplayId, 'Foto de perfil atualizada para pré-visualização. Clique em Salvar Alterações para confirmar.', 'success', 5000);
            };
            reader.readAsDataURL(file);
        }
    });

    editProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showMessage(messageDisplayId, '', 'none'); // Limpa mensagens anteriores

        const newFullName = fullNameInput.value.trim();
        const newUsername = usernameInput.value.trim();
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        if (newFullName === '') {
            showMessage(messageDisplayId, 'Por favor, preencha o campo "Nome Completo".');
            fullNameInput.focus();
            return;
        }
        if (newUsername === '') {
            showMessage(messageDisplayId, 'Por favor, preencha o campo "Nome de Usuário".');
            usernameInput.focus();
            return;
        }

        let updatedPassword = null;
        if (oldPassword || newPassword || confirmNewPassword) {
            if (oldPassword === '') {
                showMessage(messageDisplayId, 'Para alterar a senha, você deve digitar sua "Senha Antiga".');
                oldPasswordInput.focus();
                return;
            }

            const hashedOldPasswordInput = await hashString(oldPassword);

            if (hashedOldPasswordInput !== currentUser.password) {
                showMessage(messageDisplayId, 'Senha antiga incorreta!');
                oldPasswordInput.focus();
                return;
            }

            if (newPassword === '') {
                showMessage(messageDisplayId, 'Por favor, digite sua "Nova Senha".');
                newPasswordInput.focus();
                return;
            }
            if (newPassword.length < 6) {
                showMessage(messageDisplayId, 'A "Nova Senha" deve ter no mínimo 6 caracteres.');
                newPasswordInput.focus();
                return;
            }
            if (newPassword !== confirmNewPassword) {
                showMessage(messageDisplayId, 'A "Nova Senha" e a "Confirmação da Nova Senha" não coincidem.');
                confirmNewPasswordInput.focus();
                return;
            }
            updatedPassword = await hashString(newPassword);
        }

        const updateData = {
            userId: currentUser.id, // Envia o ID do usuário
            newFullName: newFullName,
            newUsername: newUsername,
            avatar: currentUser.profile.avatar
        };
        if (updatedPassword) {
            updateData.newPassword = updatedPassword;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                // Atualiza o currentUser no localStorage com os dados retornados pelo backend
                localStorage.setItem('currentUser', JSON.stringify(data.user));

                showMessage(messageDisplayId, data.message + ' Redirecionando...', 'success', 2000);
                oldPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmNewPasswordInput.value = '';

                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 2000);
            } else {
                showMessage(messageDisplayId, data.error || 'Erro desconhecido ao atualizar perfil.');
            }
        } catch (error) {
            console.error('Erro ao comunicar com o backend para atualizar perfil:', error);
            showMessage(messageDisplayId, 'Ocorreu um erro de comunicação com o servidor. Tente novamente mais tarde.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
});