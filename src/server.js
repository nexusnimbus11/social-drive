import "dotenv/config";
import { createServer } from "http";

import app from "./app.js";

const PORT = process.env.PORT || 8000;

const server = createServer(app);

function startServer() {
  server.listen(PORT, () => console.log(`Server running on port: ${PORT}...`));
}

startServer();
