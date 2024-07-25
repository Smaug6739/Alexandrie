// Declare all snippets here

interface Snippet {
  cmd: string;
  value: string;
}

const snippets = [
  {
    cmd: '!def',
    value: ':::definition Définition: {$}\n:::',
  },
  {
    cmd: '!thm',
    value: ':::theorem Théorème:{$}\n:::',
  },
  {
    cmd: '!m',
    value: '${$}$',
  },
];

export { type Snippet, snippets };
