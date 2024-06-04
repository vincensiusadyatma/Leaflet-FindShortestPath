class Vertex {
    
    #id;                        // Vertex id    
    #vertexType;                // Vertex type (intersection or hospital)
    #lat;                       // Latitude
    #lon;                       // Longitude
    #label;                     // Label
    #graph;                     // Reference to the parent graph
    #neighborIds;               // Set of neighbor ids
    #pathParent;                // Parent vertex for pathing

    static #idCounter = 1;      // Counter to generate unique ids

    constructor(id, vertexType, lat, lon, label = null, graph, neighborIds = null) {
        this.#id = id;
        this.#vertexType = vertexType;
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
        this.#graph = graph;
        this.#neighborIds = new Set(neighborIds);
    }
    
    
    getId() {
        return this.#id;
    }

    getVertexType() {
        return this.#vertexType;
    }

    getLat() {
        return this.#lat;
    }

    getLon() {
        return this.#lon;
    }

    getLabel() {
        return this.#label;
    }

    getNeighborIds() {
        return this.#neighborIds;
    }

    setParent(parent) {
        this.#pathParent = parent;
    }

    getParent() {
        return this.#pathParent;
    }

    set({id, lat, lon, label}) {
        this.#id = id;
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
    }

    isHospital() {
        return this.#vertexType === 'hospital';
    }

    isIntersection() {
        return this.#vertexType === 'intersection';
    }

    addNeighbor(neighborId) {
        return this.#neighborIds.add(neighborId);
    }

    removeNeighbor(neighborId) {
        return this.#neighborIds.delete(neighborId);
    }

    hasNeighbor(neighborId) {
        return this.#neighborIds.has(neighborId);
    }

    /**
     * Method to return the distance to another vertex using euclidean distance formula.
     * @param vertex Vertex to compare
     * @returns float Distance to the vertex
     */
    distanceFrom(vertex) {
        console.log(vertex == null ? 'null' : 'not null');
        if (!(vertex instanceof Vertex)) {
            throw new TypeError("The vertex must be an instance of Vertex class.");
        }
        return Math.sqrt(Math.pow(this.#lat - vertex.getLat(), 2) + Math.pow(this.#lon - vertex.getLon(), 2));
    }

    // Calculate the distance to a neighbor by passing the neighbor's id
    distanceFromId(id) {
        if (!this.#neighborIds.has(id)) {
            throw new Error("The vertex is not a neighbor.");
        }
        return this.distanceFrom(this.#graph.getVertex(id));
    }

    // Calculate the Manhattan distance to another vertex
    manhattanDistanceFrom(vertex) {
        if (!(vertex instanceof Vertex)) {
            throw new TypeError("The vertex must be an instance of Vertex class.");
        }
        return Math.abs(this.#lat - vertex.getLat()) + Math.abs(this.#lon - vertex.getLon());
    }

    // Calculate the Manhattan distance to a neighbor by passing the neighbor's id
    manhattanDistanceFromId(id) {
        if (!this.#neighborIds.has(id)) {
            throw new Error("The vertex is not a neighbor.");
        }
        return this.manhattanDistanceFrom(this.#graph.getVertex(id));
    }
}

export default Vertex;

