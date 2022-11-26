<script lang="ts" setup>
import FullName from "~/components/games/FullName.vue";
import Mapping from "~/components/games/Mapping.vue";
import {useGameStore} from "~/store/game";
import {Games} from "~/types/base";
import {onMounted, request, useRoute, watch} from "#imports";
import Excluding from "~/components/games/Excluding.vue";
import Swiper from "~/components/games/Swiper.vue";

const store = useGameStore();

const route = useRoute();

onMounted(() => {
  store.startTime = new Date().getTime();
  store.tryCount = 0;
});

watch(() => route.params.name, () => {
  store.startTime = new Date().getTime();
  store.tryCount = 0;
});

watch(() => store.state, () => {
  if (['fail', 'success'].includes(store.state)) {
    request.post('statistic/add_game_session/', {
      duration: new Date().getTime() - store.startTime,
      points: store.state === 'success' ? 10 : 0,
      gameType: route.params.name,
      tryCount: store.tryCount,
    }).then(() => {
      store.loadBalance();
    }).finally(() => {
      store.tryCount = 0;
    })
  }
  if (store.state === 'success' && Math.random() > 0.5) {
    request.post('collection/spawn_playcard/').then(() => {
      store.loadBalance();
    });
  }
});
</script>

<template>
  <div :key="store.key" class="h-full">
    <FullName v-if="route.params.name === Games.fullName" />
    <Mapping v-else-if="route.params.name === Games.mapping" />
    <Excluding v-else-if="route.params.name === Games.excluding" />
    <Swiper v-else-if="route.params.name === Games.swiper" />
  </div>
</template>
