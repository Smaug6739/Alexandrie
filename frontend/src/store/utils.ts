interface Result {
  status: 'success' | 'error';
  data?: any;
}
const baseUrl = 'http://192.168.0.25:8082/api/v1/';
export async function makeRequest(route: string, method: string, body: Object): Promise<Result> {
  const responce = await fetch(baseUrl + route, {
    method: method,
    body: method == 'GET' ? null : JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    credentials: 'include',
  });
  if (responce.status >= 200 && responce.status < 300) {
    const decoded = await responce.json();
    console.log(decoded);

    return {
      status: 'success',
      data: decoded.result,
    };
  } else {
    return { status: 'error' };
  }
}
