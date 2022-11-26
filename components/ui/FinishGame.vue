<script lang="ts" setup>
import {computed, onUnmounted, ref, useRouter} from "#imports";
import {useGameStore} from "~/store/game";
import {useRoute, watch} from "#imports";
import {v4 as uuid} from 'uuid';
import {Games} from "~/types/base";

const store = useGameStore();
const route = useRoute();
const router = useRouter();

const randomParameter = ref(0);
const image = computed(() => `/game-finishes/${store.state}-${randomParameter.value + 1}.png`);
const successText = computed(() => [
  'Поехали дальше!',
  'Я как Ник Фьюри!',
  'Ладно, за работу!',
][randomParameter.value]);
const failText = computed(() => [
  'Попробую ещё раз.',
  'Ещё попытка?',
  'Зарядить пушки!'
][randomParameter.value]);

const nextGame = () => {
  store.key = uuid();
  store.state = 'none';
  const types = Object.values(Games);
  router.push(`/dashboard/games/${types[Math.floor(Math.random() * types.length)]}`)
};

const repeatGame = () => {
  store.key = uuid();
  store.state = 'none';
};

watch(() => store.state, () => {
  randomParameter.value = Math.floor(Math.random() * 3);
});

watch(route, () => {
  store.state = 'none';
});

onUnmounted(() => {
  store.state = 'none';
});
</script>

<template>
  <transition name="fade">
    <Card class="finishGame" v-if="store.state !== 'none'">
      <template #content>
        <div class="flex flex-column align-items-center justify-content-evenly">
          <img :src="image" />
          <Button class="p-button-lg p-button-success p-button-rounded" v-if="store.state === 'success'" @click="nextGame">{{ successText }}</Button>
          <Button class="p-button-lg p-button-help p-button-rounded" v-else-if="store.state === 'fail'" @click="repeatGame">{{ failText }}</Button>
        </div>
      </template>
    </Card>
  </transition>
</template>

<style lang="scss">
.finishGame {
  position: absolute;
  padding: 0;
  z-index: 10;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 0;

  .p-card-body {
    height: 100%;
  }

  .p-card-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
