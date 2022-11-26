<script setup lang="ts">
import {
  computed,
} from '#imports';
import {useMainStore} from '~/store/main';
import MobileMenu from "~/components/layout/MobileMenu.vue";

type MainMenuItem = {
  label?: string;
  divider?: boolean;
  to?: string;
  click?: (event: MouseEvent) => void;
  icon?: string;
}

const store = useMainStore();

const DESKTOP_MENU: MainMenuItem[] = [
  {
    label: 'Главная',
    to: '/dashboard',
  },
  {
    label: 'Компания',
    to: '/dashboard/company',
  },
];

const desktopMenuItems = computed(() => DESKTOP_MENU);
</script>

<template>
  <header
    class="topMenu shadow-4 flex align-items-center px-3 md:px-4"
  >
    <div class="align-items-center none lg:flex xl:gap-2">
      <NuxtLink
        v-for="item in desktopMenuItems"
        :key="item.label"
        :to="item.to"
        class="block"
      >
        <Button
          class="p-button-text px-2 xl:px-3"
          :label="item.label"
          :icon="item.icon"
          icon-pos="right"
        />
      </NuxtLink>
    </div>
    <MobileMenu />
    <div class="ml-auto flex align-items-center gap-2">
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
  z-index: 10;
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
