import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import MarkdownIt from 'markdown-it';

import { mermaidPlugin } from './mermaid';
import { plantumlPlugin } from './plantuml';

function render(source: string): string {
  const md = new MarkdownIt({ html: true, linkify: true });
  md.use(mermaidPlugin);
  md.use(plantumlPlugin);
  return md.render(source);
}

describe('plantumlPlugin', () => {
  test('captures a ::: block as a plantuml placeholder', () => {
    const html = render(':::plantuml\n@startuml\nAlice -> Bob\n@enduml\n:::');

    assert.match(html, /<pre class="plantuml">/);
    assert.match(html, /Alice -&gt; Bob/);
  });

  test('captures a fenced ```plantuml block too', () => {
    const html = render('```plantuml\n@startuml\nAlice -> Bob\n@enduml\n```');

    assert.match(html, /<pre class="plantuml">/);
  });

  test('keeps diagram source raw instead of parsing it as Markdown', () => {
    // Pipes, brackets and indentation are all meaningful PlantUML syntax and must
    // survive: the inline parser would otherwise turn them into tables/links/code.
    const html = render(':::plantuml\n@startuml\n  Alice -> Bob: [msg] | pipe\n@enduml\n:::');

    assert.match(html, /\[msg\] \| pipe/);
    assert.doesNotMatch(html, /<table>/);
    assert.doesNotMatch(html, /<a href/);
  });

  test('escapes HTML in the diagram source', () => {
    const html = render(':::plantuml\n<script>alert(1)</script>\n:::');

    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;/);
  });

  test('autocloses an unterminated block', () => {
    const html = render(':::plantuml\n@startuml\nAlice -> Bob\n@enduml');

    assert.match(html, /<pre class="plantuml">/);
  });

  test('does not swallow content after the closing marker', () => {
    const html = render(':::plantuml\n@startuml\n@enduml\n:::\n\nAfter the diagram.');

    assert.match(html, /<p>After the diagram\.<\/p>/);
  });

  test('leaves an unrelated language fence alone', () => {
    const html = render('```js\nconst a = 1;\n```');

    assert.doesNotMatch(html, /class="plantuml"/);
  });
});

describe('mermaidPlugin still behaves as before the shared rule was extracted', () => {
  test('captures ::: and fenced mermaid blocks', () => {
    assert.match(render(':::mermaid\ngraph TD\n  A --> B\n:::'), /<pre class="mermaid">/);
    assert.match(render('```mermaid\ngraph TD\n  A --> B\n```'), /<pre class="mermaid">/);
  });

  test('keeps mermaid source raw and escaped', () => {
    const html = render(':::mermaid\ngraph TD\n  A[Start] --> B{Ok?}\n  B -->|Yes| C\n:::');

    assert.match(html, /A\[Start\] --&gt; B\{Ok\?\}/);
    assert.match(html, /B --&gt;\|Yes\| C/);
    assert.doesNotMatch(html, /<table>/);
  });

  test('keeps the two diagram types independent', () => {
    const html = render(':::mermaid\ngraph TD\n  A --> B\n:::\n\n:::plantuml\n@startuml\n@enduml\n:::');

    assert.match(html, /<pre class="mermaid">/);
    assert.match(html, /<pre class="plantuml">/);
  });
});
