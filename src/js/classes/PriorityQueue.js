class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
        // Sorting the queue based on the cost of the elements.
        this.items.sort((a, b) => a.cost - b.cost); 
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

export default PriorityQueue;