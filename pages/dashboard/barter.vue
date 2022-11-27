<script lang="ts" setup>
import {request, useAsyncData} from "#imports";
import WinCard from "~/components/ui/WinCard.vue";
import {WinCardType} from "~/types/base";
import {useToast} from "primevue/usetoast";

type BarterType = {
  id: number;
  user1Cards: WinCardType[];
  user2Cards: WinCardType[];
}

const toast = useToast();

const {data: cards} = await useAsyncData<BarterType[]>('barter', () => request.get('collection/trade_offers/'));

const onSubmit = (barter: BarterType, value: boolean) => {
  request.post('collection/accept_trade/', {"tradeId": barter.id, "accept": value}).then(() => {
    toast.add({ severity: 'success', summary: value ? 'Заявка успешно принята' : 'Заявка успешно отклонена', life: 3000 })
    cards.value = cards.value!.filter((f) => f.id !== barter.id);
  });
}
</script>

<template>
  <div class="flex flex-column gap-4 max-w-30rem mx-auto p-3">
    <template v-if="cards?.length">
      <div v-for="card in cards" :key="card.id">
        <div class="flex gap-4">
          <div class="w-full">
            <WinCard :card="card.user1Cards[0]" :index="1" />
            <span class="block mt-2 text-center">Предложенная</span>
          </div>
          <div class="w-full">
            <WinCard :card="card.user2Cards[0]" :index="2" />
            <span class="block mt-2 text-center">Ваша</span>
          </div>
        </div>
        <div class="flex gap-4 mt-4">
          <Button class="w-full justify-content-center p-button-success" @click="onSubmit(card, true)">Принять</Button>
          <Button class="w-full justify-content-center p-button-danger" @click="onSubmit(card, false)">Отклонить</Button>
        </div>
      </div>
    </template>
    <p class="text-center">Нет предложенных обменов. Сами вы можете предложить обмен на странице коллекции другого пользователя.</p>
  </div>
</template>
