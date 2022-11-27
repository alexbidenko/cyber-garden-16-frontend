<script lang="ts" setup>
import FullName from "~/components/games/FullName.vue";
import Mapping from "~/components/games/Mapping.vue";
import {useGameStore} from "~/store/game";
import {Games, WinCardType} from "~/types/base";
import {onMounted, ref, request, useRoute, watch} from "#imports";
import Excluding from "~/components/games/Excluding.vue";
import Swiper from "~/components/games/Swiper.vue";
import WinCard from "~/components/ui/WinCard.vue";

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

const winCard = ref<{card: WinCardType, index: number}>();

const spawn = () => {
  request.post<WinCardType>('collection/spawn_playcard/').then((data) => {
    store.loadBalance();
    winCard.value = {
      card: data,
      index: Math.floor(Math.random() * 4) + 1,
    };
    setTimeout(() => {
      winCard.value = undefined;
    }, 4000);
  });
}

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
    spawn();
  }
});

onMounted(() => {
  // @ts-ignore
  window.spawn = spawn;
});
</script>

<template>
  <div :key="store.key" class="gameNamePage">
    <FullName v-if="route.params.name === Games.fullName" />
    <Mapping v-else-if="route.params.name === Games.mapping" />
    <Excluding v-else-if="route.params.name === Games.excluding" />
    <Swiper v-else-if="route.params.name === Games.swiper" />

    <WinCard v-if="winCard" :card="winCard.card" :index="winCard.index" class="gameNamePage__winCard gameNamePage__winCard_show" />
  </div>
</template>

<style lang="scss">
.gameNamePage {
  height: calc(100vh - var(--header-height));
  overflow: auto;
  position: relative;

  &__winCard {
    top: 100vh;
    left: calc(50% - 125px);
    z-index: 100;
    position: absolute;
    height: 400px;
    width: 250px;

    &_show {
      animation: show-card 3s ease;
    }
  }

  @keyframes show-card {
    0% {
      transform: translateY(0);
    }

    40% {
      transform: translateY(-140%);
    }

    60% {
      transform: translateY(-140%);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
