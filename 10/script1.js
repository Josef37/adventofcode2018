/**
 * There are 383 lights. About 20 to 30 characters.
 * For a decent message, they are in an area about 100 to 200 wide.
 */

const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const lights = data.split("\n").map(string => {
      let [, x, y, , vx, vy] = string.split(/<|,|>/).map(Number);
      return { x, y, vx, vy };
    });
    let { time } = findMinimalBoundingBox(lights);
    draw(lights);
    console.log(time);
  });
}

function draw(lights) {
  let message = "";
  const box = getBoundingBox(lights);
  for (let y = box.top; y <= box.bottom; y++) {
    for (let x = box.left; x <= box.right; x++) {
      if (lights.some(light => x === light.x && y === light.y)) {
        message = message.concat("#");
      } else {
        message = message.concat(".");
      }
    }
    message = message.concat("\n");
  }
  console.log(message);
}

function doStep(lights, dt, time) {
  lights.forEach(light => {
    light.x += light.vx * dt;
    light.y += light.vy * dt;
  });
  return time+dt;
}

function findMinimalBoundingBox(lights) {
  let time = 0;
  let dt = 1000;
  while (true) {
    const oldArea = getBoundingBoxArea(lights);
    time = doStep(lights, dt, time);
    const newArea = getBoundingBoxArea(lights);
    if (Math.abs(dt) === 1) {
      if (oldArea < newArea) {
        break;
      }
    } else if (oldArea < newArea) {
      dt = Math.round(dt / -2);
    }
  }
  time = doStep(lights, -dt, time); // undo the last step, which was too far
  return {
    time,
    area: getBoundingBoxArea(lights)
  };
}

function getBoundingBoxArea(lights) {
  const { top, right, bottom, left } = getBoundingBox(lights);
  return (bottom - top) * (right - left);
}

function getBoundingBox(lights) {
  return lights.reduce(
    (bounds, light) => {
      bounds.top = Math.min(bounds.top, light.y);
      bounds.right = Math.max(bounds.right, light.x);
      bounds.bottom = Math.max(bounds.bottom, light.y);
      bounds.left = Math.min(bounds.left, light.x);
      return bounds;
    },
    {
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
      left: Infinity
    }
  );
}

answer();
