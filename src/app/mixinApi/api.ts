import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface basicParams extends AxiosRequestConfig {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  noAuth?: true;
}
interface paramsWithConfig extends basicParams {
  sendConfig: true;
}

interface paramsWithoutConfig extends basicParams {
  sendConfig?: never;
}

function makeApiCall<T>(
  params: paramsWithConfig
): Promise<AxiosResponse<T, any>>;

function makeApiCall<T>(params: paramsWithoutConfig): Promise<T>;

async function makeApiCall<T>({
  url,
  method = "GET",
  data,
  noAuth,
  sendConfig,
  ...config
}: paramsWithConfig | paramsWithoutConfig) {
  let headers: Record<string, string> = {};
  const token = localStorage.getItem("token");

  if (token !== null && !noAuth) {
    headers.Authorization = `JWT ${token}`;
  }
  const response = await axios<T>({
    method,
    data,
    url: `${import.meta.env.VITE_BASE_URL}/${url}`,
    headers,
    ...config,
  }).then((res) => res);
  // error handling can be found in store index.ts file at the bottom because store instance
  // is required for dispatching some functions
  if (sendConfig) {
    return response;
  }
  return response.data;
}

export interface errType {
  message: string;
  code: number | string;
  err?: any;
}

function checkErrorHasMessage(err: any): err is errType {
  return err?.message !== undefined;
}

export { makeApiCall, checkErrorHasMessage };
