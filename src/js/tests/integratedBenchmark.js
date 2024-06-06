import Graph from "../classes/Graph.js";
import PERSIMPANGAN from "../../persimpangan.js";
import RUMAH_SAKIT from "../../rumahsakit.js";

function runBenchmark(startId, goalId, nTimes, algorithms = ['dijkstra', 'greedy', 'bfs', 'astar']) {
    const algoAndAverageTime = [];
    const runHistory = [];

    const graph = new Graph();
    const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);
    fullVertices.forEach(vertexData => {
        graph.createVertex(vertexData.id, vertexData.vertexType, vertexData.latitude, vertexData.longitude, vertexData.label, vertexData.neighborIds, true);
    });

    algorithms.forEach(algorithm => {
        runHistory[algorithm] = [];
        let totalTime = 0;
        for (let i = 0; i < nTimes; i++) {
            const startTime = performance.now();
            const result = graph.computeShortestRoute(startId, goalId, algorithm);
            // run history contains only the status and the time elapsed for each run, for each algorithm
            const endTime = performance.now();
            const timeElapsed = endTime - startTime;
            runHistory[algorithm].push({ status: result.getStatus(), timeElapsed });
            totalTime += timeElapsed;
        }
        const averageTime = totalTime / nTimes;
        algoAndAverageTime.push({ algorithm, averageTime });
    });

    return {
        runHistory,
        algoAndAverageTime
    };
}

const startId = "itc-57";
const goalId = "rs-pratama";
const nTimes = 10;
const algorithms = ['dijkstra', 'greedy', 'bfs', 'astar'];

const results = runBenchmark(startId, goalId, nTimes, algorithms);
console.log(JSON.stringify(results, null, 2));