import { buildPlantumlUrl, encodePlantumlSource } from './plantuml-encode';

export type PlantumlRenderer = 'server' | 'local';

export interface RenderPlantumlOptions {
  mode: PlantumlRenderer;
  server: string;
  dark: boolean;
}

interface LocalEngine {
  renderToString: (lines: string[], onSuccess: (svg: string) => void, onError: (message: string) => void, options?: { dark: boolean }) => void;
}

let localEnginePromise: Promise<LocalEngine> | null = null;

/**
 * The local engine is the full PlantUML build (~7 MB with its Graphviz layout
 * engine), so it is imported on demand -- only when a document actually contains a
 * diagram and the reader chose local rendering -- and cached for the session.
 *
 * Its ES module needs the Graphviz engine present as a global first, which only a
 * classic script tag provides, hence the injection before the import.
 */
function loadLocalEngine(): Promise<LocalEngine> {
  localEnginePromise ??= (async () => {
    await new Promise<void>((resolvePromise, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-plantuml-viz]');
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolvePromise();
        existing.addEventListener('load', () => resolvePromise(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load the local diagram engine.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = new URL('@plantuml/core/viz-global.js', import.meta.url).href;
      script.dataset.plantumlViz = 'true';
      script.addEventListener(
        'load',
        () => {
          script.dataset.loaded = 'true';
          resolvePromise();
        },
        { once: true },
      );
      script.addEventListener('error', () => reject(new Error('Failed to load the local diagram engine.')), { once: true });
      document.head.appendChild(script);
    });

    return await import('@plantuml/core');
  })().catch(err => {
    // Don't cache the failure: a reader who was briefly offline should get another
    // attempt on the next render instead of a permanently broken diagram.
    localEnginePromise = null;
    throw err;
  });

  return localEnginePromise;
}

function renderLocally(engine: LocalEngine, source: string, dark: boolean): Promise<string> {
  // renderToString is callback-based, and settled guards against an engine that
  // reports both success and failure for one diagram. Note that invalid syntax
  // usually arrives through onSuccess as an SVG containing PlantUML's own error
  // report -- the same behaviour as the server -- so onError covers engine faults
  // rather than diagram mistakes.
  return new Promise((resolvePromise, reject) => {
    let settled = false;

    engine.renderToString(
      source.split('\n'),
      svg => {
        if (settled) return;
        settled = true;
        resolvePromise(svg);
      },
      message => {
        if (settled) return;
        settled = true;
        reject(new Error(message || 'Invalid diagram.'));
      },
      // The engine renders its own dark palette, same as the server's dsvg endpoint.
      { dark },
    );
  });
}

function showError(el: HTMLElement, message: string) {
  el.classList.add('plantuml-error');
  el.textContent = `Diagram error: ${message}`;
}

/**
 * Parse the engine's SVG through an inert document instead of assigning it as
 * innerHTML. PlantUML escapes diagram text into <text> nodes, so its output is not
 * a scripting vector today; parsing defensively keeps a future engine bug from
 * reaching the live DOM, and drops any script or event handler on the way in.
 */
function parseSvg(svg: string): Element {
  const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = parsed.documentElement;

  // A malformed document parses into a <parsererror> root, or an <html> one, rather
  // than throwing. Checking the root's local name rather than only its namespace
  // keeps this working across parser implementations.
  if (!root || root.localName?.toLowerCase() !== 'svg' || parsed.querySelector('parsererror')) {
    throw new Error('The diagram engine returned invalid SVG.');
  }

  for (const node of root.querySelectorAll('script, foreignObject')) node.remove();
  for (const node of [root, ...root.querySelectorAll('*')]) {
    for (const attr of [...node.attributes]) {
      if (/^on/i.test(attr.name) || (/^(href|xlink:href)$/i.test(attr.name) && !/^(#|https?:|mailto:)/i.test(attr.value.trim()))) {
        node.removeAttributeNode(attr);
      }
    }
  }

  return document.importNode(root, true);
}

/**
 * Turn the `<pre class="plantuml">` placeholders emitted at compile time into
 * diagrams, either as an <img> pointing at a PlantUML server or as inline SVG
 * produced by the local engine.
 */
export async function renderPlantumlDiagrams(root: HTMLElement, options: RenderPlantumlOptions): Promise<void> {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('pre.plantuml'));
  if (!elements.length) return;

  // The source is kept on the element: rendering replaces the text content, so a
  // re-render (theme change, server change) needs the original to work from.
  const sources = elements.map(el => {
    el.dataset.plantumlSource ??= el.textContent ?? '';
    return el.dataset.plantumlSource;
  });

  let engine: LocalEngine | null = null;
  if (options.mode === 'local') {
    try {
      engine = await loadLocalEngine();
    } catch (err) {
      for (const el of elements) showError(el, err instanceof Error ? err.message : String(err));
      return;
    }
  }

  // Sequential on purpose: the local engine keeps shared internal state and silently
  // overwrites the previous result if renders overlap.
  for (const [index, el] of elements.entries()) {
    const source = (sources[index] ?? '').trim();

    if (!source) {
      showError(el, 'The diagram is empty.');
      continue;
    }

    try {
      if (engine) {
        el.replaceChildren(parseSvg(await renderLocally(engine, source, options.dark)));
      } else {
        const url = buildPlantumlUrl(options.server, await encodePlantumlSource(source), options.dark);
        const img = document.createElement('img');
        img.alt = 'PlantUML diagram';
        img.loading = 'lazy';
        // A server that is unreachable or refuses the diagram would otherwise leave a
        // broken-image icon with no explanation of what went wrong.
        img.addEventListener('error', () => showError(el, 'The PlantUML server could not be reached.'), { once: true });
        img.src = url;

        el.replaceChildren(img);
      }

      el.classList.remove('plantuml-error');
    } catch (err) {
      showError(el, err instanceof Error ? err.message : String(err));
    }
  }
}
