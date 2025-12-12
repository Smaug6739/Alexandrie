import { type KeyBinding } from '@codemirror/view';

export function createKeymaps(commands: { exec: (action: string) => void }) {
  const markdownKeysmap: readonly KeyBinding[] = [
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
      key: 'Mod-e',
      run: () => {
        commands.exec('image');
        return true;
      },
    },
    {
      key: 'Mod-l',
      run: () => {
        commands.exec('link');
        return true;
      },
    },
  ];

  return markdownKeysmap;
}
