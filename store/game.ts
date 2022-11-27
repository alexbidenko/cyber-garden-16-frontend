import {defineStore} from "pinia";
import {v4 as uuid} from 'uuid';
import {request} from "#imports";
import {WinCardType} from "~/types/base";

export const useGameStore = defineStore('game', {
  state: () => ({
    key: uuid(),
    state: 'none' as 'success' | 'fail' | 'none',
    startTime: 0,
    tryCount: 0,
    balance: 0,
    relatedCount: {
      "allCount": 0,
      "introducedCount": 1,
    },

    barterCard: undefined as WinCardType | undefined,
  }),
  actions: {
    loadBalance() {
      request.get<{balance: number}>('statistic/get_user_balance/').then((data) => {
        this.balance = data.balance;
      });
      request.get<{
        "allCount": number,
        "introducedCount": number
      }>('user/related_count/').then((data) => {
        this.relatedCount = data;
      });
    },
  },
});
