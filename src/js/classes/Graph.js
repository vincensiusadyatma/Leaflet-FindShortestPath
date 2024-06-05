import Result from "./Result.js";
import Vertex from "./Vertex.js";
import PriorityQueue from "./PriorityQueue.js";

class Graph {

    _vertices;
    #vertexIdCounter;

    constructor() {
        this._vertices = new Map();
        this.#vertexIdCounter = 0;
    }

    // Getters

    getVertex(id) {
        return this._vertices.get(id);
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

    addVertex(...vertex) {
        for (let v of vertex) {
            if (!(v instanceof Vertex)) {
                throw new Error('Vertex must be an instance of Vertex');
            }
            this._vertices.set(v.getId(), v);

            console.log(`Iterating neighbors of vertex ${v.getId()}`);
            console.log(`Neighbors:`);
            v.getNeighborIds().forEach(neighborId => {
                console.log(`Neighbor id: ${neighborId}`);
            });
            for (let neighborId of v.getNeighborIds()) {
                console.log(`Neighbor id: ${neighborId}`);
                const neighbor = this.getVertex(neighborId);
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

    updateVertexConnections() {}

    // Shortest path finder caller

    computeShortestRoute(startId, goalId, algorithm) {
        const startVertex = this.getVertex(startId);
        console.log(`Start vertex type: ${startVertex}`)
        console.log(`Start vertex: ${startVertex.getId()}`)
        const goalVertex = this.getVertex(goalId)
        console.log(`Goal vertex type: ${goalVertex}`)
        console.log(`Goal vertex: ${goalVertex.getId()}`);

        let routes;
        if (algorithm === 'dijkstra') {
            routes = this.dijkstra(startVertex, goalVertex);
            console.log(`Routes: ${routes}`);
        }
        else if (algorithm === 'greedy') {
            routes = this.greedy(startVertex, goalVertex);
            console.log(`Routes: ${routes}`);
        }
        else {
            throw new Error('Algorithm not found');
        }
        console.log(`Routes: ${routes}`);

        // Fills the result object with route,
        // route is an array of vertices id with its cost (like dictionary)
        return new Result(this, routes);
    }

    // Shortest path algorithm

    /**
     * A* algorithm to find the shortest path between two vertices.
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex
     * @returns Result class Ordered list of vertices id from start to goal
     */
    greedy(startVertex, goalVertex) {
        const vertices = structuredClone(this._vertices);
        let queue = new PriorityQueue();
        let visited = new Set();

        // Initialize the queue with the start vertex
        queue.enqueue({ vertex: startVertex, cost: 0, parent: null });

        console.log("CHECK 1")
        // While the queue is not empty
        while (!queue.isEmpty()) {
            console.log("CHECK 2")
            // Get the current vertex and its cost from the queue's head
            const { vertex: currVertex, cost } = queue.dequeue();

            if (!queue.isEmpty()) {
                console.log(`QUEUE IS NOW EMPTY`)
            }

            // When finding the goal id, reconstruct the path and return it
            if (currVertex.getId() === goalVertex.getId()) {
                console.log("RETURNING")
                return this.reconstructPath(currVertex);
            }
            console.log("CHECK 3")

            // Mark current vertex as visited (after processing its children)
            visited.add(currVertex.getId());

            console.log("CHECK 4")
            
            // Get children and add them to queue with their costs
            const children = this.greedyGetChildren(currVertex, goalVertex);
            console.log(children);
            for (const child of children) {
                console.log("CHILDREN")
                if (!visited.has(child.vertex.getId())) {
                    child.vertex.setParent(currVertex);
                    queue.enqueue({ vertex: child.vertex, cost: cost + child.cost, parent: currVertex });
                }
            }
            // print contents of queue
            console.log("QUEUE CONTENTS");
            console.log(queue.getList());

            console.log("CHECK 5");
        }
    }

    greedyGetChildren(vertex, goalVertex) {
        const children = [];
        console.log(`Before iterating neighbor Ids of vertex ${vertex.getId()}`)
        for (let neighborId of vertex.getNeighborIds()) {
            console.log(`Neighbor id: ${neighborId}`);
            const neighbor = this.getVertex(neighborId);
            const distance = vertex.distanceFrom(neighbor);
            children.push({ vertex: neighbor, cost: distance, parent: vertex });
        }
        console.log(`greedyGetChildren: ${children}`)
        return children;
    }

    reconstructPath(vertex) {
        const path = [];
        let current = vertex;

        // Traverse backwards through parent nodes to get the path
        while (current) {
            path.push(current.getId());
            current = current.getParent();
        }

        return path.reverse();
    }

    dijkstra(startVertex, goalVertex) {
        const vertices = structuredClone(this._vertices);
        let queue = new PriorityQueue();
        let visited = new Set();

        // Initialize the queue with the start vertex
        queue.enqueue({ vertex: startVertex, cost: 0, parent: null });

        // While the queue is not empty
        while (!queue.isEmpty()) {
            // Get the current vertex and its cost from the queue's head
            const { vertex: currVertex, cost } = queue.dequeue();

            // When finding the goal id, reconstruct the path and return it
            if (currVertex.getId() === goalVertex.getId()) {
                return this.reconstructPath(currVertex);
            }

            // Mark current vertex as visited (after processing its children)
            visited.add(currVertex.getId());

            // Get children and add them to queue with their costs
            const children = this.dijkstraGetChildren(currVertex, goalVertex);
            for (const child of children) {
                if (!visited.has(child.vertex.getId())) {
                    child.vertex.setParent(currVertex);
                    queue.enqueue({ vertex: child.vertex, cost: cost + child.cost, parent: currVertex });
                }
            }
        }
    }

    dijkstraGetChildren(vertex, goalVertex) {
        const children = [];
        for (let neighborId of vertex.getNeighborIds()) {
            const neighbor = this.getVertex(neighborId);
            const distance = vertex.distanceFrom(neighbor);
            children.push({ vertex: neighbor, cost: distance, parent: vertex });
        }
        return children;
    }
}

export default Graph;