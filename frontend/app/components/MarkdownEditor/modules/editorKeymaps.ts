import type { KeyBinding } from '@codemirror/view';

export function createKeymaps(commands: { exec: (action: string, payload?: string) => void }) {
  const markdownKeysmap: readonly KeyBinding[] = [
    // Text formatting
    {
      key: 'Mod-b',
      run: () => {
        commands.exec('bold');
        return true;
      },
    },
    {
      key: 'Mod-i',
      run: () => {
        commands.exec('italic');
        return true;
      },
    },
    {
      key: 'Mod-u',
      run: () => {
        commands.exec('underline');
        return true;
      },
    },
    {
      key: 'Mod-Shift-s',
      run: () => {
        commands.exec('strike');
        return true;
      },
    },
    {
      key: 'Mod-Shift-h',
      run: () => {
        commands.exec('mark');
        return true;
      },
    },

    // Links and media
    {
      key: 'Mod-k',
      run: () => {
        commands.exec('link');
        return true;
      },
    },
    {
      key: 'Mod-Shift-i',
      run: () => {
        commands.exec('image');
        return true;
      },
    },

    // Code
    {
      key: 'Mod-e',
      run: () => {
        commands.exec('code');
        return true;
      },
    },
    {
      key: 'Mod-Shift-c',
      run: () => {
        commands.exec('codeBlock');
        return true;
      },
    },

    // Structure
    {
      key: 'Mod-Shift-.',
      run: () => {
        commands.exec('quote');
        return true;
      },
    },
    {
      key: 'Mod-Shift-7',
      run: () => {
        commands.exec('orderedList');
        return true;
      },
    },
    {
      key: 'Mod-Shift-8',
      run: () => {
        commands.exec('list');
        return true;
      },
    },
    {
      key: 'Mod-Shift-9',
      run: () => {
        commands.exec('taskList');
        return true;
      },
    },
    {
      key: 'Mod-Enter',
      run: () => {
        commands.exec('toggleCheckbox');
        return true;
      },
    },

    // Headers
    {
      key: 'Mod-1',
      run: () => {
        commands.exec('h1');
        return true;
      },
    },
    {
      key: 'Mod-2',
      run: () => {
        commands.exec('h2');
        return true;
      },
    },
    {
      key: 'Mod-3',
      run: () => {
        commands.exec('h3');
        return true;
      },
    },
    {
      key: 'Mod-4',
      run: () => {
        commands.exec('h4');
        return true;
      },
    },
    {
      key: 'Mod-5',
      run: () => {
        commands.exec('h5');
        return true;
      },
    },
    {
      key: 'Mod-6',
      run: () => {
        commands.exec('h6');
        return true;
      },
    },

    // Math
    {
      key: 'Mod-m',
      run: () => {
        commands.exec('mathInline');
        return true;
      },
    },
    {
      key: 'Mod-Shift-m',
      run: () => {
        commands.exec('mathBlock');
        return true;
      },
    },

    // Other
    {
      key: 'Mod-Shift-x',
      run: () => {
        commands.exec('clearFormatting');
        return true;
      },
    },
    {
      key: 'Mod-Shift-r',
      run: () => {
        commands.exec('horizontalRule');
        return true;
      },
    },
  ];

  return markdownKeysmap;
}
