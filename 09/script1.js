/**
 * Set the first marble into the graph (linking to itself)
 * Iterate trough all players until last marble
 * Set each marble and keep track of the current score
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;

function answer(numberOfPlayers, lastMarbleScore) {
  const playerScores = Array(numberOfPlayers).fill(0);
  const graph = new Graph();
  graph.setNode(0);
  graph.setEdge(0, 0);
  for (
    let marbleScore = 1, currentMarble = 0, player = 0;
    marbleScore <= lastMarbleScore;
    marbleScore++, player = (player + 1) % numberOfPlayers
  ) {
    if (marbleScore % 70833 === 0) console.log(marbleScore / 70833);
    if (marbleScore % 23 !== 0) {
      addNormalMarble(marbleScore, currentMarble, graph);
      currentMarble = marbleScore;
    } else {
      const marbles = addSpecialMarble(currentMarble, graph);
      currentMarble = marbles.currentMarble;
      playerScores[player] += marbleScore + Number(marbles.removeMarble);
      // console.log(
      //   `Player ${player} gets ${marbleScore} + ${marbles.removeMarble} points`
      // );
    }
  }
  return playerScores.reduce((max, score) => Math.max(max, score));
}

function addNormalMarble(marbleScore, currentMarble, graph) {
  const beforeMarble = graph.successors(currentMarble)[0];
  const afterMarble = graph.successors(beforeMarble)[0];
  graph.setNode(marbleScore);
  graph.removeEdge(beforeMarble, afterMarble);
  graph.setEdge(beforeMarble, marbleScore);
  graph.setEdge(marbleScore, afterMarble);
}

function addSpecialMarble(currentMarble, graph) {
  for (let count = 0; count < 6; count++) {
    currentMarble = graph.predecessors(currentMarble)[0];
  }
  const removeMarble = graph.predecessors(currentMarble)[0];
  const beforeMarble = graph.predecessors(removeMarble)[0];
  graph.removeNode(removeMarble);
  graph.setEdge(beforeMarble, currentMarble);
  return { currentMarble, removeMarble };
}

// console.log(answer(9, 25) === 32);
// console.log(answer(10, 1618) === 8317);
// console.log(answer(13, 7999) === 146373);
// console.log(answer(17, 1104) === 2764);
// console.log(answer(21, 6111) === 54718);
// console.log(answer(30, 5807) === 37305);
console.log(answer(486, 100 * 70833));
