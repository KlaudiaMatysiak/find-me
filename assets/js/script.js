/* jshint esversion: 8 */
document.addEventListener('DOMContentLoaded', initializeGame);

// Array with images for the game
const allPictures = [
    'alpaca',
    'bird',
    'cat',
    'chameleon',
    'corgi',
    'dachshund',
    'dog',
    'dolphin',
    'eagle',
    'elephant',
    'flamingos',
    'fox',
    'frog',
    'giraffe',
    'hedgehog',
    'highland-cattle',
    'horse',
    'impala',
    'jellyfish',
    'koala',
    'ladybugs',
    'lizard',
    'mandrill',
    'owl',
    'parrot',
    'ragdoll',
    'rat',
    'red-panda',
    'samoyed',
    'spider',
    'squirrel',
    'swan',
    'turtle',
    'zebra',
];

// Global variables
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
let nickname;
let scoreBoardList = [];
const scoreKey = 'FindMe!Score';
const nicknameKey = 'FindMe!User';
const LS = window.localStorage;
 
function initializeGame() {
    grid = document.querySelector('.grid');
    menuView = document.querySelector('.menu-view');
    gameView = document.querySelector('.game-view');
    nicknameInInput();
    initialScore();
    handleGameControls();
    rulesModal();
    menuView.classList.add('show');
}

// Game controls
function handleGameControls() {
    const playButton = document.querySelector('#start');
    playButton.addEventListener('click', () => {
        if (startGame()) {
            menuView.classList.remove('show');
            gameView.classList.add('show');
        }
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
    if (!setNickname()) {
        alert('Please enter your nickname to start the game!');
        return false;
    }
    createBoard();
    flipTheBoard()
        .then(() => startCountDown(gameDuration, "Memorize Time"))
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
    return true;
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
        const image = card.querySelector(`img.card-front`);
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
        }, 1000);
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

// Local Storage
function setNickname() {
    const input = document.querySelector('#nickname');
    nickname = input.value;
    LS.setItem(nicknameKey, nickname);
    const user = document.querySelector('#user');
    user.innerText = nickname;
    return nickname;
}

function initialScore() {
    readData();
    generateRaport();
}

function readData() {
    const data = LS[scoreKey];
    if (data) {
        scoreBoardList = JSON.parse(data);
    }
}

function saveData() {
    LS[scoreKey] = JSON.stringify(scoreBoardList);
}

function generateRaport() {
    const ol = document.querySelector('#score-list');
    ol.innerText = '';
    scoreBoardList.slice(0,10).forEach(({nickname, score, date}) => {
        const li = document.createElement('li');
        li.innerText = `${nickname} --- ${score} --- ${date}`;
        ol.appendChild(li);
    })
}

function saveScore() {
    if (score === 0) {
        return
    }
    const newScore = {
        score: score,
        nickname: nickname,
        date: (new Date()).toLocaleDateString(),
    };
    scoreBoardList.push(newScore);
    scoreBoardList.sort((a,b) => b.score - a.score);
    generateRaport();
    saveData();
}

function nicknameInInput() {
    nickname = localStorage.getItem(nicknameKey);
    const input = document.querySelector('#nickname');
    if (nickname == null) {
        return
    } else {
        input.setAttribute('value', nickname);
    };
}

// Gameover
function gameOver() {
    gameOverModal('flex');
    console.log('Game Over');
    saveScore();
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
