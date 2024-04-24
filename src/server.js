import 'dotenv/config';
import { createServer } from 'http';

import app from './app.js';
import { connectToDB } from './configs/mongodb.js';

const PORT = process.env.PORT || 8000;

const server = createServer(app);

async function startServer() {
    await connectToDB();
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}...`));
}
// test

startServer();
