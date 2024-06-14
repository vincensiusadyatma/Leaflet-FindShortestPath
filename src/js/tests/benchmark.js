import benchmark from './integratedBenchmark.js';

const nTimes = 250;

let parameters = {
    startId: 'itc-80',
    goalId: 'rs-umum-veteran-patmasari',
    nTimes: nTimes,
    algorithms: ['greedy', 'bfs', 'dijkstra', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);

parameters = {
    startId: 'itc-80',
    goalId: null,
    nTimes: nTimes,
    algorithms: ['greedy', 'bfs', 'dijkstra', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);

// from itc-70

parameters = {
    startId: 'itc-70',
    goalId: 'rs-umum-veteran-patmasari',
    nTimes: nTimes,
    algorithms: ['greedy', 'bfs', 'dijkstra', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);

parameters = {
    startId: 'itc-70',
    goalId: null,
    nTimes: nTimes,
    algorithms: ['greedy', 'bfs', 'dijkstra', 'astar']
};

benchmark(parameters.startId, parameters.goalId, parameters.nTimes, parameters.algorithms);