AOS.init({
	duration: 800,
	easing: 'slide',
	once: false
});

jQuery(document).ready(function ($) {

	"use strict";

	$(".loader").delay(1000).fadeOut("slow");
	$("#overlayer").delay(1000).fadeOut("slow");

	// Клонирование меню для мобильной версии
	var siteMenuClone = function () {
		// Клонирование навигационного меню для мобильной версии
		$('.js-clone-nav').each(function () {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});

		// Добавление стрелок для выпадающих меню в мобильной версии
		setTimeout(function () {
			var counter = 0;
			$('.site-mobile-menu .has-children').each(function () {
				var $this = $(this);

				$this.prepend('<span class="arrow-collapse collapsed">');

				$this.find('.arrow-collapse').attr({
					'data-toggle': 'collapse',
					'data-target': '#collapseItem' + counter,
				});

				$this.find('> ul').attr({
					'class': 'collapse',
					'id': 'collapseItem' + counter,
				});

				counter++;
			});
		}, 1000);

		// Обработка клика по стрелке выпадающего меню
		$('body').on('click', '.arrow-collapse', function (e) {
			var $this = $(this);
			if ($this.closest('li').find('.collapse').hasClass('show')) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();
		});

		// Закрытие мобильного меню при изменении размера окна
		$(window).resize(function () {
			var $this = $(this),
				w = $this.width();

			if (w > 768) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});

		// Переключение мобильного меню при клике на кнопку
		$('body').on('click', '.js-menu-toggle', function (e) {
			var $this = $(this);
			e.preventDefault();

			if ($('body').hasClass('offcanvas-menu')) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		});

		// Закрытие мобильного меню при клике вне его области
		$(document).mouseup(function (e) {
			var container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});
	};
	siteMenuClone();


	var sitePlusMinus = function () {
		$('.js-btn-minus').on('click', function (e) {
			e.preventDefault();
			if ($(this).closest('.input-group').find('.form-control').val() != 0) {
				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
			} else {
				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
			}
		});
		$('.js-btn-plus').on('click', function (e) {
			e.preventDefault();
			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
		});
	};
	// sitePlusMinus();


	var siteSliderRange = function () {
		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 500,
			values: [75, 300],
			slide: function (event, ui) {
				$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
			}
		});
		$("#amount").val("$" + $("#slider-range").slider("values", 0) +
			" - $" + $("#slider-range").slider("values", 1));
	};
	// siteSliderRange();




	var siteCarousel = function () {
		if ($('.nonloop-block-13').length > 0) {
			$('.nonloop-block-13').owlCarousel({
				center: false,
				items: 1,
				loop: true,
				stagePadding: 0,
				margin: 0,
				smartSpeed: 1000,
				autoplay: true,
				nav: true,
				navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
				responsive: {
					600: {
						margin: 0,
						nav: true,
						items: 2
					},
					1000: {
						margin: 0,
						stagePadding: 0,
						nav: true,
						items: 2
					},
					1200: {
						margin: 0,
						stagePadding: 0,
						nav: true,
						items: 3
					}
				}
			});
		}

		$('.slide-one-item').owlCarousel({
			center: false,
			items: 1,
			loop: true,
			stagePadding: 0,
			margin: 0,
			smartSpeed: 1500,
			autoplay: true,
			pauseOnHover: false,
			dots: true,
			nav: true,
			navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
		});
	};
	siteCarousel();



	var siteCountDown = function () {

		$('#date-countdown').countdown('2020/10/10', function (event) {
			var $this = $(this).html(event.strftime(''
				+ '<span class="countdown-block"><span class="label">%w</span> weeks </span>'
				+ '<span class="countdown-block"><span class="label">%d</span> days </span>'
				+ '<span class="countdown-block"><span class="label">%H</span> hr </span>'
				+ '<span class="countdown-block"><span class="label">%M</span> min </span>'
				+ '<span class="countdown-block"><span class="label">%S</span> sec</span>'));
		});

	};
	// siteCountDown();

	var siteDatePicker = function () {

		if ($('.datepicker').length > 0) {
			$('.datepicker').datepicker();
		}

	};
	// siteDatePicker();

	// Функция для "липкой" шапки
	var siteSticky = function () {
		$(".js-sticky-header").sticky({ topSpacing: 0 });
	};
	siteSticky();

	// Навигация по одной странице (плавная прокрутка к якорям)
	var OnePageNavigation = function () {
		var navToggler = $('.site-menu-toggle');

		$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a[href^='#']", function (e) {
			e.preventDefault();

			var hash = this.hash;

			$('html, body').animate({
				'scrollTop': $(hash).offset().top - 50
			}, 600, 'easeInOutExpo', function () {
				// window.location.hash = hash;
			});
		});
	};
	OnePageNavigation();

	// Функция для изменения шапки при прокрутке
	var siteScroll = function () {
		$(window).scroll(function () {
			var st = $(this).scrollTop();

			if (st > 100) {
				$('.js-sticky-header').addClass('shrink');
			} else {
				$('.js-sticky-header').removeClass('shrink');
			}
		});
	};
	siteScroll();

	var counter = function () {
		$('#about-section').waypoint(function (direction) {
			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
				// Проверяем, существует ли $.animateNumber
				if ($ && $.animateNumber && $.animateNumber.numberStepFactories) {
					var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
					$('.number > span').each(function () {
						var $this = $(this),
							num = $this.data('number');
						$this.animateNumber(
							{
								number: num,
								numberStep: comma_separator_number_step
							}, 7000
						);
					});
				} else {
					// Альтернативный вариант без анимации
					$('.number > span').each(function () {
						var $this = $(this),
							num = $this.data('number');
						$this.text(num);
					});
				}
			}
		}, { offset: '95%' });
	};
	counter();


});

document.addEventListener('DOMContentLoaded', function () {
	// Получаем все карточки туров
	const tourCards = document.querySelectorAll('.tour-card-3d');
	// Объект для хранения таймеров для каждой карточки
	const cardTimers = {};

	// Добавляем обработчик события клика для каждой карточки
	tourCards.forEach((card, index) => {
		card.addEventListener('click', function () {
			// Переключаем класс 'flipped' на внутреннем элементе текущей карточки
			const innerCard = this.querySelector('.tour-card-inner');
			innerCard.classList.toggle('flipped');

			// Если карточка перевернута, устанавливаем таймер на 15 секунд
			if (innerCard.classList.contains('flipped')) {
				// Очищаем предыдущий таймер для этой карточки, если он существует
				if (cardTimers[index]) {
					clearTimeout(cardTimers[index]);
				}

				// Устанавливаем новый таймер
				cardTimers[index] = setTimeout(() => {
					innerCard.classList.remove('flipped');
					delete cardTimers[index];
				}, 45000); // 15 секунд
			} else {
				// Если карточка была возвращена в исходное положение, очищаем таймер
				if (cardTimers[index]) {
					clearTimeout(cardTimers[index]);
					delete cardTimers[index];
				}
			}
		});
	});
});

document.addEventListener('DOMContentLoaded', function () {
	// Получаем элементы модального окна
	const modal = document.getElementById('bookingModal');
	if (!modal) return; // Если модального окна нет, прекращаем выполнение

	const closeBtn = document.querySelector('.close-modal');
	const bookingForm = document.getElementById('bookingForm');
	const tourTitle = document.getElementById('bookingTourTitle');
	const tourInput = document.getElementById('bookingTourInput');
	const successMessage = document.getElementById('bookingSuccess');
	const closeSuccess = document.querySelector('.close-success');

	// Получаем все кнопки бронирования
	const bookButtons = document.querySelectorAll('.price-btn');

	// Переключение между полями email и телефон
	const contactEmail = document.getElementById('contactEmail');
	const contactPhone = document.getElementById('contactPhone');
	const emailGroup = document.getElementById('emailGroup');
	const phoneGroup = document.getElementById('phoneGroup');
	const emailInput = document.getElementById('userEmail');
	const phoneInput = document.getElementById('userPhone');

	if (contactEmail && contactPhone) {
		// Обработчики для переключения метода контакта
		contactEmail.addEventListener('change', function () {
			emailGroup.style.display = 'block';
			phoneGroup.style.display = 'none';
			emailInput.required = true;
			phoneInput.required = false;
		});

		contactPhone.addEventListener('change', function () {
			emailGroup.style.display = 'none';
			phoneGroup.style.display = 'block';
			emailInput.required = false;
			phoneInput.required = true;
		});
	}

	if (phoneInput) {
		// Маска для телефона
		phoneInput.addEventListener('input', function (e) {
			let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
			e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + (x[3] ? x[3] + '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
		});
	}

	// Обработчик для кнопок бронирования
	bookButtons.forEach(button => {
		button.addEventListener('click', function () {
			// Получаем название тура из ближайшей карточки
			const card = this.closest('.tour-card-back');
			const tourName = card ?
				(card.querySelector('h3') ?
					card.querySelector('h3').textContent :
					card.querySelector('h5').textContent) :
				'Тур';

			// Устанавливаем название тура в модальном окне
			tourTitle.textContent = tourName;
			tourInput.value = tourName;

			// Показываем модальное окно
			modal.style.display = 'block';
			setTimeout(() => {
				modal.classList.add('show');
			}, 10);
			document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
		});
	});

	if (closeBtn) {
		// Закрытие модального окна
		closeBtn.addEventListener('click', function () {
			closeModal();
		});
	}

	// Закрытие при клике вне модального окна
	window.addEventListener('click', function (event) {
		if (event.target === modal) {
			closeModal();
		}
	});

	if (closeSuccess) {
		// Закрытие окна успешной отправки
		closeSuccess.addEventListener('click', function () {
			successMessage.style.display = 'none';
			closeModal();
		});
	}

	// Функция закрытия модального окна
	function closeModal() {
		modal.classList.remove('show');
		setTimeout(() => {
			modal.style.display = 'none';
			document.body.style.overflow = ''; // Разблокируем прокрутку страницы
		}, 300);
	}

	if (bookingForm) {
		// Обработка успешной отправки формы
		bookingForm.addEventListener('submit', function (e) {
			// Formspree обрабатывает отправку, но мы можем добавить дополнительную логику
			// Например, сохранение в localStorage для резервного копирования
			const formData = new FormData(bookingForm);
			const bookingData = {
				tourName: tourTitle.textContent,
				name: formData.get('name'),
				contactMethod: formData.get('contactMethod'),
				email: formData.get('email'),
				phone: formData.get('phone'),
				message: formData.get('message'),
				date: new Date().toISOString()
			};

			// Сохраняем в localStorage как резервную копию
			const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
			savedBookings.push(bookingData);
			localStorage.setItem('bookings', JSON.stringify(savedBookings));
		});
	}

	// Обработка ответа от Formspree
	window.addEventListener("DOMContentLoaded", function () {
		const form = document.getElementById("bookingForm");

		async function handleSubmit(e) {
			e.preventDefault();
			const status = document.createElement("div");
			status.style.marginTop = "10px";

			try {
				const data = new FormData(e.target);
				const response = await fetch(e.target.action, {
					method: form.method,
					body: data,
					headers: {
						'Accept': 'application/json'
					}
				});

				const json = await response.json();

				if (response.ok) {
					// Форма успешно отправлена
					bookingForm.style.display = 'none';
					successMessage.style.display = 'block';
					form.reset();
				} else {
					// Ошибка при отправке
					throw new Error(json.error || "Произошла ошибка при отправке формы");
				}
			} catch (error) {
				status.innerHTML = "Произошла ошибка при отправке формы";
				status.style.color = "red";
				form.appendChild(status);
			}
		}

		if (form) {
			form.addEventListener("submit", handleSubmit);
		}
	});
});
// Кнопка "Наверх"
$(document).ready(function () {
	var backToTopButton = $('#backToTop');

	// Показать/скрыть кнопку при скролле
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			backToTopButton.addClass('show');
		} else {
			backToTopButton.removeClass('show');
		}
	});

	// Плавная прокрутка наверх при клике
	backToTopButton.click(function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: 0
		}, 800);
	});
});