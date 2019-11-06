function answer(numberOfPlayers, lastMarbleScore) {
  const serialNumber = 9221;
  const cells = Array(300)
    .fill()
    .map(arr => Array(300));
  for (let x = 1; x <= 300; x++) {
    for (let y = 1; y <= 300; y++) {
      cells[x - 1][y - 1] = getPowerLevel(x, y, serialNumber);
    }
  }
  findMaxSquare(cells);
}

function findMaxSquare(cells) {
  const max = { x: null, y: null, size: null, value: -Infinity };
  for (let x = 1; x <= 300; x++) {
    for (let y = 1; y <= 300; y++) {
      let value = 0;
      for (let size = 1; size <= 300 + 1 - Math.max(x, y); size++) {
        let dy = size - 1;
        for (let dx = 0; dx < size; dx++) {
          value += cells[x - 1 + dx][y - 1 + dy];
        }
        let dx = size - 1;
        for (let dy = 0; dy < size-1; dy++) {
          value += cells[x - 1 + dx][y - 1 + dy];
        }
        if (value > max.value) {
          max.value = value;
          max.x = x;
          max.y = y;
          max.size = size;
        }
      }
    }
  }
  console.log(max);
}

function getPowerLevel(x, y, serialNumber) {
  const rackId = x + 10;
  const result = (rackId * y + serialNumber) * rackId;
  const hundreds = Math.floor(result / 100) % 10;
  return hundreds - 5;
}

console.log(
  "test getPowerLevel",
  [
    { x: 122, y: 79, serial: 57, result: -5 },
    { x: 217, y: 196, serial: 39, result: 0 },
    { x: 101, y: 153, serial: 71, result: 4 }
  ].every(
    input => getPowerLevel(input.x, input.y, input.serial) === input.result
  )
);
answer();
