<script lang="ts" setup>
import {navigateTo, useCookie} from "#imports";

const authorized = useCookie('authorized');

if (!authorized.value) {
  await navigateTo('/auth', {redirectCode: 302});
}
</script>

<template>
  <div class="dashboardPage py-4 px-3 md:p-6 flex flex-column gap-3">
    <NuxtLink to="/dashboard/relationship" class="flex-1">
      <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Отметить знакомых
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/games">
      <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Игры на знакомства
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/admin">
      <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Администрирование
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/company">
      <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Древо сотрудников
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/dashboard/users">
      <Card class="hover:shadow-2 shadow-6 transition-all transition-duration-300">
        <template #content>
          Поиск сотрудников
        </template>
      </Card>
    </NuxtLink>
  </div>
</template>

<style lang="scss">
.dashboardPage {
  .p-card {
    border-radius: 12px;
  }

  .p-card-content {
    padding: 0 !important;
  }
}
</style>
