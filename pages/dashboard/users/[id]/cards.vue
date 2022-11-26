<script lang="ts" setup>
import {request, useAsyncData, useRoute} from "#imports";
import {DepartmentType} from "~/types/base";
import Cards from '~/components/ui/Cards.vue';

const route = useRoute();

const userUuid = route.params.id;

const [{data: departments}, {data: cards}] = await Promise.all([
  useAsyncData<DepartmentType[]>('department', () => request.get('department/get_departments/')),
  useAsyncData<DepartmentType[]>(`cards_${userUuid}`, () => request.get(`collection/user_play_cards/${userUuid}`)),
]);
</script>

<template>
  <Cards :data="departments || []" :cards="cards" />
</template>
