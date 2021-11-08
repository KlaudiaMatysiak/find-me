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

function initializeGame() {
    grid = document.querySelector('.grid');
    handlePlayClick();
}

// Start game button
function handlePlayClick() {
    const playButton = document.getElementById('start');
    playButton.addEventListener('click', () => {
        createBoard();
        setTimeout(randomizeMainPic, 3000);
    });

}

// Random main picture
function randomizeMainPic() {
    const previewPic = document.querySelector('img.preview');
    let randomIndex = Math.floor(Math.random() * currentGamePics.length);
    previewPic.src = `assets/images/${currentGamePics[randomIndex]}.jpg`;
    console.log(randomIndex);
}

// Random nine pictures
function createBoard() {
    currentGamePics = picsArray.sort(() => 0.5 - Math.random()).slice(0, 9);
    currentGamePics.forEach((img, i) => {
        const element = document.querySelector(`.card:nth-child(${i+1}) img.picture`);
        element.src = `assets/images/${img}.jpg`;
    })
}


// Check for matches


// Flip the pic


// Timer