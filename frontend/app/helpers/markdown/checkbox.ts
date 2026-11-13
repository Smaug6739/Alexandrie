import type { MarkdownIt, StateCore } from 'markdown-it';

function markdownItCheckbox(md: MarkdownIt) {
  // Add a core rule to process checkboxes
  md.core.ruler.after('inline', 'checkbox', (state: StateCore) => {
    let checkboxIdCounter = 0;
    // Iterate through all tokens in the state
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (!token) continue;
      // Check if the token is an inline token and contains checkboxes
      if (token.type === 'inline' && token.content.match(/^\[([ xX])\]/)) {
        const match = token.content.match(/^\[([ xX])\]\s*(.*)/);

        if (match) {
          const isChecked = match[1]?.toLowerCase() === 'x';
          const label = match[2];
          const index = checkboxIdCounter++;

          // Inject HTML tokens for rendering checkboxes
          const checkboxToken = new state.Token('html_inline', '', 0);
          checkboxToken.content = `
            <label class="checkbox-container">
              <input type="checkbox" ${isChecked ? 'checked' : ''} data-checkbox-index="${index}">
              <span>${label}</span>
            </label>
          `;

          token.meta = { ...token.meta, checkboxIndex: index };
          token.children = [checkboxToken]; // Replace children with the new HTML content
          token.content = ''; // Clear the text content to avoid duplicate rendering
        }
      }
    }
  });
}

// Source line of the checkbox rendered with data-checkbox-index `index`
function checkboxLine(md: MarkdownIt, markdown: string, index: number): number | undefined {
  return md.parse(markdown, {}).find(t => t.type === 'inline' && t.meta?.checkboxIndex === index)?.map?.[0];
}

export { markdownItCheckbox, checkboxLine };
