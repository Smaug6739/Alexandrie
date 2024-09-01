<template>
  <main>
    <AppHeader />
    <div class="content-wrapper">
      <div class="intro">
        <div class="intro-text">
          <h1>
            Your Ideas, Documents & Plans. <br />
            Alexandrie
          </h1>
          <h3>Centralize Your Notes. Enhance Your Productivity.</h3>
        </div>
        <div class="btns-block">
          <NuxtLink to="/dashboard" class="get-started">Get started</NuxtLink>
          <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" class="github">Github</NuxtLink>
        </div>
      </div>
      <div class="images">
        <img :src="`/main-${colorMode.value}.webp`" alt="Documents Image" />
      </div>
    </div>
    <h2 style="text-align: center; border: none">Try editor online</h2>
    <div class="editor"><MarkdownEditor :doc="doc" :options="{ showPreview: !isMobile(), toolbar: 'minimal' }" /></div>
    <h2 style="text-align: center; border: none">Organize your documents</h2>
    <div class="demo">
      <img src="/home.webp" alt="home" />
    </div>
    <AppFooter />
  </main>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';

const doc = ref({
  content_markdown: `# Welcome to Alexandrie ! 🚀\n## Formatting options\n\nLorem **ipsum dolor** *sit amet*, consectetur _adipiscing elit_. ==But not sad.==   \n\n### Different content blocks\n\n:::blue Blue\nA blue block\n:::\n:::red Red\nA red block\n:::\n:::green Green\nA green block\n:::\n:::grey Grey\nA grey block\n:::\n:::yellow Yellow\nA yellow block\n:::\n:::turquoise Turquoise\nA turquoise block\n:::\n:::details Details\nA details block\n:::\n\n\n:::no-print\nThis content will not be printed\n:::\n\n:::center\nThis content is centered\n:::\n\n:::definition Red Info\nBlock of content (ex: definition)\n:::\n\n:::property Blue Info\nBlock of content (ex: property)\n:::\n\n:::theorem Turquoise Info\nBlock of content (ex: theorem)\n:::\n\n:::info-u Info without background\nBlock of content (ex: info, tip, note)\n:::\n\n:::warning Warning Info\nBlock of content (ex: warning)\n:::\n\n### Bullet and Numbered Lists:\n\n- Bullet 1\n- Bullet 2\n  - Sub-bullet 2-1\n\n1. Item 1\n1. Item 2\n\n### Markdown Tables\n\n| Column 1  | Column 2  | Column 3 |\n|:----------|:----------|:---------|\n|Item 1     | Item 2    | Item 3   |\n\n### Other formats\n\n$\\text{This is a math block: } f(x) = ax^2+bx+c$\n\n\`\`\`javascript\nconst hello = "Hello world";\n\`\`\`\n\n> Note: This content is a quote\n>> Nested quote\n\n## Shortcuts\n\n- **Ctrl + S**: Save\n- **Ctrl + P**: Toggle preview\n- **Ctrl + Q**: Switch to document\n- **Ctrl + B**: Bold formatting\n- **Ctrl + I**: Italic formatting\n- **Ctrl + U**: Underline formatting\n- **Ctrl + K**: Insert link\n- **Ctrl + M**: Insert image\n\n## Snippets\n\n- **!m**: Insert a math block (LaTeX)\n- **!def**: Insert a definition block\n- **!thm**: Insert a theorem block\n- **!center**: Center the content\n- **!red**: Insert a red block\n- **!green**: Insert a green block\n- **!blue**: Insert a blue block\n- **!yellow**: Insert a yellow block\n- **!details**: Insert a details block\n`,
});
</script>

<style scoped lang="scss">
main {
  flex-grow: 1;
  padding-top: 1.5rem;
  width: 95%;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.editor {
  max-width: 1200px;
  height: 700px;
  margin: 0 auto;
}
.demo {
  width: 100%;
  height: 100%;
  img {
    max-height: unset;
    display: block;
    max-width: 1000px;
    width: 100%;
    margin: 25px auto;
  }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
}

.intro {
  max-width: 48rem;
  gap: 1rem;
}

.intro h1 {
  font-size: 3.1rem;
  font-weight: 700;
}

.intro h3 {
  font-size: 1.3rem;
  font-weight: 500;
  text-decoration: none;
}

.btns-block {
  display: flex;
  justify-content: center;
  margin: 2rem;

  a {
    margin: 0 0.5rem;
    padding: 0.5rem 1.4rem;
    border-radius: 0.45rem;

    font-weight: 500;
    font-size: 1.2rem;

    &:hover {
      transform: scale(1.03);
    }
  }

  .get-started {
    background-color: var(--font-color);
    color: var(--bg-color);
    border: 1px solid var(--bg-color);
  }

  .github {
    background-color: var(--bg-color);
    color: var(--font-color);
    border: 1px solid var(--font-color);
  }
}

.none {
  display: none;
}

.images {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  width: 800px;
}

@media (max-width: 768px) {
  .intro h1 {
    font-size: 2.5rem;
  }

  .intro h3 {
    font-size: 1rem;
  }
}
</style>
