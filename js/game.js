const destinations = [
    { name: 'Дагестан', image: 'images/photo_1.png' },
    { name: 'Грузия', image: 'images/photo_2.jpeg' },
    { name: 'Алтай', image: 'images/photo_3.jpg' },
    { name: 'Осетия', image: 'images/photo_4.jpg' },
    { name: 'Мальдивы', image: 'images/photo_5.jpg' },
    { name: 'Абхазия', image: 'images/Abhs.jpg' }
];

let gameState = {
    flippedCards: [],
    matches: 0,
    attempts: 0,
    canFlip: false, // Блокируем флип во время показа
    gameStarted: false
};

function showInitialCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('flipped');
        }, index * 100);
    });

    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('flipped');
            }, index * 100);
        });
        gameState.canFlip = true;
        gameState.gameStarted = true;
    }, 3000);
}

function createCards() {
    const gameContainer = document.getElementById('gameContainer');
    const cards = [...destinations, ...destinations]
        .sort(() => Math.random() - 0.5);

    cards.forEach((destination, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.setProperty('--card-index', index);
        card.dataset.index = index;
        card.dataset.name = destination.name;

        card.innerHTML = `
            <div class="card-front">
                <img src="${destination.image}" class="destination-image" alt="${destination.name}">
            </div>
            <div class="card-back">
                <img src="images/QPTour.png" style="width: 80px;" alt="QPTour">
            </div>
        `;

        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });

    setTimeout(showInitialCards, 500);
}

function flipCard(card) {
    if (!gameState.canFlip || card.classList.contains('flipped') || 
        gameState.flippedCards.includes(card)) return;

    card.classList.add('flipped');
    gameState.flippedCards.push(card);

    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        document.getElementById('attempts').textContent = gameState.attempts;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    gameState.canFlip = false;

    if (card1.dataset.name === card2.dataset.name) {
        gameState.matches++;
        document.getElementById('matches').textContent = gameState.matches;
        gameState.flippedCards = [];
        gameState.canFlip = true;

        if (gameState.matches === destinations.length) {
            setTimeout(gameWon, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            gameState.flippedCards = [];
            gameState.canFlip = true;
        }, 1000);
    }
}

function gameWon() {
    const discount = Math.max(0, 30 - gameState.attempts);
    const promoCode = 'MATCH' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    alert(`Поздравляем! Вы нашли все пары за ${gameState.attempts} попыток!\n
        Ваша скидка: ${discount}%\n
        Промокод: ${promoCode}`);
}

createCards();