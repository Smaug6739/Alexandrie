import { Router } from 'express';

//Config
export interface Iconfig {
  readonly port: number;
  readonly database: {
    readonly host: string;
    readonly database: string;
  };
}
//Router
export interface Iroute {
  route: string;
  version: number;
  router: Router;
}

//Responce
export interface IResponce {
  status: string;
  timestamp: number;
  result?: any;
  message?: string;
}
//Object
export interface IObject {
  [index: string]: any;
}
