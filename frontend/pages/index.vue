<template>
  <div class="container">
    <nav>
      <div class="actions">
        <NuxtLink to="/login" class="login">Login</NuxtLink>
        <NuxtLink to="/signup" class="sign-up">Sign up</NuxtLink>
      </div>
    </nav>
    <main>
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
    </main>
    <footer>
      <Logo />
      <p class="p2">Developed and designed by Smaug with ❤️</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';

const doc = ref({
  content_markdown: `# Welcome to Alexandrie ! 🚀
## Formatting options

Lorem **ipsum dolor** *sit amet*, consectetur _adipiscing elit_. ==But not sad.==   

### Different content blocks

:::blue Blue
A blue block
:::
:::red Red
A red block
:::
:::green Green
A green block
:::
:::grey Grey
A grey block
:::
:::yellow Yellow
A yellow block
:::
:::turquoise Turquoise
A turquoise block
:::
:::details Details
A details block
:::


:::no-print
This content will not be printed
:::

:::center
This content is centered
:::

:::definition Red Info
Block of content (ex: definition)
:::

:::property Blue Info
Block of content (ex: property)
:::

:::theorem Turquoise Info
Block of content (ex: theorem)
:::

:::info-u Info without background
Block of content (ex: info, tip, note)
:::

:::warning Warning Info
Block of content (ex: warning)
:::

### Bullet and Numbered Lists:

- Bullet 1
- Bullet 2
  - Sub-bullet 2-1

1. Item 1
1. Item 2

### Markdown Tables

| Column 1  | Column 2  | Column 3 |
|:----------|:----------|:---------|
|Item 1     | Item 2    | Item 3   |

### Other formats

$\\text{This is a math block: } f(x) = ax^2+bx+c$

\`\`\`javascript
const hello = "Hello world";
\`\`\`

> Note: This content is a quote
>> Nested quote

## Shortcuts

- **Ctrl + S**: Save
- **Ctrl + P**: Toggle preview
- **Ctrl + Q**: Switch to document
- **Ctrl + B**: Bold formatting
- **Ctrl + I**: Italic formatting
- **Ctrl + U**: Underline formatting
- **Ctrl + K**: Insert link
- **Ctrl + M**: Insert image

## Snippets

- **!m**: Insert a math block (LaTeX)
- **!def**: Insert a definition block
- **!thm**: Insert a theorem block
- **!center**: Center the content
- **!red**: Insert a red block
- **!green**: Insert a green block
- **!blue**: Insert a blue block
- **!yellow**: Insert a yellow block
- **!details**: Insert a details block
`,
});
</script>

<style scoped lang="scss">
.container {
  width: 95%;
  margin: 0 auto;
}

nav {
  width: fit-content;
  justify-content: space-between;
  font-weight: 500;
  margin: 15px 0 0 auto;
}
h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.actions {
  a {
    padding: 4px 15px;
    margin: 0 8px;
    border-radius: 25px;
  }
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
.editor {
  max-width: 1200px;
  height: 700px;
  margin: 0 auto;
}
.sign-up {
  background: var(--bg-color);
  border: 1px solid var(--border-color);

  &:hover {
    outline: 2px solid var(--border-color);
    outline-offset: 2px;
  }
}

.login {
  background: var(--font-color);
  color: var(--bg-color);

  &:hover {
    outline: 2px solid var(--font-color);
    outline-offset: 2px;
  }
}

main {
  flex-grow: 1;
  padding-top: 1.5rem;
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

footer {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  margin: 0 30px;
}

@media (max-width: 768px) {
  .intro h1 {
    font-size: 2.5rem;
  }

  .intro h3 {
    font-size: 1rem;
  }
  footer {
    margin: 0;
    padding: 0;
  }
}
</style>
