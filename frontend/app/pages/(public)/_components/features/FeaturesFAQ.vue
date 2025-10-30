<template>
  <section class="faq">
    <h2 class="title">Frequently asked questions</h2>
    <p class="subtitle">Everything you need to know about using Alexandrie.</p>
    <div class="faq-list">
      <app-accordion v-for="(f, i) in faqs" :key="i" :summary="f.q" :open="openIndex === i" @update:modelValue="val => (openIndex = val ? i : null)">
        <p>{{ f.a }}</p>
      </app-accordion>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null);

const faqs = [
  { q: 'Is it open-source?', a: 'Yes, Alexandrie is 100% open-source and MIT licensed.' },
  { q: 'Can I self-host?', a: 'Yes, you can run it locally or on a VPS via Docker Compose.' },
  { q: 'Will collaboration be added?', a: 'Yes, real-time collaboration is planned for future versions.' },
  { q: 'Does it work offline?', a: 'Absolutely. Alexandrie is local-first with offline persistence.' },
];
</script>

<style scoped lang="scss">
.faq {
  padding: 3rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;

  .title {
    font-size: 2rem;
    margin: 0 0 0.25rem;
    color: var(--font-color-dark, #0f172a);
  }

  .subtitle {
    color: var(--font-color-light, #64748b);
    margin: 0 0 1.25rem;
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Styles for old inline accordion removed in favor of <app-accordion> */
</style>
