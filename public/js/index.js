const openModal = modalId => {
    document.getElementById(modalId).classList.add('active');
};

const closeModal = modalId => {
    document.getElementById(modalId).classList.remove('active');
};

const toggleOption = element => {
    element.classList.toggle('active');
};


document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    }
});