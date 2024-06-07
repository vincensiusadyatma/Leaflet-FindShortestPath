import Graph from "../classes/Graph.js";
import PERSIMPANGAN from "../../persimpangan.js";
import RUMAH_SAKIT from "../../rumahsakit.js";

const graph = new Graph();

const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);

fullVertices.forEach(vertexData => {
    // console.log(vertexData);
    graph.createVertex(vertexData.id, vertexData.vertexType, vertexData.latitude, vertexData.longitude, vertexData.label, vertexData.neighborIds, true);
});

// const testVertexId = "rs-dr-sardjito"; console.log(`[DEBUGGING] neighbors of ${testVertexId}`); console.log(graph.getVertex(testVertexId).getNeighborIds()); throw new Error("Stop here");
// console.log(graph.getVertices());

// console.log(graph.getVertex("itc-1").getNeighborIds());

const startId = "itc-57";
const goalId = "rs-pratama";
// const goalId = null;
const algorithm = 'astar';

const startTime = performance.now();
const result = graph.computeShortestRoute(startId, goalId, algorithm);
const endTime = performance.now();

if (result == []) {
    console.log('No path found');
}
console.log(`Algorithm: ${algorithm}`);
console.log(result.toJSON());
result.printRoutes();

const timeElapsed = endTime - startTime;
console.log(`Time elapsed: ${timeElapsed.toFixed(2)} milliseconds`);