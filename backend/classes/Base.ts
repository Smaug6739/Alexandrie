import { App } from '../App';
import Validator from './Validator';

export default abstract class Base {
  // Define the app main class
  readonly app: App;

  constructor(app: App) {
    if (!app) throw new Error('App is not defined');
    this.app = app;
  }

  public abstract validator: Validator;
}
