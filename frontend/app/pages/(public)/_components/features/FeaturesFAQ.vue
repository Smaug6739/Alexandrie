<template>
  <section class="faq">
    <div class="section-header">
      <h2>Frequently asked questions</h2>
      <p class="subtitle">Everything you need to know about Alexandrie</p>
    </div>

    <div class="faq-container">
      <div class="faq-list">
        <div v-for="(f, i) in faqs" :key="i" class="faq-item" :class="{ open: openIndex === i }">
          <button class="faq-question" @click="toggleFaq(i)">
            <span class="question-text">{{ f.q }}</span>
            <span class="question-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="openIndex !== i" d="M12 5v14M5 12h14" />
                <path v-else d="M5 12h14" />
              </svg>
            </span>
          </button>
          <div class="faq-answer" :style="{ maxHeight: openIndex === i ? '200px' : '0' }">
            <p>{{ f.a }}</p>
          </div>
        </div>
      </div>

      <div class="faq-cta">
        <div class="cta-content">
          <div class="cta-icon"><Icon name="help" display="xxl" /></div>
          <h3>Still have questions?</h3>
          <p>Can't find what you're looking for? Join our community!</p>
          <a href="https://discord.gg/UPsEg6egPj" target="_blank" class="cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
              />
            </svg>
            Join Discord
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(0);

function toggleFaq(index: number) {
  openIndex.value = openIndex.value === index ? null : index;
}

const faqs = [
  {
    q: 'Is Alexandrie really free and open-source?',
    a: 'Yes, Alexandrie is 100% open-source under the MIT license. You can use it, modify it, and distribute it freely. No hidden costs, no premium tiers.',
  },
  {
    q: 'Can I self-host Alexandrie on my own server?',
    a: 'Absolutely! You can run Alexandrie on your own infrastructure using Docker. Full documentation is available to help you get started in minutes.',
  },
  {
    q: 'Does Alexandrie work offline?',
    a: 'Yes, Alexandrie is designed with offline-first principles. Your notes are available locally and sync when you reconnect.',
  },
  {
    q: 'How is my data stored and secured?',
    a: 'When self-hosting, your data stays on your own server. We use industry-standard security practices, and all data transmission is encrypted.',
  },
  {
    q: 'Can I import my notes from other apps?',
    a: 'Yes! You can import Markdown files from other apps like Notion, Obsidian, or any Markdown editor. Export to PDF with beautiful formatting is also supported.',
  },
  {
    q: 'Does it support code blocks and math equations?',
    a: 'Definitely! We support syntax highlighting for 100+ programming languages and LaTeX math equations rendering.',
  },
  {
    q: 'Is there a mobile app available?',
    a: 'Alexandrie is a responsive web application that works great on mobile browsers. Native apps are on our roadmap.',
  },
];
</script>

<style scoped lang="scss">
.faq {
  max-width: 1200px;
  margin: 6rem auto;
  padding: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

h2 {
  border: none;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.faq-container {
  display: grid;
  align-items: start;
  gap: 3rem;
  grid-template-columns: 1.5fr 1fr;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-base);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: var(--primary);
  }

  &.open {
    border-color: var(--primary);
    box-shadow: 0 10px 40px rgb(99 102 241 / 10%);
  }
}

.faq-question {
  display: flex;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-body);
  text-align: left;
  background: none;
  transition: all 0.2s ease;
  align-items: center;
  cursor: pointer;
  gap: 1rem;
  justify-content: space-between;
}

.question-icon {
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  color: var(--primary);
  background: var(--surface-raised);
  transition: all 0.3s ease;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;

  .open & {
    color: white;
    background: var(--primary);
  }
}

.faq-answer {
  max-height: 0;
  transition: max-height 0.3s ease;
  overflow: hidden;

  p {
    padding: 0 1.5rem 1.25rem;
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }
}

// CTA Card
.faq-cta {
  position: sticky;
  top: 100px;
}

.cta-content {
  padding: 2.5rem 2rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xxl);
  text-align: center;
  background: linear-gradient(135deg, var(--surface-raised), var(--surface-base));
}

.cta-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.cta-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cta-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.cta-btn {
  display: inline-flex;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #5865f2;
  transition: all 0.3s ease;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    box-shadow: 0 8px 20px rgb(88 101 242 / 30%);
    transform: translateY(-2px);
  }
}

@media screen and (width <= 968px) {
  .faq-container {
    grid-template-columns: 1fr;
  }

  .faq-cta {
    position: static;
  }
}

@media screen and (width <= 640px) {
  .faq {
    padding: 1rem;
  }

  .faq-question {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .faq-answer p {
    padding: 0 1rem 1rem;
  }
}
</style>
