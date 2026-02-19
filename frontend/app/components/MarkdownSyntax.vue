<template>
  <div class="markdown-guide">
    <div class="content">
      <h1><IconApp style="width: 60px" /> {{ t('markdown.syntax.title') }}</h1>
      <p style="margin: 0">{{ t('markdown.syntax.subtitle') }}</p>

      <!-- BASIC FORMATTING -->
      <h2><Icon name="edit" fill="var(--primary)" /> {{ t('markdown.syntax.basicFormatting') }}</h2>
      <ul>
        <li><strong>Bold</strong>: <code>**bold**</code> or <code>__bold__</code></li>
        <li><em>Italic</em>: <code>*italic*</code> or <code>_italic_</code></li>
        <li><u>Underline</u>: <code>__underline__</code></li>
        <li><del>Strikethrough</del>: <code>~~strikethrough~~</code></li>
        <li><mark>Highlight</mark>: <code>==highlight==</code></li>
        <li>Superscript: <sup>text</sup> <code>^text^</code></li>
        <li>Subscript: <sub>text</sub> <code>~text~</code></li>
      </ul>

      <!-- TAGS -->
      <p>
        <strong>{{ t('markdown.syntax.tags') }}: </strong> <tag blue>Blue</tag> <tag green>Green</tag> <tag red>Red</tag> <tag yellow>Yellow</tag>
        <tag grey>Grey</tag> <tag teal>Teal</tag><br />
        Syntax: <code v-text="`<tag 'color'>Content</tag>`"></code> — example: <code v-text="`<tag blue>Blue</tag>`"></code>
      </p>

      <!-- COLORS -->
      <p>
        <strong>{{ t('markdown.syntax.colors') }}: </strong>
        <strong>
          <span style="color: var(--blue)">blue</span> ; <span style="color: var(--red)">red</span> ; <span style="color: var(--green)">green</span> ;
          <span style="color: var(--yellow)">yellow</span> ; <span style="color: var(--primary)">primary</span> ;
          <span style="color: var(--purple)">purple</span> ; <span style="color: var(--pink)">pink</span> ;
          <span style="color: var(--teal)">teal</span> </strong
        ><br />
        Syntax: <code v-text="`{color:'color'}(Text to color)`"></code> — example: <code v-text="`{color:blue}(blue)`"></code>
      </p>

      <p>
        <strong>{{ t('markdown.syntax.titles') }}:</strong>
        Syntax: <code v-text="`# H1`"></code> → <code v-text="`###### H6`"></code>
      </p>

      <p>
        <strong>{{ t('markdown.syntax.linksAndImages') }}:</strong>
        Use <code>[links](https://example.com)</code> and <code>![images](image.png)</code>.
      </p>

      <!-- COLORED BLOCKS -->
      <h2><Icon name="layers" fill="var(--primary)" /> {{ t('markdown.syntax.coloredBlocks') }}</h2>
      <p>Use colored blocks with the syntax <code>:::color TITLE</code>.</p>
      <div class="block-grid">
        <div class="custom-block blue">
          <p class="custom-block-title">INFO</p>
          <pre>:::blue INFO<br />:::</pre>
        </div>
        <div class="custom-block green">
          <p class="custom-block-title">SUCCESS</p>
          <pre>:::green SUCCESS<br />:::</pre>
        </div>
        <div class="custom-block yellow">
          <p class="custom-block-title">WARNING</p>
          <pre>:::yellow WARNING<br />:::</pre>
        </div>
        <div class="custom-block red">
          <p class="custom-block-title">DANGER</p>
          <pre>:::red DANGER<br />:::</pre>
        </div>
        <div class="custom-block grey">
          <p class="custom-block-title">NOTE</p>
          <pre>:::grey NOTE<br />:::</pre>
        </div>
        <div class="custom-block teal">
          <p class="custom-block-title">NOTE</p>
          <pre>:::teal NOTE<br />:::</pre>
        </div>
      </div>

      <!-- ADVANCED BLOCKS -->
      <h2><Icon name="layers" fill="var(--primary)" /> {{ t('markdown.syntax.advancedBlocks') }}</h2>
      <p>Use info blocks with the syntax <code>:::name TITLE Content :::</code>.</p>

      <div class="block-grid">
        <div class="markdown-container">
          <strong class="red title"><Icon name="info" color="red" /> INFO Red</strong>
          <div class="markdown-container-content">
            <code>:::info-red Title<br />Content<br />:::</code>
          </div>
        </div>

        <div class="markdown-container">
          <strong class="teal title"><Icon name="info" color="teal" /> INFO Teal</strong>
          <div class="markdown-container-content">
            <code>:::info-teal Title<br />Content<br />:::</code>
          </div>
        </div>

        <div class="markdown-container">
          <strong class="blue title"><Icon name="info" color="blue" /> INFO Blue</strong>
          <div class="markdown-container-content">
            <code>:::info-blue Title<br />Content<br />:::</code>
          </div>
        </div>
      </div>

      <hr style="margin: 8px" />

      <!-- LAYOUT BLOCKS -->
      <div class="demo">
        <pre>:::center<br />This text is centered!<br />:::</pre>
        <div class="center">This text is centered!</div>
      </div>

      <div class="demo">
        <pre>::::columns<br />:::column<br />Column left<br />:::<br />:::column<br />Column right<br />::::</pre>
        <div class="columns">
          <div class="column">Column left</div>
          <div class="column">Column right</div>
        </div>
      </div>

      <div class="demo">
        <pre>:::no-print<br />This content will not appear in PDF exports.<br />:::</pre>
        <p>This content will not appear in PDF exports.</p>
      </div>

      <div class="demo">
        <pre>:::details<br />Click to reveal hidden content.<br />:::</pre>
        <details class="details custom-block no-print">
          <summary>Details</summary>
          <p>Click to reveal hidden content.</p>
        </details>
      </div>

      <h2><Icon name="layers" fill="var(--primary)" /> {{ t('markdown.syntax.cardsAndPanels') }}</h2>
      <p>
        Use powerful block containers with a simplified syntax and <strong>modifiers</strong>. You can style your blocks using attributes like
        <code>border</code>, <code>rounded</code>, <code>bordered</code>, <code>shadow</code>, and even a custom <code>title="..."</code>.
      </p>
      <p>
        Syntax:
        <code>:::block-name modifier=value another-modifier title="Your Title"</code>
      </p>

      <h3>Available block types:</h3>
      <ul>
        <li><code>:::frame</code> — general purpose framed block</li>
        <li><code>:::card</code> — card-like container</li>
        <li><code>:::panel</code> — side panel / auxiliary container</li>
      </ul>

      <h3>Available modifiers:</h3>
      <ul>
        <li><strong>border=red|blue|green|yellow|teal|primary|grey|pink|purple…</strong></li>
        <li><strong>rounded</strong> — adds strong border radius</li>
        <li><strong>shadow</strong> — soft drop shadow</li>
        <li><strong>bordered</strong> — stronger border</li>
        <li><strong>gap=sm|md|lg</strong> — internal spacing</li>
        <li><strong>title="Your Title"</strong> — custom header</li>
      </ul>

      <div class="demo">
        <pre>
:::frame border=red title="Important"
This is a framed block with a custom color and rounded edges.
:::</pre
        >

        <div class="block frame border-red">
          <div class="block-title">Important</div>
          <p style="margin: 0">This is a framed block with a custom color and rounded edges.</p>
        </div>
      </div>

      <div class="demo">
        <pre>
:::card shadow bordered title="Card Example"
Cards can be styled with multiple modifiers at once.
:::</pre
        >

        <div class="block card shadow bordered">
          <div class="block-title">Card Example</div>
          <p>Cards can be styled with multiple modifiers at once.</p>
        </div>
      </div>

      <div class="demo">
        <pre>
:::panel gap=md title="Panel"
Useful for side content or notes.
:::</pre
        >

        <div class="block panel gap-md">
          <div class="block-title">Panel</div>
          <p>Useful for side content or notes.</p>
        </div>
      </div>

      <!-- MATH -->
      <h2><Icon name="maths" fill="var(--primary)" /> {{ t('markdown.syntax.mathSyntax') }}</h2>
      <p>Use KaTeX for math expressions: <code>$...$</code> (inline) or <code>$$...$$</code> (block).</p>
      <div class="demo">
        <pre>$\int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}$</pre>
        <!-- eslint-disable-next-line vue/no-v-html  OK fixed value -->
        <p v-html="compile('$$\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$')"></p>
      </div>

      <!-- EXTENDED SYNTAX -->
      <h2><Icon name="import" fill="var(--primary)" /> {{ t('markdown.syntax.extendedSyntax') }}</h2>
      <ul>
        <li><strong>Code blocks:</strong> <code>```language ... ```</code></li>
        <li><strong>Blockquotes:</strong> <code>> Quoted text</code></li>
        <li><strong>Horizontal rule:</strong> <code>---</code> or <code>***</code></li>
        <li><strong>Lists:</strong> <code>- item</code> or <code>1. item</code></li>
        <li><strong>Nested lists:</strong> indent with two spaces</li>
        <li><strong>Task lists:</strong> <code>- [ ] Todo</code>, <code>- [x] Done</code></li>
        <li>
          <strong>Tables:</strong><br />
          <pre style="margin: 10px 0; padding: 0.75rem; border-radius: var(--radius-sm); color: white; overflow-x: auto">
| Column 1 | Column 2 |
|-----------|-----------|
| Cell 1    | Cell 2    |</pre
          >
        </li>
        <li><strong>Footnotes:</strong> <code>Text[^1]</code> with <code>[^1]: footnote text</code></li>
        <li><strong>Inline HTML:</strong> <code>&lt;span style="color:red"&gt;text&lt;/span&gt;</code></li>
      </ul>

      <!-- FOOTNOTES -->
      <h2><Icon name="format/footnote" fill="var(--primary)" /> {{ t('markdown.syntax.footnotes') }}</h2>
      <p>Add footnotes to your text for references or additional information.</p>
      <div class="demo">
        <pre>
This is a text with a note[^1] and another[^ref].

[^1]: First footnote
[^ref]: Second footnote with text identifier</pre
        >
        <div>
          <p>
            This is a text with a note<sup class="footnote-ref"><a href="#fn-1" title="First footnote">[1]</a></sup> and another<sup class="footnote-ref"
              ><a href="#fn-ref" title="Second footnote with text identifier">[ref]</a></sup
            >.
          </p>
          <section class="footnotes" style="font-size: 0.9rem; border-top: 1px solid var(--border); margin-top: 1rem; padding-top: 0.5rem">
            <ol style="margin: 0; padding-left: 1.5rem">
              <li>First footnote <a href="#fnref-1" class="footnote-backref">↩</a></li>
              <li>Second footnote with text identifier <a href="#fnref-ref" class="footnote-backref">↩</a></li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import compile from '~/helpers/markdown';

const { t } = useI18nT();
</script>

<style scoped lang="scss">
.markdown-guide {
  max-width: 100%;
  margin: auto;
  line-height: 1.7;
}

.content {
  margin: 1rem 0.5rem;
}

h1 {
  display: flex;
  margin: 0;
  align-items: center;
}

h2 {
  display: flex;
  font-size: 1.3rem;
  color: var(--primary);
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

code {
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-xs);
  font-family: $font-mono;
  font-size: 0.8rem;
}

.demo {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;

  pre {
    margin: 10px 0;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    color: white;
    overflow-x: auto;
  }

  * {
    flex: 1;
  }
}

.custom-block pre {
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  font-family: $font-mono;
  font-size: 0.85rem;
  background: rgb(255 255 255 / 30%);
  margin-top: 0.5rem;
}

.block-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

@media screen and (width <= 800px) {
  .content {
    margin: 0.75rem 0.25rem;
  }

  .block-grid {
    grid-template-columns: 1fr;
  }

  .demo {
    flex-direction: column;
  }
}
</style>
