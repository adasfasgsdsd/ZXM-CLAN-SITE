// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8421922493:AAG-6zXdALUQnq9JlUKyR8W_EK18ippooPQ';
const TELEGRAM_CHAT_IDS = ['6719958001', '5947748922', '7214965634'];

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Функция для переключения навигации
function toggleNav() {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    
    // Анимация ссылок
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

burger.addEventListener('click', toggleNav);

// Закрытие меню при клике на ссылку
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('nav-active')) {
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
            message: formData.get('message')
        };
        
        // Валидация данных
        if (!data.nickname || !data.age || !data.discord || !data.message) {
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
        const telegramMessage = `
🎮 *НОВАЯ ЗАЯВКА В КЛАН ZXM*

*Никнейм в Roblox:* ${data.nickname}
*Возраст:* ${data.age}
*Discord:* ${data.discord}
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
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
            
            // Плавная прокрутка к элементу
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработчик для кнопки в герое (открывает Telegram)
document.querySelector('.hero-content .btn').addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://t.me/+pYnbxFJTZtg5YTYy', '_blank');
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
