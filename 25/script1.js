/**
 * Build an undirected graph and count connected components
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;
const graphAlg = require("@dagrejs/graphlib").alg;

function answer() {
  let data = fs.readFileSync(__dirname + "/input", { encoding: "utf8" });
  const points = data.split("\n").map(line => line.split(",").map(Number));
  const graph = new Graph({ directed: false });
  points.forEach(point => graph.setNode(point.toString(), point));
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (getDistance(points[i], points[j]) <= 3) {
        graph.setEdge(points[i].toString(), points[j].toString());
      }
    }
  }
  console.log(graphAlg.components(graph).length);
}

function getDistance(point1, point2) {
  let distance = 0;
  for (let i = 0; i < point1.length; i++) {
    distance += Math.abs(point2[i] - point1[i]);
  }
  return distance;
}

answer();
