document.addEventListener('DOMContentLoaded', initializeGame);
// Modal 
function rulesModal() {
    var modal = document.querySelector('#modal-rules');
    var btn = document.querySelector('#rules');
    var span = document.querySelector('#close-rules');
    btn.onclick = () => modal.style.display = 'flex';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = event => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function gameOverModal(on) {
    var modal = document.querySelector('#modal-game-over');
    var span = document.querySelector('#close-game-over');
    modal.style.display = on;
    span.onclick = () => modal.style.display = 'none';
    window.onclick = event => {
        if (event.target == modal) {
            modal.style.display = 'none'
        }
        // location.reload(true);
    }
}

// Create array with images for the game
const picsArray = [
    'eagle',
    'elephant',
    'cat',
    'dog',
    'fox',
    'hedgehog',
    'horse',
    'owl',
    'turtle'
]

let grid;
let currentGamePics;
let drawnMainPic;
let revealedCards = [];
let score = 0;
let menuView;
let gameView;


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
        playButton.setAttribute('disabled', true);
    });
    const cards = document.querySelectorAll('.card');
    cards.forEach((item) => {
        console.log(item);
        item.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const cardValue = card && card.dataset.id;
            card.classList.add('show');
            // Check for matches
            if (cardValue === drawnMainPic) {
                setTimeout(() => {
                    card.classList.remove('show');
                    updateScore();
                    startGame();
                }, 2000);
            } else if (cardValue !== drawnMainPic) {
                gameOverModal('flex');
            } else {
                setTimeout(() => {
                    gameOver();
                    updateScore(0);
                    card.classList.remove('show');
                }, 1000);
            }
        })
    });
}

// Start game
function startGame() {
    createBoard();
    flipTheBoard();
    setTimeout(() => {
        const prepareTime = 5;
        startCountDown(prepareTime, "Prepare");
        visibilityMainPicture();
        setTimeout(() => {
            flipTheBoard();
            setTimeout(() => {
                startCountDown(5, 'Game Time');
                setTimeout(() => {
                    gameOver();
                }, 5000);
            }, 800);
        }, prepareTime * 1000)
    }, 800);
    setTimeout(randomizeMainPic, 5500);
}

// Score points
function updateScore(value) {
    if (value === 0) {
        score = 0;
    } else {
        score += 1;
    }
    document.querySelector('.score-value').innerText = score;
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
    currentGamePics = picsArray.sort(() => 0.5 - Math.random()).slice(0, 9);
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
}

// Visibility of main picture
function visibilityMainPicture() {
    const mainPic = document.querySelector('.main-pic');
    mainPic.classList.toggle('visibility');
}

// Timer
function startCountDown(timeLeft, timerText) {
    let timer = document.querySelector('.time-value');
    let text = document.querySelector('.timer-text');
    text.innerText = timerText;
    var gameTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            timer.innerHTML = 0;
        } else {
            timer.innerHTML = timeLeft;
        }
    }, 1000)
}

// Gameover
function gameOver() {
    console.log('Game Over');
}