const fs = require("fs");

// fs.readFile("./input.txt", { encoding: "utf8" }, (err, data) => {
//   console.time("timer");
//   let floor = 0;
//   for(const char of data) {
//     if (char === "(") floor++;
//     else if (char === ")") floor--;
//   }
//   console.timeEnd("timer");
//   console.log(floor);
// });

fs.readFile("./input.txt", { encoding: "utf8" }, (err, directions) => {
  console.time("santa-time");
  const directionsArray = directions.split("");
  const answer = directionsArray.reduce((acc, val) => {
    if (val === "(") {
      return (acc += 1);
    } else if (val === ")") {
      return (acc -= 1);
    }
  }, 0);
  console.timeEnd("santa-time");
  console.log("floor:", answer);
});
