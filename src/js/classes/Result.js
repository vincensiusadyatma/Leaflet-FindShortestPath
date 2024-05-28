class Result {
    #pathRoutes = Array();

    constructor(pathRoutes) {
        if (!(pathRoutes instanceof Array)) {
            throw new Error('Path routes must be an array');
        }
        this.#pathRoutes = pathRoutes;
    }

    getTotalDistance() {
        return this.#pathRoutes.reduce((total, route) => total + route.getDistance(), 0);
    }

    getPathRoutes() {
        return this.#pathRoutes;
    }

    /**
     * Returns a JSON containg the path total distance and ids of the routes.
     */
    toJSON() {
        return {
            totalDistance: this.getTotalDistance(),
            routes: this.#pathRoutes.map(route => route.getId())
        };
    }
}