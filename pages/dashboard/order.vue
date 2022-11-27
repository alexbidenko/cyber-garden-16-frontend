<script lang="ts" setup>
import {request, useAsyncData} from "#imports";
import {ProductType} from "~/types/base";

const {data: products} = await useAsyncData<({product: ProductType, id: number})[]>('order', () => request.get('store/trading_history/'));
console.log(products.value);
</script>

<template>
  <div v-if="products" class="orderPage flex flex-column gap-2 align-items-center p-3">
    <Card style="width: 25em;border-radius: 12px" v-for="item in products" :key="item.id" class="max-w-full mb-3">
      <template #header>
        <img :src="item.product.icons" style="height: 15rem; border-radius: 12px" class="max-w-full" />
      </template>
      <template #title>
        {{item.product.title }}
      </template>
      <template #subtitle>
        Ожидайте доставки от компании
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
.orderPage {
  .p-card-content {
    padding: 0;
  }
}
</style>
