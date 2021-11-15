/* jshint esversion: 8 */
document.addEventListener('DOMContentLoaded', initializeGame);

// Array with images for the game
const allPictures = [
    'eagle',
    'elephant',
    'cat',
    'dog',
    'fox',
    'hedgehog',
    'horse',
    'owl',
    'turtle'
];

let grid;
let currentGamePics;
let drawnMainPic;
let score = 0;
let level = 1;
let menuView;
let gameView;

let allowToClick = false;
let selectedPic;
let gameDuration = 6;
let displayTimer = null;
let gameTimer = null;
 
function initializeGame() {
    grid = document.querySelector('.grid');
    menuView = document.querySelector('.menu-view');
    gameView = document.querySelector('.game-view');
    handleGameControls();
    rulesModal();
    menuView.classList.add('show');
}

// Game controls
function handleGameControls() {
    const playButton = document.querySelector('#start');
    playButton.addEventListener('click', () => {
        menuView.classList.remove('show');
        gameView.classList.add('show');
        startGame();
    });
    const cards = document.querySelectorAll('.card');
    cards.forEach((item) => {
        item.addEventListener('click', (event) => {
            if (!allowToClick || selectedPic) {
                return;
            }
 
            const card = event.target.closest('.card');
            revealCard(card);
        });
    });
}

// Promise wrapper for setTimeout
const wait = (timeout) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(timeout);
    }, timeout * 1000);
});
 
// Start game
function startGame() {
    createBoard();
    flipTheBoard()
        .then(() => startCountDown(gameDuration, "Prepare"))
        .then(() => flipTheBoard())
        .then(() => {
            allowToClick = true;
            randomizeMainPic();
            toggleMainPicture();
            startCountDown(gameDuration, 'Game Time');
            gameTimer = setTimeout(() => {
                displayTimer = null;
                gameOver();
            }, gameDuration * 1000);
        });
}
 
function revealCard(card) {
    selectedPic = card && card.dataset.id;
    if (!selectedPic) {
        throw new Error('Game ERROR');
    }
    clearInterval(gameTimer);
    card.classList.add('show');
    allowToClick = false;
    wait(0.8)
        .then(() => {
            clearInterval(gameTimer);
            gameTimer = null;
            clearInterval(displayTimer);
            displayTimer = null;
            if (selectedPic === drawnMainPic) {
                nextLevel();
            } else {
                gameOver();
            }
        });
 
}

// Next level
function nextLevel() {
    updateScore();
    level += 1;
    playAgain();
}
 
// New game after another
function playAgain(resetScore) {
    resetGame();
    wait(0.8).then(() => {
        if (resetScore) {
            updateScore(0);
        }
        startGame();
    });
}
 
// Score points
function updateScore(value) {
    if (value === 0) {
        score = 0;
    } else {
        score += 1;
    }
    document.querySelector('.score-value').innerText = score;
    document.querySelector('#end-score').innerText = score;
}
 
// Random main picture
function randomizeMainPic() {
    const previewPic = document.querySelector('img.main-pic');
    let randomIndex = Math.floor(Math.random() * currentGamePics.length);
    drawnMainPic = currentGamePics[randomIndex];
    previewPic.src = `assets/images/${drawnMainPic}.jpg`;
}
 
// Random nine pictures
function createBoard() {
    currentGamePics = allPictures.sort(() => 0.5 - Math.random()).slice(0, 9);
    currentGamePics.forEach((img, i) => {
        const card = document.querySelector(`.card:nth-child(${i+1})`);
        card.setAttribute('data-id', img);
        const image = card.querySelector(`img.averse`);
        image.src = `assets/images/${img}.jpg`;
    });
}
 
// Flip the pic
function flipTheBoard() {
    grid.classList.toggle('show');
    return wait(0.8);
}
 
// Visibility of main picture
function toggleMainPicture() {
    const mainPic = document.querySelector('.main-pic');
    mainPic.classList.toggle('visibility');
}
 
// Timer
function startCountDown(timeLeft, timerText) {
    return new Promise((resolve) => {
        let timer = document.querySelector('.time-value');
        let text = document.querySelector('.timer-text');
        text.innerText = timerText;
        displayTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(displayTimer);
                timer.innerHTML = 0;
                resolve();
            } else {
                timer.innerHTML = timeLeft;
            }
            console.log(timer, "timer");
            console.log(text, "text");
            console.log(timeLeft, 'timeleft')
        }, 1000);
    });
}
 
// Gameover
function gameOver() {
    gameOverModal('flex');
    console.log('Game Over');
}

// Reset game
function resetGame() {
    allowToClick = false;
    selectedPic = null;
    document.querySelectorAll('.card.show').forEach(el => el.classList.remove('show'));
    toggleMainPicture();
}

// Modals
function rulesModal() {
    const modal = document.querySelector('#modal-rules');
    const btn = document.querySelector('#rules');
    const span = document.querySelector('#close-rules');
    console.log('modal', modal);
    btn.onclick = event => {
        modal.style.display = 'flex';
        console.log('button click', event);
    } 
    span.onclick = () => modal.style.display = 'none';
    window.onclick = event => {
        console.log('window click', event);
        if (modal.style.display === 'flex' && event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
 
function gameOverModal(on) {
    const modal = document.querySelector('#modal-game-over');
    const playAgainButton = modal.querySelector('#play-again-button');
    const mainMenuButton = modal.querySelector('#main-menu-button');
    playAgainButton.onclick = () => {
        playAgain(true);
        modal.style.display = 'none';
    };
    modal.style.display = on;
    mainMenuButton.onclick = () => {
        modal.style.display = 'none';
        gameView.classList.remove('show');
        menuView.classList.add('show');
        resetGame();
    }

}

      