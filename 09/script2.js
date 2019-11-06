/**
 * Set the first marble into the graph (linking to itself)
 * Iterate trough all players until last marble
 * Set each marble and keep track of the current score
 */

const fs = require("fs");

class Marble {
  constructor(value, clockwise, counterclockwise) {
    this.value = value;
    this.clockwise = clockwise;
    this.counterclockwise = counterclockwise;
  }
}

function answer(numberOfPlayers, lastMarbleScore) {
  const playerScores = Array(numberOfPlayers).fill(0);
  let currentMarble = new Marble(0);
  currentMarble.clockwise = currentMarble.counterclockwise = currentMarble;

  for (
    let marbleScore = 1, player = 0;
    marbleScore <= lastMarbleScore;
    marbleScore++, player = (player + 1) % numberOfPlayers
  ) {
    if (marbleScore % 70833 === 0) console.log(marbleScore / 70833);
    if (marbleScore % 23 !== 0) {
      currentMarble = addNormalMarble(marbleScore, currentMarble);
    } else {
      const marbles = addSpecialMarble(currentMarble);
      currentMarble = marbles.currentMarble;
      playerScores[player] += marbleScore + Number(marbles.removeMarble.value);
      // console.log(
      //   `Player ${player} gets ${marbleScore} + ${marbles.removeMarble} points`
      // );
    }
  }
  return playerScores.reduce((max, score) => Math.max(max, score));
}

function addNormalMarble(marbleScore, currentMarble) {
  const beforeMarble = currentMarble.clockwise;
  const afterMarble = beforeMarble.clockwise;
  const newMarble = new Marble(marbleScore);

  beforeMarble.clockwise = newMarble;
  newMarble.clockwise = afterMarble;
  afterMarble.counterclockwise = newMarble;
  newMarble.counterclockwise = beforeMarble;

  return newMarble;
}

function addSpecialMarble(currentMarble) {
  for (let count = 0; count < 6; count++) {
    currentMarble = currentMarble.counterclockwise;
  }
  const removeMarble = currentMarble.counterclockwise;
  const beforeMarble = removeMarble.counterclockwise;
  beforeMarble.clockwise = currentMarble;
  currentMarble.counterclockwise = beforeMarble;

  return { currentMarble, removeMarble };
}

console.log(answer(9, 25) === 32);
console.log(answer(10, 1618) === 8317);
console.log(answer(13, 7999) === 146373);
console.log(answer(17, 1104) === 2764);
console.log(answer(21, 6111) === 54718);
console.log(answer(30, 5807) === 37305);
console.log(answer(486, 100*70833));
