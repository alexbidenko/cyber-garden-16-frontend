<script lang="ts" setup>
import FullName from "~/components/games/FullName.vue";
import Mapping from "~/components/games/Mapping.vue";
import {useGameStore} from "~/store/game";
import {Games} from "~/types/base";
import {useRoute} from "#imports";

const store = useGameStore();

const route = useRoute();
</script>

<template>
  <div :key="store.key">
    <FullName v-if="route.params.name === Games.fullName" />
    <Mapping v-else-if="route.params.name === Games.mapping" />
  </div>
</template>
