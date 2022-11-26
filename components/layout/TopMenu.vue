<script setup lang="ts">
import {useMainStore} from '~/store/main';
import MobileMenu from "~/components/layout/MobileMenu.vue";
import {useGameStore} from "~/store/game";

const store = useMainStore();
const gameStore = useGameStore();
</script>

<template>
  <header
    class="topMenu shadow-4 flex align-items-center px-3 md:px-4"
  >
    <MobileMenu />
    <div class="ml-auto flex align-items-center gap-2">
      <Chip :label="gameStore.balance.toString()" image="/icons/coin.svg" />
      <NuxtLink to="/auth" class="block" v-if="!store.isAuthorized">
        <Button class="p-button-text px-2 sm:px-3">
          Войти
        </Button>
      </NuxtLink>
      <template v-else>
        <NuxtLink to="/dashboard/profile" class="block p-overlay-badge">
          <Button class="p-button-help p-button-raised">
            <span class="lg:block mr-2" style="display: none;">{{ store.user.name }}</span>
            <i class="pi pi-user" />
          </Button>
        </NuxtLink>
      </template>
    </div>
  </header>
</template>

<style lang="scss">
.topMenu {
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 20;
  background-color: #2a323deb !important;

  &_admin {
    position: absolute;
  }

  &__pro {
    background-color: gold;
    cursor: pointer;
  }

  &__tooltip {
    max-width: 305.5px !important;
    transform: translateX(-1.8rem);

    @media screen and (min-width: 768px) {
      transform: initial;
    }

    .p-tooltip-text {
      width: 100%;
      white-space: nowrap;
    }

    .p-tooltip-arrow {
      transform: translateX(1.8rem);

      @media screen and (min-width: 768px) {
        transform: initial;
      }
    }
  }
}
</style>
