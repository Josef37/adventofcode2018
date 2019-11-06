const fs = require("fs");

function q1() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const claims = data.split("\n");
    const claimed = new Set();
    const overlapped = new Set();
    claims.forEach(claim => {
      const [_, id, left, top, width, height] = claim
        .split(/#|@|,|:|x/)
        .map(Number);
      for (let dx = 0; dx < width; dx++) {
        for (let dy = 0; dy < height; dy++) {
          const key = `${left + dx}|${top + dy}`;
          if (claimed.has(key)) overlapped.add(key);
          else claimed.add(key);
        }
      }
    });
    console.log(overlapped.size);
  });
}

function q2() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const claims = data.split("\n");
    const claimed = new Set();
    const overlapped = new Set();
    claims.forEach(claim => {
      const [_, id, left, top, width, height] = claim
        .split(/#|@|,|:|x/)
        .map(Number);
      for (let dx = 0; dx < width; dx++) {
        for (let dy = 0; dy < height; dy++) {
          const key = `${left + dx}|${top + dy}`;
          if (claimed.has(key)) overlapped.add(key);
          else claimed.add(key);
        }
      }
    });
    claims.some(claim => {
      const [_, id, left, top, width, height] = claim
        .split(/#|@|,|:|x/)
        .map(Number);
      for (let dx = 0; dx < width; dx++) {
        for (let dy = 0; dy < height; dy++) {
          const key = `${left + dx}|${top + dy}`;
          if (overlapped.has(key)) return false;
        }
      }
      console.log(id);
      return true;
    });
  });
}

// q1();
q2();
