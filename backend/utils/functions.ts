import type { IResponse } from '../types';

export function success(result: any): IResponse {
  const Response: IResponse = {
    status: 'success',
    timestamp: Date.now(),
    result: result,
  };
  return Response;
}

export function error(message: any): IResponse {
  const Response: IResponse = {
    status: 'error',
    timestamp: Date.now(),
    message: String(message),
  };
  return Response;
}

export function isErr(param: any): boolean {
  return param instanceof Error;
}

export function checkAndChange(obj: any) {
  if (isErr(obj)) return error(obj.message || obj);
  else return success(obj);
}

export function parseCookies(cookies: string = ''): any {
  return cookies.split(';').reduce((obj: any, c: string) => {
    const n: any = c.trim().split('=');
    obj[n[0]] = n[1].trim();
    return obj;
  }, {});
}
