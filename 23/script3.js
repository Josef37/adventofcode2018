const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const bots = parseBotsData(data);
    const best = getBestPosition(bots);

    const improvements = getImprovements(bots, best);

    // logImprovements(improvements);

    console.log("In range of " + countBots(best, bots) + " nanobots");
    console.log(best);
    console.log("Distance to (0,0,0): " + (best.x + best.y + best.z));
  });
}

answer();

function logImprovements(
  improvements,
  filterImproveable = false,
  maxIndex = Infinity
) {
  improvements
    .filter(bot => !filterImproveable || bot.distance > 0)
    .slice(0, maxIndex)
    .forEach(bot =>
      console.log(dir(bot.dx), dir(bot.dy), dir(bot.dz), bot.distance)
    );
}

function getImprovements(bots, best) {
  return bots
    .map(bot => ({
      bot: bot,
      dx: Math.sign(bot.x - best.x),
      dy: Math.sign(bot.y - best.y),
      dz: Math.sign(bot.z - best.z),
      distance: distance(best, bot) - bot.r
    }))
    .sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance));
}

function getBestPosition(bots) {
  let bestBot = bots
    .map(bot1 => ({
      count: bots.filter(bot2 => distance(bot1, bot2) <= bot2.r).length,
      bot: bot1
    }))
    .reduce((best, bot) => {
      if (best.count < bot.count) return bot;
      return best;
    });
  const best = {
    x: bestBot.bot.x,
    y: bestBot.bot.y,
    z: bestBot.bot.z
  };
  best.x += -8465355;
  best.y += 5455054;
  best.z += 5055330;
  return best;
}

function dir(number) {
  return number === 0 ? "o" : number > 0 ? "+" : "-";
}

function countBots({ x, y, z }, bots) {
  return bots.filter(bot => distance({ x, y, z }, bot) <= bot.r).length;
}

function distance({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
}

function parseBotsData(data) {
  return data.split("\n").map(line => {
    const [, x, y, z, r] = /pos=<(.*?),(.*?),(.*?)>, r=(.*)/
      .exec(line)
      .map(Number);
    return { x, y, z, r };
  });
}
