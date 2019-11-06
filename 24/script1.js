const fs = require("fs");

class Group {
  constructor({
    units,
    hitPoints,
    weaknesses,
    immunities,
    attackType,
    attackDamage,
    initiative
  }) {
    this.units = Number(units);
    this.hitPoints = Number(hitPoints);
    this.weaknesses = weaknesses ? weaknesses.split(", ") : [];
    this.immunities = immunities ? immunities.split(", ") : [];
    this.attackType = attackType;
    this.attackDamage = Number(attackDamage);
    this.initiative = Number(initiative);
    this.target = null;
    this.targeted = false;
  }

  get effectivePower() {
    return this.units * this.attackDamage;
  }

  selectTarget(possibleTargets) {
    const targetsSorted = possibleTargets
      .filter(group => !group.targeted)
      .sort((a, b) => {
        if (this.damage(a) === this.damage(b)) {
          if (a.effectivePower === b.effectivePower) {
            return b.initiative - a.initiative;
          }
          return b.effectivePower - a.effectivePower;
        }
        return this.damage(b) - this.damage(a);
      });
    if (!targetsSorted.length) return;
    let target = targetsSorted[0];
    if (!this.damage(target)) return;
    this.target = target;
    target.targeted = true;
  }

  damage(group) {
    let damage = this.effectivePower;
    if (group.weaknesses.includes(this.attackType)) damage *= 2;
    if (group.immunities.includes(this.attackType)) damage = 0;
    return damage;
  }

  attack() {
    if (!this.target) return;
    let damage = this.damage(this.target);
    let unitsKilled = Math.floor(damage / this.target.hitPoints);
    this.target.units -= Math.min(unitsKilled, this.target.units);
    this.target.targeted = false;
    this.target = null;
    return unitsKilled > 0;
  }
}

function answer(path) {
  let boosts = [0, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
  // let boosts = [0, 1569, 1570];
  for (let boost of boosts) {
    let { immuneSystemGroups, infectionGroups } = parseInput(path);
    boostGroups(immuneSystemGroups, boost);

    ({ immuneSystemGroups, infectionGroups } = simulate(
      immuneSystemGroups,
      infectionGroups
    ));

    let units = immuneSystemGroups.reduce((sum, group) => sum + group.units, 0);
    console.log(units, "immune system units with", boost, "boost");
    units = infectionGroups.reduce((sum, group) => sum + group.units, 0);
    console.log(units, "infection units\n");
  }
}

const logging = false;
answer(__dirname + "/input");

function boostGroups(groups, boost) {
  groups.forEach(group => (group.attackDamage += boost));
}

function simulate(immuneSystemGroups, infectionGroups) {
  if(logging) logGroups(immuneSystemGroups, infectionGroups);
  while (immuneSystemGroups.length && infectionGroups.length) {
    targeting(immuneSystemGroups, infectionGroups);
    if (!attacking(immuneSystemGroups, infectionGroups)) {
      console.log("No one died. No point in going on!");
      break;
    }
    immuneSystemGroups = immuneSystemGroups.filter(group => group.units > 0);
    infectionGroups = infectionGroups.filter(group => group.units > 0);
    if(logging) logGroups(immuneSystemGroups, infectionGroups);
  }
  return { immuneSystemGroups, infectionGroups };
}

function targeting(immuneSystemGroups, infectionGroups) {
  function sortGroups(groups) {
    return groups.sort((a, b) => {
      if (a.effectivePower === b.effectivePower) {
        return b.initiative - a.initiative;
      }
      return b.effectivePower - a.effectivePower;
    });
  }

  sortGroups(immuneSystemGroups).forEach(group =>
    group.selectTarget(infectionGroups)
  );
  sortGroups(infectionGroups).forEach(group =>
    group.selectTarget(immuneSystemGroups)
  );
}

function attacking(immuneSystemGroups, infectionGroups) {
  const allGroups = immuneSystemGroups.concat(infectionGroups);
  allGroups.sort((a, b) => b.initiative - a.initiative);
  let unitsKilled = false;
  allGroups.forEach(group => (unitsKilled = group.attack() || unitsKilled));
  return unitsKilled;
}

function logGroups(immuneSystemGroups, infectionGroups) {
  console.log(
    "Immune system: " + immuneSystemGroups.map(group => group.units).join(", ")
  );
  console.log(
    "Infection:     " + infectionGroups.map(group => group.units).join(", ")
  );
}

function parseInput(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  const lines = data.split("\n");
  const split = lines.indexOf("Infection:");
  const immuneSystemData = lines.slice(1, split - 1);
  const infectionData = lines.slice(split + 1);

  const immuneSystemGroups = parseGroups(immuneSystemData);
  const infectionGroups = parseGroups(infectionData);

  return { immuneSystemGroups, infectionGroups };
}

function parseGroups(lines) {
  return lines.map(line => {
    const regex = /(?<units>\d*?) units each with (?<hitPoints>\d*?) hit points(?<immuneAndWeak>.*?)? with an attack that does (?<attackDamage>\d*?) (?<attackType>\w*?) damage at initiative (?<initiative>\d*)/;
    const groups = regex.exec(line).groups;
    groups.immunities = /(?<=immune to )[^(;)]*/.exec(groups.immuneAndWeak);
    if (groups.immunities) groups.immunities = groups.immunities[0];
    groups.weaknesses = /(?<=weak to )[^(;)]*/.exec(groups.immuneAndWeak);
    if (groups.weaknesses) groups.weaknesses = groups.weaknesses[0];
    delete groups.immuneAndWeak;
    return new Group(groups);
  });
}
