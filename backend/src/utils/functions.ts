import { IResponce, IObject } from '../types';

export function success(result: any): IResponce {
  const responce: IResponce = {
    status: 'success',
    timestamp: Date.now(),
    result: result,
  };
  return responce;
}

export function error(message: string): IResponce {
  const responce: IResponce = {
    status: 'error',
    timestamp: Date.now(),
    message: message,
  };
  return responce;
}

export function isErr(param: any): Boolean {
  return param instanceof Error;
}

export function checkAndChange(obj: any) {
  if (isErr(obj)) return error(obj.message || obj);
  else return success(obj);
}
