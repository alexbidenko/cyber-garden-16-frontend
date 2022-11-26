<script setup lang="ts">
import {
  computed, navigateTo, request, useCookie,
  useRoute, useRouter, useState,
} from '#imports';
import {useMainStore} from '~/store/main';
import {ResponseErrorType} from "~/utils/request";
import {UserType} from "~/types/base";

const route = useRoute();
const store = useMainStore();
const router = useRouter();

const authorized = useCookie('authorized');

if (authorized.value) await navigateTo('/', {redirectCode: 302});

const name = useState('name', () => '');
const email = useState('email', () => '');
const password = useState('password', () => '');
const isRequest = useState('isRequest', () => false);

const authPath = computed(() => ({
  path: '/auth',
  query: {
    invite: route.query.invite,
    paymentRedirect: route.query.paymentRedirect,
    paymentPlan: route.query.paymentPlan,
    authRedirect: route.query.authRedirect,
    verifyEmail: route.query.verifyEmail,
  },
}));
const isValidName = computed(() => !!name.value);
const isValidEmail = computed(() => /^(.+)@(.+)$/.test(email.value));
const isValidPassword = computed(() => password.value.length >= 8);

const submit = () => {
  isRequest.value = true;
  request.post<UserType & { token: string }>('user/create_user/', {
    name: name.value, email: email.value, password: password.value,
  })
    .then(({ token, ...user }) => {
      authorized.value = token;
      store.setUser(user);
      router.push('/dashboard');
    }).catch((e: ResponseErrorType) => {
      if (e.response?.status === 403) {
        store.toast.add({
          severity: 'error', summary: "Выбранный Email уже используется", life: 3000,
        });
      } else {
        store.toast.add({
          severity: 'error', summary: "Ошибка регистрации", life: 3000,
        });
      }
    }).finally(() => {
      isRequest.value = false;
    });
};
</script>

<template>
  <div class="signUpPage">
    <Head>
      <Title>Войти в аккаунт</Title>
    </Head>

    <Card class="w-full signUpPage__card">
      <template #title>
        <h1 class="text-2xl">
          Войти в аккаунт
        </h1>
      </template>
      <template #content>
        <form @submit.prevent="submit">
          <div class="flex flex-column gap-2">
            <label class="block w-full">
              Имя
              <Input
                class="p-inputtext-lg my-2 w-full"
                :class="{'p-invalid': !isValidName}"
                placeholder="Введите ваше имя"
                name="name"
                v-model="name"
                autocomplete="given-name"
              />
            </label>
            <label class="block w-full">
              Email
              <Input
                class="p-inputtext-lg my-2 w-full"
                :class="{'p-invalid': !isValidEmail}"
                placeholder="Введите email"
                name="email"
                v-model="email"
                autocomplete="email"
              />
            </label>
            <label class="block w-full">
              Пароль
              <Password
                class="p-inputtext-lg w-full signUpPage__password my-2"
                :class="{'p-invalid': !isValidPassword}"
                placeholder="Введите пароль"
                name="password"
                v-model="password"
                toggle-mask
                weak-label="Слабый пароль"
                medium-label="Средний пароль"
                strong-label="Сильный пароль"
                autocomplete="new-password"
              >
                <template #footer>
                  <ul class="pl-2 ml-2 mt-3 mb-0" style="line-height: 1.5">
                    <li>Минимум 8 символов</li>
                  </ul>
                </template>
              </Password>
            </label>
            <Button
              type="submit"
              class="signUpPage__button p-button-lg block w-full flex-1"
              :loading="isRequest"
              :disabled="!(isValidName && isValidEmail && isValidPassword)"
            >
              Зарегистрироваться
            </Button>
            <NuxtLink :to="authPath">
              <Button type="button" class="signUpPage__button p-button-lg p-button-outlined p-button-help block w-full flex-1 mt-2">
                Войти
              </Button>
            </NuxtLink>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
.signUpPage {
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
    width: 100%;
    margin-top: 16px;
  }

  .p-buttonset > * {
    width: 50%;
    justify-content: center;
  }
}
</style>
