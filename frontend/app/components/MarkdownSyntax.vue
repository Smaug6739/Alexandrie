<template>
  <div class="modal">
    <div class="markdown-doc">
      <h1>📘 Alexandrie Markdown Syntax Guide</h1>
      <p>This guide shows you how to use Alexandrie’s extended Markdown features to create expressive and organized notes.</p>

      <h2>✍️ Basic Formatting</h2>
      <ul>
        <li><strong>Bold</strong>: <code>**bold**</code> or <code>__bold__</code></li>
        <li><em>Italic</em>: <code>*italic*</code></li>
        <li><u>Underline</u>: <code>_underline_</code></li>
        <li><del>Strikethrough</del>: <code>~~strikethrough~~</code></li>
        <li><mark>Highlight</mark>: <code>==highlight==</code></li>
      </ul>

      <strong>Tags: </strong> <tag blue>Info</tag> <tag green>Success</tag><tag red>Danger</tag><tag yellow>Yellow</tag> <tag grey>Note</tag>
      <tag teal>Teal</tag>
      <pre>
&lt;tag blue&gt;Info&lt;/tag&gt;
&lt;tag red&gt;Danger&lt;/tag&gt;
&lt;tag teal>Teal&lt;/tag>
...</pre
      >
      <strong>Colors: </strong>
      <strong
        ><span style="color: var(--blue)">blue</span> ; <span style="color: var(--red)">red</span> ; <span style="color: var(--green)">green</span> ;
        <span style="color: var(--yellow)">yellow</span> ; <span style="color: var(--primary)">primary</span> ;
        <span style="color: var(--purple)">purple</span> ; <span style="color: var(--pink)">pink</span> ; <span style="color: var(--teal)">teal</span></strong
      >
      <pre>{color:blue}(blue) ; {color:red}(red) ; {color:green}(green) ;</pre>

      <h2>🔢 Headings</h2>
      <ul>
        <li>H1: <code># Heading 1</code></li>
        <li>H2: <code>## Heading 2</code></li>
        <li>H3: <code>### Heading 3</code></li>
        <li>H4: <code>#### Heading 4</code></li>
        <li>H5: <code>##### Heading 5</code></li>
        <li>H6: <code>###### Heading 6</code></li>
      </ul>

      <h2>💬 Blockquotes</h2>
      <p>Use the greater-than symbol to create blockquotes:</p>
      <pre>
> This is a blockquote.
> It can span multiple lines.</pre
      >
      <h2>🔗 Links & Images</h2>
      <ul>
        <li><a href="https://example.com">Example link</a>: <code>[Example link](https://example.com)</code></li>
        <li><img src="" alt="Image" />: <code>![Alt text](image-url)</code></li>
      </ul>

      <h2>🧾 Lists & Tables</h2>
      <ul>
        <li>Unordered: <code>- Item</code></li>
        <li>Ordered: <code>1. Item</code></li>
      </ul>
      <p>Table syntax:</p>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem">
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1</td>
              <td>Cell 1</td>
            </tr>
            <tr>
              <td>Row 2</td>
              <td>Cell 2</td>
            </tr>
          </tbody>
        </table>
        <pre>
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Cell 1   |
| Row 2    | Cell 2   |</pre
        >
      </div>

      <h2>💻 Code</h2>
      <p>Inline: <code>`inline code`</code></p>
      <p>Multiline:</p>
      <pre>
```javascript
function hello() {
  console.log("Hello, world!");
}
```</pre
      >
      <h2>📏 Horizontal Rules</h2>
      <p><code>---</code>, <code>***</code>, or <code>___</code> renders a line:</p>
      <hr />

      <h2>🎨 Colored Blocks</h2>
      <p>Use triple-colon blocks to insert styled sections:</p>
      <div class="demo">
        <pre>:::blue INFO<br>:::</pre>
        <div class="blue custom-block"><p class="custom-block-title">INFO</p></div>
      </div>
      <div class="demo">
        <pre>:::green SUCCESS<br>:::</pre>
        <div class="green custom-block"><p class="custom-block-title">SUCCESS</p></div>
      </div>
      <div class="demo">
        <pre>:::yellow WARNING<br>:::</pre>
        <div class="yellow custom-block"><p class="custom-block-title">WARNING</p></div>
      </div>
      <div class="demo">
        <pre>:::grey NOTE<br>:::</pre>
        <div class="grey custom-block"><p class="custom-block-title">NOTE</p></div>
      </div>
      <div class="demo">
        <pre>:::red DANGER<br>:::</pre>
        <div class="red custom-block"><p class="custom-block-title">DANGER</p></div>
      </div>
      <div class="demo">
        <pre>:::teal TEAL<br>:::</pre>
        <div class="teal custom-block"><p class="custom-block-title">TEAL</p></div>
      </div>
      <h2>📚 Special Blocks</h2>
      <p>These enhance your note structure visually and semantically:</p>
      <div class="demo">
        <pre>:::center<br />This text is centered!<br />:::</pre>
        <div class="center">This text is centered!</div>
      </div>
      <div class="demo">
        <pre>::::columns <br />:::column<br/>:::column<br />Column left<br/>:::column<br/>Column right<br/>::::</pre>
        <div class="columns">
          <div class="column">Column left</div>
          <div class="column">Column right</div>
        </div>
      </div>
      <div class="demo">
        <pre>:::no-print <br />This content will not appear in PDF exports.<br/>:::</pre>
        <p>This content will not appear in PDF exports.</p>
      </div>
      <div class="demo">
        <pre>:::details <br />Click to reveal hidden content.<br />:::</pre>
        <details class="details custom-block no-print">
          <summary>Details</summary>
          <p>Click to reveal hidden content.</p>
        </details>
      </div>
      <div class="demo">
        <pre>:::definition What is Markdown?<br />Markdown is a lightweight markup language.<br />:::</pre>
        <div class="markdown-container">
          <strong style="display: inline-flex; align-items: center; gap: 3px" class="red title"> <Icon name="info" color="red" />What is Markdown?</strong>
          <div class="markdown-container-content"><p>Markdown is a lightweight markup language.</p></div>
        </div>
      </div>
      <div class="demo">
        <pre>:::theorem Pythagoras<br />a² + b² = c²<br />:::</pre>
        <div class="markdown-container">
          <strong style="display: inline-flex; align-items: center; gap: 3px" class="teal title"> <Icon name="info" color="teal" />Pythagoras</strong>
          <div class="markdown-container-content"><p>a² + b² = c²</p></div>
        </div>
      </div>
      <div class="demo">
        <pre>:::property Property name<br />Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />:::</pre>
        <div class="markdown-container">
          <strong style="display: inline-flex; align-items: center; gap: 3px" class="blue title"> <Icon name="info" color="blue" />Property name</strong>
          <div class="markdown-container-content"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div>
        </div>
      </div>
      <h2>📤 Export</h2>
      <p>Export your notes to PDF, automatically hiding private/debug blocks for a clean result.</p>
    </div>
  </div>
</template>

<style scoped>
.markdown-doc {
  margin: auto;
  line-height: 1.7;
}

.markdown-doc pre {
  padding: 0.75rem;
  border-radius: 6px;
  color: white;
  overflow-x: auto;
}

.demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 1rem;
  * {
    flex: 1;
  }
  pre {
    margin: 10px 0;
  }
}
</style>
