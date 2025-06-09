// perfil.js

// A função showMessage é carregada de global-functions.js.

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userSelectedMood');
            sessionStorage.removeItem('userMoodInteraction');
            alert('Você foi desconectado.');
            window.location.href = 'landing-page.html';
        });
    }

    if (user) {
        document.getElementById('profile-name').textContent = user.profile.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-member-since').textContent = user.profile.memberSince;
        document.getElementById('profile-avatar').src = user.profile.avatar;
        document.getElementById('profile-avatar').alt = `Foto de perfil de ${user.profile.name}`;
    } else {
        document.getElementById('profile-name').textContent = 'Usuário não logado';
        document.getElementById('profile-email').textContent = 'Faça login para ver seu perfil';
        document.getElementById('profile-member-since').textContent = '';
        document.getElementById('profile-avatar').src = 'https://via.placeholder.com/150?text=Sem+Foto';
        document.getElementById('profile-avatar').alt = 'Usuário não logado';
        
        // Redireciona para a tela de login se não houver currentUser
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
    }
});