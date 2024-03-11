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
  };
}

function Gameboard() {
  const board = [];

  for (let i = 0; i < 8; i += 1) {
    board[i] = [];
    for (let j = 0; j < 8; j += 1) {
      board[i][j] = 0;
    }
  }

  const assignCordinates = (ship, x, y) => {
    ship.setCoordinates(x, y);
  };

  const getBoard = () => board;

  return {
    getBoard,
    assignCordinates,
  };
}

const ship1 = Ship(4);
ship1.hit();
ship1.hit();
const game = Gameboard();
game.assignCordinates(ship1, 2, 0);
console.log(ship1.getCoordinates());

// console.log(ship1.isSunk());
