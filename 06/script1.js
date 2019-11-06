/**
 * Open questions: When is the area infinite?
 * Answer:
 * Make a bounding box.
 * Every place that is closest to a point on the edge,
 * will extend outwards forever, because you can't shortcut anymore
 *
 * 1. Determine a bounding box
 * 2. For each coordinate determine all distances to places
 * 3. If there is a minimal distance, choose the place
 * 4. Check box boundary and remove candidates
 * 5. Pick the candidate with the most coordinates closest
 */

const fs = require("fs");

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const places = data.split("\n").map(location => {
      const coordinates = location.split(",").map(Number);
      return { x: coordinates[0], y: coordinates[1] };
    });
    // Determine bounding box of all places
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
    // Iterate through all coordinates in bounding box and get closest place and remove candidates
    const closestPlaceMap = new Map();
    const isCandidate = Array(places.length).fill(true);
    for (let x = bounds.left; x <= bounds.right; x++) {
      for (let y = bounds.top; y <= bounds.bottom; y++) {
        const distances = places.map(
          place => Math.abs(place.x - x) + Math.abs(place.y - y)
        );
        const minDistance = Math.min(...distances);
        // Only unique minimum distances
        if (
          distances.filter(distance => distance === minDistance).length === 1
        ) {
          let closestPlaceIndex = distances.indexOf(minDistance);
          closestPlaceMap.set(`${x}|${y}`, closestPlaceIndex);
          // Closest place for boundary, then there are infinite closest places
          if (
            x === bounds.left ||
            x === bounds.right ||
            y === bounds.top ||
            y === bounds.bottom
          ) {
            isCandidate[closestPlaceIndex] = false;
          }
        }
      }
    }
    // Go through all candidates and count the number of closest places, find the highest
    const maxPlace = isCandidate
      .map((isCandidate, index) => {
        if (isCandidate) {
          return {
            place: index,
            closestCount: Array.from(closestPlaceMap.values()).filter(
              placeIndex => placeIndex === index
            ).length
          };
        }
        return false;
      })
      .filter(place => place)
      .reduce((maxPlace, place) => {
        if (place.closestCount > maxPlace.closestCount) {
          return place;
        } else {
          return maxPlace;
        }
      });
    console.log(maxPlace);
  });
}

answer();
