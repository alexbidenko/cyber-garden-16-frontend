<script lang="ts" setup>
import {request, useAsyncData, useRoute} from "#imports";
import {DepartmentType, WinCardType} from "~/types/base";
import Cards from '~/components/ui/Cards.vue';
import {useGameStore} from "~/store/game";

const route = useRoute();
const store = useGameStore();

const userUuid = route.params.id;

const [{data: departments}, {data: cards}, {data: myCollection}] = await Promise.all([
  useAsyncData<DepartmentType[]>('department', () => request.get('department/get_departments/')),
  useAsyncData<WinCardType[]>(`cards_${userUuid}`, () => request.get(`collection/user_play_cards/${userUuid}`)),
  useAsyncData<WinCardType[]>('cards', () => request.get('collection/play_cards/')),
]);
</script>

<template>
  <div>
    <Cards :data="departments || []" :cards="cards" related />

    <Dialog :visible="!!store.barterCard">
      <Cards :data="departments || []" :cards="myCollection" />
    </Dialog>
  </div>
</template>
