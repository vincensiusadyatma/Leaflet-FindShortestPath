const GraphSearchingAlgorithm = {
    DIJKSTRA: 'dijkstra',
    ASTAR: 'astar',
}

class Graph {

    _vertices;
    #vertexIdCounmter;

    constructor(initialVertex) {
        if (!(initialVertex instanceof Vertex)) {
            throw new Error('Initial vertex must be an instance of Vertex');
        }
        this._vertices = new Map();
        this.#vertexIdCounmter = 0;
        this.addVertex(initialVertex);
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
        return this.#vertexIdCounmter++;
    }

    hasVertexId(id) {
        return this._vertices.has(id);
    }

    // General methods

    createVertex({lat, lon, label = null}) {
        const newVertex = new Vertex(lat, lon, this, label);
    }

    addVertex(vertex) {
        if (!(vertex instanceof Vertex)) {
            throw new Error('Vertex must be an instance of Vertex');
        }
        this._vertices.set(vertex.getId(), vertex);
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

    // Shortest path finder caller
    
    computeShortestRoute(startId, goalId, algorithm) {
        if (!Object.values(SearchingAlgoirthm).includes(algorithm.toUpperCase())) {
            throw new Error(`Algorithm {algorithm} is not supported. Use any of the following: ${Object.values(SearchingAlgoirthm).join(', ')}.`);
        }
        const startVertex = this.getVertex(startId);
        const goalVertex = this.getVertex(goalId);

        switch (algorithm) {
            case GraphSearchingAlgorithm.DIJKSTRA:
                return this.dijkstra(startVertex, goalVertex);
            case GraphSearchingAlgorithm.ASTAR:
                return this.astar(startVertex, goalVertex);
        }
    }
    greedy(startId, goalId) {
        let data = JSON.parse(localStorage.getItem('data'));
        let queue = [{
            id: startId,
            cost: manhattan(data[startId].lat, data[startId].lon, data[goalId].lat, data[goalId].lon),
            path: 0,
            parent: null,
            lat: data[startId].lat,
            lon: data[startId].lon
        }];
        let visited = new Set();
    
        let iterations = 0;
    
        while (true) {
            ++iterations;
            let current = queue.shift();
    
            if (current.id == goalId) {
                return current;
            } else {
                visited.add(current.id);
                let children = getChildrenGreedy(current, goalId, data);
    
                let changedQueue = false;
    
                for (let child of children) {
                    if (!visited.has(child.id)) {
                        queue.push(child);
                        changedQueue = true;
                    }
                }
    
                if (queue.length > 0) {
                    if (!changedQueue && iterations > 50) continue;
    
                    queue.sort((a, b) => {
                        if (a.cost < b.cost) {
                            return -1;
                        } else if (a.cost > b.cost) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    return null;
                }
            }
        }
    }
    
    getChildrenGreedy(parent, goalId, data) {
        let children = [];
        for (let c of data[parent.id].con) {
            let path = manhattan(data[c].lat, data[c].lon, data[goalId].lat, data[goalId].lon);
    
            children.push({
                id: c,
                lat: data[c].lat,
                lon: data[c].lon,
                parent: parent,
                cost: path,
                path: path
            });
        }
    
        return children;
    }

    // Shortest path algorithms methods

    /**
     * Dijkstra's algorithm to find the shortest path between two vertices. (brute-force)
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex
     * @returns Ordered list of vertices id from start to goal
     */

    /**
     * A* algorithm to find the shortest path between two vertices. (greedy)
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex
     * @returns Ordered list of vertices id from start to goal
     */
}

export default Graph;