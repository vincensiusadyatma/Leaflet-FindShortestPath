class HospitalMapGraph extends Graph {

    #hospitalVertices;

    constructor() {
        super();
        this.#hospitalVertices = new Set();
    }

    constructor(initialVertex) {
        if (!(initialVertex instanceof Vertex)) {
            throw new Error('Initial vertex must be an instance of Vertex');
        }
        super(initialVertex);
        this.#hospitalVertices = new Set();
    }

    /**
     * @returns Set of hospital vertices containing hospital vertices ids.
     */
    getHospitalVertices() {
        return this.#hospitalVertices;
    }

    createHospitalVertex({id, lat, lon, label = null}) {
        return new Vertex(id, lat, lon, this, label);
    }

    addVertex(vertex) {
        if (!(vertex instanceof Vertex)) {
            throw new Error('Vertex must be an instance of Vertex');
        }
        this._vertices.set(vertex.getId(), vertex);
        if (vertex.isHospital()) {
            this.#hospitalVertices.add(vertex);
        }
    }

    removeVertexId(id) {
        super._vertices.delete(id);
        if (this.#hospitalVertices.has(id)) {
            this.#hospitalVertices.delete(id);
        }

        // Remove all references to the vertex
        for (let vertex of super._vertices.values()) {
            vertex.removeNeighbor(id);
        }
    }
}