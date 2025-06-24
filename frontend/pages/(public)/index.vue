<template>
  <main>
    <section class="header">
      <IconApp />
    </section>
    <section class="content-wrapper">
      <div class="intro">
        <div class="intro-text">
          <h1 class="title">
            <span id="typewriter"></span>
          </h1>
          <h3 class="subtitle">Centralize Your Notes. Enhance Your Productivity.</h3>
        </div>
        <div class="btns-block">
          <NuxtLink to="/dashboard" class="get-started">Get started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="github">Github</NuxtLink>
        </div>
      </div>
      <div class="images">
        <img src="`/screenshots/mock/1.png`" alt="Documents Image" />
      </div>
    </section>
    <section class="editor-section">
      <h2 class="section-title">Try editor online</h2>
      <div class="editor">
        <MarkdownEditor :doc="doc" :options="{ showPreview: !isMobile(), toolbar: 'minimal' }" />
      </div>
    </section>
    <section class="demo-section">
      <h2 class="section-title">Organize your documents</h2>
      <div class="demo">
        <img src="/screenshots/mock/3.png" alt="home" />
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';
import AppFooter from './_components/AppFooter.vue';
const typewriterText = ref('Your Ideas, Documents & Plans.\nAlexandrie');

onMounted(() => {
  const element = document.getElementById('typewriter');
  if (!element || (element && !element)) return;
  const text = typewriterText.value.split(''); // Divise le texte en lettres
  let index = 0;
  const type = () => {
    if (index < text.length) {
      element.textContent += text[index] || '';
      index++;
      setTimeout(type, 50); // Ajustez la vitesse d'écriture
    } else element.style.borderRight = 'none';
  };
  type();
});

const colorMode = useColorMode();
const doc = ref({
  content_markdown: `#  Alexandrie Hub 🚀

---

## ✨ Why Choose **Alexandrie**?

### 🚀 Enhanced syntax

* **Bold**, *Italic*, *Underline*, ==Highlight==
* Quotes, nested quotes, inline \`code\`, LaTeX math blocks:

:::center 
$\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}$
:::

### 💡 Key Features

* **Free Forever** – No hidden costs, no premium traps. Ever.
* **Unlimited Notes** – Whether it's 10 or 10,000 notes, you're free.
* **UI** – A clean, distraction-free interface you’ll actually love to use.
* **Stunning Sidebar Navigation** – Navigate through your workspaces and categories with ease.
* **Advanced Markdown Support** – Includes custom blocks, math (LaTeX), syntax highlighting, collapsible sections, and more.
* **Export to PDF** – Need a printable version? Export any note with perfect formatting.
* **Fully Responsive** – Works seamlessly on desktop and mobile.
* **Highly Customizable** – Want to tweak colors, styles, structure? Go for it.
* **Keyboard Shortcuts** – Speed up your workflow with intuitive hotkeys.

---

## 🚀 The Alexandrie Experience

:::definition Students & pro
**Alexandrie** redefines how students and professionals take notes. Think powerful Markdown, blended with a visual, minimalist, elegant interface.
:::

### 📂 Organized Like Never Before

* **Workspaces** to structure your subjects or projects
* **Nested categories** for fine-grained classification
* **Search and filter** your notes instantly

---

## ✍️ Rich Markdown, Elevated

\`\`\`javascript
// Yes, you can even write beautiful code blocks like this
const app = "Alexandrie";
console.log("Welcome to " + app);
\`\`\`



> *"Notes are not just text anymore, they’re an extension of your thoughts."*

:::theorem Support
All of this is supported natively, with real-time preview.
:::

---

## 🎯 Keyboard Shortcuts

:::center
| Action             | Shortcut |
| ------------------ | -------- |
| Save               | Ctrl + S |
| Toggle Preview     | Ctrl + P |
| Switch to Document | Ctrl + Q |
| Bold               | Ctrl + B |
| Italic             | Ctrl + I |
| Underline          | Ctrl + U |
| Insert Link        | Ctrl + K |
| Insert Image       | Ctrl + M |

Table 1: Keyboard Shortcuts
:::

:::property Blue Info
Efficiency is just a keypress away.
:::

---

## 📐 Custom Blocks

Need color-coded content? You got it:

:::blue Blue Block
Use for cool notes, tips or ideas
:::

:::red Red Block
Great for **warnings**, errors, or alerts
:::

:::green Green Block
Perfect for successes or checklists
:::

:::yellow Yellow Block
Use for yellow flags or info
:::

:::details Details
Click to reveal hidden content, explanations, or spoilers.
:::

---

## 🔍 Discover the Magic of Snippets

You can type \`!m\`, \`!thm\`, \`!def\`, \`!blue\`, \`!center\`, etc. to instantly insert styled blocks. Here's how you might use them:

\:::info-u Info without background
Snippets speed up your note-writing, keeping focus on **content** not formatting.
\:::

---

## 📦 Export & Share with Style

* Export your notes to **PDF** in a print-friendly, professionally styled format.
* Automatically hide blocks like:

Perfect for personal reminders or developer-only sections!

## 💖 Final Thoughts


You love project and you want to contribute ? Go on Github: [Smaug6739/Alexandrie](https://github.com/Smaug6739/Alexandrie)`,
});
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1,
h2,
h3 {
  font-weight: 600;
  color: var(--font-color);
}

h3 {
  font-size: 1.4rem;
  color: var(--font-color-light);
  font-weight: 500;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--font-color);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  position: absolute;
  top: 0;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 120px;
}

.intro {
  max-width: 48rem;
  padding: 1rem;
  h1 {
    font-size: 2.6rem;
  }
  h3 {
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
}

.btns-block {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2.5rem 0;
}

.get-started,
.github {
  padding: 0.9rem 2rem;
  border-radius: 10rem;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  border: none;
  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    transform: translateY(-4px);
  }
}

.get-started {
  background: $primary-color;
  color: #fff;
}

.github {
  background: var(--bg-contrast);
  color: var(--font-color);
}

.images {
  width: 100%;
  margin-top: 2rem;
}
img {
  max-height: unset;
  max-height: 500px;
  border-radius: 0.5rem;
}
.editor-section,
.demo-section {
  text-align: center;
  width: 100%;
  .editor {
    text-align: left;
  }
}

.editor {
  max-width: 1200px;
  height: 720px;
  padding: 25px;
  overflow: hidden;
}

.demo img {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  display: block;
  margin: 25px auto;
  max-height: unset;
  max-width: 1000px;
  width: 100%;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  .get-started,
  .github {
    padding: 0.8rem 1.6rem;
    font-size: 0.9rem;
  }

  .auth-links {
    gap: 0.8rem;
  }
}
</style>
