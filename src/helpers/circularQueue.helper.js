/**
 * CircularQueue class represents a fixed-size queue with circular behavior.
 * It allows adding and removing items while maintaining a limited size.
 */
class CircularQueue {
  /**
   * Creates an instance of CircularQueue.
   *
   * @param {number} size - The maximum size of the queue.
   */
  constructor(size) {
    this.size = size; // Max size of the queue
    this.queue = []; // Array to store the elements (timestamps)
    this.front = 0; // Index of the front element
    this.rear = 0; // Index of the rear element
    this.count = 0; // Number of elements in the queue
  }

  /**
   * Adds an item to the queue. If the queue is full, it will overwrite the front item.
   *
   * @param {*} item - The item to add to the queue (e.g., timestamp).
   */
  enqueue(item) {
    if (this.count === this.size) {
      // If the queue is full, overwrite the front item (LRU eviction)
      this.front = (this.front + 1) % this.size;
    } else {
      this.count++;
    }
    this.queue[this.rear] = item;
    this.rear = (this.rear + 1) % this.size;
  }

  /**
   * Removes the front item from the queue.
   *
   * @returns {*} - The item that was removed from the front of the queue. Returns `null` if the queue is empty.
   */
  dequeue() {
    if (this.count === 0) return null; // Queue is empty
    const item = this.queue[this.front];
    this.front = (this.front + 1) % this.size;
    this.count--;
    return item;
  }

  /**
   * Peeks at the front item of the queue without removing it.
   *
   * @returns {*} - The front item of the queue. Returns `null` if the queue is empty.
   */
  peek() {
    if (this.count === 0) return null; // Queue is empty
    return this.queue[this.front];
  }

  /**
   * Gets the number of elements currently in the queue.
   *
   * @returns {number} - The number of items in the queue.
   */
  getSize() {
    return this.count;
  }
}

export default CircularQueue;
