import { Router } from 'express';

//Router
export interface Iroute {
  route: string;
  version: number;
  router: Router;
}

//Response
export interface IResponse {
  status: string;
  timestamp: number;
  result?: any;
  message?: string;
}
//Object
export interface IObject {
  [index: string]: any;
}
