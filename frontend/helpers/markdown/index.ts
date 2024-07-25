import MarkdownIt from 'markdown-it';
import { containerPlugin } from './container';
import { anchorPlugin } from './anchor';
import { containerSvg } from './containers-svg';
// @ts-ignore
import underline from 'markdown-it-underline';
import highlight from 'markdown-it-highlightjs';
// @ts-ignore
import mark from 'markdown-it-mark';
import katex from 'katex';

const md = new MarkdownIt({ html: true });
md.use(containerPlugin);
md.use(anchorPlugin);
md.use(containerSvg);
md.use(underline);
md.use(mark);
md.use(markdownItKatexPlugin);
md.use(highlight);

function markdownItKatexPlugin(md: any) {
  // Nous ajoutons une règle en ligne (inline) après la règle 'escape' (qui échappe les caractères spéciaux)
  md.inline.ruler.after('escape', 'katex', (state: any, silent: any) => {
    if (silent) return false; // Si le mode silencieux est activé, nous arrêtons ici

    const startMathPos = state.pos; // Nous stockons la position du début de l'expression mathématique
    if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
      // Nous vérifions si le caractère à la position de départ est un dollar sign ($)
      return false;
    }
    const endMarker = '$'; // Le délimiteur de fin pour l'expression mathématique
    let found = false; // Variable pour savoir si nous avons trouvé le délimiteur de fin
    let endMathPos = -1; // Position du délimiteur de fin dans la chaîne

    // Nous parcourons la chaîne à partir de la position de départ pour trouver le délimiteur de fin
    for (let i = startMathPos + 1; i < state.src.length; i++) {
      if (state.src.charCodeAt(i) === 0x24 /* $ */) {
        // Si nous trouvons un dollar sign ($)
        if (state.src.charCodeAt(i - 1) !== 0x5c /* \ */) {
          // Et qu'il n'est pas précédé d'un backslash (\)
          found = true; // Nous avons trouvé le délimiteur de fin
          endMathPos = i; // Nous stockons sa position
          break; // Nous arrêtons la recherche
        }
      }
    }

    if (!found) return false; // Si nous n'avons pas trouvé le délimiteur de fin, nous arrêtons ici

    // Nous ajoutons un token de type 'katex_inline' à la liste des tokens
    const token = state.push('katex_inline', '', 0);
    token.markup = endMarker; // Le délimiteur de fin pour ce token
    token.content = state.src.slice(startMathPos + 1, endMathPos); // Le contenu entre les délimiteurs de début et de fin
    state.pos = endMathPos + 1; // Nous mettons à jour la position de l'analyseur pour passer après le délimiteur de fin

    return true; // Nous signalons que nous avons traité un token avec succès
  });

  // Nous définissons la méthode de rendu pour les tokens de type 'katex_inline'
  md.renderer.rules.katex_inline = (tokens: any, idx: any) => {
    return mdTokatex(tokens[idx].content); // Nous utilisons notre fonction mdTokatex pour rendre le contenu mathématique
  };
}

export default function compile(str: string = ''): string {
  // Replace &lt; &gt; &amp; to < > & (to avoid markdown-it escape)
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return md.render(str, {
    html: true,
  });
}
function mdTokatex(text: string): string {
  const expressionWithoutDollar = text;
  const render = katex.renderToString(expressionWithoutDollar, {
    throwOnError: false,
    displayMode: true,
    trust: true,
  });
  return `<span class="katex-container"><i>${render}</i></span>`;
}
