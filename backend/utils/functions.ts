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

type Cookies = {
  [key: string]: any;
};
export function parseCookies(cookies: string = '') {
  return cookies.split(';').reduce((obj: Cookies, c: string) => {
    const n = c.trim().split('=');
    if (n[0]) obj[n[0]] = n[1]?.trim();
    return obj;
  }, {});
}
