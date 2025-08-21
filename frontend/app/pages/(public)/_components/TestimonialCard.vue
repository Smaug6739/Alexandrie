<template>
  <div class="testimonial-card">
    <img :src="avatar" :alt="name" class="avatar" >
    <blockquote>{{ text }}</blockquote>
    <p class="author">
      {{ name }} <span>- {{ role }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  role: string;
  text: string;
  avatar: string;
}>();
</script>

<style scoped lang="scss">
.testimonial-card {
  max-width: 300px;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  background: var(--bg-color);
  box-shadow: 0 5px 20px rgb(0 0 0 / 5%);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

blockquote {
  color: var(--font-color);
  font-style: italic;
  margin-bottom: 1rem;
}

.author {
  font-weight: bold;
  color: var(--font-color);
}

.author span {
  font-weight: normal;
  color: var(--font-color-light);
}
</style>
