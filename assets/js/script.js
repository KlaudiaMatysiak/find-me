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
let gameDuration = 5;
let displayTimer = null;
let gameTimer = null;
let nickname;
let scoreBoardList = [];
let scoresModal;
let rulesModal;
let gameOverModal;
let warningModal;
let mainPicture;
const scoreKey = 'FindMe!Score';
const nicknameKey = 'FindMe!User';
const LS = window.localStorage;

// Initial code to start page
function initializeGame() {
    warningModal = handleModal('#modal-default');
    scoresModal = handleModal('#modal-scores', '#scores');
    rulesModal = handleModal('#modal-rules', '#rules');
    gameOverModal = handleGameOverModal();
    grid = document.querySelector('.grid');
    menuView = document.querySelector('.menu-view');
    gameView = document.querySelector('.game-view');
    nicknameInInput();
    initialScore();
    handleGameControls();
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
    const userName = setNickname();
    if (!userName ) {
        warningModal.show('Warning!', 'Please enter your nickname to start the game!');
        return false;
    }
    if (userName.length > 15) {
        warningModal.show('Warning!', 'Nickname length can not be longer then 15 characters!');

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

// Show and match selected card
function revealCard(card) {
    selectedPic = card && card.dataset.id;
    if (!selectedPic) {
        throw new Error('Game ERROR');
    }
    clearInterval(gameTimer);
    clearInterval(displayTimer);
    gameTimer = null;
    displayTimer = null;
    card.classList.add('show');
    allowToClick = false;
    wait(0.8)
        .then(() => {
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
 
// Play game again
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

// Random pictures to make a board
function createBoard() {
    currentGamePics = allPictures.sort(() => 0.5 - Math.random()).slice(0, 9);
    currentGamePics.forEach((img, i) => {
        const card = document.querySelector(`.card:nth-child(${i+1})`);
        card.setAttribute('data-id', img);
        const image = card.querySelector(`img.card-front`);
        image.src = `assets/images/${img}.jpg`;
    });
}

// Flipping cards
function flipTheBoard() {
    grid.classList.toggle('show');

    return wait(0.8);
}

// Visibility of the main picture
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
        timer.innerText = timeLeft;
        
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

// Gameover
function gameOver() {
    allowToClick = false;
    saveScore();
    const wantedCard = document.querySelector(`.card[data-id*="${drawnMainPic}"]`);
    wantedCard.classList.add('show');
    wait(2).then(() => {
        gameOverModal.show();
    });
    const modalheader = document.querySelector('#game-over-header');
    if (score === 0) {
        modalheader.innerText = randomizeMotivateText();
    } else {
        modalheader.innerText = randomizePositiveText();
    }
}

// Random sentences
function randomizePositiveText() {
    const array = [
        'Well done!',
        'Good job!',
        'Proud of you',
        'Nicly done',
        'You rock!',
    ];
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}

function randomizeMotivateText() {
    const array = [
        'You can do better!',
        'Don\'t give up!',
        'Don\'t stress',
        'Stay positive!',
    ];
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}

// Reset game
function resetGame() {
    allowToClick = false;
    selectedPic = null;
    document.querySelectorAll('.card.show').forEach(el => el.classList.remove('show'));
    toggleMainPicture();
}

// Save nickname in Local Storage
function setNickname() {
    const input = document.querySelector('#nickname');
    const playerElements = document.querySelectorAll('.player');

    nickname = input.value;
    LS.setItem(nicknameKey, nickname);
    playerElements.forEach((item) => item.innerText = nickname);

    return nickname;
}

// Read score board from Local Storage
function initialScore() {
    readData();
    generateReport();
}

// Read data from Local Storage
function readData() {
    const data = LS[scoreKey];
    if (data) {
        scoreBoardList = JSON.parse(data);
    }
}

// Save data in Local Storage
function saveData() {
    LS[scoreKey] = JSON.stringify(scoreBoardList);
}

// Generate score list
function generateReport() {
    const ol = document.querySelector('#score-list');
    ol.innerText = '';
    scoreBoardList.slice(0,10).forEach(({nickname, score, date}) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="nickname">${nickname}</span> <span data-score="${score}" class="score">${score}</span> <span class="date">${date}</span>`;
        ol.appendChild(li);
    })
}

// Save data if score > 0
function saveScore() {
    if (score === 0) {

        return
    }
    const newScore = {
        score: score,
        nickname: nickname,
        date: (new Date()).toLocaleDateString(),
    };
    const p = document.querySelector('#score-board-text');
    p.style.display = 'none'; 
    scoreBoardList.push(newScore);
    scoreBoardList.sort((a,b) => b.score - a.score);
    generateReport();
    saveData();
}

// Save input value from latest input
function nicknameInInput() {
    nickname = localStorage.getItem(nicknameKey);
    const input = document.querySelector('#nickname');
    if (nickname == null) {
        return
    } else {
        input.setAttribute('value', nickname);
    };
}

// Modals handler for scores and rules modals
function handleModal(modalName, triggerName) {
    const modal = document.querySelector(modalName);
    const trigger = document.querySelector(triggerName);
    const close = modal.querySelector('.close');
    const title = modal.querySelector('.title');
    const content = modal.querySelector('.content');

    const showModal = (titleText, contentText) => {
        if (typeof titleText === 'string' && title) {
            title.innerText = titleText;
        }
        if (typeof contentText === 'string' && content) {
            content.innerText = contentText;
        }
        modal.style.display = 'flex';
        window.addEventListener('click', onWindowClick);
    };
    const hideModal = () => {
        modal.style.display = 'none';
        window.removeEventListener('click', onWindowClick);
    };
    const onWindowClick = event => {
        if (event.target === modal) {
            hideModal();
        }
    };

    if (trigger) {
        trigger.addEventListener('click', showModal);
    }

    if (close) {
        close.addEventListener('click', hideModal);
    }

    return {
        show: showModal,
        hide: hideModal,
    };
}

// Modal handler for game over modal
function handleGameOverModal() {
    const modal = document.querySelector('#modal-game-over');
    const playAgainButton = modal.querySelector('#play-again-button');
    const mainMenuButton = modal.querySelector('#main-menu-button');

    const showModal = () => {
        modal.style.display = 'flex';
    };
    const hideModal = () => {
        modal.style.display = 'none';
    };
    const onPlayAgainClick = () => {
        playAgain(true);
        hideModal();
    };
    const onMainMenuClick = () => {
        hideModal();
        updateScore(0);
        gameView.classList.remove('show');
        menuView.classList.add('show');
        resetGame();
    };

    playAgainButton.addEventListener('click', onPlayAgainClick);
    mainMenuButton.addEventListener('click', onMainMenuClick);

    return {
        show: showModal,
    };
}
