<script lang="ts" setup>
import {ref, request} from '#imports';
import {ResponseErrorType} from "~/utils/request";
import {useToast} from "primevue/usetoast";

const {visible} = defineProps<{visible: boolean}>();

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const toast = useToast();

const isRequest = ref(false);
const password = ref('');
const newPassword = ref('');

const resetDialog = () => {
  password.value = '';
  newPassword.value = '';
  emit('update:visible', false);
};

const saveNewPassword = () => {
  isRequest.value = true;
  request.put('user/change_password/', {oldPassword: password.value, newPassword: newPassword.value}).then(() => {
    resetDialog();
    toast.add({
      severity: 'success', summary: 'Пароль успешно обновлен', life: 3000,
    });
  }).catch((e: ResponseErrorType) => {
    if (e.response?.status === 403) {
      toast.add({
        severity: 'error', summary: "Неверный старый пароль", life: 3000,
      });
    } else {
      toast.add({
        severity: 'error', summary: "Ошибка смены пароля", life: 3000,
      });
    }
  }).finally(() => {
    isRequest.value = false;
  });
};
</script>

<template>
  <Dialog
    header="Изменение пароля"
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    style="width: 360px"
    dismissable-mask
    :base-z-index="5"
    modal
    @hide="resetDialog"
  >
    <div class="flex flex-column gap-2">
      <label class="block w-full">
        Старый пароль
        <Password
          class="p-inputtext-lg changePassword__input my-2 w-full"
          placeholder="Введите пароль"
          name="password"
          v-model="password"
          autocomplete="current-password"
          toggle-mask
          :feedback="false"
        />
      </label>
      <label class="block w-full">
        Новый пароль
        <Password
          class="p-inputtext-lg my-2 w-full changePassword__input"
          placeholder="Введите пароль"
          name="password"
          v-model="newPassword"
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
    </div>

    <template #footer>
      <Button
        label="Отменить"
        icon="pi pi-times"
        class="p-button-text"
        @click="resetDialog"
      />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        autofocus
        :loading="isRequest"
        :disabled="newPassword.length < 8"
        @click="saveNewPassword"
      />
    </template>
  </Dialog>
</template>

<style lang="scss">
.changePassword {
  &__input input {
    width: 100%;
  }
}
</style>
