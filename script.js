// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8421922493:AAG-6zXdALUQnq9JlUKyR8W_EK18ippooPQ';
const TELEGRAM_CHAT_IDS = ['6719958001', '5947748922', '7214965634'];

// Счётчик онлайн
let onlineCount = 7; // Начальное значение

function updateOnlineCounter() {
    // Случайное изменение количества онлайн (от -2 до +3)
    const randomChange = Math.floor(Math.random() * 6) - 2;
    onlineCount = Math.max(3, Math.min(15, onlineCount + randomChange));
    
    document.getElementById('onlineCount').textContent = onlineCount;
    
    // Обновляем каждые 30-60 секунд
    setTimeout(updateOnlineCounter, 30000 + Math.random() * 30000);
}

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

// Запуск счётчика онлайн при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateOnlineCounter();
});


// ... предыдущий код JavaScript ...

// Админ панель - управление изображениями
const adminPanel = document.querySelector('.admin-panel');
const adminUploadArea = document.getElementById('adminUploadArea');
const adminImageUpload = document.getElementById('adminImageUpload');
const adminPreviewGrid = document.getElementById('adminPreviewGrid');
const humiliatedGrid = document.getElementById('humiliatedGrid');
const clearImagesBtn = document.getElementById('clearImages');
const saveAdminBtn = document.getElementById('saveAdmin');

// Показать/скрыть админ панель
document.querySelectorAll('.admin-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
        
        if (adminPanel.style.display === 'block') {
            loadAdminImages();
        }
    });
});

// Загрузка изображений
adminUploadArea.addEventListener('click', () => {
    adminImageUpload.click();
});

adminImageUpload.addEventListener('change', (e) => {
    handleAdminUpload(e.target.files);
});

adminUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    adminUploadArea.style.background = 'rgba(0, 255, 0, 0.2)';
});

adminUploadArea.addEventListener('dragleave', () => {
    adminUploadArea.style.background = '';
});

adminUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    adminUploadArea.style.background = '';
    handleAdminUpload(e.dataTransfer.files);
});

function handleAdminUpload(files) {
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                addImageToPreview(e.target.result, file.name);
            }
            
            reader.readAsDataURL(file);
        }
    }
}

function addImageToPreview(imageData, filename) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
        <img src="${imageData}" alt="Preview">
        <button class="delete-btn" onclick="removePreviewImage(this)">×</button>
    `;
    previewItem.dataset.image = imageData;
    previewItem.dataset.filename = filename;
    adminPreviewGrid.appendChild(previewItem);
}

// Удаление изображения из превью
function removePreviewImage(button) {
    button.parentElement.remove();
    updatePlaceholderVisibility();
}

// Очистка всех изображений
clearImagesBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите удалить все изображения?')) {
        localStorage.removeItem('zxm_humiliated_images');
        adminPreviewGrid.innerHTML = '';
        humiliatedGrid.innerHTML = '';
        addPlaceholder();
    }
});

// Сохранение изменений
saveAdminBtn.addEventListener('click', () => {
    saveImages();
    alert('Изображения успешно сохранены!');
    adminPanel.style.display = 'none';
});

function saveImages() {
    const images = [];
    document.querySelectorAll('.preview-item').forEach(item => {
        images.push({
            data: item.dataset.image,
            filename: item.dataset.filename
        });
    });
    
    localStorage.setItem('zxm_humiliated_images', JSON.stringify(images));
    displayHumiliatedImages();
}

// Загрузка сохранённых изображений
function loadAdminImages() {
    adminPreviewGrid.innerHTML = '';
    const savedImages = JSON.parse(localStorage.getItem('zxm_humiliated_images') || '[]');
    
    savedImages.forEach(image => {
        addImageToPreview(image.data, image.filename);
    });
    
    updatePlaceholderVisibility();
}

// Отображение изображений в разделе "Кого мы унизили"
function displayHumiliatedImages() {
    const savedImages = JSON.parse(localStorage.getItem('zxm_humiliated_images') || '[]');
    humiliatedGrid.innerHTML = '';
    
    if (savedImages.length === 0) {
        addPlaceholder();
        return;
    }
    
    savedImages.forEach(image => {
        const item = document.createElement('div');
        item.className = 'humiliated-item';
        item.innerHTML = `<img src="${image.data}" alt="Униженный противник">`;
        humiliatedGrid.appendChild(item);
    });
}

function addPlaceholder() {
    humiliatedGrid.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-trophy"></i>
            <p>Здесь будут появляться наши победы!</p>
        </div>
    `;
}

function updatePlaceholderVisibility() {
    const hasImages = document.querySelectorAll('.preview-item').length > 0;
    if (!hasImages) {
        addPlaceholder();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... предыдущая инициализация ...
    
    // Загрузка изображений унижений
    displayHumiliatedImages();
    
    // Скрыть админ панель по умолчанию
    adminPanel.style.display = 'none';
});
