<script lang="ts" setup>
import {DepartmentType, WinCardType} from "~/types/base";
import {computed, onMounted, onUnmounted, ref, request, useRoute} from "#imports";
import WinCard from "~/components/ui/WinCard.vue";
import {useGameStore} from "~/store/game";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

type ItemType = DepartmentType & {collection: WinCardType[]};

const {data, cards, related} = defineProps<{
  data: DepartmentType[],
  cards: WinCardType[];
  related?: boolean;
}>();

const route = useRoute();
const store = useGameStore();
const confirm = useConfirm();
const toast = useToast();

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

const screenWidth = ref(0);
const activeCount = computed(() => {
  if (screenWidth.value < 400) return 1;
  if (screenWidth.value < 600) return 2;
  if (screenWidth.value < 800) return 3;
  if (screenWidth.value < 1100) return 4;
  return 5;
});

const onResize = () => {
  screenWidth.value = window.innerWidth;
  console.log(activeCount.value);
};

const onBarter = (card: WinCardType) => {
  confirm.require({
    header: "Подтверждение обмена",
    message: 'Вы уверены, что хотите обменять товар?',
    icon: 'pi pi-shopping-cart',
    acceptLabel: 'Да',
    rejectLabel: 'Нет',
    accept: () => {
      request.post('collection/request_trade/', {"user2": route.params.id, "offered_cards": [card.id],  "requested_cards": [store.barterCard!.id]}).then(() => {
        toast.add({severity: 'success', summary: 'Запрос на обмен отправлен', detail: 'Ожидайте ответа пользователя', life: 3000})
      }).finally(() => {
        store.barterCard = undefined;
      });
    },
  });
};

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="cardsPage p-4 max-w-30rem mx-auto">
    <div class="flex flex-wrap cardsPage__list">
      <Card v-for="(d, index) in list" :key="d.id" class="cardsPage__card hover:shadow-2 shadow-6 transition-all transition-duration-300" @click="select(d, index)">
        <template #content>
          {{ d.title }}
          <div v-for="card in d.collection" :key="card.person.uuid" class="cardsPage__c">
            <WinCard :index="index" :card="card" />
          </div>
        </template>
      </Card>
    </div>

    <Dialog :visible="!!activeGroup" @update:visible="activeGroup = undefined" style="width: 100%" @hide="activeGroup = undefined" :modal="true" :dismissableMask="true">
      <Carousel :value="activeGroup?.data.collection" :numVisible="activeCount" :numScroll="1">
        <template #item="slotProps">
          <div class="px-2">
            <WinCard :card="slotProps.data" :index="activeGroup?.index" />
            <Button v-if="related" class="mt-3 w-full justify-content-center" @click="store.barterCard = slotProps.data">Обменять</Button>
            <Button v-else-if="store.barterCard" class="mt-3 w-full justify-content-center" @click="onBarter(slotProps.data)">Отдать</Button>
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
  padding: 1rem 0;
}
</style>
