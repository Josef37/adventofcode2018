const fs = require("fs");

function q1() {
  fs.readFile("./input.txt", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const ids = data.split("\n").slice(0, -1);
    const sortedIds = ids.map(id => id.split("").sort());
    const count = sortedIds.map(countDoublesAndTriples).reduce(
      (sum, current) => {
        sum.doubles += current.hasDouble;
        sum.triples += current.hasTriple;
        return sum;
      },
      { doubles: 0, triples: 0 }
    );
    console.log(count.doubles);
    console.log(count.triples);
    console.log(count.doubles * count.triples);
  });
}

function countDoublesAndTriples(sortedId) {
  let hasDouble = false,
    hasTriple = false;
  count = 1; // Counts consecutive letters

  sortedId.reduce((previous, current) => {
    if (previous === current) {
      count++;
    } else {
      if (count === 2) hasDouble = true;
      else if (count === 3) hasTriple = true;
      count = 1;
    }
    return current;
  });
  // Check again after the last character
  if (count === 2) hasDouble = true;
  else if (count === 3) hasTriple = true;

  return {
    hasDouble,
    hasTriple
  };
}

function q2() {
  fs.readFile("./input.txt", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const ids = data
      .split("\n")
      .slice(0, -1)
      .map(id => id.split(""));
    // Iterate over all pairs of boxes
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const firstId = ids[i],
          secondId = ids[j];
        let differsIn = 0;
        for (let k = 0; k < firstId.length; k++) {
          if (firstId[k] !== secondId[k]) differsIn++;
        }
        if (differsIn === 1) {
          let answer = [];
          for (let k = 0; k < firstId.length; k++) {
            if (firstId[k] === secondId[k]) answer.push(firstId[k]);
          }
          console.log(answer.join(""));
        }
      }
    }
  });
}

// q1();
q2();
