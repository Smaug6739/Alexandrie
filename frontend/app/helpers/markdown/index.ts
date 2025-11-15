/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownIt from 'markdown-it';
import { containerPlugin } from './container';
import { anchorPlugin } from './anchor';
import { containerSvg } from './containers-svg';
import { copyCodePlugin } from './code-block';
// @ts-expect-error no types provided
import underline from 'markdown-it-underline';
import highlight from 'markdown-it-highlightjs';
// @ts-expect-error no types provided
import mark from 'markdown-it-mark';
import katex from 'katex';
import colorPlugin from './colors';

const md = new MarkdownIt({ html: true });
md.use(containerPlugin);
md.use(anchorPlugin);
md.use(containerSvg);
md.use(copyCodePlugin);
md.use(underline);
md.use(mark);
md.use(markdownItKatexPlugin);
md.use(highlight);
md.use(markdownItCheckbox);
md.use(colorPlugin, {
  enableBracketSyntax: true, // also parse [text]{color=value}
  allowHex: true, // allow #rgb and #rrggbb
  allowedNamedColors: ['red', 'crimson', 'rebeccapurple'], // restrict named colors (null = all standard names)
});

function markdownItKatexPlugin(md: any) {
  md.inline.ruler.after('escape', 'katex', (state: any, silent: any) => {
    if (silent) return false;

    const startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) return false;

    // Vérifie si c'est $$ (display) ou $ (inline)
    const isDisplay = state.src.charCodeAt(startMathPos + 1) === 0x24;
    const endMarker = isDisplay ? '$$' : '$';

    let found = false;
    let endMathPos = -1;
    const searchStart = startMathPos + (isDisplay ? 2 : 1);

    // Recherche du délimiteur de fin
    for (let i = searchStart; i < state.src.length; i++) {
      if (state.src.charCodeAt(i) === 0x24 /* $ */) {
        // Si on a $$ en fin
        if (isDisplay && state.src.charCodeAt(i + 1) === 0x24 && state.src.charCodeAt(i - 1) !== 0x5c) {
          found = true;
          endMathPos = i;
          break;
        }
        // Si on a $ en fin
        if (!isDisplay && state.src.charCodeAt(i - 1) !== 0x5c) {
          found = true;
          endMathPos = i;
          break;
        }
      }
    }

    if (!found) return false;

    const token = state.push(isDisplay ? 'katex_display' : 'katex_inline', '', 0);
    token.markup = endMarker;
    token.content = state.src.slice(startMathPos + endMarker.length, endMathPos);

    state.pos = endMathPos + endMarker.length;
    return true;
  });

  // Inline math ($...$)
  md.renderer.rules.katex_inline = (tokens: any, idx: any) => {
    return mdToKatex(tokens[idx].content, false);
  };

  // Display math ($$...$$)
  md.renderer.rules.katex_display = (tokens: any, idx: any) => {
    return mdToKatex(tokens[idx].content, true);
  };
}

// [ ] and [x] checkbox
// Fonction markdownItCheckbox
// Ajout d'une règle pour les listes
function markdownItCheckbox(md: any) {
  let checkboxIdCounter = 0;
  // Ajout d'une règle pour transformer les cases à cocher
  md.core.ruler.after('inline', 'checkbox', (state: any) => {
    // Parcourt tous les tokens de l'état
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];

      // Vérifier si le token est une liste et s'il contient des cases à cocher
      if (token.type === 'inline' && token.content.match(/^\[([ xX])\]/)) {
        const match = token.content.match(/^\[([ xX])\]\s*(.*)/);

        if (match) {
          const isChecked = match[1].toLowerCase() === 'x';
          const label = match[2];
          const checkboxId = `check-${checkboxIdCounter++}`;

          // Injecte des tokens HTML pour le rendu des cases à cocher
          const checkboxToken = new state.Token('html_inline', '', 0);
          checkboxToken.content = `
            <label class="checkbox-container">
              <input type="checkbox" ${isChecked ? 'checked' : ''} id="check-${checkboxId}">
              <span>${label}</span>
            </label>
          `;

          token.children = [checkboxToken]; // Remplace les enfants par le nouveau contenu HTML
          token.content = ''; // Vide le contenu textuel pour éviter un rendu dupliqué
        }
      }
    }
  });
}
// Définir une règle de rendu pour injecter les cases à cocher

export default function compile(str: string = ''): string {
  // Replace &lt; &gt; &amp; to < > & (to avoid markdown-it escape)
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return md.render(str, {
    html: true,
  });
}
function mdToKatex(text: string, centered: boolean): string {
  const expressionWithoutDollar = text;
  const render = katex.renderToString(expressionWithoutDollar, {
    throwOnError: false,
    displayMode: true,
    trust: true,
  });
  return `<span class="katex-container ${centered ? 'center' : ''}"><i>${render}</i></span>`;
}
