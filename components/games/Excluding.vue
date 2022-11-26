<script lang="ts" setup>
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {combineFullName, computed, ref, requestUsers, useAsyncData} from "#imports";
import {UserType} from "~/types/base";
import {useGameStore} from "~/store/game";

const store = useGameStore();

const {data: users} = await useAsyncData<UserType[]>('users', () => requestUsers({
  order: 'random',
  not_empty: ['firstName', 'lastName', 'patronymic', 'avatar'],
  introduced: 4,
  not_introduced: 1,
}));

const correctUser = computed(() => users.value![Math.floor(Math.random() * users.value!.length)]);
const selectedUser = ref<UserType>();
console.log(correctUser.value);

const changeSelected = (user: UserType) => {
  if (correctUser.value.uuid === user.uuid) {
    store.state = 'success';
  } else {
    store.tryCount++;
    if (store.tryCount >= 3) {
      store.state = 'fail';
    }
    selectedUser.value = user;
    setTimeout(() => {
      selectedUser.value = undefined;
    }, 300);
  }
};
</script>

<template>
  <div v-if="users" class="excludingGame p-6 md:p-8 flex flex-column gap-3">
    <Card v-for="user in users" class="excludingGame__card cursor-pointer hover:shadow-2 shadow-6 transition-all transition-duration-300" :class="{excludingGame__card_error: selectedUser?.uuid === user.uuid}" @click="changeSelected(user)">
      <template #content>
        <div class="flex gap-2 align-items-center">
          <UserAvatar class="w-4rem h-4rem" :user="user" />
          {{ combineFullName(user) }}
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
.excludingGame {
  &__card {
    position: relative;
    border-radius: 12px;

    .p-card-content {
      padding: 0;
    }

    &::after {
      content: '';
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &_error::after {
      opacity: 0.3;
      background-color: red;
    }
  }
}
</style>
