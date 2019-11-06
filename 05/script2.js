/**
 * 1. Read the file (deleted last line)
 * 2. Split into array
 * 3. Make a copy
 * 4. Remove first letter from the copy
 * 5. React and count
 * 6. Go on with other letters
 * 7. Find minimum
 */

const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    let units = data.split("");
    const occuringUnits = new Set();
    units.forEach(unit => occuringUnits.add(unit.toLowerCase()));
    let minLength = Infinity;
    for (let removeUnit of occuringUnits) {
      let units = data.replace(new RegExp(removeUnit, "gi"), "").split("");
      react(units);
      minLength = Math.min(minLength, units.length);
    }
    console.log(minLength);
  });
}

function react(units) {
  for (let index = 1; index < units.length; index++) {
    const previousUnit = units[index - 1];
    const currentUnit = units[index];
    if (doReact(previousUnit, currentUnit)) {
      units.splice(index - 1, 2);
      index = index < 2 ? 0 : index - 2;
    }
  }
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
