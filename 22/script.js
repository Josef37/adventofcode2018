const Graph = require("@dagrejs/graphlib").Graph;
const dijkstra = require("@dagrejs/graphlib").alg.dijkstra;

answer(510, { x: 10, y: 10 });
answer(5913, { x: 8, y: 701 });

function answer(depth, target) {
  const padding = { x: 40, y: 100 };
  const { typeMap } = calculateMaps(depth, target, padding);
  const graph = createGraph(typeMap);
  const distance = dijkstra(graph, String([0, 0, "torch"]), e => graph.edge(e))[
    String([target.x, target.y, "torch"])
  ].distance;
  console.log(distance);
}

function createGraph(typeMap) {
  const graph = new Graph();
  for (let [positionString, type] of Object.entries(typeMap)) {
    addToGraph(positionString, type, graph);
  }
  return graph;
}

function addToGraph(positionString, type, graph) {
  let [x, y] = positionString.split(",").map(Number);
  let tools = [];
  switch (type) {
    case "rocky":
      tools[0] = "torch";
      tools[1] = "climbing";
      break;
    case "wet":
      tools[0] = "climbing";
      tools[1] = "neither";
      break;
    case "narrow":
      tools[0] = "torch";
      tools[1] = "neither";
      break;
  }
  graph.setNode(String([x, y, tools[0]]));
  graph.setNode(String([x, y, tools[1]]));
  setEdge(graph, [x, y, tools[0]], [x, y, tools[1]], 7);
  [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([x, y]) => x >= 0 && y >= 0)
    .forEach(([neighborX, neighborY]) => {
      for (let tool of tools) {
        if (graph.hasNode(String([neighborX, neighborY, tool]))) {
          setEdge(graph, [x, y, tool], [neighborX, neighborY, tool], 1);
        }
      }
    });
}

function setEdge(graph, v, w, label) {
  graph.setEdge(String(v), String(w), label);
  graph.setEdge(String(w), String(v), label);
}

function addType(x, y, typeMap, erosionLevels, depth, target) {
  erosionLevels[key(x, y)] = calculateErosionLevel(
    x,
    y,
    target,
    erosionLevels,
    depth
  );
  typeMap[key(x, y)] = getType(erosionLevels[key(x, y)]);
}

function calculateRiskLevel(map) {
  return Object.values(map).reduce((risk, region) => {
    switch (region) {
      case "rocky":
        return risk + 0;
      case "wet":
        return risk + 1;
      case "narrow":
        return risk + 2;
    }
  }, 0);
}

function calculateMaps(depth, target, padding) {
  const erosionLevels = {};
  for (let y = 0; y <= target.y + padding.y; y++) {
    for (let x = 0; x <= target.x + padding.x; x++) {
      erosionLevels[key(x, y)] = calculateErosionLevel(
        x,
        y,
        target,
        erosionLevels,
        depth
      );
    }
  }
  const typeMap = {};
  Object.keys(erosionLevels).forEach(
    key => (typeMap[key] = getType(erosionLevels[key]))
  );
  return { erosionLevels, typeMap };
}

function calculateErosionLevel(x, y, target, erosionLevels, depth) {
  let geologicIndex;
  if (x === 0 && y === 0) geologicIndex = 0;
  else if (x === target.x && y === target.y) geologicIndex = 0;
  else if (y === 0) geologicIndex = x * 16807;
  else if (x === 0) geologicIndex = y * 48271;
  else if (!erosionLevels[key(x - 1, y)] || !erosionLevels[key(x, y - 1)])
    throw new Error("Neighbors not calculated yet!");
  else
    geologicIndex = erosionLevels[key(x - 1, y)] * erosionLevels[key(x, y - 1)];
  return (geologicIndex + depth) % 20183;
}

function getType(erosionLevel) {
  switch (erosionLevel % 3) {
    case 0:
      return "rocky";
    case 1:
      return "wet";
    case 2:
      return "narrow";
  }
}

function key(x, y) {
  return String([x, y]);
}
