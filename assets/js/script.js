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
    const playButton = document.getElementById('start');
    playButton.addEventListener('click', () => {
        createBoard();
        setTimeout(randomizeMainPic, 5000);
    });
    const cards = document.querySelectorAll('.card');
    cards.forEach((item) => {
        console.log(item);
        item.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            const cardValue = card && card.dataset.id;
            card.classList.add('show');
            if (cardValue === drawnMainPic) {
                setTimeout(() => {
                    card.classList.remove('show');
                    updateScore();
                    createBoard();
                    randomizeMainPic();
                }, 2000);
            } else {
                setTimeout(() => {
                    updateScore(0);
                    card.classList.remove('show');
                }, 1000);
            }
        })
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
}

// Random main picture
function randomizeMainPic() {
    const previewPic = document.querySelector('img.preview');
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
    })
    setTimeout(flipTheBoard, 2000);
    setTimeout(flipTheBoard, 4000);
}


// Check for matches


// Flip the pic
function flipTheBoard() {
    grid.classList.toggle('show');
}

// Timer