/* eslint-disable no-unused-vars */
import 'pinia';

import {ConfirmationServiceMethods} from 'primevue/confirmationservice';
import {ToastServiceMethods} from 'primevue/toastservice';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    toast: ToastServiceMethods;
    confirm: ConfirmationServiceMethods;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
