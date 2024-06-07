class Result {
    #graph;
    #pathRoutes;
    #goalId;
    #algorithm;
    #status;

    constructor(graph, pathRoutes, goalId, algorithm, status) {
        this.#graph = graph;
        this.#pathRoutes = pathRoutes;
        this.#goalId = goalId !== null ? goalId : 'null / nearest hospital';
        this.#algorithm = algorithm;
        this.#status = status;
    }

    getTotalDistance() {
        let totalDistance = 0;
        this.#pathRoutes.forEach(path => {
            totalDistance += path.cost;
        });
        return totalDistance;
    }

    getRouteIds() {
        return this.#pathRoutes.map(path => path.vertex.getId())
    }

    getRoutee() {
        return this.#pathRoutes;
    }

    getGoalId() {
        return this.#goalId;
    }

    getAlgorithm() {
        return this.#algorithm;
    }

    getStatus() {
        return this.#status;
    }

    /**
     * Returns a JSON containg the path total distance and ids of the routes.
     */
    toJSON() {
        return {
            status: this.#status,
            algorithm: this.#algorithm,
            startId: this.#pathRoutes[0].vertex.getId(),
            goalId: this.#goalId,
            totalDistance: this.getTotalDistance(),
            routes: this.getRouteIds()
        };
    }

    printRoutes() {
        console.log("=== Routes ===");
        console.log(`Status: ${this.#status}`)
        console.log(`Algorithm: ${this.#algorithm}`);
        console.log(`Start: ${this.#pathRoutes[0].vertex.getId()}`);
        console.log(`Goal: ${this.#goalId}`);
        console.log(`Total distance: ${this.getTotalDistance()} (KM)`);
        console.log(`Route used:`)
        // this.#pathRoutes.forEach(path => {console.log(`--> Vertex: ${path.vertex.getId()}, Cost: ${path.cost}`);});
        console.log(this.#pathRoutes.map(path => path.vertex.getId()));
    }
}

export default Result;