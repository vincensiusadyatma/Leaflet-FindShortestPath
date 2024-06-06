import Result from "./Result.js";
import Vertex from "./Vertex.js";
import PriorityQueue from "./PriorityQueue.js";
import Queue from "./Queue.js";

class Graph {

    _vertices;
    #vertexIdCounter;

    constructor() {
        this._vertices = new Map();
        this.#vertexIdCounter = 0;
    }

    // Getters

    getVertex(vertexId) {
        return this._vertices.get(vertexId);
    }

    /**
     * @returns Map of vertices containing vertices ids as keys and vertices as values.
     */
    getVertices() {
        return this._vertices;
    }

    getThenIncrementedVertexId() {
        return this.#vertexIdCounter++;
    }

    hasVertexId(id) {
        return this._vertices.has(id);
    }

    // General methods

    createVertex(id, vertexType, lat, lon, label = null, neighborIds, insert = false) {
        const vertex = new Vertex(id, vertexType, lat, lon, label, this, neighborIds);
        if (insert) {
            console.log(`Inserting vertex ${vertex.getId()} to the graph`)
            this.addVertex(vertex);
        }
        return vertex;
    }

    addVertex(...vertices) {
        // Adding vertex the graph
        for (let v of vertices) {
            if (!(v instanceof Vertex)) {
                throw new Error('Vertex must be an instance of Vertex');
            }
            this._vertices.set(v.getId(), v);

            console.log(`Iterating neighbors of vertex ${v.getId()}`);
            console.log(`Neighbors:`);
            v.getNeighborIds().forEach(neighborId => {
                console.log(`Neighbor id: ${neighborId}`);
            });
        }
        // Connecting the vertices
        for (let v of vertices) {
            for (let neighborId of v.getNeighborIds()) {
                console.log(`addVertex --> Connecting to neighbor id: ${neighborId}`);
                console.log(`Vertices:${vertices.map(vertex => vertex.getId())}`)
                const neighbor = this.getVertex(neighborId);
                console.log(`Neighbor type: ${typeof neighbor}`);
                // if (!(neighbor instanceof Vertex)) {
                //     throw new Error('Vertex must be an instance of Vertex');
                // }
                if (neighbor) {
                    this.connectVertices(v, neighbor);
                    console.log(`Connected vertex ${v.getId()} with neighbor ${neighbor.getId()}`);
                }
            }
        }
    }

    removeVertexId(id) {
        this._vertices.delete(id);

        // Remove all references to the vertex
        for (let vertex of this._vertices.values()) {
            vertex.removeNeighbor(id);
        }
    }

    connectVertices(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        vertex1.addNeighbor(vertex2.getId());
        vertex2.addNeighbor(vertex1.getId());
    }

    connectVerticesById(id1, id2) {
        const vertex1 = this.getVertex(id1);
        const vertex2 = this.getVertex(id2);
        this.connectVertices(vertex1, vertex2);
    }

    disconnectVertices(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        vertex1.removeNeighbor(vertex2.getId());
        vertex2.removeNeighbor(vertex1.getId());
    }

    isConnected(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        return vertex1.hasNeighbor(vertex2.getId()) && vertex2.hasNeighbor(vertex1.getId());
    }

    isConnectedById(id1, id2) {
        const vertex1 = this.getVertex(id1);
        const vertex2 = this.getVertex(id2);
        return this.isConnected(vertex1, vertex2);
    }

    updateVertexConnections() { }

    // Shortest path finder caller

    computeShortestRoute(startId, goalId, algorithm) {
        const startVertex = this.getVertex(startId);
        if (startVertex === 'undefined') {
            throw new Error('Start vertex not found.');
        }
        console.log(`Start vertex type: ${startVertex}`)
        console.log(`Start vertex: ${startVertex.getId()}`)
        let goalVertex = null;
        if (goalId !== null) {
            goalVertex = this.getVertex(goalId)
            console.log(`Goal vertex type: ${goalVertex}`)
            console.log(`Goal vertex: ${goalVertex.getId()}`);
        }

        let pathRoutes;
        if (algorithm === 'dijkstra') {
            if (goalVertex === null) {
                throw new Error('Goal vertex must be specified for Dijkstra algorithm');
            }
            let result;
            result = this.dijkstra(startVertex, goalVertex);
            console.log(`Dijkstra pathRoutes: ${result[0].map(route => route.vertex.getId())}`);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            console.log("<=========================================================================>");
            return result;
        }
        else if (algorithm === 'greedy') {
            let result;
            result = this.greedy(startVertex, goalVertex);
            console.log(`Greedy pathRoutes: ${result[0].map(route => route.vertex.getId())}`);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            console.log("<=========================================================================>");
            return result;
        }
        else if (algorithm === 'greedyBacktrack') {
            let result;
            result = this.greedyBacktrack(startVertex, goalVertex);
            console.log(`Greedy backtrack pathRoutes: ${result[0].map(route => route.vertex.getId())}`);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            console.log("<=========================================================================>");
            return result;
        }
        else {
            throw new Error('Algorithm not found');
        }
    }

    // Shortest path algorithm

    /**
     * Greedy algorithm that hopes to find the shortest path without doing backtracking
     * by selecting the nearest neighbor of each traveled vertex.
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex, can be null
     * @returns an array containing the pathRoutes and status
     */
    greedy(startVertex, goalVertex) {
        const vertices = structuredClone(this._vertices);
        let queue = new Queue();
        let visited = new Set();
        let pathRoutes = [];
        let status;

        // Initialize the queue with the start vertex
        queue.enqueue({ vertex: startVertex, cost: 0 });
        pathRoutes.push({ vertex: startVertex, cost: 0 });

        // While the queue is not empty
        let iterations = 0;
        while (!queue.isEmpty()) {
            ++iterations;
            // Get the current vertex and its cost from the queue's head
            const { vertex: currVertex, cost } = queue.dequeue();

            console.log("===========================================================================");
            console.log(`Iteration: ${iterations} (${currVertex.getId()})`);
            console.log("===========================================================================");
            console.log(`Queue: `); console.log(queue.items);
            console.log(`Visited: `); console.log(visited);
            console.log(`Path routes: `); console.log(pathRoutes);
            console.log("---------------------------------------------------------------------------");

            // Mark current vertex as visited
            visited.add(currVertex.getId());

            // Check  goal conditions
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                // Specific goal vertex found
                status = 'success';
                break;
            } else if (goalVertex === null && currVertex.getId().startsWith("rs-")) {
                // Hospital vertex found
                status = 'success';
                break;
            } else if (typeof currVertex === 'undefined') {
                // Reached a leaf node (no backtracking)
                status = 'failed';
                break;
            }

            // Get neighbors and add them to queue with their costs
            let neighborHood = this.nearestNeighborsOf(currVertex);
            neighborHood = neighborHood.sort((v1, v2) => v1.cost < v2.cost ? -1 : 1).filter(neighbor => !visited.has(neighbor.vertex.getId()));
            if (neighborHood.length === 0) {
                status = 'failed';
                break;
            }
            console.log(`Shortest neighbors of (${currVertex.getId()}) is ${neighborHood[0].vertex.getId()} (${neighborHood[0].cost})`);
            console.log(`Enqueueing vertex: ${neighborHood[0].vertex.getId()}`);
            queue.enqueue({ vertex: neighborHood[0].vertex, cost: neighborHood[0].cost });
            console.log("Pushing pathRoutes");
            pathRoutes.push({ vertex: neighborHood[0].vertex, cost: neighborHood[0].cost });
            console.log("PathRoutes: "); console.log(pathRoutes);
        }
        console.log(`Returning pathRoutes: ${pathRoutes.map(route => route.vertex.getId())}`);
        console.log(pathRoutes);
        return [pathRoutes, status];
    }

    /**
     * Greedy with backtracking, this algorithm properly handles leaf nodes by backtracking
     * and selecting another path based on cost.
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex, can be null
     * @returns an array containing the pathRoutes and status
     */
    greedyBacktrack(startVertex, goalVertex) {
        const vertices = structuredClone(this._vertices);
        let queue = new PriorityQueue(); // Using priority queue for better path selection
        let visited = new Set();
        let pathRoutes = [];
        let status = 'failed';

        // Initialize the queue with the start vertex
        queue.enqueue({ vertex: startVertex, cost: 0, path: [{ vertex: startVertex, cost: 0 }] });

        // While the queue is not empty
        let iterations = 0;
        while (!queue.isEmpty()) {
            ++iterations;
            // Get the current vertex and its cost from the queue's head
            const { vertex: currVertex, cost, path } = queue.dequeue();

            console.log("===========================================================================");
            console.log(`Iteration: ${iterations} (${currVertex.getId()})`);
            console.log("===========================================================================");
            console.log(`Queue: `); console.log(queue.items);
            console.log(`Visited: `); console.log(visited);
            console.log(`Path routes: `); console.log(pathRoutes);
            console.log("---------------------------------------------------------------------------");

            // Mark current vertex as visited
            visited.add(currVertex.getId());

            // Check for goal conditions
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                // Specific goal vertex found
                pathRoutes = path;
                status = 'success';
                break;
            } else if (goalVertex === null && currVertex.getId().startsWith("rs-")) {
                // Hospital vertex found
                pathRoutes = path;
                status = 'success';
                break;
            } else if (typeof currVertex === 'undefined') {
                continue; // Skip undefined vertices
            }

            // Get neighbors and add them to queue with their costs
            let neighborHood = this.nearestNeighborsOf(currVertex);
            neighborHood = neighborHood.sort((v1, v2) => v1.cost < v2.cost ? -1 : 1).filter(neighbor => !visited.has(neighbor.vertex.getId()));
            if (neighborHood.length === 0) {
                continue; // Backtrack by continuing the loop
            }

            // Enqueue all neighbors
            for (let neighbor of neighborHood) {
                console.log(`Shortest neighbors of (${currVertex.getId()}) is ${neighbor.vertex.getId()} (${neighbor.cost})`);
                console.log(`Enqueueing vertex: ${neighbor.vertex.getId()}`);
                queue.enqueue({
                    vertex: neighbor.vertex,
                    cost: neighbor.cost,
                    path: [...path, { vertex: neighbor.vertex, cost: neighbor.cost }]
                });
            }
        }

        console.log(`Returning pathRoutes: ${pathRoutes.map(route => route.vertex.getId())}`);
        console.log(pathRoutes);
        return [pathRoutes, status];
    }

    /**
     * Dijkstra algorithm to find the most optimal shortest path, this id done by iterating
     * each and every vertex. 
     * @param startVertex 
     * @param goalVertex 
     * @returns an array containing the pathRoutes and status
     */
    dijkstra(startVertex, goalVertex) {
        const vertices = this._vertices;
        console.log(vertices);
        // throw new Error('Early break to debug');
        let priorityQueue = new PriorityQueue();
        let distances = {};
        let previousVertices = {};
        let pathRoutes = [];
        let status = 'failed';

        // Initialize distances and priority queue
        for (let vertex of vertices.values()) {
            if (!vertex instanceof Vertex) throw new Error('Vertex is undefined');
            distances[vertex.getId()] = Infinity;
            previousVertices[vertex.getId()] = null;
        }
        distances[startVertex.getId()] = 0;
        priorityQueue.enqueue({ vertex: startVertex, cost: 0 });

        let iterations = 0;
        while (!priorityQueue.isEmpty()) {
            ++iterations;
            const { vertex: currVertex, cost } = priorityQueue.dequeue();

            console.log("===========================================================================");
            console.log(`Iteration: ${iterations} (${currVertex.getId()})`);
            console.log("===========================================================================");
            console.log(`Queue: `); console.log(priorityQueue.items);
            console.log(`Path routes: `); console.log(pathRoutes);
            console.log("---------------------------------------------------------------------------");


            // Stop if we reached the goal
            if (currVertex.getId() === goalVertex.getId()) {
                status = 'success';
                let vertex = currVertex;
                while (vertex) {
                    console.log(`Pushing pathRoutes: ${vertex.getId()}`);
                    pathRoutes.unshift({ vertex: vertex, cost: distances[vertex.getId()] });
                    vertex = previousVertices[vertex.getId()];
                }
                break;
            }

            // Get neighbors and update distances
            let neighbors = this.nearestNeighborsOf(currVertex);
            for (let neighbor of neighbors) {
                let alternate = distances[currVertex.getId()] + neighbor.cost;
                if (alternate < distances[neighbor.vertex.getId()]) {
                    distances[neighbor.vertex.getId()] = alternate;
                    // console.log(`Distances: `); console.log(distances);
                    previousVertices[neighbor.vertex.getId()] = currVertex;
                    priorityQueue.enqueue({ vertex: neighbor.vertex, cost: alternate });
                }
            }
        }

        // Recalculate the distances/cost in pathRoutes for each vertex
        // starting from the second vertex
        for (let i = 1; i < pathRoutes.length; i++) {
            const currVertex = pathRoutes[i].vertex;
            const prevVertex = pathRoutes[i - 1].vertex;
            pathRoutes[i].cost = currVertex.haversineDistanceFrom(prevVertex);
        }

        console.log(`Returning pathRoutes: ${pathRoutes.map(route => route.vertex.getId())}`);
        console.log(pathRoutes);
        return [pathRoutes, status];
    }

    nearestNeighborsOf(vertex) {
        const neighborHood = [];
        for (let neighborId of vertex.getNeighborIds()) {
            const neighbor = this.getVertex(neighborId);
            console.log(`Neighbor id: (${neighborId})${typeof neighbor === 'undefined' ? " is undefined" : " is defined"}`);
            const distance = vertex.haversineDistanceFrom(neighbor);
            neighborHood.push({ vertex: neighbor, cost: distance });
            console.log(`Neighbor id: ${neighborId}, cost: ${distance}`);
        }
        // if (vertex.getId() === 'itc-35') throw new Error('Early break to debug');
        console.log(`greedyGetChildren of (${vertex.getId()}): ${neighborHood.map(neighbor => `\n - ${neighbor.vertex.getId()}: ${neighbor.cost}`)}`);
        return neighborHood;
    }
}

export default Graph;