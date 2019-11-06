

/**
 * 1. Read the file (deleted last line)
 * 2. Split into array
 * 3. Scan for the first reacting pair (remember index)
 * 4. Remove pair and start scanning again one position left
 * 5. Stop when end is reached
 */

const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    let units = data.split("");
    for (let index = 1; index < units.length; index++) {
      const previousUnit = units[index - 1];
      const currentUnit = units[index];
      if (doReact(previousUnit, currentUnit)) {
        units.splice(index - 1, 2);
        index = index < 2 ? 0 : index-2;
      }
    }
    console.log(units.length);
  });
}

function doReact(unit1, unit2) {
  if (unit1.toLowerCase() !== unit2.toLowerCase()) return false;
  if (unit1.toUpperCase() === unit1 && unit2.toUpperCase() === unit2)
    return false;
  if (unit1.toLowerCase() === unit1 && unit2.toLowerCase() === unit2)
    return false;
  return true;
}

answer();