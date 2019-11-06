const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;
const dijkstra = require("@dagrejs/graphlib").alg.dijkstra;
const preorder = require("@dagrejs/graphlib").alg.preorder;

const tests = [];
tests[0] = answer(__dirname + "/test1") === 3;
tests[1] = answer(__dirname + "/test2") === 10;
tests[2] = answer(__dirname + "/test3") === 18;
tests[3] = answer(__dirname + "/test4") === 23;
tests[4] = answer(__dirname + "/test5") === 31;
console.log(tests);
console.log(answer(__dirname + "/input"));

function answer(path) {
  const instructionTree = parseData(path);
  const start = [0, 0];
  const map = traverse(instructionTree, "0", start);
  return longestDistance(map, String(start));
}

function longestDistance(map, start) {
  const distances = dijkstra(map, start);
  return Object.values(distances).reduce(
    (maxDistance, { distance }) => Math.max(maxDistance, distance),
    -Infinity
  );
}

function traverse(tree, rootId, start) {
  const map = new Graph();
  let nodes = preorder(tree, rootId);
  const starts = {};
  nodes.forEach(nodeId => {
    let position = start;
    if (nodeId !== rootId) position = starts[tree.predecessors(nodeId)[0]];
    let instructions = tree.node(nodeId);
    for (let char of instructions) {
      const newPosition = move(char, position);
      map.setNode(String(newPosition));
      map.setEdge(String(position), String(newPosition));
      map.setEdge(String(newPosition), String(position));
      position = newPosition;
    }
    starts[nodeId] = position;
  });
  return map;
}

function move(char, position) {
  const newPosition = position.slice();
  switch (char) {
    case "N":
      newPosition[1]--;
      break;
    case "E":
      newPosition[0]++;
      break;
    case "S":
      newPosition[1]++;
      break;
    case "W":
      newPosition[0]--;
      break;
  }
  return newPosition;
}

function parseData(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  const chars = data.split("").slice(1, -1);
  const tree = new Graph();
  let id = -1;
  tree.setNode(String(++id), []);
  let currentDepth = 0;
  let currentNodeIds = { 0: id };
  let openEndsPerDepth = { 0: [id] };
  for (let char of chars) {
    switch (char) {
      case "(": // create a new child node
        currentDepth++;
        tree.setNode(String(++id), []);
        tree.setEdge(String(currentNodeIds[currentDepth - 1]), String(id));
        openEndsPerDepth[currentDepth - 1] = openEndsPerDepth[
          currentDepth - 1
        ].filter(nodeId => nodeId !== currentNodeIds[currentDepth - 1]);
        if (openEndsPerDepth[currentDepth])
          openEndsPerDepth[currentDepth].push(id);
        else openEndsPerDepth[currentDepth] = [id];
        currentNodeIds[currentDepth] = id;
        break;
      case "|": // create a sibling node
        tree.setNode(String(++id), []);
        tree.setEdge(String(currentNodeIds[currentDepth - 1]), String(id));
        openEndsPerDepth[currentDepth].push(id);
        currentNodeIds[currentDepth] = id;
        break;
      case ")": // create a new node connecting all open ends of the last depth
        currentDepth--;
        tree.setNode(String(++id), []);
        openEndsPerDepth[currentDepth + 1].forEach(nodeId =>
          tree.setEdge(String(nodeId), String(id))
        );
        openEndsPerDepth[currentDepth + 1] = [];
        openEndsPerDepth[currentDepth].push(id);
        currentNodeIds[currentDepth] = id;
        break;
      default:
        tree.setNode(String(id), tree.node(String(id)).concat(char));
        break;
    }
  }
  return tree;
}
