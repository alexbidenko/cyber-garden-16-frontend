<script lang="ts" setup>
import SearchInput from '~/components/ui/SearchInput.vue';
import {combineFullName, ref, request, useAsyncData, watch} from "#imports";
import {UserType} from "~/types/base";
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {useSearchStore} from "~/store/search";

const {data: users} = await useAsyncData<UserType[]>('users', () => request.get('user/list_of_users/'));

const store = useSearchStore();

const timer = ref<NodeJS.Timer>()

watch(() => store.search, () => {
  clearTimeout(timer.value);
  setTimeout(() => {
    request.get<UserType[]>('user/text_search/', {
      params: {
        search_text: store.search,
        page: 0,
        limit_of_set: 1000,
      },
    }).then((data) => {
      users.value = data;
    })
  }, 500);
});
</script>

<template>
  <div class="usersPage p-3 max-w-30rem mx-auto">
    <Card class="mb-4">
      <template #content>
        <SearchInput />
      </template>
    </Card>

    <div v-if="users" class="flex flex-column gap-3">
      <NuxtLink v-for="user in users" :to="`/dashboard/users/${user.uuid}`" :key="user.uuid">
        <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
          <template #content>
            <div class="flex gap-2 align-items-center">
              <UserAvatar class="w-3rem h-3rem" :user="user" />
              <div>
                {{ combineFullName(user) }}
                <span class="text-sm text-500 block mt-1">{{user.specialization}}</span>
              </div>
            </div>
          </template>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.usersPage {
  .p-card-body {
    padding: 1rem;
  }

  .p-card-content {
    padding: 0;
  }
}
</style>
