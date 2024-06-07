import Graph from "../classes/Graph.js";
import PERSIMPANGAN from "../../persimpangan.js";
import RUMAH_SAKIT from "../../rumahsakit.js";
import { hrtime } from 'process';

function runBenchmark(startId, goalId, nTimes, algorithms = ['dijkstra', 'greedy', 'bfs', 'astar']) {
    const algoAndAverageTime = [];
    const runHistory = {};

    const graph = new Graph();
    const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);
    fullVertices.forEach(vertexData => {
        graph.createVertex(vertexData.id, vertexData.vertexType, vertexData.latitude, vertexData.longitude, vertexData.label, vertexData.neighborIds, true);
    });

    algorithms.forEach(algorithm => {
        runHistory[algorithm] = [];
        let lastPathRoutes = [];
        let lastStatus = '';
        let lastTotalDistance = 0;
        let totalTimeNs = 0n;
        for (let i = 0; i < nTimes; i++) {
            const startTime = hrtime.bigint();
            const result = graph.computeShortestRoute(startId, goalId, algorithm);
            const endTime = hrtime.bigint();
            const timeElapsedNs = endTime - startTime;
            const timeElapsedMs = Number(timeElapsedNs) / 1e6;
            runHistory[algorithm].push({
                status: result.getStatus(),
                timeElapsed: `${timeElapsedMs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} miliseconds (${timeElapsedNs.toLocaleString()} nanoseconds)`
            });
            totalTimeNs += timeElapsedNs;
            lastPathRoutes = result.getRouteIds();
            lastStatus = result.getStatus();
            lastTotalDistance = result.getTotalDistance();
        }
        const averageTimeNs = totalTimeNs / BigInt(nTimes);
        const averageTimeMs = Number(averageTimeNs) / 1e6;

        algoAndAverageTime.push({
            algorithm: algorithm,
            status: lastStatus + ` (total distance: ${lastTotalDistance.toLocaleString()} KM)`,
            pathRoutes: lastPathRoutes,
            averageTime: `${averageTimeMs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} miliseconds (${averageTimeNs.toLocaleString()} nanoseconds)`
        });
    });

    return {
        history: runHistory,
        startId: startId,
        goalId: goalId !== null ? goalId : 'null / nearest hospital',
        iterations: nTimes,
        averageTime: algoAndAverageTime
    };
}

const startId = "itc-28";
// const goalId = "rs-jogja";
const goalId = null;
const nTimes = 100;
const algorithms = [
    'greedy',
    'dijkstra',
    'astar',
    'bfs'
];

const results = runBenchmark(startId, goalId, nTimes, algorithms);
console.info("<================================= BENCHMARK RESULTS =================================>")
console.log(JSON.stringify(results, null, 2));
