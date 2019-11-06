/**
 * Start parsing number after number
 * Create a node: save children and metadata quantity
 * When all children are created, add metadata
 * When metadata is added, check, if parent has all children, and go on from there
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const numbers = data.split(" ").map(Number);
    const graph = constructGraph(numbers);
    const sum = metadataSum(graph);
    console.log(sum);
  });
}

function metadataSum(graph) {
  return graph
    .nodes()
    .reduce((totalSum, node) => totalSum + nodeMetadataSum(node, graph), 0);
}

function nodeMetadataSum(node, graph) {
  return graph.node(node).metadata.reduce((sum, val) => sum + val, 0);
}

function constructGraph(numbers) {
  const graph = new Graph();
  let nodeId = 0;
  let childNodesQuantity;
  let metadataQuantity;
  // auxiliary root node
  graph.setNode(nodeId, {
    childNodesQuantity: 1,
    metadataQuantity: 0,
    metadata: []
  });
  let currentNode = nodeId++;
  for (let number of numbers) {
    // Parsing done for this node, go up to parent
    if (nodeFinished(graph, currentNode)) {
      currentNode = parentNode(graph, currentNode);
    }
    if (childNodesMissing(graph, currentNode)) {
      if (childNodesQuantity === undefined) {
        childNodesQuantity = number;
      } else if (metadataQuantity === undefined) {
        metadataQuantity = number;
        // Construct new child node
        graph.setNode(nodeId, {
          childNodesQuantity,
          metadataQuantity,
          metadata: []
        });
        graph.setEdge(currentNode, nodeId);
        childNodesQuantity = metadataQuantity = undefined;
        currentNode = nodeId++;
      }
    } else if (metadataMissing(graph, currentNode)) {
      graph.node(currentNode).metadata.push(number);
    }
  }
  return graph;
}

function metadataMissing(graph, currentNode) {
  return (
    graph.node(currentNode).metadata.length <
    graph.node(currentNode).metadataQuantity
  );
}

function childNodesMissing(graph, currentNode) {
  return (
    graph.outEdges(currentNode).length <
    graph.node(currentNode).childNodesQuantity
  );
}

function parentNode(graph, currentNode) {
  return graph.inEdges(currentNode)[0].v;
}

function nodeFinished(graph, currentNode) {
  return (
    graph.node(currentNode).metadata.length ===
      graph.node(currentNode).metadataQuantity &&
    graph.outEdges(currentNode).length ===
      graph.node(currentNode).childNodesQuantity
  );
}

answer();
