import {defineStore} from "pinia";
import {v4 as uuid} from 'uuid';
import {request} from "#imports";

export const useGameStore = defineStore('game', {
  state: () => ({
    key: uuid(),
    state: 'none' as 'success' | 'fail' | 'none',
    startTime: 0,
    tryCount: 0,
    balance: 0,
  }),
  actions: {
    loadBalance() {
      request.get<{balance: number}>('statistic/get_user_balance/').then((data) => {
        this.balance = data.balance;
      });
    },
  },
});
