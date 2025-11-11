<template>
  <section class="about-demo">
    <header class="about-demo__header">
      <div>
        <h3>Experiment with the editor</h3>
        <p>
          Try Alexandrie's Markdown editor directly in your browser. Saving is disabled in this demo, but every formatting tool is
          ready to explore.
        </p>
      </div>
      <AppButton type="secondary" class="about-demo__guide" @click="openSyntaxGuide">
        <Icon name="help" display="lg" />
        Markdown Syntax Guide
      </AppButton>
    </header>
    <ClientOnly>
      <div class="about-demo__editor">
        <MarkdownEditor :doc="demoDocument" minimal disable-saving />
      </div>
      <template #fallback>
        <div class="about-demo__loading">Loading editor…</div>
      </template>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { reactive, shallowRef } from 'vue';
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';
import MarkdownSyntax from '~/components/MarkdownSyntax.vue';
import { Modal, useModal } from '~/composables/ModalBus';

const demoDocument = reactive({
  name: 'Alexandrie Editor Demo',
  description: 'Markdown playground with live preview',
  tags: 'demo,markdown,alexandrie',
  content: `# Welcome to the editor demo

Start typing to explore the **Markdown** workflow. Everything renders instantly in the preview panel.

## Quick ideas to try

- Trigger the preview panel with the toolbar eye icon.
- Use the slash menu to discover snippets.
- Paste an image to see how uploads are handled.

> Tip: Keyboard shortcuts like \`Ctrl/Cmd + B\` work too!

### Tables, code & more

| Feature | Shortcut | Description |
| --- | --- | --- |
| Bold | \`Ctrl/Cmd + B\` | Emphasise your key points |
| Ordered list | \`Ctrl/Cmd + Shift + 7\` | Perfect for processes |
| Code block | \`\`\`language\ncode\n\`\`\` | Great for tutorials |

\`\`\`js
export function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

---

Need syntax reminders? Open the guide from the button above.`,
});

const modal = useModal();
const openSyntaxGuide = () => {
  modal.add(new Modal(shallowRef(MarkdownSyntax), { size: 'large' }));
};
</script>

<style scoped lang="scss">
.about-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.about-demo__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0 0 0.25rem;
  }

  p {
    margin: 0;
    color: var(--font-color-light);
    line-height: 1.6;
  }
}

.about-demo__guide {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.about-demo__editor {
  min-height: 480px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.about-demo__loading {
  display: flex;
  min-height: 240px;
  border: 1px dashed var(--border-color);
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  color: var(--font-color-light);
}
</style>
