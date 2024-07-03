import { App } from '../app';

export default abstract class Base<T> {
  // Define the app main class
  readonly app: App;

  constructor(app: App) {
    if (!app) throw new Error('App is not defined');
    this.app = app;
  }

  public abstract validate(data: T): string | false;
}
