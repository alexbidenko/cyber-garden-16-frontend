<script setup lang="ts">
import {
  combineFullName,
  computed, onBeforeUnmount, onMounted, ref, request, requestUsers, useState, watch,
} from '#imports';
import {UserType} from "~/types/base";
import UserAvatar from "~/components/ui/UserAvatar.vue";

const container = ref<HTMLDivElement>();
const card = ref<any>();
const isMoved = ref(false);
const startPosition = ref({x: 0, y: 0});
const deltaPosition = ref({x: 0, y: 0});
const finishDeltaPosition = ref({x: '0px', y: '0px'});
const cardTransformOrigin = ref({x: 0, y: 0});

const isRequest = useState('isRequest', () => true);
const questions = ref<UserType[]>([]);
const index = useState('index', () => 0);
const direction = useState('direction', () => '');
const answer = useState('answer', () => '');

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
  const isRight = deltaPosition.value.x > 0;
  const isLeft = deltaPosition.value.x < 0;

  return {
    isRight,
    isLeft,
    right: isRight ? absX : 0,
    left: isLeft ? absX : 0,
  };
});
const helperStyle = computed(() => {
  let color = 'transparent';
  if (isMoved.value) {
    if (directionLevels.value.isLeft) color = 'rgba(241,158,166,0.7)';
    if (directionLevels.value.isRight) color = 'rgba(159,218,168,0.7)';
  }
  return {
    'opacity': Math.min(0.3, Math.max(0, +Object.values(directionLevels.value).reduce((acc, el) => el > acc ? el : acc, 0) - 25) / 800),
    'background-color': color,
  };
});

const normalizePosition = (event: TouchEvent | MouseEvent) => {
  return 'touches' in event ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : {x: event.clientX, y: event.clientY};
};

const loadQuestions = (excluded: string[] = []) => {
  isRequest.value = true;
  request.get('user/random_user/', {
    params: {
      limit_of_set: 10,
      uuid_to_exclude: excluded.join(','),
    },
  }).then((data) => {
    questions.value = [...(excluded ? questions.value : []), ...data];
  }).finally(() => {
    isRequest.value = false;
  });
};

const onNext = () => {
  index.value += 1;
  if (questions.value.length < index.value + 3) {
    loadQuestions(questions.value.slice(index.value - 2).map((el) => el.uuid));
  }
};

const onDiscard = () => {
  answer.value = 'no';
  direction.value = 'left';
  onNext();
};

const onSuccess = () => {
  answer.value = 'yes';
  direction.value = 'right';
  onNext();
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
  if (directionLevels.value.isRight && directionLevels.value.right > finishLevel) onSuccess();
  else if (directionLevels.value.isLeft && directionLevels.value.left > finishLevel) onDiscard();
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

watch(index, (_, p) => {
  request.post('user/introduce_users/', {
    user_id: questions.value[p].uuid, status: answer.value === 'yes',
  });
});

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
    class="interestsPage"
    :class="`interestsPage_${direction}`"
  >
    <div class="interestsPage__content max-w-30rem mx-auto" style="width: 100%">
      <template v-if="isRequest && !index" />
      <template v-else-if="activeQuestion">
        <transition mode="out-in" name="card">
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

        <div class="interestsPage__buttons mb-5">
          <Button icon="pi pi-thumbs-down" class="p-button-danger interestsPage__simpleIcon p-button-lg" @click="onDiscard()" />
          <Button icon="pi pi-thumbs-up" class="p-button-success interestsPage__simpleIcon p-button-lg" @click="onSuccess()" />
        </div>
      </template>
      <p v-else class="text-800 text-2xl md:text-3xl text-center text-black-alpha-90">
        Закончились сотрудники
      </p>
    </div>

    <div
      class="interestsPage__helper"
      :class="{interestsPage__helper_uncontrolled: !isMoved}"
      :style="helperStyle"
    >
      <transition name="icon" mode="out-in">
        <div v-if="directionLevels.isLeft" class="p-button-danger interestsPage__simpleIcon">
          <i class="pi pi-thumbs-down" />
        </div>
        <div v-else-if="directionLevels.isRight" class="p-button-success interestsPage__simpleIcon">
          <i class="pi pi-thumbs-up" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
.interestsPage {
  flex: 1;
  padding: calc(32px + var(--header-height)) 10vw 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height));

  @media (max-width: 640px) {
    padding: calc(32px + var(--header-height)) 16px 32px;

    & .p-card .p-card-body {
      padding: 2rem;

      @media (max-width: 640px) {
        padding: 1rem;
      }
    }
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
