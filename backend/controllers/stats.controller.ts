import BaseController from './BaseController';
import { RessourcesManager } from '../classes';
//import type { Ressource } from '../types';
//import type { Request, Response } from 'express';

export default class RessourcesController extends BaseController<RessourcesManager> {
  constructor(app: App) {
    super(new RessourcesManager(app));
  }
}
