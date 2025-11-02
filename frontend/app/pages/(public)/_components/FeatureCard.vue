<template>
  <div class="feature-card" data-aos="fade-up">
    <div class="icon-wrapper">
      <Icon :class="`icon-${icon}`" class="icon" :name="icon" fill="white" display="lg" />
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string; text: string }>();
</script>

<style scoped lang="scss">
.icon-wrapper {
  display: flex;
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #6c63ff);
  box-shadow: 0 6px 20px rgb(108 99 255 / 30%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  align-items: center;
  justify-content: center;
}

.feature-card {
  position: relative;
  padding: 2rem 1.8rem;
  border-radius: 1.2rem;
  text-align: center;
  background: var(--bg-color);
  box-shadow: 0 10px 30px rgb(0 0 0 / 6%);
  overflow: hidden;

  &:hover {
    box-shadow: 0 14px 40px rgb(0 0 0 / 12%);
    transform: translateY(-8px);

    .icon-wrapper {
      transform: scale(1.05) rotate(3deg);
    }
  }
}

.icon {
  font-size: 1.8rem;
  color: white;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--primary), #6c63ff);
  background-clip: text;
  margin-bottom: 0.6rem;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 0.96rem;
  line-height: 1.5;
  color: var(--font-color-light);
}
</style>
