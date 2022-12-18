export interface APIResult<Data> {
  status: 'success' | 'error';
  result?: Data;
}
export const baseUrl = import.meta.env.VITE_BASE_API?.toString() || '';
export async function makeRequest(route: string, method: string, body: Object): Promise<APIResult<any>> {
  try {
    const Response = await fetch(`${baseUrl}/api/v1/${route}`, {
      method: method,
      body: method == 'GET' || method == 'DELETE' ? null : JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      credentials: 'include',
    });
    if (Response.status >= 200 && Response.status < 300) {
      const decoded = await Response.json();
      return {
        status: 'success',
        result: decoded.result,
      };
    } else {
      return { status: 'error' };
    }
  } catch (e) {
    console.log(e);
    return { status: 'error' };
  }
}
