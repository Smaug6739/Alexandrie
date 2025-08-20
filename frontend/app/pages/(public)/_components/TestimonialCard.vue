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
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 1rem;
}
blockquote {
  font-style: italic;
  color: var(--font-color);
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
