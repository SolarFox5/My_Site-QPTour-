// Функция для загрузки HTML-файлов
async function includeHTML(elementId, filePath) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Элемент с ID "${elementId}" не найден на странице`);
            return; // Прерываем выполнение функции, если элемент не найден
        }

        const response = await fetch(filePath);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
    }
}

// Загрузка хедера и футера при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Проверяем наличие контейнеров перед загрузкой
    if (document.getElementById('header-container')) {
        includeHTML('header-container', 'includes/header.html');
    }

    if (document.getElementById('footer-container')) {
        includeHTML('footer-container', 'includes/footer.html');
    }
});
try {
    // Код для загрузки хедера
} catch (error) {
    console.error('Ошибка при загрузке хедера:', error);
    // Продолжить загрузку страницы даже при ошибке
}