// mood-popup.js

document.addEventListener('DOMContentLoaded', () => {
    const moodPopup = document.getElementById('mood-popup');
    const closeButton = moodPopup.querySelector('.close-button');
    const moodButtons = moodPopup.querySelectorAll('.mood-button');
    const skipButton = moodPopup.querySelector('.skip-button');

    function showPopup() {
        moodPopup.classList.add('show');
    }

    function hidePopup() {
        moodPopup.classList.remove('show');
    }

    // Exibe o pop-up 1 segundo após o carregamento da página
    setTimeout(() => {
        if (!sessionStorage.getItem('userMoodInteraction')) {
             showPopup();
        }
    }, 1000);

    closeButton.addEventListener('click', () => {
        hidePopup();
        sessionStorage.setItem('userMoodInteraction', 'skipped');
        if (window.filterMoviesByMood) {
            window.filterMoviesByMood('default');
        }
    });

    skipButton.addEventListener('click', () => {
        hidePopup();
        sessionStorage.setItem('userMoodInteraction', 'skipped');
        if (window.filterMoviesByMood) {
            window.filterMoviesByMood('default');
        }
    });

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            const selectedMood = button.dataset.mood;
            console.log(`Humor selecionado: ${selectedMood}`);
            
            localStorage.setItem('userSelectedMood', selectedMood);
            sessionStorage.setItem('userMoodInteraction', 'selected');

            hidePopup();

            if (window.filterMoviesByMood) {
                window.filterMoviesByMood(selectedMood);
            }
        });
    });

});