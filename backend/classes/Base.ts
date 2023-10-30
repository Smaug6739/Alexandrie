import { App } from "../app";

export default class Base {
  // Define the app main class
  readonly app: App;

  constructor(app: App) {
    if (!app) throw new Error("App is not defined");
    this.app = app;
  }
}
