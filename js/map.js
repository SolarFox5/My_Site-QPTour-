document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, загружены ли необходимые библиотеки
    if (!window.Globe) {
        console.error('Globe.gl library not loaded');
        return;
    }

        // Данные о местах с информацией о доступности туров
        const places = [
            { name: 'Москва', lat: 55.7558, lng: 37.6173, description: 'Столица России', hasBooking: false },
            { name: 'Санкт-Петербург', lat: 59.9343, lng: 30.3351, description: 'Культурная столица России', hasBooking: false },
            { name: 'Екатеринбург', lat: 56.8431, lng: 60.6454, description: 'Столица Урала', hasBooking: false },
            { name: 'Сочи', lat: 43.6028, lng: 39.7342, description: 'Курортный город на Черном море', hasBooking: false },
            { name: 'Дагестан', lat: 42.8207, lng: 47.1220, description: 'Республика на Кавказе', hasBooking: true, tourId: 'dagestan' },
            { name: 'Тбилиси', lat: 41.7151, lng: 44.8271, description: 'Столица Грузии', hasBooking: false },
            { name: 'Абхазия', lat: 42.8766, lng: 41.1066, description: 'Республика на побережье Черного моря', hasBooking: true, tourId: 'abkhazia' },
            { name: 'Стамбул', lat: 41.0082, lng: 28.9784, description: 'Город на стыке Европы и Азии', hasBooking: false },
            { name: 'Дубай', lat: 25.2048, lng: 55.2708, description: 'Город небоскребов', hasBooking: false },
            { name: 'Бали', lat: -8.3405, lng: 115.0920, description: 'Остров в Индонезии', hasBooking: false },
            { name: 'Пхукет', lat: 7.9519, lng: 98.3381, description: 'Остров в Таиланде', hasBooking: false },
            { name: 'Алтай', lat: 50.7747, lng: 86.1930, description: 'Горный регион России', hasBooking: true, tourId: 'altai' },
            { name: 'Осетия', lat: 43.1500, lng: 44.5000, description: 'Республика на Кавказе', hasBooking: true, tourId: 'ossetia' },
            { name: 'Грузия', lat: 42.3154, lng: 43.3569, description: 'Страна на Кавказе', hasBooking: true, tourId: 'georgia' },
            { name: 'Мальдивы', lat: 3.2028, lng: 73.2207, description: 'Острова в Индийском океане', hasBooking: true, tourId: 'maldives' }
        ];

    // Создаем экземпляр глобуса
    const globeContainer = document.getElementById('globe-container');
    if (!globeContainer) {
        console.error('Globe container not found');
        return;
    }

    // Создаем HTML-элемент для краткой всплывающей подсказки
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.padding = '10px';
    tooltip.style.background = 'white';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '1000';
    tooltip.style.fontFamily = 'Rubik, sans-serif';
    tooltip.style.fontSize = '14px';
    document.body.appendChild(tooltip);

    // Создаем модальное окно для подробной информации
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'none';
    modal.style.zIndex = '2000';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.fontFamily = 'Rubik, sans-serif';
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.style.background = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.maxWidth = '400px';
    modalContent.style.width = '90%';
    modalContent.style.position = 'relative';
    modalContent.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    modal.appendChild(modalContent);

    // Кнопка закрытия модального окна
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#999';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        globe.controls().autoRotate = true;
    });
    modalContent.appendChild(closeButton);

    // Закрытие модального окна при клике на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            globe.controls().autoRotate = true;
        }
    });

    // Создаем SVG для маркера-капельки
    const markerSvg = `
        <svg viewBox="0 0 24 36">
            <path d="M12 0C5.5 0 0 5.5 0 12c0 6.4 12 24 12 24s12-17.6 12-24c0-6.5-5.5-12-12-12z" fill="#ff5100"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
    `;

    // Функция для показа подробной карточки
    function showDetailedCard(place) {
        const titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.color = '#ff5100';
        titleDiv.style.marginBottom = '15px';
        titleDiv.style.fontSize = '24px';
        titleDiv.style.textAlign = 'center';
        titleDiv.textContent = place.name;

        const descDiv = document.createElement('div');
        descDiv.style.marginBottom = '20px';
        descDiv.style.color = '#333';
        descDiv.style.lineHeight = '1.6';
        descDiv.style.fontSize = '16px';
        descDiv.style.textAlign = 'center';
        descDiv.textContent = place.description;

        const statusDiv = document.createElement('div');
        statusDiv.style.marginBottom = '20px';
        statusDiv.style.textAlign = 'center';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.padding = '8px';
        statusDiv.style.borderRadius = '5px';
        
        if (place.hasBooking) {
            statusDiv.style.background = '#e8f5e8';
            statusDiv.style.color = '#2d5a2d';
            statusDiv.textContent = '✓ Туры доступны для бронирования';
        } else {
            statusDiv.style.background = '#f5e8e8';
            statusDiv.style.color = '#5a2d2d';
            statusDiv.textContent = '⚠ Туры временно недоступны';
        }

        const buttonDiv = document.createElement('div');
        buttonDiv.style.textAlign = 'center';

        const bookingButton = document.createElement('button');
        bookingButton.textContent = place.hasBooking ? 'Забронировать тур' : 'Тур недоступен';
        bookingButton.style.padding = '12px 24px';
        bookingButton.style.border = 'none';
        bookingButton.style.borderRadius = '8px';
        bookingButton.style.fontSize = '16px';
        bookingButton.style.fontWeight = 'bold';
        bookingButton.style.cursor = place.hasBooking ? 'pointer' : 'not-allowed';
        bookingButton.style.transition = 'all 0.3s ease';
        bookingButton.style.fontFamily = 'Rubik, sans-serif';
        bookingButton.style.width = '100%';

        if (place.hasBooking) {
            bookingButton.style.background = 'linear-gradient(45deg, #ff5100, #ffd700)';
            bookingButton.style.color = 'white';
            bookingButton.addEventListener('mouseenter', () => {
                bookingButton.style.transform = 'translateY(-2px)';
                bookingButton.style.boxShadow = '0 6px 15px rgba(255, 81, 0, 0.4)';
            });
            bookingButton.addEventListener('mouseleave', () => {
                bookingButton.style.transform = 'translateY(0)';
                bookingButton.style.boxShadow = 'none';
            });
            bookingButton.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
                window.location.href = `index.html#services-section`;
                setTimeout(() => {
                    const tourCard = document.querySelector(`[data-tour-id="${place.tourId}"]`);
                    if (tourCard) {
                        tourCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 500);
            });
        } else {
            bookingButton.style.background = '#ccc';
            bookingButton.style.color = '#666';
        }

        buttonDiv.appendChild(bookingButton);

        // Очищаем и заполняем модальное окно
        modalContent.innerHTML = '';
        modalContent.appendChild(closeButton);
        modalContent.appendChild(titleDiv);
        modalContent.appendChild(descDiv);
        modalContent.appendChild(statusDiv);
        modalContent.appendChild(buttonDiv);

        modal.style.display = 'flex';
        globe.controls().autoRotate = false;
    }

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

            // Обработчик наведения - показываем краткую информацию
            container.addEventListener('mouseenter', () => {
                tooltip.innerHTML = `<div style="font-weight: bold; color: #ff5100;">${d.name}</div><div>${d.description}</div>`;
                tooltip.style.display = 'block';
                globe.controls().autoRotate = false;
            });

            container.addEventListener('mousemove', event => {
                tooltip.style.left = `${event.clientX + 10}px`;
                tooltip.style.top = `${event.clientY + 10}px`;
            });

            container.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
                globe.controls().autoRotate = true;
            });

            // Обработчик клика - показываем подробную карточку
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                tooltip.style.display = 'none';
                showDetailedCard(d);
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

   // Закрытие модального окна по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
            globe.controls().autoRotate = true;
        }
    });
});