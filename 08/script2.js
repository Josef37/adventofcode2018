/**
 * Start parsing number after number
 * Create a node: save children and metadata quantity
 * When all children are created, add metadata
 * When metadata is added, check, if parent has all children, and go on from there
 * Recursively calculate nodes value
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const numbers = data.split(" ").map(Number);
    const graph = constructGraph(numbers);
    const rootNodeValue = getNodeValue(graph, 1);
    console.log(rootNodeValue);
  });
}

function getNodeValue(graph, nodeId) {
  const node = graph.node(nodeId);
  if (node.childNodesQuantity === 0) {
    return nodeMetadataSum(graph, nodeId);
  } else {
    const sortedChildNodes = graph
      .outEdges(nodeId)
      .map(edge => edge.w)
      .sort((nodeId1, nodeId2) => Number(nodeId1) - Number(nodeId2));
    return node.metadata.reduce((sum, metadata) => {
      const index = metadata - 1;
      if (index < 0 || index >= sortedChildNodes.length) return sum;
      return sum + getNodeValue(graph, sortedChildNodes[index]);
    }, 0);
  }
}

function nodeMetadataSum(graph, nodeId) {
  return graph.node(nodeId).metadata.reduce((sum, val) => sum + val, 0);
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
