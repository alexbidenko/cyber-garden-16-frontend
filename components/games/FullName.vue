<script lang="ts" setup>
import {combineFullName, computed, ref, requestUsers, shuffle, useAsyncData, useState, watch} from "#imports";
import {UserType} from "~/types/base";
import getRandomAndExclude from "~/utils/getRandomAndExclude";
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {useGameStore} from "~/store/game";
import {useToast} from "primevue/usetoast";

const toast = useToast();
const store = useGameStore();

const {data: usedUsers} = await useAsyncData<UserType[]>(`users_${store.key}`, () => requestUsers({
  not_empty: ['firstName', 'lastName', 'patronymic', 'avatar'],
  order: 'random',
  introduced: 3,
}));

const correctUser = useState(`correctUser_${store.key}`, () => ({} as UserType))
getRandomAndExclude(usedUsers.value!, (item, list) => {
  correctUser.value = item;
  usedUsers.value = list;
});

const answers = ref<string[]>([]);

const partList = computed(() => parameters.value.filter((el) => !answers.value.includes(el)))

const destructUserFields = (u: UserType) => [
  u.firstName,
  u.lastName,
  u.patronymic,
];
const parameters = useState(`parameters_${store.key}`, () => shuffle([
  ...destructUserFields(correctUser.value),
  ...usedUsers.value!.reduce((acc, el) => acc.concat(destructUserFields(el)), [] as string[])
]));

const selectPart = (part: string) => {
  if (answers.value.includes(part)) answers.value = answers.value.filter((el) => el !== part);
  else answers.value = [...answers.value, part];
};

watch(answers, () => {
  if (answers.value.join(' ') === combineFullName(correctUser.value)) {
    store.state = 'success';
  } else if (answers.value.length >= 3) {
    answers.value = [];
    store.tryCount += 1;

    if (store.tryCount >= 5) {
      store.state = 'fail';
    } else {
      toast.add({severity: 'error', summary: 'Позор не знать своих коллег!', life: 3000})
    }
  }
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-center">Соберите полное имя</h2>
    <div class="mx-auto" style="max-width: 420px">
      <UserAvatar :user="correctUser" class="block mx-auto max-w-8rem mb-4" />
      <Chips :inputProps="{readonly: true}" class="w-full mb-6 block" v-model="answers" />

      <div class="flex gap-3 flex-wrap justify-content-center">
        <Button v-for="part in partList" :key="part" @click="selectPart(part)" class="p-button-rounded">
          {{ part }}
        </Button>
      </div>
    </div>
  </div>
</template>
