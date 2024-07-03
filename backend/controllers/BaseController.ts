import * as utils from '../utils';
import type Base from '../classes/Base';

export default abstract class BaseController<T extends Base<V>, V> {
  public app: App;

  protected manager: T;

  protected utils = utils;

  constructor(manager: T) {
    this.app = manager.app;
    this.manager = manager;
  }
}
