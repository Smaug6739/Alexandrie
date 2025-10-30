<template>
  <section class="faq">
    <h2>Frequently asked questions</h2>
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
  { q: 'Can I self-host?', a: 'Yes, you can run it locally or on a server. You can easily set it up using Docker or manually.' },
  { q: 'Does it work offline?', a: 'Absolutely. Alexandrie is local-first with offline persistence.' },
  { q: 'How is data stored?', a: 'Your data is stored in your own database when self-hosting; media files are served through the built-in CDN integration.' },
  { q: 'Can I import/export notes?', a: 'Yes. You can import Markdown and export to PDF with beautiful formatting.' },
  { q: 'Does it support math and code?', a: 'Yes. Math (LaTeX) and code blocks with syntax highlighting are supported.' },
  { q: 'What about keyboard shortcuts?', a: 'Alexandrie is keyboard-first. Most actions are available via shortcuts.' },
];
</script>

<style scoped lang="scss">
.faq {
  padding: 3rem 2rem 0 2rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;

  h2 {
    font-size: 2rem;
    border: none;
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
