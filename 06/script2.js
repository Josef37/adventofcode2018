/**
 * 1. Determine a bounding box where you are sure to exceed distance
 * 2. For each coordinate determine the sum of distances to places
 * 3. If the distance is small enough, increment area
 * 4. Return area
 */

const fs = require("fs");
const MAX_DISTANCE = 10000;

function getBoundingBox(places) {
  const bounds = places.reduce(
    (bounds, place) => {
      bounds.top = Math.min(bounds.top, place.y);
      bounds.right = Math.max(bounds.right, place.x);
      bounds.bottom = Math.max(bounds.bottom, place.y);
      bounds.left = Math.min(bounds.left, place.x);
      return bounds;
    },
    {
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
      left: Infinity
    }
  );
  const padding = Math.ceil(MAX_DISTANCE / places.length);
  return {
    top: bounds.top - padding,
    right: bounds.right + padding,
    bottom: bounds.bottom + padding,
    left: bounds.left - padding
  };
}

function getArea(places, bounds) {
  let area = 0;
  for (let x = bounds.left; x <= bounds.right; x++) {
    for (let y = bounds.top; y <= bounds.bottom; y++) {
      const distance = places
        .map(place => Math.abs(place.x - x) + Math.abs(place.y - y))
        .reduce((sum, dist) => sum + dist);
      if (distance < MAX_DISTANCE) area++;
    }
  }
  return area;
}

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const places = data.split("\n").map(location => {
      const coordinates = location.split(",").map(Number);
      return { x: coordinates[0], y: coordinates[1] };
    });
    const boundingBox = getBoundingBox(places);
    const area = getArea(places, boundingBox);
    console.log(area);
  });
}

answer();
