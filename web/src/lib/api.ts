import Axios, { type AxiosRequestConfig } from "axios";
import { config } from "src/config";

const axiosInstance = Axios.create({
  baseURL: config.API_URL,
});

const api = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = axiosInstance<T>({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

export { api };
