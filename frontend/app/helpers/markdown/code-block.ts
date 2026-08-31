import type { MarkdownIt } from 'markdown-it';

/**
 * This plugin adds a copy button and a language label to code blocks in the
 * rendered markdown.
 */

const ICON_COPY = `<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const ICON_CHECK = `<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

/**
 * Conventional casing for the hints people actually type. Anything absent here is
 * shown as written, so an unlisted language still gets a label.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  c: 'C',
  'c++': 'C++',
  cpp: 'C++',
  cs: 'C#',
  csharp: 'C#',
  css: 'CSS',
  diff: 'Diff',
  docker: 'Dockerfile',
  dockerfile: 'Dockerfile',
  go: 'Go',
  golang: 'Go',
  graphql: 'GraphQL',
  html: 'HTML',
  ini: 'INI',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  latex: 'LaTeX',
  less: 'Less',
  lua: 'Lua',
  makefile: 'Makefile',
  markdown: 'Markdown',
  md: 'Markdown',
  nginx: 'Nginx',
  objectivec: 'Objective-C',
  php: 'PHP',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  py: 'Python',
  python: 'Python',
  r: 'R',
  rb: 'Ruby',
  ruby: 'Ruby',
  rs: 'Rust',
  rust: 'Rust',
  scala: 'Scala',
  scss: 'SCSS',
  sh: 'Bash',
  shell: 'Shell',
  sql: 'SQL',
  swift: 'Swift',
  tex: 'TeX',
  toml: 'TOML',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  vue: 'Vue',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
  zsh: 'Zsh',
};

/**
 * Resolve the label for a fence's info string. Only the first word is the language:
 * highlight.js ignores the rest, and so do we, so `js {1,3}` still reads JavaScript.
 */
export function resolveLanguageLabel(info: string): string {
  const hint = info.trim().split(/\s+/)[0] ?? '';
  if (!hint) return '';

  return LANGUAGE_LABELS[hint.toLowerCase()] ?? hint;
}

export const copyCodePlugin = (md: MarkdownIt) => {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const original = defaultFence ? defaultFence(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
    const label = resolveLanguageLabel(tokens[idx]?.info ?? '');

    // The hint comes from the document, so it is escaped like any other content.
    const languageTag = label ? `<span class="code-block-language">${md.utils.escapeHtml(label)}</span>` : '';

    return `
<div class="code-block-wrapper">
  <div class="code-block-actions">
    ${languageTag}
    <button type="button" class="code-copy-btn" aria-label="Copy code" title="Copy code">
      <span class="btn-icon">${ICON_COPY}</span>
      <span class="btn-icon-success">${ICON_CHECK}</span>
    </button>
  </div>
  ${original}
</div>`;
  };
};
