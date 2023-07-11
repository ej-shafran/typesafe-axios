import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type Validator<T> = (data: unknown) => T | Promise<T>;

export type Schema<T> =
  | {
    parse: Validator<T>;
  }
  | {
    validate: Validator<T>;
  }
  | Validator<T>;

async function validate<T>(data: unknown, schema: Schema<T>) {
  let parsed =
    typeof schema === "function"
      ? schema(data)
      : "parse" in schema
        ? schema.parse(data)
        : schema.validate(data);

  if (
    parsed &&
    typeof parsed === "object" &&
    "then" in parsed &&
    parsed.then instanceof Function
  ) {
    return await parsed;
  } else {
    return parsed;
  }
}

export class Taxios<T> {
  constructor(private schema: Schema<T>) { }

  private __simpleAxiosMethod<F extends (...args: any[]) => Promise<any>>(
    method: F
  ) {
    return async function <
      R extends AxiosResponse<T, any> = AxiosResponse<T, any>
    >(this: Taxios<T>, ...params: Parameters<F>) {
      const response: R = await method(...params);
      response.data = await validate(response.data, this.schema);
      return response;
    };
  }

  private __axiosMethodWithData(
    method: (url: string, data: any, config?: AxiosRequestConfig) => any
  ) {
    return async function <
      D = any,
      R extends AxiosResponse<T, any> = AxiosResponse<T, any>
    >(this: Taxios<T>, url: string, data: D, config?: AxiosRequestConfig) {
      const response: R = await method(url, data, config);
      response.data = await validate(response.data, this.schema);
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

export function taxios<R>(schema: Schema<R>): Taxios<R> {
  return new Taxios(schema);
}
