import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
  #usersColors = new Map();

  constructor() {}

  #pickColor() {
    return `#` + (((1 << 24) * Math.random()) | 0).toString(16) + "-fg";
  }

  #getUserColor(userName) {
    if (this.#usersColors.has(userName)) return this.#usersColors.get(userName);

    const color = this.#pickColor();
    this.#usersColors.set(userName, color);

    return color;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message);
      this.clearValue();
    };
  }

  #onMessageReceived({ screen, chat }) {
    return (msg) => {
      const { userName, message } = msg;
      const color = this.#getUserColor(userName);

      chat.addItem(`{${color}}{bold}${userName}{/}: ${message}`);
      screen.render();
    };
  }

  #onLogChanged({ screen, activityLog }) {
    return (msg) => {
      const [userName] = msg.split(/\s/);
      const color = this.#getUserColor(userName);
      activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}`);

      screen.render();
    };
  }

  #onStatusChanged({ screen, status }) {
    return (users) => {
      // vamos pegar o primeiro elemento da lista
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);

      users.forEach((userName) => {
        const color = this.#getUserColor(userName);
        status.addItem(`{${color}}{bold}${userName}{/}`);
      });

      screen.render();
    };
  }

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(
      constants.events.app.MESSAGE_RECEIVED,
      this.#onMessageReceived(components)
    );
    eventEmitter.on(
      constants.events.app.ACTIVITYLOG_UPDATED,
      this.#onLogChanged(components)
    );
    eventEmitter.on(
      constants.events.app.STATUS_UPDATED,
      this.#onStatusChanged(components)
    );
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: "HackerChat - Guilherme Rocha" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();

    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render();
  }
}

// setInterval(() => {
//     const users = ["grochavieira", "cool"];
//     eventEmitter.emit("activityLog:updated", "grochavieira entrou");
//     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
//     users.push("gui");
//     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
//     users.push("troll");
//     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
//     eventEmitter.emit("message:received", {
//       message: "hello world!!!",
//       userName: "grochavieira",
//     });
//     eventEmitter.emit("message:received", {
//       message: "hello world!!!",
//       userName: "joao",
//     });
//     eventEmitter.emit("message:received", {
//       message: "hello world!!!",
//       userName: "lucas",
//     });
//   }, 2000);
