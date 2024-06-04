import Graph from "./classes/Graph.js";
import PERSIMPANGAN from "../persimpangan.js";
import RUMAH_SAKIT from "../rumahsakit.js";

const graph = new Graph();

const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);

fullVertices.forEach(vertexData => {
    // console.log(vertexData);
    graph.createVertex(vertexData.id, vertexData.vertexType, vertexData.latitude, vertexData.longitude, vertexData.label, vertexData.neighborIds, true);
});

// console.log(graph.getVertices());

// console.log(graph.getVertex("itc-1").getNeighborIds());

const result = graph.computeShortestRoute("itc-37", "rs-jih", 'greedy');
if (result == []) {
    console.log('No path found');
}
console.log(result.toJSON());