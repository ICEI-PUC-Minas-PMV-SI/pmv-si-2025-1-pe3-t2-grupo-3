// editar-perfil.js

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

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // 1. Carregar dados do usuário logado ao carregar a página
    if (currentUser) {
        fullNameInput.value = currentUser.profile.name || '';
        emailInput.value = currentUser.email || '';
        usernameInput.value = currentUser.username || '';
        
        currentAvatar.src = currentUser.profile.avatar || 'https://via.placeholder.com/150?text=Sem+Foto'; 
        currentAvatar.alt = `Foto de perfil de ${currentUser.profile.name || 'Usuário'}`;

    } else {
        alert('Nenhum usuário logado. Redirecionando para o login.');
        window.location.href = 'login.html'; 
        return; 
    }

    // 2. Pré-visualização da imagem do avatar ao selecionar um arquivo
    avatarUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentAvatar.src = e.target.result;
                currentUser.profile.avatar = e.target.result; 
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Lógica para salvar as alterações ao clicar no botão "Salvar Alterações"
    editProfileForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Pega os valores atualizados dos campos
        const newFullName = fullNameInput.value.trim(); // .trim() remove espaços em branco extras
        const newUsername = usernameInput.value.trim();
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        // --- VALIDAÇÕES DE CAMPOS OBRIGATÓRIOS ---
        if (newFullName === '') {
            alert('Por favor, preencha o campo "Nome Completo".');
            fullNameInput.focus();
            return;
        }
        if (newUsername === '') {
            alert('Por favor, preencha o campo "Nome de Usuário".');
            usernameInput.focus();
            return;
        }

        // --- VALIDAÇÃO DA ALTERAÇÃO DE SENHA ---
        if (newPassword || confirmNewPassword) { // Se o usuário tentou alterar a senha (pelo menos um campo preenchido)
            if (oldPassword === '') {
                alert('Para alterar a senha, você deve digitar sua "Senha Antiga".');
                oldPasswordInput.focus();
                return;
            }
            // Simulação: Em um sistema real, você compararia o HASH da senha antiga com o HASH do input
            if (oldPassword !== currentUser.password) { 
                alert('Senha antiga incorreta!');
                oldPasswordInput.focus();
                return;
            }
            if (newPassword === '') {
                alert('Por favor, digite sua "Nova Senha".');
                newPasswordInput.focus();
                return;
            }
            if (newPassword.length < 6) { 
                alert('A "Nova Senha" deve ter no mínimo 6 caracteres.');
                newPasswordInput.focus();
                return;
            }
            if (newPassword !== confirmNewPassword) {
                alert('A "Nova Senha" e a "Confirmação da Nova Senha" não coincidem.');
                confirmNewPasswordInput.focus();
                return;
            }
            // Se todas as validações de senha passarem, atualiza a senha
            currentUser.password = newPassword; 
        } else if (oldPassword !== '') {
            // Se a senha antiga foi preenchida mas as novas senhas não
            alert('Para alterar a senha, você deve preencher os campos "Nova Senha" e "Confirmar Nova Senha".');
            newPasswordInput.focus();
            return;
        }

        // Atualizar outras informações do perfil no objeto currentUser
        currentUser.profile.name = newFullName;
        currentUser.username = newUsername;
        // O avatar já é atualizado na pré-visualização no evento 'change' se uma nova imagem foi selecionada.

        // Simular salvamento: Salva o objeto currentUser atualizado no localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); 

        alert('Perfil atualizado com sucesso! (Estas alterações são locais e temporárias)');
        window.location.href = 'perfil.html'; // Redireciona de volta para a página de perfil
    });

    // 4. Lógica para o botão Cancelar
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html'; // Volta para a página de perfil sem salvar
    });
});