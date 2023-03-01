import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Schema } from "yup";
import * as yup from "yup";

class Taxios<T> {
  constructor(private readonly schema: Schema<T>) {}

  private __simpleAxiosMethod<F extends (...args: any[]) => Promise<any>>(method: F) {
    return async function <R extends AxiosResponse<T, any> = AxiosResponse<T, any>>(
      this: Taxios<T>,
      ...params: Parameters<F>
    ) {
      const response: R = await method(...params);
      await this.schema.validate(response.data, { strict: true });
      return response;
    };
  }

  private __axiosMethodWithData(
    method: (url: string, data: any, config?: AxiosRequestConfig) => any,
  ) {
    return async function <D = any, R extends AxiosResponse<T, any> = AxiosResponse<T, any>>(
      this: Taxios<T>,
      url: string,
      data: D,
      config?: AxiosRequestConfig,
    ) {
      const response: R = await method(url, data, config);
      await this.schema.validate(response.data, { strict: true });
      return response;
    };
  }

  get = this.__simpleAxiosMethod(axios.get);
  delete = this.__simpleAxiosMethod(axios.delete);
  head = this.__simpleAxiosMethod(axios.head);
  options = this.__simpleAxiosMethod(axios.options);

  post = this.__axiosMethodWithData(axios.post);
  put = this.__axiosMethodWithData(axios.put);
  patch = this.__axiosMethodWithData(axios.patch);
}

export function taxios<T>(schema: Schema<T>) {
  return new Taxios<T>(schema);
}

export default taxios;
