// Обработка отправки формы
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Сбор данных формы
    const formData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        level: document.getElementById('level').value,
        experience: document.getElementById('experience').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // В реальном приложении здесь будет код для отправки данных в Telegram бота
    // Для этого нужно использовать Telegram Bot API
    
    // Сообщение об успешной отправке
    alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время через Telegram.');
    
    // Очистка формы
    this.reset();
});

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
    });
});

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация появления элементов при прокрутке
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOptions = {
        threshold: 0.3
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transition = 'opacity 0.5s ease-in-out';
        fadeInObserver.observe(element);
    });
});

// Фиксация хедера при прокрутке
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 27, 0.95)';
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'rgba(15, 15, 27, 0.8)';
        header.style.boxShadow = 'none';
    }
});
