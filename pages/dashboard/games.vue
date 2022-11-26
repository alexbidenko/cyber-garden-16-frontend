<script lang="ts" setup>
import FinishGame from "~/components/ui/FinishGame";
</script>

<template>
  <div class="gameRoot">
    <NuxtPage />
    <FinishGame />
  </div>
</template>

<style lang="scss">
.gameRoot {
  height: calc(100vh - var(--header-height));
  position: relative;
  overflow: auto;
}
</style>
