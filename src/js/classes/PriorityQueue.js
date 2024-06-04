class PriorityQueue {
    #heap = [];

    constructor() {
        this.#heap.push(null);
    }

    enqueue(value) {
        this.#heap.push(value);
        this.#shiftUp();
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }

        const root = this.#heap[1];
        const last = this.#heap.pop();
        if (this.#heap.length > 1) {
            this.#heap[1] = last;
            this.#shiftDown();
        }

        return root;
    }

    getList() {
        return this.#heap;
    }

    isEmpty() {
        return this.#heap.length === 1;
    }

    #shiftUp() {
        let current = this.#heap.length - 1;
        let parent = Math.floor(current / 2);

        while (parent > 0 && this.#heap[current] < this.#heap[parent]) {
            // swap
            [this.#heap[current], this.#heap[parent]] = [this.#heap[parent], this.#heap[current]];
            current = parent;
            parent = Math.floor(current / 2);
        }
    }

    #shiftDown() {
        let current = 1;
        let leftChild = current * 2;
        let rightChild = current * 2 + 1;
        let child = this.#heap[rightChild] < this.#heap[leftChild] ? rightChild : leftChild;

        while (this.#heap[child] < this.#heap[current]) {
            // swap
            [this.#heap[current], this.#heap[child]] = [this.#heap[child], this.#heap[current]];
            current = child;
            leftChild = current * 2;
            rightChild = current * 2 + 1;
            child = this.#heap[rightChild] < this.#heap[leftChild] ? rightChild : leftChild;
        }
    }
}

export default PriorityQueue;