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
&lt;tag green&gt;Success&lt;/tag&gt;
&lt;tag red&gt;Danger&lt;/tag&gt;
&lt;tag yellow&gt;Yellow&lt;/tag&gt;
&lt;tag grey&gt;Note&lt;/tag&gt;
&lt;tag teal>Teal&lt;/tag></pre
      >

      <strong>Colors: </strong>
      <strong
        ><span style="color: var(--blue)">blue</span> ; <span style="color: var(--red)">red</span> ; <span style="color: var(--green)">green</span> ;
        <span style="color: var(--yellow)">yellow</span> ; <span style="color: var(--primary)">primary</span> ;
        <span style="color: var(--purple)">purple</span> ; <span style="color: var(--pink)">pink</span> ; <span style="color: var(--teal)">teal</span></strong
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

      <h2>🔲 Grid Organization</h2>
      <p>Use the <strong>Grid Organization</strong> button in the toolbar to create custom layouts:</p>
<<<<<<< HEAD
      
      <h3>Quick Presets</h3>
      <p>Pre-built grid layouts for common use cases:</p>
      
      <div class="grid-examples">
        <div class="grid-example">
          <h4>2x2 Grid</h4>
          <div class="grid-preview grid-2x2">
            <div class="grid-cell">Cell 1</div>
            <div class="grid-cell">Cell 2</div>
            <div class="grid-cell">Cell 3</div>
            <div class="grid-cell">Cell 4</div>
          </div>
          <p><strong>Perfect for:</strong> Comparing two concepts, pros/cons lists</p>
        </div>

        <div class="grid-example">
          <h4>3x2 Grid</h4>
          <div class="grid-preview grid-3x2">
            <div class="grid-cell">Cell 1</div>
            <div class="grid-cell">Cell 2</div>
            <div class="grid-cell">Cell 3</div>
            <div class="grid-cell">Cell 4</div>
            <div class="grid-cell">Cell 5</div>
            <div class="grid-cell">Cell 6</div>
          </div>
          <p><strong>Ideal for:</strong> Feature comparisons, process steps</p>
        </div>

        <div class="grid-example">
          <h4>2x3 Grid</h4>
          <div class="grid-preview grid-2x3">
            <div class="grid-cell">Cell 1</div>
            <div class="grid-cell">Cell 2</div>
            <div class="grid-cell">Cell 3</div>
            <div class="grid-cell">Cell 4</div>
            <div class="grid-cell">Cell 5</div>
            <div class="grid-cell">Cell 6</div>
          </div>
          <p><strong>Great for:</strong> Step-by-step processes, timelines</p>
        </div>

        <div class="grid-example">
          <h4>3x3 Grid</h4>
          <div class="grid-preview grid-3x3">
            <div class="grid-cell">Cell 1</div>
            <div class="grid-cell">Cell 2</div>
            <div class="grid-cell">Cell 3</div>
            <div class="grid-cell">Cell 4</div>
            <div class="grid-cell">Cell 5</div>
            <div class="grid-cell">Cell 6</div>
            <div class="grid-cell">Cell 7</div>
            <div class="grid-cell">Cell 8</div>
            <div class="grid-cell">Cell 9</div>
          </div>
          <p><strong>Comprehensive:</strong> Information display, data organization</p>
        </div>
      </div>
      <h3>Generated Markdown</h3>
      <p>Here's what gets inserted when you use the Grid Organization tool:</p>
      
=======

      <h3>Generated Markdown</h3>
      <p>Here's what gets inserted when you use the Grid Organization tool:</p>

>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
      <div class="markdown-examples">
        <div class="example-section">
          <h4>Simple 2x2 Table</h4>
          <div class="rendered-table">
            <table>
              <thead>
                <tr>
                  <th>Header 1</th>
                  <th>Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                </tr>
                <tr>
                  <td>Cell 3</td>
                  <td>Cell 4</td>
                </tr>
              </tbody>
            </table>
          </div>
<<<<<<< HEAD
          <pre>| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |</pre>
=======
          <pre>
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |</pre
          >
>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
        </div>

        <div class="example-section">
          <h4>3x3 Data Table</h4>
          <div class="rendered-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Item A</td>
                  <td>$19.99</td>
                  <td>⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>Item B</td>
                  <td>$29.99</td>
                  <td>⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>Item C</td>
                  <td>$39.99</td>
                  <td>⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
<<<<<<< HEAD
          <pre>| Product | Price  | Rating |
|---------|--------|--------|
| Item A  | $19.99 | ⭐⭐⭐⭐⭐ |
| Item B  | $29.99 | ⭐⭐⭐⭐  |
| Item C  | $39.99 | ⭐⭐⭐   |</pre>
=======
          <pre>
| Product | Price  | Rating |
|---------|--------|--------|
| Item A  | $19.99 | ⭐⭐⭐⭐⭐ |
| Item B  | $29.99 | ⭐⭐⭐⭐  |
| Item C  | $39.99 | ⭐⭐⭐   |</pre
          >
>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
        </div>
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
      <div style="display: flex; align-items: center; flex-wrap: wrap">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::blue INFO<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="blue custom-block"><p class="custom-block-title">INFO</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::green SUCCESS<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="green custom-block"><p class="custom-block-title">SUCCESS</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::yellow WARNING<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="yellow custom-block"><p class="custom-block-title">WARNING</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::grey NOTE<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="grey custom-block"><p class="custom-block-title">NOTE</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::red DANGER<br>:::</pre>
        </span>
        <span style="flex: 1; margin-left: 10px"
          ><div class="red custom-block"><p class="custom-block-title">DANGER</p></div></span
        >
      </div>
      <div style="display: flex">
        <span style="flex: 1; margin-right: 10px">
          <pre style="padding: 5px; color: white">:::teal TEAL<br>:::</pre>
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

<<<<<<< HEAD
/* Grid Organization Examples */
.grid-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

.grid-example {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.grid-example h4 {
  margin: 0 0 1rem 0;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.grid-preview {
  display: grid;
  gap: 4px;
  margin: 1rem 0;
  justify-content: center;
}

.grid-2x2 {
  grid-template-columns: repeat(2, 60px);
  grid-template-rows: repeat(2, 40px);
}

.grid-3x2 {
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(2, 40px);
}

.grid-2x3 {
  grid-template-columns: repeat(2, 60px);
  grid-template-rows: repeat(3, 35px);
}

.grid-3x3 {
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 35px);
}

.grid-cell {
  background: var(--primary);
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  padding: 4px;
  transition: all 0.3s ease;
}

.grid-cell:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

/* Custom Grid Layouts */
.custom-grid-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

.custom-grid-example {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.custom-grid-example h4 {
  margin: 0 0 1rem 0;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.custom-grid-preview {
  display: grid;
  gap: 4px;
  margin: 1rem 0;
}

.header-content {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
}

.header-content .header-cell {
  grid-column: 1 / -1;
  background: var(--blue);
  height: 50px;
}

.header-content .content-cell {
  background: var(--green);
  height: 80px;
}

.header-content .sidebar-cell {
  background: var(--purple);
  height: 80px;
}

.feature-compare {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
}

.feature-compare .feature-header {
  grid-column: 1 / -1;
  background: var(--primary);
  height: 40px;
}

.feature-compare .plan-a {
  background: var(--blue);
  height: 35px;
}

.feature-compare .plan-b {
  background: var(--green);
  height: 35px;
}

.feature-compare .feature-1,
.feature-compare .feature-2 {
  background: var(--grey);
  height: 35px;
}

.feature-compare .plan-a-yes,
.feature-compare .plan-b-yes {
  background: var(--green);
  height: 35px;
  font-size: 1.2rem;
}

.feature-compare .plan-a-no {
  background: var(--red);
  height: 35px;
  font-size: 1.2rem;
}

=======
>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
/* Markdown Examples */
.markdown-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 1.5rem 0;
}

.example-section {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.example-section h4 {
  margin: 0 0 1rem 0;
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.rendered-table {
  margin: 1rem 0;
  overflow-x: auto;
}

.rendered-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rendered-table th {
  background: var(--primary);
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.rendered-table td {
  padding: 10px 12px;
  border-top: 1px solid var(--border-color);
}

.rendered-table tr:hover {
  background: var(--bg-color-secondary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
<<<<<<< HEAD
  .grid-examples,
  .custom-grid-examples,
=======
>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
  .markdown-examples {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
<<<<<<< HEAD
  
  .grid-example,
  .custom-grid-example,
  .example-section {
    padding: 1rem;
  }
  
  .grid-2x2,
  .grid-3x2,
  .grid-2x3,
  .grid-3x3 {
    transform: scale(0.9);
  }
=======

  .example-section {
    padding: 1rem;
  }
>>>>>>> 4cf5f349be0800eddc51160dc064c70cd715fbe4
}
</style>
