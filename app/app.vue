<template>
  <NuxtLayout>
    <AppHeader />
    <Transition name="fade" mode="out-in">
      <NuxtPage />
    </Transition>
    <AppFooter />
  </NuxtLayout>
</template>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
