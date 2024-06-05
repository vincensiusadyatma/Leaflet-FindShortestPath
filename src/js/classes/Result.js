class Result {
    #graph;
    #pathRoutes;

    constructor(graph, pathRoutes) {
        this.#graph = graph;
        this.#pathRoutes = pathRoutes;
    }

    getTotalDistance() {
        console.log('this.#pathRoutes before reverse:', this.#pathRoutes);
        let totalDistance = 0;
        console.log(typeof this.#pathRoutes);
        this.#pathRoutes.reverse().forEach(path => {
            if (path.parent != null) {
                totalDistance += path.cost;
            }
        });
        return totalDistance;
    }

    getRouteIds() {
        return this.#pathRoutes;
    }

    /**
     * Returns a JSON containg the path total distance and ids of the routes.
     */
    toJSON() {
        return {
            totalDistance: this.getTotalDistance(),
            routes: this.getRouteIds()
        };
    }

    printRoutes() {
        console.log(`Total distance: ${this.getTotalDistance()}`);
        this.#pathRoutes.forEach(route => {
            console.log(`Vertex: ${route.getId()}, Cost: ${route.cost}`);
        });
    }
}

export default Result;