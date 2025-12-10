function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function toggleOption(element) {
    element.classList.toggle('active');
}

// 모달 외부 클릭시 닫기
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
    });
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    }
});