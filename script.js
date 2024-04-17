const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const bird = document.getElementById('bird');
const upperPipe = document.getElementById('upperPipe');
const lowerPipe = document.getElementById('lowerPipe');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

let score = 0;
let birdTop = 220;
let birdSpeed = 0;
let pipeLeft = 400;
let pipeHeight = 150; // Initial pipe height
let pipeGap = 200; // Gap between pipes
let gravity = 0.5;
let jumpForce = -7;
let jumping = false;
let gamePlaying = false;

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.style.display = 'none';
    gameContainer.classList.remove('hidden');
    resetGame();
}

function jump() {
    if (gamePlaying) {
        jumping = true;
        birdSpeed = jumpForce;
    }
}

document.addEventListener('keydown', jump);
document.addEventListener('click', jump);

function moveBird() {
    if (!jumping) {
        birdSpeed += gravity;
    } else {
        jumping = false;
    }

    birdTop += birdSpeed;

    if (birdTop <= 0 || birdTop >= window.innerHeight - 50) {
        endGame();
        return;
    }

    bird.style.top = birdTop + 'px';
}

function movePipes() {
    if (!gamePlaying) return;

    pipeLeft -= 5;
    upperPipe.style.left = pipeLeft + 'px';
    lowerPipe.style.left = pipeLeft + 'px';

    if (pipeLeft <= -50) {
        pipeLeft = 400;
        pipeHeight = Math.random() * (window.innerHeight - pipeGap - 100) + 50;
    }

    upperPipe.style.height = `${pipeHeight}px`;
    lowerPipe.style.top = `${pipeHeight + pipeGap}px`;
    lowerPipe.style.height = `${window.innerHeight - pipeHeight - pipeGap}px`;

    if (pipeLeft < 50 && pipeLeft > -50) {
        const birdX = bird.offsetLeft + bird.offsetWidth / 2;

        if (birdX > upperPipe.offsetLeft && birdX < upperPipe.offsetLeft + upperPipe.offsetWidth) {
            increaseScore();
        }

        if (
            birdX < upperPipe.offsetLeft + upperPipe.offsetWidth && birdX + bird.offsetWidth > upperPipe.offsetLeft &&
            (birdTop < pipeHeight || birdTop + bird.offsetHeight > pipeHeight + pipeGap)
        ) {
            endGame();
            return;
        }
    }
}

function increaseScore() {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
}

function resetScore() {
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
}

function endGame() {
    gamePlaying = false;
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = 'Final Score: ' + score;
}

restartButton.addEventListener('click', resetGame);

function resetGame() {
    birdTop = 220;
    birdSpeed = 0;
    pipeLeft = 400;
    resetScore();
    gamePlaying = true;
    bird.style.top = birdTop + 'px';
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

function gameLoop() {
    moveBird();
    movePipes();

    if (gamePlaying) {
        requestAnimationFrame(gameLoop);
    }
}