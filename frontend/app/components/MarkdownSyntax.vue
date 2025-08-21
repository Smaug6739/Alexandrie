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

      <strong>Tags: </strong> <tag blue>Info</tag> <tag green>Success</tag><tag red>Danger</tag><tag yellow>Yellow</tag> <tag grey>Note</tag> <tag teal>Teal</tag>
      <pre>
&lt;tag blue&gt;Info&lt;/tag&gt;
&lt;tag green&gt;Success&lt;/tag&gt;
&lt;tag red&gt;Danger&lt;/tag&gt;
&lt;tag yellow&gt;Yellow&lt;/tag&gt;
&lt;tag grey&gt;Note&lt;/tag&gt;
&lt;tag teal>Teal&lt;/tag></pre
      >

      <strong>Colors: </strong>
      <strong
        ><span style="color: var(--blue)">blue</span> ; <span style="color: var(--red)">red</span> ; <span style="color: var(--green)">green</span> ; <span style="color: var(--yellow)">yellow</span> ;
        <span style="color: var(--primary)">primary</span> ; <span style="color: var(--purple)">purple</span> ; <span style="color: var(--pink)">pink</span> ; <span style="color: var(--teal)">teal</span></strong
      >

      <pre>
{color:blue}(blue) ; {color:red}(red) ; {color:green}(green) ; {color:yellow}(yellow) ; {color:primary}(primary) ; {color:purple}(purple) ; {color:pink}(pink) ; {color:teal}(teal)

Custom RGB allowed: {color:#2cafcc}(custom 1) {color:#34b125}(custom 2)</pre
      >

      <h2>🔢 Headings</h2>

      <ul>
        <li>H1: <code># Heading 1</code></li>
        <li>H2: <code>## Heading 2</code></li>
        <li>H3: <code>### Heading 3</code></li>
        <li>H4: <code>#### Heading 4</code></li>
        <li>H5: <code>##### Heading 5</code></li>
        <li>H6: <code>###### Heading 6</code></li>
      </ul>
      <pre>
# Heading 1
## Heading 2
### Heading 3</pre
      >
      <h2>💬 Blockquotes</h2>
      <p>Use the greater-than symbol to create blockquotes:</p>
      <pre>
> This is a blockquote.
> It can span multiple lines.</pre
      >
      <h2>🔗 Links & Images</h2>
      <ul>
        <li><a href="https://example.com">Example link</a>: <code>[Example link](https://example.com)</code></li>
        <li><img src="" alt="Image" >: <code>![Alt text](image-url)</code></li>
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
      <hr >

      <h2>🎨 Colored Blocks</h2>
      <p>Use triple-colon blocks to insert styled sections:</p>
      <div style="display: flex; align-items: center; flex-wrap: wrap">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::blue INFO<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="blue custom-block"><p class="custom-block-title">INFO</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::green SUCCESS<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="green custom-block"><p class="custom-block-title">SUCCESS</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::yellow WARNING<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="yellow custom-block"><p class="custom-block-title">WARNING</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::grey NOTE<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="grey custom-block"><p class="custom-block-title">NOTE</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::red DANGER<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="red custom-block"><p class="custom-block-title">DANGER</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style=" padding: 5px;color: white">:::teal TEAL<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="teal custom-block"><p class="custom-block-title">TEAL</p></div></span
        >
      </div>
      <h2>📚 Special Blocks</h2>
      <p>These enhance your note structure visually and semantically:</p>
      <ul>
        <li><code>:::center</code> – center-aligned content</li>
        <li><code>:::no-print</code> – content hidden in PDF export</li>
        <li><code>:::details</code> – collapsible content</li>
        <li><code>:::definition [Title]</code></li>
        <li><code>:::theorem [Title]</code></li>
        <li><code>:::property [Title]</code></li>
      </ul>
      <p>Examples:</p>
      <pre>
:::center
This text is centered!
:::</pre
      >
      <pre>
:::no-print
This content will not appear in PDF exports.
:::</pre
      >

      <pre>
:::details
Click to reveal hidden content.
:::</pre
      >

      <pre>
:::definition What is Markdown?
Markdown is a lightweight markup language.
:::</pre
      >

      <pre>
:::theorem Pythagoras
a² + b² = c²
:::</pre
      >

      <pre>
:::info-u Quick Tip
Snippets help you focus on writing, not formatting.
:::</pre
      >

      <h2>📤 Export</h2>
      <p>Export your notes to PDF, automatically hiding private/debug blocks for a clean result.</p>

      <h2>💡 Tips</h2>
      <ul>
        <li>Combine blocks for complex notes: math + code + definition</li>
        <li>Use <code>:::details</code> to hide advanced explanations</li>
        <li>Exported PDF respects layout and styles</li>
      </ul>
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
</style>
