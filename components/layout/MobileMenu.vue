<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, useRoute, watch,
} from '#imports';

type MainMenuItem = {
  label?: string;
  divider?: boolean;
  to?: string;
  click?: (event: MouseEvent) => void;
  icon?: string;
}

const route = useRoute();

const MOBILE_MENU: MainMenuItem[] = [
  {
    label: 'О проекте',
    to: '/',
  },
  {
    label: 'Правила игр',
    to: '/',
  },
  {
    label: 'Главная',
    to: '/dashboard',
  },
  {
    label: 'Профиль',
    to: '/dashboard/profile',
  },
  {divider: true},
  {
    label: 'Правила игр',
    to: '/rules',
  },
  {
    label: 'Начать знакомство',
    to: '/dashboard/games',
  },
  {
    label: 'Моя коллекция',
    to: '/dashboard/cards',
  },
  {
    label: 'Отметить знакомых',
    to: '/dashboard/relationship',
  },
  {
    label: 'Карта компании',
    to: '/dashboard/company',
  },
  {
    label: 'Поиск сотрудников',
    to: '/dashboard/users',
  },
  {divider: true},
  {
    label: 'Потрать свои баллы',
    to: '/dashboard/products',
  },
  {
    label: 'Предложения обменов',
    to: '/dashboard/barter',
  },
];
const isMoved = ref(false);
const showMenu = ref(false);
const touchStartXPosition = ref<number>(0);
const touchDeltaXPosition = ref<number>(0);
const menuContainer = ref<HTMLDivElement>();

const path = computed(() => route.fullPath);
const mobileMenuItems = computed(() => MOBILE_MENU);

const normalizeXPosition = (event: TouchEvent | MouseEvent) => {
  return 'touches' in event ? event.touches[0].clientX : event.clientX;
};

const onTouchMove = (event: TouchEvent | MouseEvent) => {
  const xPosition = normalizeXPosition(event);

  touchDeltaXPosition.value = Math.min(0, xPosition - touchStartXPosition.value);
  isMoved.value = true;
};

const onTouchEnd = (event: Event) => {
  if (isMoved.value) event.preventDefault();
  if (touchDeltaXPosition.value < -150) {
    setTimeout(() => {
      showMenu.value = false;
    });
  }
  touchStartXPosition.value = 0;
  touchDeltaXPosition.value = 0;
  setTimeout(() => {
    isMoved.value = false;
  });

  menuContainer.value!.removeEventListener('touchmove', onTouchMove);
  menuContainer.value!.removeEventListener('mousemove', onTouchMove);
  menuContainer.value!.removeEventListener('touchend', onTouchEnd);
  menuContainer.value!.removeEventListener('mouseup', onTouchEnd);
};

const onTouchStart = (event: TouchEvent | MouseEvent) => {
  if (!showMenu.value) return;

  touchStartXPosition.value = normalizeXPosition(event);

  menuContainer.value!.addEventListener('touchmove', onTouchMove);
  menuContainer.value!.addEventListener('mousemove', onTouchMove);
  menuContainer.value!.addEventListener('touchend', onTouchEnd);
  menuContainer.value!.addEventListener('mouseup', onTouchEnd);
};

const onOverflowClick = () => {
  if (!isMoved.value) showMenu.value = false;
};

watch(path, () => {
  showMenu.value = false;
});

watch(showMenu, (value) => {
  if (value) document.body.classList.add('p-overflow-hidden');
  else document.body.classList.remove('p-overflow-hidden');
});

onMounted(() => {
  menuContainer.value!.addEventListener('touchstart', onTouchStart);
  menuContainer.value!.addEventListener('mousedown', onTouchStart);
});

onBeforeUnmount(() => {
  menuContainer.value!.removeEventListener('touchstart', onTouchStart);
  menuContainer.value!.removeEventListener('mousedown', onTouchStart);
});
</script>

<template>
  <Button
    icon="pi pi-bars"
    class="p-button-text"
    @click="showMenu = !showMenu"
    aria-label="Открыть меню"
  />

  <div ref="menuContainer">
    <transition name="fade">
      <div v-if="showMenu" class="mobileMenu__overflow" @click="onOverflowClick" />
    </transition>
    <transition name="sidebar">
      <aside
        v-if="showMenu"
        class="surface-section h-screen border-right-1 surface-border flex flex-column select-none top-0 left-0 fixed mobileMenu__menu"
        :style="touchStartXPosition ? `transform: translateX(${touchDeltaXPosition}px)` : 'transition: transform 0.25s ease'"
      >
        <Button
          icon="pi pi-times"
          class="p-button-text absolute p-button-rounded text-900"
          style="top: 16px; right: 16px"
          @click="showMenu = false"
          aria-label="Закрыть меню"
        />
        <nav class="overflow-y-auto min-h-full flex align-items-center">
          <ul class="list-none p-2 m-0 w-full">
            <li v-for="item in mobileMenuItems" :key="item.to">
              <Divider v-if="item.divider" />
              <NuxtLink
                v-else
                :to="item.to"
                class="flex align-items-center cursor-pointer p-3 text-700 hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
              >
                <span class="font-medium mx-auto">{{ item.label }}</span>
                <span class="p-ink" />
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
    </transition>
  </div>
</template>

<style lang="scss">
.mobileMenu {
  &__overflow {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 11;
    transition: opacity 0.5s ease;
  }

  &__menu {
    z-index: 12;
    width: 300px;
  }

  @media screen and (min-width: 992px) {
    .lg\:none {
      display: none !important;
    }
  }
}
</style>
