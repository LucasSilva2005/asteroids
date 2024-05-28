const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const shipImages = {
    up: new Image(),
    left: new Image(),
    right: new Image(),
    down: new Image()
};

shipImages.up.src = 'assets/nave.png'; // Nave padrão
shipImages.left.src = 'assets/nave_esquerda.png'; // Nave indo para a esquerda
shipImages.right.src = 'assets/nave_direita.png'; // Nave indo para a direita
shipImages.down.src = 'assets/nave_abaixo.png'; // Nave indo para baixo

let currentShipImage = shipImages.up;

const asteroidImage = new Image();
asteroidImage.src = 'assets/asteroide.png'; // Substitua pelo caminho correto da imagem do asteroide

const ship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 5
};

const asteroids = [];
const asteroidSpeed = 3;
let gameInterval;
let gameOver = false;
let score = 0;
let passedAsteroids = 0; // Contador de asteroides passados

function drawShip() {
    ctx.drawImage(currentShipImage, ship.x, ship.y, ship.width, ship.height);
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.drawImage(asteroidImage, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });
}

function updateShipPosition() {
    ship.x += ship.dx;
    ship.y += ship.dy;
    if (ship.x < 0) ship.x = 0;
    if (ship.x + ship.width > canvas.width) ship.x = canvas.width - ship.width;
    if (ship.y < 0) ship.y = 0;
    if (ship.y + ship.height > canvas.height) ship.y = canvas.height - ship.height;
}

function updateAsteroids() {
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroidSpeed;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
            spawnAsteroid();
        }
        if (detectCollision(ship, asteroid)) {
            endGame();
        } else if (asteroid.y + asteroid.height > ship.y + ship.height && !asteroid.passed) {
            asteroid.passed = true;
            passedAsteroids++;
            updateScore();
        }
    });
}

function spawnAsteroid() {
    const asteroid = {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        passed: false // Flag para verificar se o asteroide já passou pela nave
    };
    asteroids.push(asteroid);
}

function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('score').textContent = score;
}

function updateScore() {
    score = passedAsteroids;
    document.getElementById('score').textContent = score;
}

function startGame() {
    document.getElementById('gameOver').classList.add('hidden');
    ship.x = canvas.width / 2 - 25;
    ship.y = canvas.height - 60;
    asteroids.length = 0;
    score = 0;
    passedAsteroids = 0;
    gameOver = false;
    spawnAsteroid();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    drawAsteroids();
    updateShipPosition();
    updateAsteroids();
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        ship.dx = -ship.speed;
        currentShipImage = shipImages.left;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        ship.dx = ship.speed;
        currentShipImage = shipImages.right;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        ship.dy = -ship.speed;
        currentShipImage = shipImages.up;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        ship.dy = ship.speed;
        currentShipImage = shipImages.down;
    }
});

document.addEventListener('keyup', e => {
    if (
        e.key === 'ArrowLeft' || e.key === 'a' || 
        e.key === 'ArrowRight' || e.key === 'd'
    ) {
        ship.dx = 0;
    } else if (
        e.key === 'ArrowUp' || e.key === 'w' || 
        e.key === 'ArrowDown' || e.key === 's'
    ) {
        ship.dy = 0;
    }
});

function loadImages(callback) {
    let imagesLoaded = 0;
    const totalImages = Object.keys(shipImages).length + 1; // +1 para asteroidImage

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            callback();
        }
    }

    Object.values(shipImages).forEach(image => {
        image.onload = onImageLoad;
    });

    asteroidImage.onload = onImageLoad;
}

loadImages(startGame);