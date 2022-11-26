<script lang="ts" setup>
import {UserType} from "~/types/base";

const {user} = defineProps<{
  user: UserType,
}>();
</script>

<template>
  <img :src="user.avatar || '/icons/default-avatar.svg'" class="userAvatar" />
</template>

<style lang="scss">
.userAvatar {
  object-fit: cover;
}
</style>
