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
        }
        // Connecting the vertices
        for (let v of vertices) {
            for (let neighborId of v.getNeighborIds()) {
                const neighbor = this.getVertex(neighborId);
                if (neighbor) {
                    this.connectVertices(v, neighbor);
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

    /**
     * Iterates through all vertices and checks if they are valid. For each vertex, 
     * this also checks the neighbors of the vertex and prints a warning if a neighbor
     * of the current vertex has invalid neighbor.
     */
    checkVerticesValidity() {
        for (let vertex of this._vertices.values()) {
            if (!(vertex instanceof Vertex)) {
                throw new Error('Vertex is undefined');
            }
            for (let neighborId of vertex.getNeighborIds()) {
                const neighbor = this.getVertex(neighborId);
                if (!neighbor) {
                    console.warn(`Neighbor ${neighborId} of vertex ${vertex.getId()} is not found`);
                }
            }
        }
    }

    // Shortest path finder caller

    /**
     * Caller method to compute the shortest path between two vertices using a specified algorithm.
     * @param startId id of the starting vertex
     * @param goalId id of the goal vertex, can be null to automatically find the nearest hospital
     * @param algorithm algorithm to use: can be 'greedy','greedyBacktrack', or dijkstra'
     * @returns 
     */
    computeShortestRoute(startId, goalId, algorithm) {
        const startVertex = this.getVertex(startId);
        if (startVertex === 'undefined') {
            throw new Error('Start vertex not found.');
        }
        let goalVertex = null;
        if (goalId !== null) {
            try {
                goalVertex = this.getVertex(goalId)
            } catch (e) {
                throw new Error(`This vertex does not exist in the graph!`)
            }
        }

        if (algorithm === 'greedy') {
            let result;
            result = this.greedy(startVertex, goalVertex);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            return result;
        }
        else if (algorithm === 'dijkstra') {
            let result;
            result = this.dijkstra(startVertex, goalVertex);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            return result;
        }
        else if (algorithm === 'bfs') {
            let result;
            result = this.bfs(startVertex, goalVertex);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            return result;
        }
        else if (algorithm === 'astar') {
            let result;
            result = this.astar(startVertex, goalVertex);
            result = new Result(this, result[0], goalId, algorithm, result[1]);
            return result;
        }
        else {
            throw new Error("Algorithm not found, use either: 'greedy', 'bfs', or 'dijkstra'.");
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
        let queue = new Queue();
        let visited = new Set();
        let pathRoutes = [];
        let status = 'failed';
    
        // Initialize the queue with the start vertex
        queue.enqueue({ vertex: startVertex, cost: 0 });
        pathRoutes.push({ vertex: startVertex, cost: 0 });
    
        // While the queue is not empty
        // let iterations = 0;
        while (!queue.isEmpty()) {
            // ++iterations;
    
            const { vertex: currVertex, cost } = queue.dequeue();
            // console.log(`Iteration: ${iterations} (${currVertex.getId()}: ${currVertex.getVertexType()})`);
    
            // Mark current vertex as visited
            visited.add(currVertex.getId());
    
            // Check goal conditions
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                // Specific goal vertex found
                status = `success: goal vertex found {${currVertex.getId()}}`;
                break;
            } else if (goalVertex === null && currVertex.getVertexType() === 'hospital') {
                // Hospital vertex found
                status = `success: nearest hospital found {${currVertex.getId()}}`;
                break;
            }
    
            // Find the neighbor with the smallest cost that hasn't been visited
            let minCost = Infinity;
            let nextNeighbor = null;
            let neighbors = this.nearestNeighborsOf(currVertex);
    
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor.vertex.getId()) && neighbor.cost < minCost) {
                    minCost = neighbor.cost;
                    nextNeighbor = neighbor;
                }
            }
    
            if (nextNeighbor !== null) {
                queue.enqueue({ vertex: nextNeighbor.vertex, cost: nextNeighbor.cost });
                pathRoutes.push({ vertex: nextNeighbor.vertex, cost: nextNeighbor.cost });
            } else {
                // Reached leaf vertex, jalan buntu
                status = `failed: leaf vertex reached {${currVertex.getId()}}`;
                break;
            }
        }
    
        return [pathRoutes, status];
    }
    

    /**
     * Backtracking algorithm, this algorithm properly handles leaf nodes by backtracking
     * and selecting another path based on cost. This approach is a Best-First-Search (BFS).
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex, can be null
     * @returns an array containing the pathRoutes and status
     */
    bfs(startVertex, goalVertex) {
        // Making a priority queue with lower cost as the priority
        let priorityQueue = new PriorityQueue();
        let visited = new Set();
        let pathRoutes = [];
        let status = 'failed';

        // Initialize the queue with the start vertex
        priorityQueue.enqueue({ vertex: startVertex, cost: 0, path: [{ vertex: startVertex, cost: 0 }] });

        // let iterations = 0;
        // While the queue is not empty
        while (!priorityQueue.isEmpty()) {
            // ++iterations;

            const { vertex: currVertex, cost, path } = priorityQueue.dequeue();
            // console.log(`Iteration: ${iterations} (${currVertex.getId()})`);

            // Mark current vertex as visited
            visited.add(currVertex.getId());

            // Check for goal conditions
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                // Specific goal vertex found
                pathRoutes = path;
                status = `success: goal vertex found {${currVertex.getId()}}`;
                break;
            } else if (goalVertex === null && currVertex.getVertexType() === 'hospital') {
                // Hospital vertex found
                pathRoutes = path;
                status = `success: nearest hospital found {${currVertex.getId()}}`;
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
                priorityQueue.enqueue({
                    vertex: neighbor.vertex,
                    cost: neighbor.cost,
                    path: [...path, { vertex: neighbor.vertex, cost: neighbor.cost }]
                });
            }
        }

        // Path to goal vertex not found
        if (pathRoutes.length === 0) {
            status = `failed: path to goal not found`
            pathRoutes = [{ vertex: goalVertex, cost: 0 }];
        }

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
        // Making a priority queue with lower cost as the priority
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

        // let iterations = 0; const maxIterations = vertices.size ** 2;
        while (!priorityQueue.isEmpty()) {
            // ++iterations;

            const { vertex: currVertex, cost } = priorityQueue.dequeue();
            // console.log(`Iteration: ${iterations} (${currVertex.getId()})`);

            // Check for goal conditions
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                // Goal vertex found
                status = `success: goal vertex found {${currVertex.getId()}}`;
                let vertex = currVertex;
                while (vertex) {
                    pathRoutes.unshift({ vertex: vertex, cost: distances[vertex.getId()] });
                    vertex = previousVertices[vertex.getId()];
                }
                break;
            } else if (goalVertex === null && currVertex.getVertexType()  === 'hospital') {
                // Hospital vertex found
                status = `success: nearest hospital found {${currVertex.getId()}}`;
                let vertex = currVertex;
                while (vertex) {
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

        // Path to goal vertex not found
        if (pathRoutes.length === 0) {
            status = 'failed: path to goal not found';
            pathRoutes = [{ vertex: goalVertex, cost: 0 }];
        }

        return [pathRoutes, status];
    }

    heuristic(vertex, goalVertex, radius) {
        if (goalVertex === null) {
            return radius;
        }
        return vertex.haversineDistanceFrom(goalVertex);
    }

    /**
     * A* algorithm to find the most optimal shortest path using a heuristic to prioritize paths.
     * @param startVertex 
     * @param goalVertex 
     * @returns an array containing the pathRoutes and status
     */
    astar(startVertex, goalVertex) {
        const vertices = this._vertices;
        let priorityQueue = new PriorityQueue();
        let distances = {};
        let previousVertices = {};
        let pathRoutes = [];
        let status = 'failed';
        let searchRadius = 0;

        // Initialize distances and priority queue
        for (let vertex of vertices.values()) {
            if (!(vertex instanceof Vertex)) {
                throw new Error('Vertex is undefined');
            }
            distances[vertex.getId()] = Infinity;
            previousVertices[vertex.getId()] = null;
        }
        distances[startVertex.getId()] = 0;
        priorityQueue.enqueue({ vertex: startVertex, cost: 0 });

        // let iterations = 0;
        while (!priorityQueue.isEmpty()) {
            // ++iterations;

            const { vertex: currVertex } = priorityQueue.dequeue();
            // console.log(`Iteration: ${iterations} (${currVertex.getId()})`);

            // Stop if we reached the goal
            if (goalVertex !== null && currVertex.getId() === goalVertex.getId()) {
                status = `success: goal vertex found {${currVertex.getId()}}`;
                let vertex = currVertex;
                while (vertex) {
                    pathRoutes.unshift({ vertex: vertex, cost: distances[vertex.getId()] });
                    vertex = previousVertices[vertex.getId()];
                }
                break;
            } else if (goalVertex === null && currVertex.getVertexType() === 'hospital') {
                status = `success: nearest hospital found {${currVertex.getId()}}`;
                let vertex = currVertex;
                while (vertex) {
                    pathRoutes.unshift({ vertex: vertex, cost: distances[vertex.getId()] });
                    vertex = previousVertices[vertex.getId()];
                }
                break;
            }

            // Get neighbors and update distances
            let neighbors = this.nearestNeighborsOf(currVertex);
            for (let neighbor of neighbors) {
                let newCost = distances[currVertex.getId()] + neighbor.cost;
                if (newCost < distances[neighbor.vertex.getId()]) {
                    distances[neighbor.vertex.getId()] = newCost;
                    previousVertices[neighbor.vertex.getId()] = currVertex;
                    const heuristicValue = this.heuristic(neighbor.vertex, goalVertex, searchRadius);
                    let priority = newCost + heuristicValue;
                    priorityQueue.enqueue({ vertex: neighbor.vertex, cost: priority });
                }
            }

            // Increase the radius if goal vertex is null to expand the search
            if (goalVertex === null) {
                searchRadius += 2;
            }
        }

        // Recalculate the distances/cost in pathRoutes for each vertex
        // starting from the second vertex
        for (let i = 1; i < pathRoutes.length; i++) {
            const currVertex = pathRoutes[i].vertex;
            const prevVertex = pathRoutes[i - 1].vertex;
            pathRoutes[i].cost = currVertex.haversineDistanceFrom(prevVertex);
        }

        // Path to goal vertex not found
        if (pathRoutes.length === 0) {
            status += ':path to goal not found';
            pathRoutes = [{ vertex: goalVertex, cost: 0 }];
        }

        return [pathRoutes, status];
    }

    nearestNeighborsOf(vertex) {
        const neighborHood = [];
        for (let neighborId of vertex.getNeighborIds()) {
            const neighbor = this.getVertex(neighborId);
            const distance = vertex.haversineDistanceFrom(neighbor);
            neighborHood.push({ vertex: neighbor, cost: distance });
        }
        return neighborHood;
    }
}

export default Graph;