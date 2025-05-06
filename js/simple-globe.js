// Простой глобус с моделью самолёта
document.addEventListener('DOMContentLoaded', function() {
  const globeContainer = document.getElementById('simple-globe-container');
  if (!globeContainer) {
    console.error('Контейнер simple-globe-container не найден');
    return;
  }

  // Создаем экземпляр Globe с минимальными настройками
  const globe = Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .width(globeContainer.clientWidth)
    .height(globeContainer.clientHeight)
    .backgroundColor('rgba(0,0,0,0)') // Прозрачный фон
    (globeContainer);

  // Получаем доступ к сцене Three.js
  const scene = globe.scene();
  
  // Добавляем базовое освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  // Загрузчик GLB моделей
  const loader = new THREE.GLTFLoader();
  
  // Переменная для хранения модели самолёта
  let airplane;
  
  // Загружаем модель самолёта
  loader.load(
    'models/airplane.glb', 
    (gltf) => {
      airplane = gltf.scene;
      
      // Масштабируем модель (120x120)
      airplane.scale.set(1.5, 1.5, 1.5);
      
      // Поворачиваем модель на 90 градусов по оси X
      
      airplane.rotation.x = Math.PI / 2;
      airplane.rotation.z = Math.PI;
      
      // Создаем пустой объект для вращения
      orbitObject = new THREE.Object3D();
      scene.add(orbitObject);
      
      // Добавляем самолёт как дочерний объект
      orbitObject.add(airplane);
      
      // Позиционируем самолёт на расстоянии от центра вращения
      // Увеличиваем радиус до 6 (в два раза больше предыдущего)
      airplane.position.set(0, 0, -120);
      
      console.log('Модель самолёта добавлена на сцену');
      
      // Запускаем анимацию после загрузки модели
      animate();
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% загружено');
    },
    (error) => {
      console.error('Ошибка при загрузке модели самолёта:', error);
    }
  );

  // Переменные для анимации
  let angle = 0;
  const speed = 0.01; // Скорость вращения
  let orbitObject; // Объект для вращения
  
  // Функция анимации
  function animate() {
    // Если объект вращения создан
    if (orbitObject) {
      // Вращаем объект вокруг оси Y
      orbitObject.rotation.y -= speed;
      
      // Поворачиваем самолёт в направлении движения
      if (airplane) {
        // Самолёт всегда смотрит по касательной к окружности
        airplane.rotation.z = Math.PI ;
      }
    }

    
    
    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(animate);
  }

  // Адаптивность при изменении размера окна
  window.addEventListener('resize', () => {
    globe
      .width(globeContainer.clientWidth)
      .height(globeContainer.clientHeight);
  });
});
