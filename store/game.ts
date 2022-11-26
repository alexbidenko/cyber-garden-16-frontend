import {defineStore} from "pinia";
import {Games} from "~/types/base";
import {v4 as uuid} from 'uuid';

export const useGameStore = defineStore('game', {
  state: () => ({
    key: uuid(),
    state: 'none' as 'success' | 'fail' | 'none',
  }),
});
