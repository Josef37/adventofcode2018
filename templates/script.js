const fs = require("fs");

function answer(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
}

answer(__dirname + "/input");
