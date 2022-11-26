<script setup lang="ts">
import Card from 'primevue/card';
import {
  combineFullName,
  computed, onBeforeUnmount, onMounted, ref, request, requestUsers, shuffle, useAsyncData, watch,
} from '#imports';
import {DepartmentType, UserType} from '~/types/base';
import {useGameStore} from "~/store/game";
import UserAvatar from "~/components/ui/UserAvatar.vue";

const store = useGameStore();

const {data: departments} = useAsyncData<DepartmentType[]>('department', () => request.get('department/get_departments/'));

const container = ref<HTMLDivElement>();
const card = ref<any>();
const isMoved = ref(false);
const startPosition = ref({x: 0, y: 0});
const deltaPosition = ref({x: 0, y: 0});
const finishDeltaPosition = ref({x: '0px', y: '0px'});
const cardTransformOrigin = ref({x: 0, y: 0});

const isRequest = ref(true);
const questions = ref<UserType[]>([]);
const index = ref(0);
const direction = ref('');
const answer = ref(0);

const activeQuestion = computed(() => questions.value[index.value]);
const cardRotating = computed(() => deltaPosition.value.x / 90);
const cardStyle = computed(() => {
  const transformOrigin = `transform-origin: ${cardTransformOrigin.value.x * 100}% ${cardTransformOrigin.value.y * 100}%;`;
  return isMoved.value ?
    `transform: translate(${deltaPosition.value.x}px, ${deltaPosition.value.y}px) rotate(${cardRotating.value}deg); ${transformOrigin}` :
    transformOrigin;
});
const directionLevels = computed(() => {
  const absX = Math.abs(deltaPosition.value.x);
  const absY = Math.abs(deltaPosition.value.y);
  const isTop = deltaPosition.value.y < 0 && absY >= absX;
  const isRight = deltaPosition.value.x > 0 && absX >= absY;
  const isBottom = deltaPosition.value.y > 0 && absY > absX;
  const isLeft = deltaPosition.value.x < 0 && absX > absY;

  return {
    isTop,
    isRight,
    isBottom,
    isLeft,
    top: isTop ? absY : 0,
    right: isRight ? absX : 0,
    bottom: isBottom ? absY : 0,
    left: isLeft ? absX : 0,
  };
});
const variants = computed(() => activeQuestion.value && shuffle([
  activeQuestion.value.department,
  ...shuffle(departments.value!.filter((el) => el.title !== activeQuestion.value.department.title)).slice(0, 3),
]))

const normalizePosition = (event: TouchEvent | MouseEvent) => {
  return 'touches' in event ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : {x: event.clientX, y: event.clientY};
};

const loadQuestions = () => {
  isRequest.value = true;
  requestUsers({
    introduced: 3,
    not_introduced: 3,
    order: "random",
    not_empty: ['firstName', 'lastName', 'patronymic', 'avatar', 'department']
  }).then((data) => {
    questions.value = data;
  }).finally(() => {
    isRequest.value = false;
  });
};

const resultState = ref<'none' | 'success' | 'fail'>('none');

const onNext = (variant: DepartmentType) => {
  if (variant.id === activeQuestion.value.department.id) resultState.value = 'success';
  else {
    store.tryCount++;
    resultState.value = 'fail';
  }
  setTimeout(() => {
    resultState.value = 'none';
  }, 300);

  index.value += 1;
  if (questions.value.length === index.value + 1) {
    store.state = store.tryCount ? 'fail' : 'success';
  }
};

const onLeft = () => {
  direction.value = 'left';
  onNext(variants.value[3]);
};

const onTop = () => {
  direction.value = 'top';
  onNext(variants.value[0]);
};

const onBottom = () => {
  direction.value = 'bottom';
  onNext(variants.value[2]);
};

const onRight = () => {
  direction.value = 'right';
  onNext(variants.value[1]);
};

const onTouchMove = (event: TouchEvent | MouseEvent) => {
  event.preventDefault();
  const position = normalizePosition(event);
  deltaPosition.value = {
    x: position.x - startPosition.value.x,
    y: position.y - startPosition.value.y,
  };
};

const onTouchEnd = (event: TouchEvent | MouseEvent) => {
  event.preventDefault();

  finishDeltaPosition.value = {
    x: `${deltaPosition.value.x}px`,
    y: `${deltaPosition.value.y}px`,
  };
  let finishLevel = 120;
  if (window.innerWidth > 1000) finishLevel = 250;
  else if (window.innerWidth > 600) finishLevel = 200;
  if (directionLevels.value.isTop && directionLevels.value.top > finishLevel) onTop();
  else if (directionLevels.value.isBottom && directionLevels.value.bottom > finishLevel) onBottom();
  else if (directionLevels.value.isRight && directionLevels.value.right > finishLevel) onRight();
  else if (directionLevels.value.isLeft && directionLevels.value.left > finishLevel) onLeft();
  setTimeout(() => {
    finishDeltaPosition.value = {x: '0px', y: '0px'};
  }, 300);

  startPosition.value = {x: 0, y: 0};
  deltaPosition.value = {x: 0, y: 0};
  isMoved.value = false;

  container.value!.removeEventListener('touchmove', onTouchMove);
  container.value!.removeEventListener('mousemove', onTouchMove);
  container.value!.removeEventListener('touchend', onTouchEnd);
  container.value!.removeEventListener('mouseup', onTouchEnd);
};

const onTouchStart = (event: TouchEvent | MouseEvent) => {
  startPosition.value = normalizePosition(event);
  isMoved.value = true;
  const rect = card.value.$el.getBoundingClientRect();
  cardTransformOrigin.value = {
    x: (startPosition.value.x - rect.x) / rect.width,
    y: (startPosition.value.y - rect.y) / rect.height,
  };

  container.value!.addEventListener('touchmove', onTouchMove);
  container.value!.addEventListener('mousemove', onTouchMove);
  container.value!.addEventListener('touchend', onTouchEnd);
  container.value!.addEventListener('mouseup', onTouchEnd);
};

watch(card, (value) => {
  if (value) {
    card.value.$el.addEventListener('touchstart', onTouchStart);
    card.value.$el.addEventListener('mousedown', onTouchStart);
  }
});

onMounted(() => {
  loadQuestions();
});

onBeforeUnmount(() => {
  card.value?.$el.removeEventListener('touchstart', onTouchStart);
  card.value?.$el.removeEventListener('mousedown', onTouchStart);
});
</script>

<template>
  <div
    ref="container"
    class="interestsPage h-full"
    :class="`interestsPage_${direction} interestsPage_${resultState}`"
  >
    <div class="interestsPage__variants" v-if="variants?.length">
      <div :class="{interestsPage__variant_active: directionLevels.isTop}">{{ variants[0]?.title }}</div>
      <div :class="{interestsPage__variant_active: directionLevels.isRight}">{{ variants[1]?.title }}</div>
      <div :class="{interestsPage__variant_active: directionLevels.isBottom}">{{ variants[2]?.title }}</div>
      <div :class="{interestsPage__variant_active: directionLevels.isLeft}">{{ variants[3]?.title }}</div>
    </div>

    <div class="interestsPage__content">
      <template v-if="isRequest && !index" />
      <transition v-else-if="activeQuestion" mode="out-in" name="card">
        <Card
          ref="card"
          :key="activeQuestion.uuid"
          class="interestsPage__card"
          :class="{interestsPage__card_uncontrolled: !isMoved}"
          :style="cardStyle"
        >
          <template #content>
            <UserAvatar :user="activeQuestion" class="mx-auto block w-8rem h-8rem" />
            <p class="text-3xl m-0 text-center pt-4 select-none">
              {{ combineFullName(activeQuestion) }}
            </p>
          </template>
        </Card>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
.interestsPage {
  flex: 1;
  padding: 32px 10vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;

  @media (max-width: 640px) {
    padding: calc(32px + var(--header-height)) 16px 32px;

    & .p-card .p-card-body {
      padding: 2rem;

      @media (max-width: 640px) {
        padding: 1rem;
      }
    }
  }

  &_success {
    box-shadow: inset 0 0 61px 31px rgba(66, 255, 0, 0.45);
  }

  &_fail {
    box-shadow: inset 0 0 61px 31px rgba(255, 0, 0, 0.45);
  }

  &__background {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
  }

  &__content {
    flex: 1;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  & &__card {
    background: #2a323dbb;
    width: 100%;
    border-radius: 24px;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    user-select: none;

    .p-card-body {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 100%;
      width: 100%;
      flex: 1;

      .p-card-content {
        margin: auto 0;
      }
    }

    &_uncontrolled {
      transition: transform 0.5s ease;
    }
  }

  &__simpleIcon .pi {
    font-size: 1.8rem;
  }

  &__variants * {
    position: absolute;
    color: black;
    font-size: 22px;
    transition: color 0.3s ease;

    &:nth-child(1) {
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
    }

    &:nth-child(2) {
      top: 25%;
      right: 16px;
      transform: rotate(20deg);
      transform-origin: 100% 50%;
    }

    &:nth-child(3) {
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
    }

    &:nth-child(4) {
      top: 25%;
      left: 16px;
      transform: rotate(-20deg);
      transform-origin: 0 50%;
    }
  }

  &__variant {
    &_active {
      color: blue;
    }
  }

  &__doubleIcon {
    justify-content: center;

    & > * {
      font-size: 1.2rem;

      &:first-child {
        transform: translateY(-5px);
      }

      &:nth-child(2) {
        transform: translateY(5px);
      }
    }
  }

  &__buttons {
    max-width: 300px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 58px;

    & > * {
      border-radius: 50%;
      width: 64px !important;
      height: 64px !important;
      align-items: center;
      display: flex;
    }
  }

  .card-enter-active,
  .card-leave-active {
    transform-origin: 50% 50% !important;
    transition: transform 0.3s ease, opacity 0.3s ease !important;
  }

  .card-enter-from {
    transform: scale(0.7);
    opacity: 0;
  }

  .card-leave-to {
    opacity: 0;
  }

  &_left .card-leave-to {
    opacity: 0;
    transform: translateY(v-bind('finishDeltaPosition.y')) translateX(v-bind('finishDeltaPosition.x')) translateX(-150px) !important;
  }

  &_right .card-leave-to {
    opacity: 0;
    transform: translateY(v-bind('finishDeltaPosition.y')) translateX(v-bind('finishDeltaPosition.x')) translateX(150px) !important;
  }

  &_top .card-leave-to {
    opacity: 0;
    transform: translateX(v-bind('finishDeltaPosition.x')) translateY(v-bind('finishDeltaPosition.y')) translateY(-150px) !important;
  }

  &_bottom .card-leave-to {
    opacity: 0;
    transform: translateX(v-bind('finishDeltaPosition.x')) translateY(v-bind('finishDeltaPosition.y')) translateY(150px) !important;
  }

  &__helper {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: background-color 0.5s ease;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;

    &_uncontrolled {
      transition: background-color 0.5s ease, opacity 0.5s ease;
    }

    & > * {
      transform-origin: 50% 50%;
      transform: scale(5);
    }

    i {
      color: white;
    }
  }

  .icon-enter-active,
  .icon-leave-active {
    transition: opacity 0.3s ease;
  }
  .icon-enter-from,
  .icon-leave-to {
    opacity: 0;
  }
}
</style>
