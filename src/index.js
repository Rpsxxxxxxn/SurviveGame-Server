const GameServer = require('./gameServer');
const server = new GameServer();
server.startLogs();
server.mainloop();