<script lang="ts" setup>
import {DepartmentType, WinCardType} from "~/types/base";
import {computed, ref} from "#imports";
import WinCard from "~/components/ui/WinCard.vue";

type ItemType = DepartmentType & {collection: WinCardType[]};

const {data, cards} = defineProps<{
  data: DepartmentType[],
  cards: WinCardType[];
}>();

const list = computed<ItemType[]>(() => data.map((el) => ({
  ...el,
  collection: cards.filter((f) => f.person.department.id === el.id).slice(0, 3),
})))

const activeGroup = ref<{index: number; data: ItemType}>();

const select = (data: ItemType, index: number) => {
  activeGroup.value = {
    index,
    data,
  }
};
</script>

<template>
  <div class="cardsPage p-4 sm:p-6 md:p-8">
    <div class="flex flex-wrap cardsPage__list">
      <Card v-for="(d, index) in list" :key="d.id" class="cardsPage__card hover:shadow-2 shadow-6 transition-all transition-duration-300" @click="select(d, index)">
        <template #content>
          {{ d.title }}
          <div v-for="card in d.collection" :key="card.person.uuid" className="cardsPage__c">
            <WinCard :index="index" :card="card" />
          </div>
        </template>
      </Card>
    </div>

    <Dialog :visible="!!activeGroup" @update:visible="activeGroup = undefined" style="width: 100%" @hide="activeGroup = undefined" :modal="true" :dismissableMask="true">
      <Carousel :value="activeGroup?.data.collection" :numVisible="1" :numScroll="1">
        <template #item="slotProps">
          <div class="px-2">
            <WinCard :card="slotProps.data" :index="activeGroup?.index" />
          </div>
        </template>
      </Carousel>
    </Dialog>
  </div>
</template>

<style lang="scss">
.cardsPage {
  &__list {
    gap: 24px;
  }

  &__card {
    width: calc(50% - 12px);
    aspect-ratio: 1 / 1.5;
    justify-content: center;
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
  }

  &__c {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    pointer-events: none;

    &:nth-child(1) {
      transform: rotate(3deg);
    }

    &:nth-child(2) {
      transform: rotate(6deg);
    }

    &:nth-child(3) {
      transform: rotate(9deg);
    }
  }
}

.p-carousel-items-content {
  padding: 6rem 0;
}
</style>
