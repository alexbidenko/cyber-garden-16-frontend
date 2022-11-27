<script lang="ts" setup>
import {WinCardType} from "~/types/base";
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {computed, onMounted, onUnmounted, ref} from "#imports";

const {card, className, index} = defineProps<{
  card: WinCardType;
  className?: string;
  index: number;
}>();

const container = ref<HTMLDivElement>();
const containerWidth = ref(0);

const backgroundFront = computed(() => `url("/cards/card-${(index % 4) + 1}-front.png") center / cover`);
const backgroundBack = computed(() => `url("/cards/card-${(index % 4) + 1}-back.png") center / cover`);
const headerFontSize =  computed(() => `${containerWidth.value * 0.09}px`);
const bodyFontSize =  computed(() => `${containerWidth.value * 0.055}px`);
const backFontSize =  computed(() => `${containerWidth.value * 0.1}px`);

const onUpdate = () => {
  containerWidth.value = container.value?.scrollWidth || 0;
}

let observer: ResizeObserver;

onMounted(() => {
  onUpdate();
  observer = new ResizeObserver(onUpdate);
  observer.observe(container.value!);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div class="winCard flip-card">
    <div class="flip-card-inner">
      <Card
        class="flip-card-front hover:shadow-2 shadow-6 transition-all transition-duration-300"
        :class="className"
      >
        <template #content>
          <div class="w-full absolute" ref="container" />
          <template v-if="containerWidth">
            <span class="winCard__department">{{ card.person.department.title }}</span>
            <UserAvatar class="winCard__avatar" :user="card.person" />
            <span class="winCard__name">{{ card.person.firstName }} {{ card.person.lastName }}</span>
            <span class="winCard__specialization">{{ card.person.specialization }}</span>
          </template>
        </template>
      </Card>
      <Card
        class="flip-card-back hover:shadow-2 shadow-6 transition-all transition-duration-300"
        :class="className"
      >
        <template #content>
          <span class="winCard__back px-2">{{ card.person.fact1 }}</span>
        </template>
      </Card>
    </div>
  </div>
</template>

<style lang="scss">
.winCard {
  aspect-ratio: 250 / 400;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  position: relative;
  max-height: 500px;

  &__avatar {
    position: absolute;
    left: 50%;
    top: 15%;
    border-radius: 12px;
    width: 64%;
    transform: translateX(-50%);
    object-fit: cover;
    aspect-ratio: 1/1;
  }

  &__department {
    position: absolute;
    left: 50%;
    top: 2%;
    width: 100%;
    transform: translateX(-50%);
    font-size: v-bind(headerFontSize);
    white-space: nowrap;
  }

  &__name {
    position: absolute;
    left: 50%;
    top: 60%;
    width: 100%;
    transform: translateX(-50%);
    font-size: v-bind(bodyFontSize);
  }

  &__back {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    font-size: v-bind(backFontSize);
    color: black;
  }

  &__specialization {
    position: absolute;
    left: 50%;
    top: 71%;
    width: 100%;
    font-size: v-bind(bodyFontSize);
    transform: translateX(-50%);
  }
}

.flip-card {
  background-color: transparent;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(360deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background: v-bind(backgroundFront);
  transform: rotateY(180deg);
}

/* Style the back side */
.flip-card-back {
  background: v-bind(backgroundBack);
}
</style>
