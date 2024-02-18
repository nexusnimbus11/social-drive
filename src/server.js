require('dotenv').config();
const { createServer } = require('http');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = createServer(app);

function startServer() {
	server.listen(PORT, () => console.log(`Server running on port: ${PORT}...`));
}

startServer();
