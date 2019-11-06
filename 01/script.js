const fs = require("fs");

function q1() {
  fs.readFile("./input.txt", { encoding: "utf8" }, (err, data) => {
    const result = data.split("\n").reduce((acc, cur) => acc + Number(cur), 0);
    console.log(result);
  });
}

function q2() {
  fs.readFile("./input.txt", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const changes = data.split("\n").map(Number).slice(0, -1);
    const frequencies = new Set();
    let frequency = 0;
    let index = 0;
    while (!frequencies.has(frequency)) {
      frequencies.add(frequency);
      let change = changes[index % changes.length];
      frequency += change;
      index += 1;
    }
    console.log(frequency);
  });
}

// q1();
q2();
