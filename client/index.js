/*
node index.js \
    ---username grochavieira \
    --room sala01 \
    --hostUri localhost
*/

import Events from "events";
import CliConfig from "./src/cliConfig.js";
import SocketClient from "./src/socket.js";
import TerminalController from "./src/terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

// vai trafegar entre as camadas de código
// para emitir os eventos necessários para
// atualizar a tela e outra ações
const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();
// const controller = new TerminalController();
// await controller.initializeTable(componentEmitter);
