interface Result {
  status: 'success' | 'error';
  data?: any;
}
const baseUrl = import.meta.env.VITE_BASE_API;
export async function makeRequest(route: string, method: string, body: Object): Promise<Result> {
  const responce = await fetch(baseUrl + route, {
    method: method,
    body: method == 'GET' || method == 'DELETE' ? null : JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    credentials: 'include',
  });
  if (responce.status >= 200 && responce.status < 300) {
    //TODO: error handling
    const decoded = await responce.json();
    return {
      status: 'success',
      data: decoded.result,
    };
  } else {
    const decoded = await responce.json();
    console.log(decoded);
    return { status: 'error' };
  }
}
