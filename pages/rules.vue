<template>
  <div class="rulesPage">
    <div class="rulesPage__container">
      <img src="/pages/rules.jpg" class="rulesPage__image" />
      <NuxtLink to="/dashboard/games/mapping" class="rulesPage__button rulesPage__button_1">
        <Button class="p-button-lg p-button-rounded rulesPage__button_c px-5">Играть</Button>
      </NuxtLink>
      <NuxtLink to="/dashboard/games/excluding" class="rulesPage__button rulesPage__button_2">
        <Button class="p-button-lg p-button-rounded rulesPage__button_c px-5">Играть</Button>
      </NuxtLink>
      <NuxtLink to="/dashboard/games/full-name" class="rulesPage__button rulesPage__button_3">
        <Button class="p-button-lg p-button-rounded rulesPage__button_c px-5">Играть</Button>
      </NuxtLink>
      <NuxtLink to="/dashboard/games/swiper" class="rulesPage__button rulesPage__button_4">
        <Button class="p-button-lg p-button-rounded rulesPage__button_c px-5">Играть</Button>
      </NuxtLink>
      <NuxtLink to="/dashboard/games" class="rulesPage__button rulesPage__button_5">
        <Button class="p-button-lg p-button-rounded rulesPage__button_c px-5">Играть</Button>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.rulesPage {
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
      right: calc(11.19 * var(--vw));
      top: calc(255 * var(--vw));
    }

    &_2 {
      left: calc(6.87 * var(--vw));
      top: calc(423.9 * var(--vw));
    }

    &_3 {
      right: calc(7.63 * var(--vw));
      top: calc(598 * var(--vw));
    }

    &_4 {
      left: calc(6.87 * var(--vw));
      top: calc(761 * var(--vw));
    }

    &_5 {
      transform: translateX(-50%);
      left: calc(50 * var(--vw));
      bottom: calc(17.8 * var(--vw));
    }
  }
}
</style>
