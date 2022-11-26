<script lang="ts" setup>
import {ref, watch} from '#imports';
import {useSearchStore} from '~/store/search';

const store = useSearchStore();
store.search = undefined;

const timer = 0;

const focus = ref(false);
const input = ref<HTMLInputElement>();
const search = ref('');

const inputFocus = () => input.value?.focus();

watch(search, () => {
  clearTimeout(timer);
  setTimeout(() => {
    store.search = search.value.trim() || undefined;
  }, 300);
});
</script>

<template>
  <Button class="p-button-rounded p-button-lg px-3 p-button-outlined searchInput" :class="{'searchInput_active': focus || search}" @click="inputFocus">
    <i class="pi pi-search" />
    <input
      ref="input"
      @focus="focus = true"
      @blur="focus = false"
      v-model="search"
    >
  </Button>
</template>

<style lang="scss">
.searchInput {
  height: 45px;
  width: 45px;
  transition: min-width 0.3s ease;
  padding: 0.625rem 14px !important;
  display: flex;
  gap: 8px;
  cursor: text !important;
  flex: 0;
  min-width: 100%;

  input {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #8dd0ff;
    font-size: 1.25rem;
  }
}
</style>
