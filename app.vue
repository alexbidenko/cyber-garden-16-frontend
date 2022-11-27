<script lang="ts" setup>
import {onMounted, useCookie, useNuxtApp, usePinia} from "#imports";
import TopMenu from "~/components/layout/TopMenu.vue";
import {useMainStore} from "~/store/main";

const {vueApp} = useNuxtApp();

const pinia = usePinia();

pinia.use(() => ({
  toast: vueApp.config.globalProperties.$toast,
  confirm: vueApp.config.globalProperties.$confirm,
}));

const authorized = useCookie('authorized', {expires: new Date(2100, 1)});
const store = useMainStore();

onMounted(() => {
  if (authorized.value) store.loadUser();
});
</script>

<template>
  <div>
    <Html lang="ru" />
    <Head>
      <Title>Admire Simpler</Title>
      <Link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <Link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <Link rel="manifest" href="/site.webmanifest" />
      <Meta name="msapplication-TileColor" content="#da532c" />
      <Meta name="theme-color" content="#ffffff" />
      <Meta property="og:site_name" content="Admire Simpler" />
      <Meta property="og:title" content="Admire Simpler" />
      <Meta property="og:image" content="https://simpler.admire.social/og.png" />
      <Meta property="og:image:width" content="1200" />
      <Meta property="og:image:height" content="630" />
      <Meta property="og:type" content="website" />
    </Head>

    <TopMenu />

    <main>
      <NuxtPage />
    </main>

    <client-only>
      <Toast position="bottom-center" />
      <ConfirmDialog />
    </client-only>
  </div>
</template>

<style lang="scss">
:root {
  --default-fonts: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol;
  --header-height: 64px;
}

body {
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  background: #6E88E5;
  font-family: var(--default-fonts);
}

main {
  padding-top: var(--header-height);
}

a {
  text-decoration: none;
}

.none {
  display: none;
}

@media screen and (min-width: 992px) {
  .lg\:none {
    display: none !important;
  }
}

@media screen and (min-width: 768px) {
  .md\:none {
    display: none !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fire-animation {
  0% {
    animation-timing-function: cubic-bezier(0.9647,0.2413,-0.0705,0.7911);
    transform: scale(0.9099999999999999);
  }
  51% {
    animation-timing-function: cubic-bezier(0.9226,0.2631,-0.0308,0.7628);
    transform: scale(1.02994);
  }
  100% {
    transform: scale(0.9099999999999999);
  }
}

.list-move,
.list-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
  transition: opacity 0.4s ease, transform 100s ease;
}

.fast-fade-enter-active,
.fast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.fast-fade-enter-from,
.fast-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-enter-active {
  transform: translateX(0);
  transition: transform 0.5s ease;
}
.sidebar-leave-active {
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.sidebar-enter-from {
  transform: translateX(-100%);
}
.sidebar-leave-to {
  transform: translateX(-100%);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

</style>
