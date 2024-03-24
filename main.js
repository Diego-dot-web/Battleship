const optionsContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const boardgameContainer = document.querySelector('#gamesboard-container');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

let angle = 0;
function flip() {
  const optionsChildren = Array.from(optionsContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionsChildren.forEach((children) => {
    children.style.transform = `rotate(${angle}deg)`;
  });
}

flipButton.addEventListener('click', flip);

const width = 10;

function createBoard(color, user) {
  const board = document.createElement('div');
  board.style.backgroundColor = color;
  board.classList.add('game-board');
  board.id = user;
  boardgameContainer.appendChild(board);

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.id = i;
    board.appendChild(block);
  }
}

createBoard('yellow', 'player');
createBoard('pink', 'computer');

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];
let notDropped;

function addPiece(user, ship, startId) {
  const allBocksContainer = document.querySelectorAll(`#${user} div`);
  const randomBoolean = Math.random() < 0.5;
  const isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
  const randomStartIndex = Math.floor(Math.random() * width * width);

  const startIndex = startId || randomStartIndex;

  const validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex
    : width * width - ship.length
  // verticality
    : startIndex <= width * width - width * ship.length
      ? startIndex : startIndex - ship.length * width - width;

  const shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBocksContainer[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBocksContainer[Number(validStart) + i * width]);
    }
  }

  let valid;

  if (isHorizontal) {
    shipBlocks.every((_shipBlock, index) => {
      valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1));
    });
  } else {
    shipBlocks.every((_shipBlock, index) => {
      valid = shipBlocks[0].id < 90 + (width * index + 1);
    });
  }

  const notTaken = shipBlocks.every((shipBlock) => !shipBlock.classList.contains('taken'));

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add('taken');
    });
  } else {
    if (user === 'computer') addPiece('computer', ship, startId);
    if (user === 'player') notDropped = true;
  }
}

ships.forEach((ship) => addPiece('computer', ship));

// Dragging
let draggedShip;

const optionShips = Array.from(optionsContainer.children);
optionShips.forEach((optionShip) => optionShip.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div');

allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener('dragover', dragOver);
  playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addPiece('player', ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

let gameOver = false;
let playerTurn;

// start Game
function startGame() {
  if (playerTurn === undefined) {
    if (optionsContainer.children.length !== 0) {
      infoDisplay.textContent = 'Please place your ships';
    } else {
      const allBoardBlock = document.querySelectorAll('#computer div');
      allBoardBlock.forEach((boardBlock) => boardBlock.addEventListener('click', handleClick));
      playerTurn = true;
      turnDisplay.textContent = 'Your Go!';
      infoDisplay.textContent = 'The game has started';
    }
  }
}

startButton.addEventListener('click', startGame);

let playerHits = [];
const computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('boom');
      infoDisplay.textContent = 'You hit the computers ship!';
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className !== 'block');
      classes = classes.filter((className) => className !== 'boom');
      classes = classes.filter((className) => className !== 'taken');
      playerHits.push(...classes);
      checkScore('player', playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains('taken')) {
      infoDisplay.textContent = 'Nothing hit this time';
      e.target.classList.add('empty');
    }
    playerTurn = false;
    const allboardBlocks = document.querySelectorAll('#computer divs');
    allboardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 3000);
  }
}

// Define the computers go

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers Go!';
    infoDisplay.textContent = 'The computer is thinking...';

    setTimeout(() => {
      const randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll('#player div');

      if (allBoardBlocks[randomGo].classList.contains('taken') && allBoardBlocks[randomGo].classList.contains('boom')) {
        computerGo();
      } else if (allBoardBlocks[randomGo].classList.contains('taken') && !allBoardBlocks[randomGo].classList.contains('boom')) {
        allBoardBlocks[randomGo].classList.add('boom');
        infoDisplay.textContent = 'The computer hit your ship';
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter((className) => className !== 'block');
        classes = classes.filter((className) => className !== 'boom');
        classes = classes.filter((className) => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = 'Nothing hit this time';
        allBoardBlocks[randomGo].classList.add('empty');
      }
    }, 3000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = 'Your Go';
      infoDisplay.textContent = 'Please take your go';
      const allBoardBlock = document.querySelectorAll('#computer div');
      allBoardBlock.forEach((block) => block.addEventListener('click', handleClick));
    }, 6000);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shiplength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName).length === shiplength
    ) {
      infoDisplay.textContent = `You sunk ${user}'s ${shipName}`;
      if (user === 'player') {
        playerHits = userHits.filter((storedShipName) => storedShipName !== shipName);
      }
      if (user === 'computer') {
        playerHits = userHits.filter((storedShipName) => storedShipName !== shipName);
      }
      userSunkShips.push(shipName);
    }
  }

  checkShip('destroyer', 2);
  checkShip('submarine', 3);
  checkShip('cruiser', 3);
  checkShip('battleship', 4);
  checkShip('carrier', 5);

  if (playerSunkShips === 5) {
    infoDisplay.textContent = 'You sunk all the computers Ships. You WON';
    gameOver = true;
  }
  if (computerSunkShips === 5) {
    infoDisplay.textContent = 'The computer has sunk all your ships. You LOST';
    gameOver = true;
  }
}
