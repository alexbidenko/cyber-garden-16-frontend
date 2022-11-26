<script lang="ts" setup>
import {request, useAsyncData} from "#imports";
import {ProductType} from "~/types/base";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {useGameStore} from "~/store/game";

const confirm = useConfirm();
const toast = useToast();
const store = useGameStore();

const {data: products} = await useAsyncData<ProductType[]>('products', () => request.get('store/get_products_list/'))

const select = (value: ProductType) => {
  confirm.require({
    message: 'Вы уверены, что хотите приобрести товар?',
    header: value.title,
    icon: 'pi pi-shopping-cart',
    acceptLabel: 'Да',
    rejectLabel: 'Нет',
    accept: () => {
      store.balance -= value.price;
      request.post('store/buy/', {id: value.id}).then(() => {
        toast.add({severity: 'success', summary: 'Поздравляем с покупкой!', detail: 'Найти товар можно в заказах'})
      });
    },
  });
};
</script>

<template>
  <div>
    <NuxtLink to="/dashboard/order">
      <Button class="p-button-lg w-full my-3 justify-content-center">Заказы</Button>
    </NuxtLink>
    <DataView :value="products" layout="list">
      <template #list="slotProps">
        <div class="col-12">
          <div class="product-list-item">
            <img :src="slotProps.data.icons" :alt="slotProps.data.name" style="width: 60%" />
            <div class="product-list-detail">
              <div class="product-name">{{slotProps.data.title}}</div>
            </div>
            <div class="product-list-action">
            <span class="product-price flex gap-2 align-items-center">
              <img src="/icons/coin.svg" style="border-radius: 50%" class="w-2rem" />
              {{slotProps.data.price}}
            </span>
              <Button icon="pi pi-shopping-cart" label="Купить"
                      :disabled="!slotProps.data.inStock || slotProps.data.price > store.balance" @click="select(slotProps.data)"></Button>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style lang="scss" scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  border-radius: 4px;
  margin-bottom: 2rem;
}
.p-dropdown {
  width: 14rem;
  font-weight: normal;
}

.product-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.product-description {
  margin: 0 0 1rem 0;
}

.product-category-icon {
  vertical-align: middle;
  margin-right: .5rem;
}

.product-category {
  font-weight: 600;
  vertical-align: middle;
}

::v-deep(.product-list-item) {
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;

  img {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin-right: 2rem;
  }

  .product-list-detail {
    flex: 1 1 0;
  }

  .p-rating {
    margin: 0 0 .5rem 0;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: .5rem;
    align-self: flex-end;
  }

  .product-list-action {
    display: flex;
    flex-direction: column;
  }

  .p-button {
    margin-bottom: .5rem;
  }
}

::v-deep(.product-grid-item) {
  margin: .5rem;
  border: 1px solid var(--surface-border);

  .product-grid-item-top,
  .product-grid-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  img {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    margin: 2rem 0;
  }

  .product-grid-item-content {
    text-align: center;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

@media screen and (max-width: 900px) {
  .product-list-item {
    flex-direction: column;
    align-items: center;

    img {
      margin: 2rem 0;
    }

    .product-list-detail {
      text-align: center;
    }

    .product-price {
      align-self: center;
    }

    .product-list-action {
      display: flex;
      flex-direction: column;
    }

    .product-list-action {
      margin-top: 2rem;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
