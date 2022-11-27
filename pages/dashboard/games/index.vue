<script lang="ts" setup>
import {useGameStore} from "~/store/game";

const game = useGameStore();
</script>

<template>
  <div class="max-w-30rem mx-auto flex flex-column gap-4 md:gap-5 py-4 align-items-center px-4">
    <h3 class="mt-0 mb-2">Прогресс изучения</h3>
    <Slider :model-value="Math.min(100, Math.round((game.relatedCount.introducedCount * 100) / game.relatedCount.allCount))" class="w-full mb-4" />
    <NuxtLink to="/rules" class="block w-full mb-3">
      <Card class="gamesPage__help hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Подробнее о правилах
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/games/mapping" class="block w-full">
      <Card class="gamesPage__linkCard hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          <div class="flex justify-content-between align-items-center gamesPage__link">
            <img src="/icons/game-1.svg" />
            <span>
              Выясним отношения?
              <br />
              Культурно...
            </span>
            <img src="/icons/game-1.svg" />
          </div>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/games/excluding" class="block w-full">
      <Card class="gamesPage__linkCard hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          <div class="flex justify-content-between align-items-center gamesPage__link">
            <img src="/icons/game-2.svg" />
            <span>
              Кто-то тут явно лишний
            </span>
            <img src="/icons/game-2.svg" />
          </div>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/games/full-name" class="block w-full">
      <Card class="gamesPage__linkCard hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          <div class="flex justify-content-between align-items-center gamesPage__link">
            <img src="/icons/game-3.svg" />
            <span>
              Фоторобот
            </span>
            <img src="/icons/game-3.svg" />
          </div>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/games/swiper" class="block w-full">
      <Card class="gamesPage__linkCard hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          <div class="flex justify-content-between align-items-center gamesPage__link">
            <img src="/icons/game-4.svg" />
            <span>
              Сделай правильный выбор
              <br />
              не будь Энакином
            </span>
            <img src="/icons/game-4.svg" />
          </div>
        </template>
      </Card>
    </NuxtLink>
  </div>
</template>

<style lang="scss">
.gamesPage {
  &__linkCard {
    background-color: #9FDAA8;

    .p-card-body {
      padding: 0.5rem 1rem;
      color: black;
      font-size: 16px;
      text-align: center;
    }
    .p-card-content {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }

  &__link {
    img {
      width: 42px;
      height: 42px;
    }
    > *:nth-child(3) {
      transform: scaleX(-100%);
    }
  }

  &__help {
    background-color: #B7A2E0;

    .p-card-body {
      padding: 0.5rem 1rem;
      color: black;
      font-size: 16px;
      text-align: center;
    }
    .p-card-content {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
}
</style>
