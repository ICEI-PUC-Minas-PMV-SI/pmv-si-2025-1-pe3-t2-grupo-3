document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        document.getElementById('profile-name').textContent = user.profile.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-member-since').textContent = user.profile.memberSince;
        document.getElementById('profile-avatar').src = user.profile.avatar;
        document.getElementById('profile-avatar').alt = `Foto de perfil de ${user.profile.name}`;
    } else {
        // Se o usuário não estiver logado, você pode exibir uma mensagem ou redirecionar para a página de login
        document.getElementById('profile-name').textContent = 'Usuário não logado';
        document.getElementById('profile-email').textContent = 'Faça login para ver seu perfil';
        document.getElementById('profile-member-since').textContent = '';
        document.getElementById('profile-avatar').src = 'default-avatar.png'; // Substitua por uma imagem padrão
        document.getElementById('profile-avatar').alt = 'Usuário não logado';
    }
});