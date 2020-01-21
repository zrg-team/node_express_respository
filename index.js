const cluster = require('cluster')

if (cluster.isMaster) {
  // Count the machine's CPUs
  const cpuCount = require('os').cpus().length

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {
    cluster.fork()
  })
// Code to run if we're in a worker process
} else {
  // Require App
  const app = require('./app')
  app.start()
}
