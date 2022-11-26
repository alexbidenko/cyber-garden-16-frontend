import {defineStore} from 'pinia';

import {request, useCookie, useRouter} from '#imports';
import {UserType} from "~/types/base";

export const useMainStore = defineStore('main', {
  state: () => ({
    user: {} as UserType,
    isAuthorized: false,
    isLogout: false,
    notification: false,
  }),
  actions: {
    setUser(value: UserType) {
      this.user = value;
      this.isAuthorized = true;
      this.isLogout = false;
    },
    logout(clear = false) {
      const router = useRouter();
      const authorized = useCookie('authorized', {expires: new Date(2100, 1)});

      if (!clear) router.push('/');
      Promise.resolve().then(() => {
        authorized.value = null;
        this.user = {} as UserType;
        this.isAuthorized = false;
        this.isLogout = true;
      });
    },
    loadUser() {
      return request.get<UserType>('user/get_profile/')
        .then(this.setUser)
        .catch(() => this.logout(true));
    },
  },
});
