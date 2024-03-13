function Ship(lenght) {
  let hits = 0;
  let y = 0;
  let x = 0;

  const isSunk = () => {
    if (hits === lenght) {
      return true;
    }
    return false;
  };

  const hit = () => {
    hits += 1;
  };

  const setCoordinates = (horizontal, vertical) => {
    y = vertical;
    x = horizontal;
  };

  const getCoordinates = () => [x, y];

  const isHit = () => hits;

  return {
    isHit,
    isSunk,
    hit,
    getCoordinates,
    setCoordinates,
    lenght,
  };
}

function Gameboard() {
  const board = [];
  const missingShots = [];

  for (let i = 0; i < 8; i += 1) {
    board[i] = [];
    for (let j = 0; j < 8; j += 1) {
      board[i][j] = 0;
    }
  }

  const assignCordinates = (ship, x, y) => {
    ship.setCoordinates(x, y);
  };

  const receiveAttack = (tryCor, shipCor, ship) => {
    if (tryCor[0] === shipCor[0] && tryCor[1] === shipCor[1]) {
      ship.hit();
    } else {
      missingShots.push(tryCor);
    }
  };

  const checkSunkShip = (...ships) => {
    const sunkedShips = ships.filter((ship) => ship.isSunk() === true);
    const aliveShips = ships.filter((ship) => ship.isSunk() === false);

    return { sunkedShips, aliveShips };
  };

  const getBoard = () => board;
  const getMissingShots = () => missingShots;

  return {
    getBoard,
    assignCordinates,
    receiveAttack,
    checkSunkShip,
    getMissingShots,
  };
}

function Player(name) {
  const game = Gameboard();
  let activePlayer;

  const takeTurns = (player1, player2) => {
    activePlayer = activePlayer === player1 ? player1 : player2;
  };

  const random = () => Math.floor(Math.random() * 10);

  const computerPlays = (arr) => {
    arr.forEach((coordinates) => {
      coordinates.forEach(() => {
        const number1 = random();
        const number2 = random();

        if (number1 === coordinates[0] && number2 === coordinates[1]) {
          return;
        }

        game.receiveAttack([number1, number2]);
      });
    });
  };

  return {
    name,
    computerPlays,
    takeTurns,
  };
}

const ship1 = Ship(5);
const ship2 = Ship(4);
ship1.hit();
ship1.hit();
ship2.hit();
const game = Gameboard();
game.assignCordinates(ship1, 2, 0);
console.log(game.checkSunkShip(ship1, ship2));

// console.log(ship1.isSunk());
