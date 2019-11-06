/**
 * Simulate the process (with 5 people)
 * Associate a worker with a step
 * Simulate until first worker done (remove the node now)
 */

const fs = require("fs");
const Graph = require("@dagrejs/graphlib").Graph;

function answer() {
  fs.readFile(__dirname + "/input", { encoding: "utf8" }, (err, data) => {
    if (err) throw err;
    const instructions = data.split("\n");
    const graph = createGraph(instructions);
    const duration = assembleSleigh(graph);
    console.log(duration);
  });
}

function createGraph(instructions) {
  const instructionsArray = instructions.map(string => [
    string.split(" ")[1],
    string.split(" ")[7]
  ]);

  const steps = new Set(instructionsArray.flat(1));

  const graph = new Graph();
  steps.forEach(step => graph.setNode(step, getDuration(step)));
  instructionsArray.forEach(instruction =>
    graph.setEdge(instruction[0], instruction[1])
  );

  return graph;
}

function getDuration(step) {
  return 61 + step.charCodeAt(0) - "A".charCodeAt(0);
}

function assembleSleigh(graph, workersCount = 5) {
  let duration = 0;
  let scheduledSteps = new Set();
  let workers = new Array(workersCount)
    .fill(null) // Override "empty"
    .map(worker => ({ duration: 0, step: undefined }));

  while (graph.nodes().length) {
    // Get all steps without dependencies and that aren't started
    let openSteps = graph
      .nodes()
      .filter(step => graph.inEdges(step).length === 0)
      .filter(step => !scheduledSteps.has(step))
      .sort();

    // Get all free workers and assign them open tasks, when there are some
    workers
      .filter(worker => worker.duration === 0)
      .forEach(freeWorker => {
        if (!openSteps.length) return;
        freeWorker.step = openSteps.shift();
        freeWorker.duration = graph.node(freeWorker.step);
        scheduledSteps.add(freeWorker.step);
      });

    // duration until next step is finished
    let nextStepCompletion = workers.reduce((duration, worker) => {
      if (worker.step) return Math.min(duration, worker.duration);
      return duration;
    }, Infinity);

    // Fast-forward time
    duration += nextStepCompletion;
    workers
      .filter(worker => worker.duration > 0)
      .forEach(worker => (worker.duration -= nextStepCompletion));

    // Free up finished workers for new tasks and remove steps from graph
    workers
      .filter(worker => worker.duration === 0)
      .forEach(freeWorker => {
        graph.removeNode(freeWorker.step);
        freeWorker.step = undefined;
      });
  }
  return duration;
}

answer();
