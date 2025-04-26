import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CircularQueue from "../helpers/circularQueue.helper.js";

const MAX_REQUESTS = 60;
const TIME_WINDOW = 60 * 1000;

// Maximum size of rateLimitMap to store unique keys
const MAX_MAP_SIZE = 10;

const rateLimitMap = new Map();

const rateLimiter = asyncHandler(async (req, res, next) => {
  let user = req.user;
  const key = `${req.token.toString()}${user._id}:${req.path}`;
  const now = Date.now();

  // Check if the rateLimitMap has the key; if not, initialize with a new CircularQueue
  if (!rateLimitMap.has(key)) {
    if (rateLimitMap.size >= MAX_MAP_SIZE) {
      // If the map size exceeds the limit, remove the first (least recently used) entry
      const firstKey = rateLimitMap.keys().next().value;
      rateLimitMap.delete(firstKey);
    }
    rateLimitMap.set(key, new CircularQueue(MAX_REQUESTS));
  }

  const queue = rateLimitMap.get(key);

  // Remove expired timestamps from the queue (within the time window)
  while (queue.getSize() > 0 && queue.peek() <= now - TIME_WINDOW) {
    queue.dequeue();
  }

  // If the number of requests exceeds the limit, send an error with the remaining time
  if (queue.getSize() >= MAX_REQUESTS) {
    const timeRemaining = TIME_WINDOW - (now - queue.peek());
    throw new ApiError(
      429,
      `Too many requests. Please try again in ${Math.ceil(timeRemaining / 1000)} seconds.`,
    );
  }

  // Add the current timestamp to the queue
  queue.enqueue(now);

  console.log("Rate Limit Queue:", rateLimitMap);

  next();
});

export default rateLimiter;
