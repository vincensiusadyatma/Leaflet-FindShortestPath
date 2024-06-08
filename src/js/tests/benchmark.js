import benchmark from './integratedBenchmark.js';

const nTimes = 150;

let parameters = {
    startId: 'itc-87',
    goalId: 'rs-jih',
    nTimes: nTimes,
    algorithms: ['dijkstra', 'greedy', 'bfs', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);

parameters = {
    startId: 'itc-87',
    goalId: 'rs-jogja',
    nTimes: nTimes,
    algorithms: ['dijkstra', 'greedy', 'bfs', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);

parameters = {
    startId: 'itc-87',
    goalId: null,
    nTimes: nTimes,
    algorithms: ['dijkstra', 'greedy', 'bfs', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);