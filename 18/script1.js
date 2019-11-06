const fs = require("fs");
const logging = false;

answer(10, __dirname + "/input");

function answer(minutes, path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  let area = parseData(data);
  for (let minute = 0; minute < minutes; minute++) {
    area = passMinute(area);
    if(logging) printArea(area, minute + 1);
  }
  const treeCount = area.flat(1).filter(state => state === "tree").length;
  const lumbCount = area.flat(1).filter(state => state === "lumb").length;
  console.log("Resource value:", treeCount * lumbCount);
}

function passMinute(area) {
  const newArea = [];
  for (let y = 0; y < area.length; y++) {
    const line = area[y];
    const newLine = [];
    for (let x = 0; x < line.length; x++) {
      const acre = line[x];
      const count = { open: 0, tree: 0, lumb: 0 };
      for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          if (
            x + dx < 0 ||
            x + dx >= line.length ||
            y + dy < 0 ||
            y + dy >= area.length
          ) {
            continue;
          }
          for (let type of Object.keys(count))
            if (area[y + dy][x + dx] === type) count[type]++;
        }
      }
      if (acre === "open") {
        if (count.tree >= 3) newLine.push("tree");
        else newLine.push("open");
      } else if (acre === "tree") {
        if (count.lumb >= 3) newLine.push("lumb");
        else newLine.push("tree");
      } else if (acre === "lumb") {
        if (count.lumb >= 1 && count.tree >= 1) newLine.push("lumb");
        else newLine.push("open");
      }
    }
    newArea.push(newLine);
  }

  return newArea;
}

function parseData(data) {
  return data.split("\n").map(line =>
    line.split("").map(char => {
      switch (char) {
        case ".":
          return "open";
        case "|":
          return "tree";
        case "#":
          return "lumb";
      }
    })
  );
}

function printArea(area, minute) {
  console.log(`After Minute ${minute}`);
  console.log(
    area
      .map(line =>
        line
          .map(state => {
            switch (state) {
              case "tree":
                return "|";
              case "open":
                return ".";
              case "lumb":
                return "#";
            }
          })
          .join("")
      )
      .join("\n")
  );
}
