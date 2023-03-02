const GameServer = require('./src/gameServer');
const server = new GameServer();
server.startLogs();
server.mainloop();