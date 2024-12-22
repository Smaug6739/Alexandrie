<template>
  <main>
    <section class="header">
      <div class="logo">
        <img src="/Logo/Alexandrie-logo-dark.png" alt="Logo Alexandrie" class="logo-img" />
      </div>
    </section>

    <section class="content-wrapper">
      <div class="intro">
        <div class="intro-text">
          <h1 class="title">
            <span id="typewriter"></span>
          </h1>
          <h3 class="subtitle">
          Centralize Your Notes. Enhance Your Productivity.
          </h3>
        </div>
        <div class="btns-block">
          <NuxtLink to="/dashboard" class="get-started">Get started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="github">Github</NuxtLink>
        </div>
      </div>
      <div class="images">
        <img :src="`/main-${colorMode.value}.webp`" alt="Documents Image" />
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
        <img src="/home.webp" alt="home" />
      </div>
    </section>
  </main>
  <AppFooter />
</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue';

const typewriterText = ref("Your Ideas, Documents & Plans.\nAlexandrie");

onMounted(() => {
  const element = document.getElementById("typewriter");

  if (element) {
    const text = typewriterText.value.split(""); // Divise le texte en lettres
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text[index] === "\n" ? "\n" : text[index];
        index++;
        setTimeout(type, 50); // Ajustez la vitesse d'écriture
      } else {
        // Supprime le curseur à la fin
        element.style.borderRight = "none";
      }
    };

    type();
  }
});

const colorMode = useColorMode();
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';

const doc = ref({
  content_markdown: `# Welcome to Alexandrie ! 🚀\n## Formatting options\n\nLorem **ipsum dolor** *sit amet*, consectetur _adipiscing elit_. ==But not sad.==   \n\n### Different content blocks\n\n:::blue Blue\nA blue block\n:::\n:::red Red\nA red block\n:::\n:::green Green\nA green block\n:::\n:::grey Grey\nA grey block\n:::\n:::yellow Yellow\nA yellow block\n:::\n:::turquoise Turquoise\nA turquoise block\n:::\n:::details Details\nA details block\n:::\n\n\n:::no-print\nThis content will not be printed\n:::\n\n:::center\nThis content is centered\n:::\n\n:::definition Red Info\nBlock of content (ex: definition)\n:::\n\n:::property Blue Info\nBlock of content (ex: property)\n:::\n\n:::theorem Turquoise Info\nBlock of content (ex: theorem)\n:::\n\n:::info-u Info without background\nBlock of content (ex: info, tip, note)\n:::\n\n:::warning Warning Info\nBlock of content (ex: warning)\n:::\n\n### Bullet and Numbered Lists:\n\n- Bullet 1\n- Bullet 2\n  - Sub-bullet 2-1\n\n1. Item 1\n1. Item 2\n\n### Markdown Tables\n\n| Column 1  | Column 2  | Column 3 |\n|:----------|:----------|:---------|\n|Item 1     | Item 2    | Item 3   |\n\n### Other formats\n\n$\\text{This is a math block: } f(x) = ax^2+bx+c$\n\n\`\`\`javascript\nconst hello = "Hello world";\n\`\`\`\n\n> Note: This content is a quote\n>> Nested quote\n\n## Shortcuts\n\n- **Ctrl + S**: Save\n- **Ctrl + P**: Toggle preview\n- **Ctrl + Q**: Switch to document\n- **Ctrl + B**: Bold formatting\n- **Ctrl + I**: Italic formatting\n- **Ctrl + U**: Underline formatting\n- **Ctrl + K**: Insert link\n- **Ctrl + M**: Insert image\n\n## Snippets\n\n- **!m**: Insert a math block (LaTeX)\n- **!def**: Insert a definition block\n- **!thm**: Insert a theorem block\n- **!center**: Center the content\n- **!red**: Insert a red block\n- **!green**: Insert a green block\n- **!blue**: Insert a blue block\n- **!yellow**: Insert a yellow block\n- **!details**: Insert a details block\n`,
});

</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f5f5f7;
  color: #333;
  line-height: 1.6;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1, h2, h3 {
  font-weight: 600;
  color: #1c1c1e;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 0.8rem;
}

#typewriter {
  font-size: 2.5rem;
  font-weight: 700;
  white-space: pre-wrap; /* Gère les sauts de ligne */
  display: inline-block;
  border-right: 4px solid #333; /* Curseur plus large */
  height: 1.2em; /* Ajuste la hauteur */
  animation: blink 0.6s step-end infinite;
}

@keyframes blink {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: #333;
  }
}


h3 {
  font-size: 1.4rem;
  color: #6e6e73;
  font-weight: 500;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  position: absolute;
  top: 0;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
}

.logo-img {
  width: 120px;
  height: auto;
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
}

.intro h1 {
  font-size: 2.6rem;
}

.intro h3 {
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.btns-block {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2.5rem 0;
}

.get-started, .github {
  padding: 0.9rem 2rem;
  border-radius: 10rem;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.get-started {
  background: linear-gradient(135deg, #6d9fff, #007aff);
  color: #fff;
  border: none;
}

.github {
  background: linear-gradient(135deg, #e4e4e6, #f2f2f7);
  color: #1c1c1e;
  border: none;
}

.get-started:hover, .github:hover {
  transform: translateY(-4px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

.images {
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
}

.images img {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.editor-section, .demo-section {
  text-align: center;
  margin-top: 4rem;
}

.editor {
  max-width: 1200px;
  height: 600px;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5ea;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1c1c1e;
}

.demo img {
  max-width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  .get-started, .github {
    padding: 0.8rem 1.6rem;
    font-size: 0.9rem;
  }

  .auth-links {
    gap: 0.8rem;
  }
}
</style>

