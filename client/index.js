import Events from "events";
import TerminalController from "./src/terminalController.js";

// vai trafegar entre as camadas de código
// para emitir os eventos necessários para
// atualizar a tela e outra ações
const componentEmitter = new Events();

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
