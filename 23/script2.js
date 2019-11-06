const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/test", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const bots = parseBotsData(data);
    const best = { x: 12, y: 12, z: 12 };
    console.log(countBots(best, bots));
    console.log(best);
    console.log(best.x + best.y + best.z);
  });
}

answer();

function countBots({ x, y, z }, bots) {
  return bots.filter(bot => distance({ x, y, z }, bot) <= bot.r).length;
}

function filterBots(bots) {
  return bots.filter(bot1 => {
    let count = bots
      .map(bot2 => distance(bot1, bot2) <= bot1.r + bot2.r)
      .reduce((sum, val) => sum + val);
    if (count < 100) console.log(count);
    if (count > 1) return count;
  });
}

function unsimplifyPosition(boundingBox, { x, y, z }, length) {
  const longestDimesion = getLongestDimesion(boundingBox);
  x = Math.floor(
    (x / length) * longestDimesion + boundingBox.left + longestDimesion / 2
  );
  y = Math.floor(
    (y / length) * longestDimesion + boundingBox.bottom + longestDimesion / 2
  );
  z = Math.floor(
    (z / length) * longestDimesion + boundingBox.top + longestDimesion / 2
  );
  return { x, y, z };
}

function countBotsInRange({ x, y, z }, bots) {
  return bots.reduce((sum, bot) => sum + isInRange({ x, y, z }, bot), 0);
}

function findBestPosition(bots, length) {
  let best = { botsInRange: -Infinity };
  for (let x = 0; x < length; x++) {
    for (let y = 0; y < length; y++) {
      for (let z = 0; z < length; z++) {
        const botsInRange = countBotsInRange({ x, y, z }, bots);
        if (botsInRange > best.botsInRange) {
          best = { x, y, z, botsInRange };
        }
      }
    }
  }
  return best;
}

function simplifyBots(bots, length) {
  const boundingBox = getBoundingBox(bots);
  const longestDimesion = getLongestDimesion(boundingBox);
  console.log(longestDimesion);

  return bots.map(bot => ({
    x: Math.floor(((bot.x - boundingBox.left) / longestDimesion) * length),
    y: Math.floor(((bot.y - boundingBox.bottom) / longestDimesion) * length),
    z: Math.floor(((bot.z - boundingBox.back) / longestDimesion) * length),
    r: Math.ceil((bot.r / longestDimesion) * length)
  }));
}

function getLongestDimesion(box) {
  return Math.max(
    box.top - box.bottom,
    box.right - box.left,
    box.front - box.back
  );
}

function getBoundingBox(positions) {
  return positions.reduce(
    (bounds, { x, y, z }) => {
      bounds.right = Math.max(bounds.right, x);
      bounds.top = Math.max(bounds.top, y);
      bounds.front = Math.max(bounds.front, z);
      bounds.left = Math.min(bounds.left, x);
      bounds.bottom = Math.min(bounds.bottom, y);
      bounds.back = Math.min(bounds.back, z);
      return bounds;
    },
    {
      top: -Infinity,
      right: -Infinity,
      bottom: Infinity,
      left: Infinity,
      front: -Infinity,
      back: Infinity
    }
  );
}

function isInRange({ x, y, z }, bot) {
  return distance({ x, y, z }, bot) <= bot.r;
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
