import { IResponse } from '../types';

export function success(result: any): IResponse {
  const Response: IResponse = {
    status: 'success',
    timestamp: Date.now(),
    result: result,
  };
  return Response;
}

export function error(message: string): IResponse {
  const Response: IResponse = {
    status: 'error',
    timestamp: Date.now(),
    message: message,
  };
  return Response;
}

export function isErr(param: any): Boolean {
  return param instanceof Error;
}

export function checkAndChange(obj: any) {
  if (isErr(obj)) return error(obj.message || obj);
  else return success(obj);
}
