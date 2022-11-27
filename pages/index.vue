<script lang="ts" setup>
import {computed, onMounted, ref} from "#imports";

const deferredPrompt = ref<any>();
const notAvailable = ref(true);

const dialog = ref(false);
const isPWA = computed(() => {
  if (process.server) return false;
  // @ts-ignore
  return navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
});

const onClick = async () => {
  if (deferredPrompt.value) {
    try {
      deferredPrompt.value.prompt();
      const {outcome} = await deferredPrompt.value.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt.value = null;
      }
    } catch {
      deferredPrompt.value = null;
    }
  } else dialog.value = true;
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt.value = e;
    notAvailable.value = !e;
  });
});
</script>

<template>
  <div class="mainPage">
    <div class="mainPage__container">
      <img src="/pages/main.svg" class="mainPage__image" />
      <NuxtLink to="/auth" class="mainPage__button mainPage__button_4">
        <Button class="p-button-lg p-button-rounded mainPage__button_c">Вперед</Button>
      </NuxtLink>
      <NuxtLink to="/auth" class="mainPage__button mainPage__button_1">
        <Button class="p-button-lg p-button-rounded mainPage__button_c">Начать</Button>
      </NuxtLink>
      <NuxtLink to="/rules" class="mainPage__button mainPage__button_3">
        <Button class="p-button-lg p-button-rounded mainPage__button_c">Подробнее</Button>
      </NuxtLink>
      <Button class="mainPage__button mainPage__button_2 mainPage__button_c p-button-lg p-button-rounded" @click="onClick">Скачать</Button>
    </div>


    <Dialog v-model:visible="dialog" header="Установка приложения" modal style="width: 420px">
      <p class="text-lg line-height-3 my-1">
        Сайт реализован как PWA и подразумевает установку через браузер.
        Если вы видите это окно, значит у вас не работает автоматическая установка, однако вы можете сделать это сами через настройки браузера.
      </p>
    </Dialog>
  </div>
</template>

<style lang="scss">
.mainPage {
  background-color: #121445;
  --vw: 1vw;

  @media (min-width: 800px) {
    --vw: 8px;
  }

  &__container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }

  &__image {
    width: 100%;
    display: block;
  }

  &__button {
    position: absolute;

    &_c {
      background-color: #ECB300 !important;
    }

    &_1 {
      left: calc(6.87 * var(--vw));
      bottom: calc(111.7 * var(--vw));
    }

    &_2 {
      right: calc(9.9 * var(--vw));
      bottom: calc(14.7 * var(--vw));
    }

    &_3 {
      right: calc(6.87 * var(--vw));
      top: calc(372.5 * var(--vw));
    }

    &_4 {
      right: calc(6.1 * var(--vw));
      top: calc(78.88 * var(--vw));
    }
  }
}
</style>
