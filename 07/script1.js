/**
 * Solve it with a directed graph (with "before" and "after")
 * 1. Parse all instructions into a directed graph
 * 2. Get all steps that do not have any "before"
 * 3. Remove this step (and all its connections)
 * 4. Update the list with all "after" steps (if they do not have "before" now)
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const instructions = data.split("\n");
    const graph = createGraph(instructions);
    const stepsOrder = assembleSleigh(graph);
    console.log(stepsOrder.join(""));
  });
}

function createGraph(instructions) {
  const instructionsArray = instructions.map(string => [
    string.split(" ")[1],
    string.split(" ")[7]
  ]);

  const steps = new Set(instructionsArray.flat(1));

  const graph = new Graph();
  steps.forEach(step => graph.setNode(step));

  instructionsArray.forEach(instruction =>
    graph.setEdge(instruction[0], instruction[1])
  );

  return graph;
}

function assembleSleigh(graph) {
  const stepsOrder = [];
  while (graph.nodes().length) {
    let noInEdgeNodesSorted = graph
      .nodes()
      .filter(node => graph.inEdges(node).length === 0)
      .sort();
    stepsOrder.push(noInEdgeNodesSorted[0]);
    graph.removeNode(noInEdgeNodesSorted[0]);
  }
  return stepsOrder;
}

answer();
