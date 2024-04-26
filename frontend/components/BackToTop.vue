<template>
  <div class="back-to-top" @click="scrollToTop" v-if="show">
  </div>
</template>

<script setup lang="ts">
const scrollTop = ref(0);
const scroll_element = document.getElementById('app-scroll')!;
const getScrollTop = () => scroll_element.scrollTop || 0;
const scrollToTop = () => scroll_element.scrollTo({ top: 0, behavior: 'smooth' });
const show = computed(() => scrollTop.value > 300);
const onScroll = () => scrollTop.value = getScrollTop()

onMounted(() => {
  scrollTop.value = getScrollTop();
  scroll_element.addEventListener('scroll', onScroll);
});
onUnmounted(() => scroll_element.removeEventListener('scroll', onScroll));
</script>

<style scoped lang="scss">
.back-to-top {
  cursor: pointer;
  position: fixed;
  bottom: 2rem;
  right: 2.5rem;
  width: 2rem;
  height: 1.2rem;
  background-color: $primary-400;
  -webkit-mask: url('/svg/back-to-top.svg') no-repeat;
  mask: url('/svg/back-to-top.svg') no-repeat;
  z-index: 100;
}

.back-to-top:hover {
  background-color: $primary-500;
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