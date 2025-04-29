document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, загружены ли необходимые библиотеки
    if (!window.Globe) {
        console.error('Globe.gl library not loaded');
        return;
    }

    // Данные о местах
    const places = [
        { name: 'Москва', lat: 55.7558, lng: 37.6173, description: 'Столица России' },
        { name: 'Санкт-Петербург', lat: 59.9343, lng: 30.3351, description: 'Культурная столица России' },
        { name: 'Сочи', lat: 43.6028, lng: 39.7342, description: 'Курортный город на Черном море' },
        { name: 'Дагестан', lat: 42.8207, lng: 47.1220, description: 'Республика на Кавказе' },
        { name: 'Тбилиси', lat: 41.7151, lng: 44.8271, description: 'Столица Грузии' },
        { name: 'Стамбул', lat: 41.0082, lng: 28.9784, description: 'Город на стыке Европы и Азии' },
        { name: 'Дубай', lat: 25.2048, lng: 55.2708, description: 'Город небоскребов' },
        { name: 'Бали', lat: -8.3405, lng: 115.0920, description: 'Остров в Индонезии' },
        { name: 'Пхукет', lat: 7.9519, lng: 98.3381, description: 'Остров в Таиланде' },
        { name: 'Алтай', lat: 50.7747, lng: 86.1930, description: 'Горный регион России' },
        { name: 'Осетия', lat: 43.1500, lng: 44.5000, description: 'Республика на Кавказе' },
        { name: 'Грузия', lat: 42.3154, lng: 43.3569, description: 'Страна на Кавказе' },
        { name: 'Мальдивы', lat: 3.2028, lng: 73.2207, description: 'Острова в Индийском океане' }
    ];

    // Создаем экземпляр глобуса
    const globeContainer = document.getElementById('globe-container');
    if (!globeContainer) {
        console.error('Globe container not found');
        return;
    }

    // Создаем HTML-элемент для всплывающей подсказки
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.padding = '10px';
    tooltip.style.background = 'white';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);

    // Создаем SVG для маркера-капельки
    const markerSvg = `
        <svg viewBox="0 0 24 36">
            <path d="M12 0C5.5 0 0 5.5 0 12c0 6.4 12 24 12 24s12-17.6 12-24c0-6.5-5.5-12-12-12z" fill="#ff5100"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
    `;

    // Инициализация глобуса
    const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .htmlElementsData(places)
        .htmlElement(d => {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.pointerEvents = 'auto';
            container.style.cursor = 'pointer';

            // Создаем маркер
            const marker = document.createElement('div');
            marker.innerHTML = markerSvg;
            marker.style.width = '24px';
            marker.style.height = '36px';
            marker.style.position = 'absolute';
            marker.style.left = '50%';
            marker.style.bottom = '0';
            marker.style.transform = 'translateX(-50%)';

            // Создаем подпись
            const label = document.createElement('div');
            label.textContent = d.name;
            label.style.color = '#ff5100';
            label.style.fontWeight = 'bold';
            label.style.fontSize = '12px';
            label.style.textAlign = 'center';
            label.style.position = 'absolute';
            label.style.width = '100px';
            label.style.left = '50%';
            label.style.bottom = '36px';
            label.style.transform = 'translateX(-50%)';
            label.style.textShadow = '0 0 3px rgba(0,0,0,0.5)';

            // Добавляем элементы в контейнер
            container.appendChild(marker);
            container.appendChild(label);

            // Добавляем обработчики событий
            container.addEventListener('mouseenter', () => {
                // Показываем подсказку с оранжевым заголовком
                tooltip.innerHTML = `<div style="font-weight: bold; color: #ff5100;">${d.name}</div><div>${d.description}</div>`;
                tooltip.style.display = 'block';

                // Останавливаем вращение
                globe.controls().autoRotate = false;
            });


            container.addEventListener('mousemove', event => {
                // Перемещаем подсказку за курсором
                tooltip.style.left = `${event.clientX + 10}px`;
                tooltip.style.top = `${event.clientY + 10}px`;
            });

            container.addEventListener('mouseleave', () => {
                // Скрываем подсказку
                tooltip.style.display = 'none';

                // Возобновляем вращение
                globe.controls().autoRotate = true;
            });

            return container;
        })
        .htmlAltitude(0.01)
        .pointOfView({ lat: 30, lng: 30, altitude: 2.5 })
        (globeContainer);

    // Настройка контроллера
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 200;
    controls.maxDistance = 500;

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        globe.width(globeContainer.offsetWidth)
            .height(globeContainer.offsetHeight);
    });

    // Обработчик кнопки вращения
    const toggleButton = document.getElementById('toggleRotation');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            controls.autoRotate = !controls.autoRotate;
            toggleButton.textContent = controls.autoRotate ? 'Остановить' : 'Вращение';
        });
    }
});
