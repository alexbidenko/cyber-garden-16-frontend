import {FetchOptions, FetchContext} from "ofetch";
import {useCookie} from "#build/imports";
import dns from 'node:dns';
import {CookieRef} from "#app";

if (process.env.NODE_ENV === 'development' && process.server) {
  dns.setDefaultResultOrder('ipv4first');
}

const isObject = (o: any) => o === Object(o) && !Array.isArray(o) && typeof o !== 'function';

export const toCamelCase = (s: string) => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
  .replace('-', '')
  .replace('_', ''));

export const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const caseTransfer = (o: any, type: 'Camel' | 'Snake'): any => {
  if (isObject(o)) {
    const n = {} as any;

    Object.keys(o)
      .forEach((k) => {
        n[(type === 'Camel' ? toCamelCase : toSnakeCase)(k)] = caseTransfer(o[k], type);
      });

    return n;
  } if (Array.isArray(o)) {
    return o.map((i) => caseTransfer(i, type));
  }

  return o;
};

const refreshState = {
  isRequest: false,
  subscribers: [] as { resolve: (v: unknown) => void, reject: (v: unknown) => void }[],
};

export const requestConfig = {
  authorized: {} as CookieRef<string>,
};

const initialOptions: FetchOptions = {
  onRequest(context) {
    console.log('onRequest');
    if (requestConfig.authorized.value) {
      context.options.headers = {
        ...(context.options.headers || {}),
        Authorization: `JWT ${requestConfig.authorized.value}`,
      }
    }
    if (!(context.options.body instanceof FormData)) context.options.body = caseTransfer(context.options.body, 'Snake');
  },
  onRequestError(context) {
    console.log('onRequestError', context.error);
  },
  onResponse(context) {
    console.log('onResponse');
    context.response._data = caseTransfer(context.response._data, 'Camel');
  },
  onResponseError(context) {
    console.log('onResponseError', context.response);
    const error = new Error(context.response.statusText);
    Object.assign(error, context);
    throw error;
  },
};

export type ResponseErrorType = Error & FetchContext;

export const initPlugin = (options: {baseURL: string}) => {
  initialOptions.baseURL = options.baseURL;
  requestConfig.authorized = useCookie('authorized', {expires: new Date(2100, 1)});
};

const request = <T>(url: string, options: FetchOptions): Promise<T> => (
  $fetch<any>(url, {...initialOptions, ...options})
);

const $request = {
  get: <T>(url: string, options: FetchOptions = {}) => request<T>(url, { ...options }),
  post: <T>(url: string, data: FetchOptions['body'] = null, options: FetchOptions = {}) => request<T>(url, { method: 'POST', ...options, body: data }),
  put: <T>(url: string, data: FetchOptions['body'] = null, options: FetchOptions = {}) => request<T>(url, { method: 'PUT', ...options, body: data }),
  delete: <T>(url: string, options: FetchOptions = {}) => request<T>(url, { method: 'DELETE', ...options }),
}

export default $request;
