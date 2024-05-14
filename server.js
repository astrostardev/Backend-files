const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { server } = require('./socket/socket'); // Import the server from socket.js
require('dotenv').config();
const connectDatabase = require('./config/database');

connectDatabase();

if (cluster.isMaster) {
  // Create a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker if it exits
    cluster.fork();
  });
} else {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`);
  });
}
