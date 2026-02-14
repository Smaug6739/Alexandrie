import type MarkdownIt from 'markdown-it';
import type { StateCore } from 'markdown-it/dist/index.cjs.js';

function markdownItCheckbox(md: MarkdownIt) {
  let checkboxIdCounter = 0;
  // Add a core rule to process checkboxes
  md.core.ruler.after('inline', 'checkbox', (state: StateCore) => {
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
          const checkboxId = `check-${checkboxIdCounter++}`;

          // Inject HTML tokens for rendering checkboxes
          const checkboxToken = new state.Token('html_inline', '', 0);
          checkboxToken.content = `
            <label class="checkbox-container">
              <input type="checkbox" ${isChecked ? 'checked' : ''} id="check-${checkboxId}">
              <span>${label}</span>
            </label>
          `;

          token.children = [checkboxToken]; // Replace children with the new HTML content
          token.content = ''; // Clear the text content to avoid duplicate rendering
        }
      }
    }
  });
}

export { markdownItCheckbox };
