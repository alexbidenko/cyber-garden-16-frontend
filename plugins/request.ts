import {initPlugin} from "~/utils/request";
import {defineNuxtPlugin} from "#imports";

export default defineNuxtPlugin(() => {
  initPlugin({ baseURL: process.server ? 'http://localhost:7777/api/' : '/api/' });
});
