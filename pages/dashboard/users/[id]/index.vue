<script lang="ts" setup>

import {UserType} from "~/types/base";
import {combineFullName, computed, request, useAsyncData, useRoute} from "#imports";
import UserAvatar from "~/components/ui/UserAvatar.vue";

const route = useRoute();

const {data: user} = await useAsyncData<UserType>('users', () => request.get(`user/user_profile/${route.params.id}`));

const grade = computed(() => ({
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
}[user.value!.grade]))
</script>

<template>
  <div class="flex justify-content-center py-8">
    <Card style="width: 32em" v-if="user">
      <template #header>
        <UserAvatar :user="user" style="height: 15rem" />
      </template>
      <template #title>
        {{ combineFullName(user) }}
      </template>
      <template #subtitle>
        {{ user.specialization }}
      </template>
      <template #content>
        <div class="flex justify-content-between text-lg">
          <span>Фамилия</span>
          <span>{{user.lastName}}</span>
        </div>
        <Divider />
        <div class="flex justify-content-between">
          <span>Имя</span>
          <span>{{user.firstName}}</span>
        </div>
        <Divider />
        <div class="flex justify-content-between">
          <span>Отчество</span>
          <span>{{user.patronymic}}</span>
        </div>
        <Divider />
        <div class="flex justify-content-between">
          <span>Отдел</span>
          <span>{{user.department.title}}</span>
        </div>
        <Divider />
        <div class="flex justify-content-between">
          <span>Грейд</span>
          <span>{{grade}}</span>
        </div>
        <Divider />
        <div class="flex justify-content-between">
          <span>Email</span>
          <span>{{user.email}}</span>
        </div>
      </template>
      <template #footer>
        <NuxtLink :to="`/dashboard/users/${user.uuid}/cards`">
          <Button class="w-full p-button-lg justify-content-center">Карточки</Button>
        </NuxtLink>
      </template>
    </Card>
  </div>
</template>
