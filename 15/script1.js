const fs = require("fs");

class Unit {
  constructor(x, y, attackPower = 3, hitPoints = 200) {
    this.x = x;
    this.y = y;
    this.attackPower = attackPower;
    this.hitPoints = hitPoints;
  }

  move(cave) {
    throw new Error("Not implemented");
  }

  inRange(targets, cave) {
    return new Set(targets.flatMap(target => target.adjacentOpenSquares(cave)));
  }

  getDistances(start, targets, cave) {
    let positions = [{ distance: 0, position: start }];
    let distances = new Map();
    while (positions.length) {
      let { position, distance } = positions.shift();
      if (
        !distances.has(position.toString()) ||
        distances.get(position.toString()) > distance
      ) {
        distances.set(position.toString(), distance);
        positions.push(
          ...this.adjacentOpenSquares(cave, position[0], position[1]).map(
            position => ({ distance: distance + 1, position })
          )
        );
      }
    }
    const targetDistances = new Map();
    for (let [position, distance] of distances) {
      if (
        Array.from(targets)
          .map(target => target.toString())
          .includes(position)
      ) {
        targetDistances.set(position, distance);
      }
    }

    return targetDistances;
  }

  minDistancePosition(distances) {
    const minDistance = Math.min(...distances.values());
    const positions = Array.from(distances.entries())
      .filter(([position, distance]) => distance === minDistance)
      .map(([position, distance]) => position.split(",").map(Number));
    positions.sort((pos1, pos2) =>
      pos1[1] === pos2[1] ? pos1[0] - pos2[0] : pos1[1] - pos2[1]
    );
    return positions[0];
  }

  adjacentSquares(cave, x = this.x, y = this.y) {
    return [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => [
      x + dx,
      y + dy
    ]);
  }

  adjacentOpenSquares(cave, x = this.x, y = this.y) {
    return [[1, 0], [0, 1], [-1, 0], [0, -1]]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([x, y]) => cave[y][x].status === "open");
  }

  move(cave, targets) {
    if (!targets.length) return "end";
    if (this.adjacentTargets(targets, cave).length) return;
    const inRangeOfTargets = this.inRange(targets, cave);
    const targetDistances = this.getDistances(
      [this.x, this.y],
      inRangeOfTargets,
      cave
    );
    if (!targetDistances.size) return;
    const closestPosition = this.minDistancePosition(targetDistances);
    const nextPosition = this.minDistancePosition(
      this.getDistances(closestPosition, this.adjacentOpenSquares(cave), cave)
    );
    cave[this.y][this.x] = cave[nextPosition[1]][nextPosition[0]];
    cave[nextPosition[1]][nextPosition[0]] = this;
    [this.x, this.y] = nextPosition;
  }

  attack(cave, targets) {
    const adjacentTargets = this.adjacentTargets(targets, cave);
    if (!adjacentTargets.length) return;
    adjacentTargets.sort((t1, t2) => {
      if (t1.hitPoints === t2.hitPoints) {
        return t1.y === t2.y ? t1.x - t2.x : t1.y - t2.y;
      }
      return t1.hitPoints - t2.hitPoints;
    });
    const target = adjacentTargets[0];
    target.hitPoints -= this.attackPower;
    if (target.hitPoints <= 0) {
      cave[target.y][target.x] = { status: "open", x: target.x, y: target.y };
    }
  }

  adjacentTargets(targets, cave) {
    return targets.filter(target =>
      this.adjacentSquares(cave)
        .map(pos => pos.toString())
        .includes([target.x, target.y].toString())
    );
  }
}

class Elf extends Unit {
  move(cave) {
    const targets = cave.flat(1).filter(unit => unit instanceof Goblin);
    return super.move(cave, targets);
  }

  attack(cave) {
    const targets = cave.flat(1).filter(unit => unit instanceof Goblin);
    return super.attack(cave, targets);
  }
}

class Goblin extends Unit {
  move(cave) {
    const targets = cave.flat(1).filter(unit => unit instanceof Elf);
    return super.move(cave, targets);
  }

  attack(cave) {
    const targets = cave.flat(1).filter(unit => unit instanceof Elf);
    return super.attack(cave, targets);
  }
}

function parseData(data) {
  const cave = data.split("\n").map((line, y) => {
    return line.split("").map((char, x) => {
      switch (char) {
        case "#":
          return { status: "wall", x, y };
        case ".":
          return { status: "open", x, y };
        case "G":
          return new Goblin(x, y);
        case "E":
          return new Elf(x, y);
      }
    });
  });
  return cave;
}

function printCave(round, cave) {
  console.log("\nAfter round " + round);
  console.log(
    cave
      .map(line =>
        line
          .map(square => {
            if (square.status === "open") return ".";
            else if (square.status === "wall") return "#";
            else if (square instanceof Elf) {
              console.log(square.x, square.y, square.hitPoints);
              return "E";
            } else if (square instanceof Goblin) {
              console.log(square.x, square.y, square.hitPoints);
              return "G";
            }
          })
          .join("")
      )
      .join("\n")
  );
}

function answer(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  const cave = parseData(data);
  let round = 1;
  for (let end = false; !end; round++) {
    cave
      .flat(1)
      .filter(cavern => cavern instanceof Unit)
      .forEach(unit => {
        if (unit.hitPoints <= 0) return;
        if (unit.move(cave) === "end") end = true;
        unit.attack(cave);
      });
    // printCave(round, cave);
  }
  const lastRound = round - 2;
  const hitPointsLeft = cave
    .flat(1)
    .filter(square => square instanceof Unit)
    .reduce((sum, unit) => sum + unit.hitPoints, 0);
  console.log("Last Completed Round:", lastRound);
  console.log("Hitpoints left:", hitPointsLeft);
  console.log("Outcome:", lastRound * hitPointsLeft);
}

answer(__dirname + "/input");
