import {initPlugin} from "~/utils/request";
import {defineNuxtPlugin} from "#imports";

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    initPlugin({ baseURL: process.server ? 'http://localhost:7777/api/' : '/api/' });
  } else {
    initPlugin({ baseURL: process.server ? 'http://cyber-garden-16-frontend_nginx:80/api/' : '/api/' });
  }
});
