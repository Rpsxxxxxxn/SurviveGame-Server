const GameServer = require('./gameServer');

const server = new GameServer();
try {
    server.startLogs();
    server.mainloop();
} catch (err) {
    server.logger.error(err);
} finally {
    server.logger.log('Server closed.');
}