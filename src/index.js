const GameServer = require('./gameServer');

const server = new GameServer();
try {
    server.startLogs();
    server.mainloop();
} catch (err) {
    server.logger.error(err);
    server.logger.log('Server stopped.');
}