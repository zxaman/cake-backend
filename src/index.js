import { httpServer } from "./app.js";
import connectDB from "./db/index.js";
import logger from "./utils/logger.js";

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, "0.0.0.0", () => {
    logger.info("⚙️  Server is running on port: " + process.env.PORT + "\n");
  });
};

try {
  await connectDB();
  startServer();
} catch (err) {
  console.log("Mongo db connect error: ", err);
}
