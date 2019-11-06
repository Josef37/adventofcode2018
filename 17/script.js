const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;
const findCycles = require("@dagrejs/graphlib").alg.findCycles;
const logging = false;

answer(__dirname + "/input");

function answer(filePath) {
  const data = fs.readFileSync(filePath, { encoding: "utf8" });
  const date = new Date();
  const folderPath =
    "./output" +
    date
      .toTimeString()
      .slice(0, 8)
      .replace(/:/g, "-");
  if (logging) {
    fs.mkdirSync(folderPath);
  }
  const { map, minY, maxY } = parseMap(data);
  const sourcePos = [500, minY];
  const path = new Graph();
  path.setNode(sourcePos.toString());
  const waterHeads = [sourcePos];
  while (true) {
    if (logging) printMap(map, path, folderPath);
    findPath(path, waterHeads, map, maxY);
    const cycles = findCycles(path);
    // Only the cycles, which are blocked left and right, are filled
    const filteredCycles = cycles.filter(cycle => {
      const { minX, maxX, y } = cycle.reduce(
        (bounds, square) => {
          const [x, y] = square.split(",").map(Number);
          return {
            minX: Math.min(x, bounds.minX),
            maxX: Math.max(x, bounds.maxX),
            y: y
          };
        },
        { minX: Infinity, maxX: -Infinity, y: 0 }
      );
      return map.has(`${minX - 1},${y}`) && map.has(`${maxX + 1},${y}`);
    });
    path
      .sinks()
      .filter(square => square.split(",").map(Number)[1] !== maxY)
      .forEach(setWater);
    filteredCycles.forEach(cycle => cycle.forEach(setWater));
    if (!filteredCycles.length) break;
  }

  const waterSquares = Array.from(map.values()).filter(
    value => value === "water"
  ).length;
  console.log(waterSquares);
  findPath(path, waterHeads, map, maxY);
  const flowingSquares = path.nodes().length;
  console.log(flowingSquares);
  console.log("water in", waterSquares + flowingSquares, "squares");

  fs.mkdirSync(folderPath);
  printMap(map, path, folderPath);

  function setWater(square) {
    map.set(square, "water");
    path.removeNode(square);
    const [x, y] = square.split(",").map(Number);
    const aboveSquare = [x, y - 1];
    if (path.hasNode(aboveSquare.toString())) waterHeads.push(aboveSquare);
  }
}

function findPath(path, waterHeads, map, maxY) {
  while (waterHeads.length) {
    const currentSquare = waterHeads.shift();
    if (currentSquare[1] > maxY) {
      path.removeNode(currentSquare.toString());
      continue;
    }
    const squareBelow = currentSquare.slice();
    squareBelow[1] += 1;
    if (!map.has(squareBelow.toString())) {
      path.setNode(squareBelow.toString());
      path.setEdge(currentSquare.toString(), squareBelow.toString());
      waterHeads.push(squareBelow);
    } else {
      const rightSquare = currentSquare.slice();
      rightSquare[0] += 1;
      goToSide(currentSquare, rightSquare);

      const leftSquare = currentSquare.slice();
      leftSquare[0] -= 1;
      goToSide(currentSquare, leftSquare);
    }
  }
  return path;

  function goToSide(currentSquare, sideSquare) {
    if (
      !path.hasEdge(currentSquare.toString(), sideSquare.toString()) &&
      !map.has(sideSquare.toString())
    ) {
      if (!path.hasNode(sideSquare.toString())) {
        path.setNode(sideSquare.toString());
        waterHeads.push(sideSquare);
      }
      path.setEdge(currentSquare.toString(), sideSquare.toString());
    }
  }
}

function parseMap(data) {
  const map = new Map();
  let minY = Infinity,
    maxY = -Infinity;
  data.split("\n").forEach(line => {
    let { from: xFrom, to: xTo } = /x=(?<from>\d+)(\.\.(?<to>\d+))?/.exec(
      line
    ).groups;
    let { from: yFrom, to: yTo } = /y=(?<from>\d+)(\.\.(?<to>\d+))?/.exec(
      line
    ).groups;
    if (!xTo) xTo = xFrom;
    if (!yTo) yTo = yFrom;
    [xFrom, xTo, yFrom, yTo] = [xFrom, xTo, yFrom, yTo].map(Number);
    minY = Math.min(minY, yFrom);
    maxY = Math.max(maxY, yTo);
    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        map.set(`${x},${y}`, "clay");
      }
    }
  });

  return { map, minY, maxY };
}

function printMap(map, path, folderPath) {
  const bounds = Array.from(map.keys())
    .concat(path.nodes())
    .map(str => str.split(",").map(Number))
    .reduce(
      (bounds, square) => ({
        minX: Math.min(square[0], bounds.minX),
        maxX: Math.max(square[0], bounds.maxX),
        minY: Math.min(square[1], bounds.minY),
        maxY: Math.max(square[1], bounds.maxY)
      }),
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
      }
    );
  let print = "";
  let padY = bounds.maxY.toString().length;
  let padX = bounds.maxX.toString().length;

  for (let i = 0; i < padX; i++) {
    print = print.concat(" ".repeat(padY + 1));
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      print = print.concat(
        x
          .toString()
          .padStart(padX)
          .charAt(i)
      );
    }
    print = print.concat("\n");
  }

  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    print = print.concat(y.toString().padStart(padY) + " ");
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      const square = `${x},${y}`;
      if (path.hasNode(square)) {
        print = print.concat("|");
        continue;
      }
      switch (map.get(square)) {
        case "water":
          print = print.concat("X");
          break;
        case "clay":
          print = print.concat("#");
          break;
        default:
          print = print.concat(".");
          break;
      }
    }
    print = print.concat("\n");
  }
  console.log("writing file");
  let date = new Date();
  fs.writeFileSync(
    `${folderPath}/output-${date
      .getHours()
      .toString()
      .padStart(2, "0")}-${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}-${date
      .getMilliseconds()
      .toString()
      .padStart(4, "0")}`,
    print,
    { encoding: "utf8" }
  );
}
