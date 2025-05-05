// Простой глобус для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    const globeContainer = document.getElementById('simple-globe-container');
    if (!globeContainer) return;

    // Создаем экземпляр Globe
    const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(globeContainer.clientWidth)
        .height(globeContainer.clientHeight)
        .showAtmosphere(true)
        .atmosphereColor('rgba(255, 81, 0, 0.7)')
        .atmosphereAltitude(0.15)
        (globeContainer);

    // Добавляем автоматическое вращение
    let currentLng = 0;
    const rotationSpeed = 0.3;

    (function animate() {
        currentLng += rotationSpeed;
        globe.pointOfView({ lat: 30, lng: currentLng });
        requestAnimationFrame(animate);
    })();

    // Делаем глобус кликабельным
    globeContainer.style.cursor = 'pointer';
    globeContainer.addEventListener('click', () => {
        window.location.href = 'map.html';
    });

    // Адаптивность при изменении размера окна
    window.addEventListener('resize', () => {
        globe
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight);
    });
});
