<template>
  <div class="feature-card" data-aos="fade-up">
    <div class="icon-wrapper">
      <Icon :class="`icon-${icon}`" class="icon" :name="icon" fill="white" :big="true" />
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="description">{{ text }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string; text: string }>();
</script>

<style scoped lang="scss">
.feature-card {
  background: var(--bg-color);
  padding: 2rem 1.8rem;
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);

    .icon-wrapper {
      transform: scale(1.05) rotate(3deg);
    }
  }
}

.icon-wrapper {
  background: linear-gradient(135deg, var(--primary), #6c63ff);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 20px rgba(108, 99, 255, 0.3);
}

.icon {
  font-size: 1.8rem;
  color: white;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  background: linear-gradient(90deg, var(--primary), #6c63ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 0.96rem;
  color: var(--font-color-light);
  line-height: 1.5;
}
</style>
