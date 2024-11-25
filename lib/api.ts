import { baseUrl } from "./utils";
import { getAccessToken } from "./session";
import { ApiRequestException } from "./exceptions";

interface FetchOptions extends RequestInit {
  data?: object;
  isAuth?: boolean;
}

async function _fetch(endpoint: string, options: FetchOptions = {}) {
  const {
    data,
    headers: customHeaders,
    isAuth = true,
    ...customConfig
  } = options;

  let token;

  if (isAuth) {
    token = await getAccessToken();
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(baseUrl(endpoint), config);

  if (!response.ok) {
    const errorBody = (await response.json())?.message || response.statusText;
    throw new ApiRequestException(errorBody, response.status);
  }

  return response.json();
}

async function _get(endpoint: string, options: FetchOptions = {}) {
  return _fetch(endpoint, { ...options, method: "GET" });
}

async function _post(
  endpoint: string,
  data: object,
  options: FetchOptions = {}
) {
  return _fetch(endpoint, { ...options, method: "POST", data });
}

async function _patch(
  endpoint: string,
  data: object,
  options: FetchOptions = {}
) {
  return _fetch(endpoint, { ...options, method: "PATCH", data });
}

async function _delete(endpoint: string, options: FetchOptions = {}) {
  return _fetch(endpoint, { ...options, method: "DELETE" });
}

const api = {
  get: _get,
  post: _post,
  patch: _patch,
  delete: _delete,
};

export { api };
