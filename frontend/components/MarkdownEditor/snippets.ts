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
  {
    cmd: '!center',
    value: ':::center\n{$}\n:::',
  },

  // Red, green, blue, yellow, details
  {
    cmd: '!red',
    value: ':::red\n{$}\n:::',
  },
  {
    cmd: '!green',
    value: ':::green\n{$}\n:::',
  },
  {
    cmd: '!blue',
    value: ':::blue\n{$}\n:::',
  },
  {
    cmd: '!yellow',
    value: ':::yellow\n{$}\n:::',
  },
  {
    cmd: '!details',
    value: ':::details\n{$}\n:::',
  },
];

export { type Snippet, snippets };
