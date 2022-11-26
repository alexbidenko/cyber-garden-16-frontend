<script lang="ts" setup>

import {UserType} from "~/types/base";
import {combineFullName, request, useAsyncData, useRoute} from "#imports";
import UserAvatar from "~/components/ui/UserAvatar.vue";

const route = useRoute();

const {data: user} = await useAsyncData<UserType>('users', () => request.get(`user/user_profile/${route.params.id}`));
</script>

<template>
  <div class="flex justify-content-center py-8">
    <Card style="width: 25em" v-if="user">
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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
          quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
      </template>
      <template #footer>
        <Button icon="pi pi-check" label="Save" />
        <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" style="margin-left: .5em" />
      </template>
    </Card>
  </div>
</template>
