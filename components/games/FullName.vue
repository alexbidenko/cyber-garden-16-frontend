<script lang="ts" setup>
import {combineFullName, ref, request, shuffle, useAsyncData, useState, watch} from "#imports";
import {UserType} from "~/types/base";
import getRandomAndExclude from "~/utils/getRandomAndExclude";
import getRandomList from "~/utils/getRandomList";
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {useGameStore} from "~/store/game";

const store = useGameStore();

const {data: users} = await useAsyncData<UserType[]>('users', () => request.get('user/list_of_users/'));

const correctUser = useState('correctUser', () => ({} as UserType))
getRandomAndExclude(users.value!, (item, list) => {
  correctUser.value = item;
  users.value = list;
});

const usedUsers = useState<UserType[]>('usedUsers', () => getRandomList(users.value!, 3));

const answers = useState<string[]>('answers', () => []);
const failCount = ref(0);

const destructUserFields = (u: UserType) => [
  u.firstName,
  u.lastName,
  u.patronymic,
];
const parameters = useState('parameters', () => shuffle([
  ...destructUserFields(correctUser.value),
  ...usedUsers.value.reduce((acc, el) => acc.concat(destructUserFields(el)), [] as string[])
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
    failCount.value += 1;

    if (failCount.value >= 5) {
      store.state = 'fail';
    }
  }
});
</script>

<template>
  <div class="p-8">
    <div class="mx-auto" style="max-width: 420px">
      <h1>Соберите ФИО по фото</h1>
      <UserAvatar :user="correctUser" class="block mx-auto max-w-8rem mb-4" />
      <Chips :inputProps="{readonly: true}" class="w-full mb-6 block" v-model="answers" />

      <div class="flex gap-3 flex-wrap">
        <Button v-for="part in parameters" :key="part" @click="selectPart(part)">
          {{ part }}
        </Button>
      </div>
    </div>
  </div>
</template>
