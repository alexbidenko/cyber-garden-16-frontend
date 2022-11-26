<script lang="ts" setup>
import SearchInput from '~/components/ui/SearchInput.vue';
import {combineFullName, request, useAsyncData} from "#imports";
import {UserType} from "~/types/base";
import UserAvatar from "~/components/ui/UserAvatar.vue";

const {data: users} = await useAsyncData<UserType[]>('users', () => request.get('user/list_of_users/'));
</script>

<template>
  <div class="usersPage p-6">
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
              {{ combineFullName(user) }}
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
