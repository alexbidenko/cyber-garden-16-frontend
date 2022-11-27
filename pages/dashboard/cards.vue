<script lang="ts" setup>
import {request, useAsyncData} from "#imports";
import {DepartmentType, WinCardType} from "~/types/base";
import Cards from '~/components/ui/Cards.vue';
import {useMainStore} from "~/store/main";
const store = useMainStore();

const [{data: departments}, {data: cards}] = await Promise.all([
  useAsyncData<DepartmentType[]>('department', () => request.get('department/get_departments/')),
  useAsyncData<WinCardType[]>('cards', () => request.get('collection/play_cards/')),
]);
</script>

<template>
  <Cards :data="departments || []" :cards="cards" />
</template>
