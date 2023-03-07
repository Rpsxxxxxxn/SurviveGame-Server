const GameServer = require('./gameServer');

const server = new GameServer();
try {
    server.onStartLogs();
    server.onMainloop();
} catch (err) {
    server.logger.error(err);
}