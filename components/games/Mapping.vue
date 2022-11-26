<script lang="ts" setup>
import {combineFullName, nextTick, ref, requestUsers, useAsyncData, watch} from "#imports";
import {UserType} from "~/types/base";
import shuffle from "~/utils/shuffle";
import UserAvatar from "~/components/ui/UserAvatar.vue";
import {useGameStore} from "~/store/game";

type FieldType = {
  uuid: string;
  userId: string;
  key: number;
  value: string;
}

const store = useGameStore();

const {data: users, error} = await useAsyncData<UserType[]>('users', () => requestUsers({
  not_empty: ['firstName', 'lastName', 'patronymic', 'avatar', 'department'],
  order: 'random',
  introduced: 3,
  not_introduced: 3,
}));

const leftFields = ref<FieldType[]>(shuffle(users.value!.map((el) => ({ uuid: `left_${el.uuid}`, userId: el.uuid, key: el.department.id, value: combineFullName(el) }))));
const rightFields = ref<FieldType[]>(shuffle(users.value!.map((el) => ({ uuid: `right_${el.uuid}`, userId: el.uuid, key: el.department.id, value: el.specialization }))));

const selectedField = ref<FieldType>();
const errorFields = ref<[string, string]>();

const selectField = (value: FieldType) => {
  if (selectedField.value) {
    if (selectedField.value.key === value.key && selectedField.value?.uuid !== value.uuid) {
      selectedField.value = value;
      nextTick(() => {
        leftFields.value = leftFields.value?.filter((el) => el.userId !== value.userId) || null;
        rightFields.value = rightFields.value?.filter((el) => el.userId !== value.userId) || null;
      });
    } else {
      errorFields.value = [selectedField.value.uuid, value.uuid];
      setTimeout(() => {
        errorFields.value = undefined;
      }, 300);
    }
    selectedField.value = undefined;
  } else {
    selectedField.value = value;
  }
};

watch(leftFields, () => {
  if (!leftFields.value.length) {
    store.state = 'success';
  }
});
</script>

<template>
  <div class="p-3 md:p-6 mappingGame">
    <div class="flex gap-4 md:gap-6 mx-auto w-fit">
      <client-only>
        <div class="lightListTransition flex flex-column gap-3 md:gap-6">
          <transition-group name="light-list">
            <Card
              v-for="field in leftFields"
              :key="field.uuid"
              @click="selectField(field)"
              class="mappingGame__card hover:shadow-2 shadow-6 transition-all transition-duration-300"
              :class="{mappingGame__card_error: errorFields?.includes(field.uuid), mappingGame__card_selected: selectedField?.uuid === field.uuid}"
            >
              <template #content>
                <div class="flex gap-2 align-items-center text-sm">
                  <UserAvatar v-if="users" class="w-3rem h-3rem" :user="users.find((el) => el.uuid === field.userId)" />
                  {{ field.value }}
                </div>
              </template>
            </Card>
          </transition-group>
        </div>
        <div class="lightListTransition flex flex-column gap-3 md:gap-6">
          <transition-group name="light-list">
            <Card
              v-for="field in rightFields"
              :key="field.uuid"
              @click="selectField(field)"
              class="mappingGame__card hover:shadow-2 shadow-6 transition-all transition-duration-300"
              :class="{mappingGame__card_error: errorFields?.includes(field.uuid), mappingGame__card_selected: selectedField?.uuid === field.uuid}"
            >
              <template #content>
                <div class="h-3rem flex align-items-center px-2">{{ field.value }}</div>
              </template>
            </Card>
          </transition-group>
        </div>
      </client-only>
    </div>
  </div>
</template>

<style lang="scss">
.mappingGame {
  .p-card-body {
    padding: 0.5rem;
  }

  .p-card-content {
    padding: 0;
  }

  &__card {
    position: relative;

    &::after {
      content: '';
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &_error::after {
      opacity: 0.3;
      background-color: red;
    }

    &_selected::after {
      opacity: 0.5;
      background-color: blue;
    }
  }
}

.lightListTransition {
  position: relative;
}
.light-list-move,
.light-list-enter-active,
.light-list-leave-active {
  transition: all 3s ease;
}
.light-list-enter-from,
.light-list-leave-to {
  opacity: 0;
}
.light-list-leave-to {
  &::after {
    opacity: 0.5;
    background-color: green;
  }
}
.light-list-leave-active {
  width: 100%;
  position: absolute;
}
</style>
