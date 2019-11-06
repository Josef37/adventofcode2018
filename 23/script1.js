const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const bots = parseBotsData(data);
    const strongestBot = findStrongestBot(bots);
    const inRageCount = bots.filter(bot => isInRange(bot, strongestBot)).length;
    console.log(inRageCount);
  });
}

answer();

function isInRange({ x, y, z }, sourceBot) {
  return distance({ x, y, z }, sourceBot) <= sourceBot.r;
}

function distance({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
}

function findStrongestBot(bots) {
  return bots.reduce((strongest, bot) =>
    strongest.r > bot.r ? strongest : bot
  );
}

function parseBotsData(data) {
  return data.split("\n").map(line => {
    const [, x, y, z, r] = /pos=<(.*?),(.*?),(.*?)>, r=(.*)/
      .exec(line)
      .map(Number);
    return { x, y, z, r };
  });
}
