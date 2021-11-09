document.addEventListener('DOMContentLoaded', initializeGame);

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

function initializeGame() {
    grid = document.querySelector('.grid');
    handleGameControls();
}

// Game controls
function handleGameControls() {
    const playButton = document.querySelector('#start');
    playButton.addEventListener('click', () => {
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
    setTimeout(randomizeMainPic, 5500);
    startCountDown();
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
    startCountDown();
    setTimeout(gameOver, 5000);
    setTimeout(visibilityMainPicture,5000);
}

// Random nine pictures
function createBoard() {
    currentGamePics = picsArray.sort(() => 0.5 - Math.random()).slice(0, 9);
    currentGamePics.forEach((img, i) => {
        const card = document.querySelector(`.card:nth-child(${i+1})`);
        card.setAttribute('data-id', img);
        const image = card.querySelector(`img.averse`);
        image.src = `assets/images/${img}.jpg`;
    })
    setTimeout(flipTheBoard, 1000);
    setTimeout(flipTheBoard, 5000);
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
function startCountDown() {
    let timer = document.querySelector('.time-value');
    var timeLeft = 4;
    var gameTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            timer.innerHTML = 0;
        } else {
            timer.innerHTML = timeLeft;
        }
        timeLeft --;
    }, 1000)
}

// Gameover
function gameOver() {
    console.log('Game Over');
}