import Graph from "../classes/Graph.js";
import PERSIMPANGAN from "../../simpang.js";
import RUMAH_SAKIT from "../../rumahsakit.js";
import { hrtime } from 'process';
import fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

function runBenchmark(startId, goalId, nTimes, algorithms = ['dijkstra', 'greedy', 'bfs', 'astar']) {
    const algoAndAverageTime = [];
    const runHistory = {};
    const execTimeHistoryNs = {};

    const graph = new Graph();
    const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);
    fullVertices.forEach(vertexData => {
        graph.createVertex(vertexData.id, vertexData.vertexType, vertexData.latitude, vertexData.longitude, vertexData.label, vertexData.neighborIds, true);
    });

    graph.checkVerticesValidity();

    algorithms.forEach(algorithm => {
        runHistory[algorithm] = [];
        execTimeHistoryNs[algorithm] = [];
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
            execTimeHistoryNs[algorithm].push(timeElapsedNs);
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

    return [
        {
            // history: runHistory,
            startId: startId,
            goalId: goalId !== null ? goalId : 'null / nearest hospital',
            iterations: nTimes,
            averageTime: algoAndAverageTime
        },
        execTimeHistoryNs
    ];
}

function benchmark(startId, goalId, nTimes, algorithms = ['dijkstra', 'greedy', 'bfs', 'astar'],) {
    const results = runBenchmark(startId, goalId, nTimes, algorithms);
    console.info("<================================= BENCHMARK RESULTS =================================>")
    console.log(JSON.stringify(results[0], null, 2));

    // Get the current file URL and directory name
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const dirPath = path.join(__dirname, 'results-csvs');
    const benchmarkResultsFilename = `benchmark-results-${startId}_to_${goalId !== null ? goalId : 'nearest-hospital'}.json`;
    const execTimeHistoryNsFilename = `exec-time-history-${startId}_to_${goalId !== null ? goalId : 'nearest-hospital'}.json`;
    
    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Custom replacer function to handle BigInt serialization
    const replacer = (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
    };
    
    // `results` is an array where:
    // - `results[0]` contains benchmark results
    // - `results[1]` contains execution time history in nanoseconds
    
    // Write benchmark results to file
    fs.writeFileSync(path.join(dirPath, benchmarkResultsFilename), JSON.stringify(results[0], null, 2));
    console.log(`Benchmark results saved to ./results-csvs/${benchmarkResultsFilename}`);
    
    // Write execution time history to file using the custom replacer
    fs.writeFileSync(path.join(dirPath, execTimeHistoryNsFilename), JSON.stringify(results[1], replacer, 2));
    console.log(`Execution time history saved to ./results-csvs/${execTimeHistoryNsFilename}`);
}

export default benchmark;