<template>
  <div v-if="show" class="back-to-top" @click="scrollToTop"/>
</template>

<script setup lang="ts">
const scrollTop = ref(0);
const getScrollTop = () => window.scrollY || 0;
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const show = computed(() => scrollTop.value > 300);
const onScroll = () => (scrollTop.value = getScrollTop());

onMounted(() => {
  scrollTop.value = getScrollTop();
  window.addEventListener('scroll', onScroll);
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped lang="scss">
.back-to-top {
  cursor: pointer;
  position: fixed;
  bottom: 2rem;
  right: 2.5rem;
  width: 2rem;
  height: 1.2rem;
  background-color: var(--primary);
  -webkit-mask: url('/svg/back-to-top.svg') no-repeat;
  mask: url('/svg/back-to-top.svg') no-repeat;
  z-index: 100;
}

.back-to-top:hover {
  background-color: $primary-dark;
}

@media (max-width: 959px) {
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
