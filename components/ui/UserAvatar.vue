<script lang="ts" setup>
import {UserType} from "~/types/base";
import md5 from "md5";
import {onMounted, ref} from "#imports";

const {user} = defineProps<{
  user: UserType,
}>();

const avatar = ref('');

onMounted(() => {
  avatar.value = `https://www.gravatar.com/avatar/${md5(user.email)}?d=monsterid`;
});
</script>

<template>
  <img :src="avatar" />
</template>
