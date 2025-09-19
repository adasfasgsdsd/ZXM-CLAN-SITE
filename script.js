// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8421922493:AAG-6zXdALUQnq9JlUKyR8W_EK18ippooPQ';
const TELEGRAM_CHAT_IDS = ['6719958001', '5947748922', '7214965634'];

// Реальный счётчик онлайн (используем localStorage для имитации)
let onlineCount = 7; // Базовое значение

function getRealOnlineCount() {
    // Проверяем, есть ли сохранённое значение в localStorage
    const savedCount = localStorage.getItem('zxm_online_count');
    
    if (savedCount) {
        // Используем сохранённое значение ±2 для реалистичности
        const baseCount = parseInt(savedCount);
        const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(3, Math.min(15, baseCount + variation));
    } else {
        // Первый запуск - случайное значение от 5 до 10
        const initialCount = 5 + Math.floor(Math.random() * 6);
        localStorage.setItem('zxm_online_count', initialCount.toString());
        return initialCount;
    }
}

function updateOnlineCounter() {
    // Получаем реалистичное количество онлайн
    onlineCount = getRealOnlineCount();
    
    // Обновляем отображение
    document.getElementById('onlineCount').textContent = onlineCount;
    
    // Сохраняем текущее значение для следующего обновления
    localStorage.setItem('zxm_online_count', onlineCount.toString());
    
    // Обновляем каждые 2 минуты для реалистичности
    setTimeout(updateOnlineCounter, 120000);
}

// Mobile Navigation
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Функция для переключения навигации
function toggleNav() {
    nav.classList.toggle('active');
    
    // Анимация ссылок
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

mobileMenuBtn.addEventListener('click', toggleNav);

// Закрытие меню при клике на ссылку
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleNav();
        }
    });
});

// Form Submission to Telegram
const joinForm = document.getElementById('joinForm');
const submitBtn = joinForm.querySelector('button[type="submit"]');

joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Сохраняем оригинальный текст кнопки
    const originalText = submitBtn.textContent;
    
    // Показываем загрузку
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Собираем данные формы
        const formData = new FormData(joinForm);
        const data = {
            nickname: formData.get('nickname'),
            age: formData.get('age'),
            discord: formData.get('discord'),
            level: formData.get('level'),
            experience: formData.get('experience'),
            message: formData.get('message')
        };
        
        // Валидация данных
        if (!data.nickname || !data.age || !data.discord || !data.level || !data.experience || !data.message) {
            alert('⚠️ Заполните все поля!');
            return;
        }
        
        // Возраст от 9 лет
        if (data.age < 9) {
            alert('⚠️ Возраст должен быть от 9 лет!');
            return;
        }
        
        if (data.age > 100) {
            alert('⚠️ Пожалуйста, укажите реальный возраст!');
            return;
        }
        
        // Формируем сообщение для Telegram
        const experienceText = {
            'beginner': 'Начинающий (менее 100 часов)',
            'intermediate': 'Опытный (100-500 часов)',
            'advanced': 'Продвинутый (500-1000 часов)',
            'expert': 'Эксперт (более 1000 часов)'
        }[data.experience] || data.experience;
        
        const telegramMessage = `
🎮 *НОВАЯ ЗАЯВКА В КЛАН ZXM*

*Никнейм в Boom Hood:* ${data.nickname}
*Возраст:* ${data.age}
*Уровень:* ${data.level}
*Discord:* ${data.discord}
*Опыт игры:* ${experienceText}
*Сообщение:* ${data.message}

*Дата:* ${new Date().toLocaleString('ru-RU')}
        `.trim();
        
        // Отправляем во все чаты
        let sentCount = 0;
        
        for (const chatId of TELEGRAM_CHAT_IDS) {
            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMessage,
                        parse_mode: 'Markdown'
                    })
                });
                
                const result = await response.json();
                if (result.ok) {
                    sentCount++;
                }
            } catch (error) {
                console.error(`Ошибка отправки в chat_id ${chatId}:`, error);
            }
        }
        
        if (sentCount > 0) {
            alert('✅ Заявка успешно отправлена! Мы свяжемся с вами в Discord.');
            joinForm.reset();
        } else {
            throw new Error('Не удалось отправить ни в один чат');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или свяжитесь с нами через Discord.');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Плавная прокрутка с учетом фиксированного хедера
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрыть мобильное меню если открыто
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
            
            // Плавная прокрутка к элементу
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация для мобильного меню
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

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

// Запуск счётчика онлайн при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем начальное значение
    document.getElementById('onlineCount').textContent = getRealOnlineCount();
    
    // Запускаем обновление
    updateOnlineCounter();
});
