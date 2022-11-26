<script setup lang="ts">
import {
  ref, request,
} from '#imports';
import ChangePassword from '~/components/dialogs/ChangePassword.vue';
import {useMainStore} from '~/store/main';
import {UserType} from "~/types/base";
import {ChangeEvent} from "rollup";

const store = useMainStore();

const dialog = ref(false);
const inputFile = ref<HTMLInputElement>();

const LEVELS = [
  {
    value: 'JUNIOR',
    label: 'Junior'
  },
  {
    value: 'MIDDLE',
    label: 'Middle'
  },
  {
    value: 'SENIOR',
    label: 'Senior'
  },
];

const saveUser = () => {
  request.put('user/update_profile/', store.user).then(() => {
    store.toast.add({
      severity: 'success', summary: "Данные успешно обновлены", life: 3000,
    });
  }).catch(() => {
    store.toast.add({
      severity: 'error', summary: "Во время обновления данных произошла ошибка", life: 3000,
    });
  });
};

const onBlur = (e: InputEvent, key: keyof Pick<UserType, 'firstName' | 'lastName' | 'patronymic' | 'email' | 'specialization'>) => {
  const newValue = (e.target as HTMLInputElement).value;
  if (newValue && newValue !== store.user[key]) {
    store.user[key] = newValue as any;
    saveUser();
  }
};

const onSelectGrade = (e: {value: any}) => {
  store.user.grade = e.value;
  saveUser();
};

const selectAvatar = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const fd = new FormData();
    fd.set('avatar', file);
    request.put<UserType>('user/update_profile/', fd).then((data) => {
      store.user.avatar = data.avatar;
      store.toast.add({
        severity: 'success', summary: "Данные успешно обновлены", life: 3000,
      });
    }).catch(() => {
      store.toast.add({
        severity: 'error', summary: "Во время обновления данных произошла ошибка", life: 3000,
      });
    });
  }
};
</script>

<template>
  <div class="profilePage">
    <Head>
      <Title>Профиль пользователя</Title>
    </Head>

    <div class="flex align-items-center relative profilePage__content py-8 p-2 md:px-3">
      <div class="grid mx-auto z-3 relative w-full" style="max-width: 1000px">
        <div class="col-12 md:col-6 p-2 md:px-3">
          <Card class="w-full h-full">
            <template #content>
              <div class="flex flex-column gap-2">
                <h2 class="text-800 text-xl mt-0 mb-3">
                  Редактирование профиля
                </h2>
                <div class="flex flex-column gap-3 mb-4">
                  <img :src="store.user.avatar" class="h-8rem w-8rem block mx-auto profilePage__avatar" />
                  <Button class="justify-content-center" @click="inputFile?.click()">Изменить</Button>
                  <input type="file" class="none" ref="inputFile" @change="selectAvatar" accept="image/*" />
                </div>
                <label class="block w-full">
                  Имя
                  <Input
                    @blur="onBlur($event, 'firstName')"
                    :value="store.user.firstName"
                    class="w-full p-inputtext-lg my-2"
                    placeholder="Введите имя"
                    autocomplete="off"
                  />
                </label>
                <label class="block w-full">
                  Фамилия
                  <Input
                    @blur="onBlur($event, 'lastName')"
                    :value="store.user.lastName"
                    class="w-full p-inputtext-lg my-2"
                    placeholder="Введите фамилию"
                    autocomplete="off"
                  />
                </label>
                <label class="block w-full">
                  Отчество
                  <Input
                    @blur="onBlur($event, 'patronymic')"
                    :value="store.user.patronymic"
                    class="w-full p-inputtext-lg my-2"
                    placeholder="Введите отчество"
                    autocomplete="off"
                  />
                </label>
                <label class="block w-full">
                  Email
                  <Input
                    @blur="onBlur($event, 'email')"
                    placeholder="Введите Email"
                    class="w-full p-inputtext-lg my-2"
                    name="email"
                    autocomplete="off"
                    :value="store.user.email"
                  />
                </label>
                <label class="block w-full">
                  Должность
                  <Input
                    @blur="onBlur($event, 'specialization')"
                    placeholder="Введите должность"
                    class="w-full p-inputtext-lg my-2"
                    name="specialization"
                    autocomplete="off"
                    :value="store.user.specialization"
                  />
                </label>
                <label class="block w-full">
                  Грейд
                  <Dropdown
                    @change="onSelectGrade($event)"
                    placeholder="Выберите грейд"
                    class="w-full p-inputtext-lg my-2"
                    :options="LEVELS"
                    :modelValue="store.user.grade"
                    option-label="label"
                    option-value="value"
                  />
                </label>

                <Divider />

                <Button
                  class="p-button-outlined justify-content-center"
                  @click="dialog = true"
                >
                  Изменить пароль
                </Button>
              </div>
            </template>
          </Card>
        </div>
        <div class="col-12 md:col-6 p-2 md:px-3">
          <Card class="w-full h-full">
            <template #content>
              <div class="flex flex-column gap-2 h-full">
                <h3 class="text-800 text-xl mt-0 mb-3">
                  Настройки
                </h3>

                <Divider />

                <Button
                  class="p-button-danger p-button-outlined justify-content-center w-full mt-auto"
                  @click="() => store.logout()"
                >
                  Выйти
                </Button>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <ConfirmDialog />

    <ChangePassword v-model:visible="dialog" />
  </div>
</template>

<style lang="scss">
.profilePage {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__avatar {
    object-fit: cover;
  }

  &__content {
    min-height: 80vh;
    flex: 1;
  }

  &__pro {
    background-color: gold;
  }

  & .p-card {
    border-radius: 16px !important;

    & .p-card-body {
      height: 100%;
    }

    & .p-card-content {
      height: 100%;
      padding: 0;
    }
  }

  .p-buttonset > * {
    width: 50%;
    justify-content: center;
  }

  &__alert {
    .p-message-icon {
      display: none;
    }

    .p-message-text {
      flex: 1;
    }
  }
}
</style>
