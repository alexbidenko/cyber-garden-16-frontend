<script setup lang="ts">
import {
  computed, navigateTo, request, useCookie,
  useRoute, useRouter, useState,
} from '#imports';
import {useMainStore} from '~/store/main';
import {UserType} from "~/types/base";
import {requestConfig} from "~/utils/request";

const route = useRoute();
const store = useMainStore();
const router = useRouter();

const authorized = useCookie('authorized', {expires: new Date(2100, 1)});

if (authorized.value) await navigateTo('/dashboard', {redirectCode: 302});

const email = useState('email', () => '');
const password = useState('password', () => '');
const isRequest = useState('isRequest', () => false);

const signUpPath = computed(() => ({
  path: '/sign-up',
  query: {
    invite: route.query.invite,
    paymentRedirect: route.query.paymentRedirect,
    paymentPlan: route.query.paymentPlan,
    authRedirect: route.query.authRedirect,
    verifyEmail: route.query.verifyEmail,
  },
}));

const submit = () => {
  isRequest.value = true;
  request.post<UserType & {token: string}>('user/obtain_token/', {login: email.value, password: password.value}).then(({token, ...user}) => {
    authorized.value = token;
    requestConfig.authorized.value = token;
    store.setUser(user);
    router.push('/dashboard');
  }).catch(() => {
    store.toast.add({
      severity: 'error', summary: "Неверный логин или пароль", life: 3000,
    });
  }).finally(() => {
    isRequest.value = false;
  });
};
</script>

<template>
  <div class="authPage">
    <Head>
      <Title>Войти в аккаунт</Title>
    </Head>

    <Card class="w-full authPage__card">
      <template #title>
        <h1 class="text-2xl">
          Войти в аккаунт
        </h1>
      </template>
      <template #content>
        <form @submit.prevent="submit">
          <div class="flex flex-column gap-2">
            <label class="block w-full">
              Email
              <Input
                placeholder="Введите email"
                class="p-inputtext-lg my-2 w-full"
                name="email"
                v-model="email"
                autocomplete="email"
              />
            </label>
            <label class="block w-full">
              Пароль
              <Password
                class="p-inputtext-lg authPage__password my-2 w-full"
                placeholder="Введите пароль"
                name="password"
                v-model="password"
                autocomplete="current-password"
                toggle-mask
                :feedback="false"
              />
            </label>
            <Button
              :disabled="!email || !password"
              type="submit"
              class="authPage__button p-button-lg block w-full flex-1"
              :loading="isRequest"
            >
              Войти
            </Button>
            <NuxtLink :to="signUpPath">
              <Button type="button" class="authPage__button p-button-outlined p-button-help p-button-lg block w-full flex-1 mt-2">
                Зарегистрироваться
              </Button>
            </NuxtLink>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
.authPage {
  padding: calc(16px + var(--header-height)) 16px 16px;
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;

  &__card {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    z-index: 1;
    background-color: #2a323dbb !important;
    border-radius: 16px !important;
  }

  & &__password input {
    width: 100%;
  }

  &__button {
    justify-content: center;
  }
}
</style>
