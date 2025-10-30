<template>
  <div v-if="show" class="back-to-top" @click="scrollToTop" />
</template>

<script setup lang="ts">
const scrollTop = ref(0);
const getScrollTop = () => window.scrollY || 0;
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const show = computed(() => scrollTop.value > 300);
const onScroll = () => (scrollTop.value = getScrollTop());

onMounted(() => {
  scrollTop.value = getScrollTop();
  document.addEventListener('scroll', onScroll);
});
onUnmounted(() => document.removeEventListener('scroll', onScroll));
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: 2.5rem;
  bottom: 2rem;
  z-index: 100;
  width: 2rem;
  height: 1.2rem;
  background-color: var(--primary);
  cursor: pointer;
  mask: url('/svg/back-to-top.svg') no-repeat;
}

.back-to-top:hover {
  background-color: var(--primary-dark);
}

@media (width <= 959px) {
  .back-to-top {
    display: none;
  }
}

@media print {
  .back-to-top {
    display: none;
  }
}
</style>
