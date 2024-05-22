const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const spaceshipImages = {
    default: 'assets/nave.png',
    left: 'assets/nave_esquerda.png',
    right: 'assets/nave_direita.png',
    down: 'assets/nave_abaixo.png'
};

const asteroidImg = new Image();
asteroidImg.src = 'assets/asteroide.png';

const spaceshipWidth = 50;
const spaceshipHeight = 30;
const asteroidWidth = 50;
const asteroidHeight = 50;

let score = 0;
let gameInterval;
let asteroidInterval;
let isGameOver = false;

class Spaceship {
    constructor(x, y, width, height, images) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.images = images;
        this.currentImage = new Image();
        this.currentImage.src = images.default;
        this.speed = 5;
    }

    draw() {
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
        this.updateImage(dx);
    }

    updateImage(dx) {
        if (dx < 0) {
            this.currentImage.src = this.images.left;
        } else if (dx > 0) {
            this.currentImage.src = this.images.right;
        } else {
            this.currentImage.src = this.images.default;
        }
    }
}

class Asteroid {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.speed = 3;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

const spaceship = new Spaceship(
    canvasWidth / 2 - spaceshipWidth / 2,
    canvasHeight - spaceshipHeight - 10,
    spaceshipWidth,
    spaceshipHeight,
    spaceshipImages
);

const asteroids = [];

function createAsteroid() {
    const x = Math.random() * (canvasWidth - asteroidWidth);
    asteroids.push(new Asteroid(x, 0, asteroidWidth, asteroidHeight, asteroidImg));
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    spaceship.draw();

    asteroids.forEach((asteroid, index) => {
        asteroid.update();
        asteroid.draw();

        if (asteroid.y > canvasHeight) {
            asteroids.splice(index, 1);
        }

        if (detectCollision(spaceship, asteroid)) {
            endGame();
        }
    });

    score++;
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score / 60)}`, 10, 20);
}

function moveSpaceship(e) {
    if (e.code === 'ArrowLeft') {
        spaceship.move(-spaceship.speed, 0);
    }
    if (e.code === 'ArrowRight') {
        spaceship.move(spaceship.speed, 0);
    }
    if (e.code === 'ArrowUp') {
        spaceship.move(0, -spaceship.speed);
    }
    if (e.code === 'ArrowDown') {
        spaceship.move(0, spaceship.speed);
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(asteroidInterval);
    isGameOver = true;
    ctx.fillStyle = '#ff0000';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvasWidth / 2 - 100, canvasHeight / 2);
}

function startGame() {
    gameInterval = setInterval(updateGame, 1000 / 60);
    asteroidInterval = setInterval(createAsteroid, 1000);
}

document.addEventListener('keydown', moveSpaceship);
startGame();
