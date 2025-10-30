<template>
  <section class="faq">
    <h2>FAQ</h2>
    <div class="faq-list">
      <div v-for="(f, i) in faqs" :key="i" class="faq-item" :class="{ open: openIndex === i }" @click="toggle(i)">
        <div class="faq-question">
          <h3>{{ f.q }}</h3>
          <svg class="arrow" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
        <transition name="expand">
          <div v-if="openIndex === i" class="faq-answer">
            <p>{{ f.a }}</p>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null);
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i;
}

const faqs = [
  { q: 'Is it open-source?', a: 'Yes, Alexandrie is 100% open-source and MIT licensed.' },
  { q: 'Can I self-host?', a: 'Yes, you can run it locally or on a VPS via Docker Compose.' },
  { q: 'Will collaboration be added?', a: 'Yes, real-time collaboration is planned for future versions.' },
  { q: 'Does it work offline?', a: 'Absolutely. Alexandrie is local-first with offline persistence.' },
];
</script>

<style scoped lang="scss">
.faq {
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #222;
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: pointer;

  &:hover {
    border-color: #d0d6f9;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  }

  &.open {
    border-color: var(--primary);
  }
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem 1.6rem;
  transition: background 0.3s ease;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #111;
  }

  .arrow {
    width: 20px;
    height: 20px;
    stroke: #444;
    stroke-width: 2;
    fill: none;
    transition: transform 0.3s ease;
  }

  .faq-item.open & .arrow {
    transform: rotate(180deg);
    stroke: var(--primary);
  }
}

.faq-answer {
  padding: 0 1.6rem 1.2rem 1.6rem;
  color: #555;
  line-height: 1.6;
  background: #fafafa;
  border-top: 1px solid #eee;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
</style>
