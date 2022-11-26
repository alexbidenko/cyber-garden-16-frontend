<script lang="ts" setup>
import {navigateTo, onMounted, request, useAsyncData, useCookie} from "#imports";
import {useGameStore} from "~/store/game";

const store = useGameStore();

const authorized = useCookie('authorized', {expires: new Date(2100, 1)});

if (!authorized.value) {
  await navigateTo('/auth', {redirectCode: 302});
}

onMounted(() => {
  store.loadBalance();
});
</script>

<template>
  <NuxtPage />
</template>
