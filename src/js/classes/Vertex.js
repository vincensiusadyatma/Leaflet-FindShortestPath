class Vertex {
    
    #id;                        // Vertex id    
    #vertexType;                // Vertex type (intersection or hospital)
    #lat;                       // Latitude
    #lon;                       // Longitude
    #label;                     // Label
    #parent;                    // Reference to the parent graph
    #neighborIds = new Set();   // Set of neighbor ids

    static #idCounter = 1;      // Counter to generate unique ids

    // Full constructor (for special nodes with special id)
    constructor(id, lat, lon, parent, label = null) {
        this.#id = id;
        this.#vertexType = 'HOSPITAL';
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
        this.#parent = parent;
    }

    // Intersection constructor
    constructor(lat, lon, parent, label = null) {
        // Uses parent graph to generate unique id
        this.#id = this.#parent.getThenIncrementedVertexId();
        this.#vertexType = 'INTERSECTION';
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
        this.#parent = parent;
    }
    
    getId() {
        if (this.#parent instanceof Graph) {
            return this.#parent._vertices
        }
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

    getNeighbors() {
        return this.#neighborIds;
    }

    set({id, lat, lon, label}) {
        this.#id = id;
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
    }

    isHospital() {
        return this.#vertexType === 'HOSPITAL';
    }

    isIntersection() {
        return this.#vertexType === 'INTERSECTION';
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
        return this.distanceFrom(this.#parent.getVertex(id));
    }
}

module.exports = Vertex ;

