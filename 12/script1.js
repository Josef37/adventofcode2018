/**
 * Beginning from four positions left of the leftmost plant,
 * read the next five states, apply the right pattern and
 * save the new state. Stop four positions right of the rightmost plant
 */

const fs = require("fs");

function answer() {
  const rulesData = fs.readFileSync("rules", { encoding: "utf8" });
  const state = fs.readFileSync("state", { encoding: "utf8" });
  const rules = new Map();
  rulesData.split("\n").forEach(line => {
    const [key, value] = line.split(" => ");
    rules.set(key, value);
  });

  const plants = {
    start: 0,
    state: state
  };

  for (let generation = 0; generation < 20; generation++) {
    grow(plants, rules);
    logGarden(plants, generation + 1);
  }

  // if follows the pattern 457+23*generation
  console.log(457 + 23 * 50000000000);
}

function logGarden(plants, generation = NaN, padding = 10) {
  console.log(
    "gen" + generation.toString().padStart(3, 0),
    plants.start.toString().padStart(2, 0),
    ".".repeat(plants.start + padding) + plants.state
  );
}

function calculatePotSum(plants) {
  return plants.state.split("").reduce((sum, plant, index) => {
    if (plant === ".") return sum;
    return sum + index + plants.start;
  }, 0);
}

function grow(plants, rules) {
  cutGarden(plants);
  padGarden(plants);
  let newState = "";
  for (let i = 0; i <= plants.state.length - 5; i++) {
    let subState = plants.state.slice(i, i + 5);
    newState += rules.get(subState);
  }
  plants.state = newState;
  plants.start += 2;
}

// Cut empty pots in beginning and end
function cutGarden(plants) {
  const emptyPotsAtStart = /^\.*/.exec(plants.state)[0].length;
  plants.state = plants.state.replace(/^\.*/, "").replace(/\.*$/, "");
  plants.start = plants.start + emptyPotsAtStart;
}

function padGarden(plants) {
  plants.state = "...." + plants.state + "....";
  plants.start -= 4;
}

answer();
