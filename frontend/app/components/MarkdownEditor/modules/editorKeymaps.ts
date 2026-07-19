import type { KeyBinding } from '@codemirror/view';

export function createKeymaps(commands: { exec: (action: string, payload?: string) => void }) {
  const markdownKeysmap: readonly KeyBinding[] = [
    // Text formatting
    {
      key: 'Mod-b',
      stopPropagation: true,
      run: () => {
        commands.exec('bold');
        return true;
      },
    },
    {
      key: 'Mod-i',
      stopPropagation: true,
      run: () => {
        commands.exec('italic');
        return true;
      },
    },
    {
      key: 'Mod-u',
      stopPropagation: true,
      run: () => {
        commands.exec('underline');
        return true;
      },
    },
    {
      key: 'Mod-Shift-s',
      stopPropagation: true,
      run: () => {
        commands.exec('strike');
        return true;
      },
    },
    {
      key: 'Mod-Shift-h',
      stopPropagation: true,
      run: () => {
        commands.exec('mark');
        return true;
      },
    },
    // Maths
    {
      key: 'Mod-ArrowUp',
      stopPropagation: true,
      run: () => {
        commands.exec('superscript');
        return true;
      },
    },
    {
      key: 'Mod-ArrowDown',
      stopPropagation: true,
      run: () => {
        commands.exec('subscript');
        return true;
      },
    },
    {
      key: 'Mod-m',
      stopPropagation: true,
      run: () => {
        commands.exec('mathInline');
        return true;
      },
    },
    // Links and media
    {
      key: 'Mod-k',
      stopPropagation: true,
      run: () => {
        commands.exec('link');
        return true;
      },
    },
    {
      key: 'Mod-Shift-i',
      stopPropagation: true,
      run: () => {
        commands.exec('image');
        return true;
      },
    },
    {
      key: 'Mod-Shift-d',
      stopPropagation: true,
      run: () => {
        commands.exec('diagram');
        return true;
      },
    },
    {
      key: 'Mod-Shift-o',
      stopPropagation: true,
      run: () => {
        commands.exec('openColorPicker');
        return true;
      },
    },
    {
      key: 'Mod-Shift-f',
      stopPropagation: true,
      run: () => {
        commands.exec('footnote');
        return true;
      },
    },

    // Code
    {
      key: 'Mod-e',
      stopPropagation: true,
      run: () => {
        commands.exec('code');
        return true;
      },
    },
    {
      key: 'Mod-Shift-c',
      stopPropagation: true,
      run: () => {
        commands.exec('codeBlock');
        return true;
      },
    },

    // Structure
    {
      key: 'Mod-Shift-.',
      stopPropagation: true,
      run: () => {
        commands.exec('quote');
        return true;
      },
    },
    {
      key: 'Mod-Shift-7',
      stopPropagation: true,
      run: () => {
        commands.exec('orderedList');
        return true;
      },
    },
    {
      key: 'Mod-Shift-8',
      stopPropagation: true,
      run: () => {
        commands.exec('list');
        return true;
      },
    },
    {
      key: 'Mod-Shift-9',
      stopPropagation: true,
      run: () => {
        commands.exec('taskList');
        return true;
      },
    },
    {
      key: 'Mod-Enter',
      stopPropagation: true,
      run: () => {
        commands.exec('toggleCheckbox');
        return true;
      },
    },
    // Mod-Alt rather than Mod-Shift: Ctrl+Shift+T is the browser's reserved
    // "reopen closed tab" shortcut, which pages cannot intercept.
    {
      key: 'Mod-Alt-t',
      stopPropagation: true,
      run: () => {
        commands.exec('gridOrganization');
        return true;
      },
    },

    // Headers
    {
      key: 'Mod-1',
      stopPropagation: true,
      run: () => {
        commands.exec('h1');
        return true;
      },
    },
    {
      key: 'Mod-2',
      stopPropagation: true,
      run: () => {
        commands.exec('h2');
        return true;
      },
    },
    {
      key: 'Mod-3',
      stopPropagation: true,
      run: () => {
        commands.exec('h3');
        return true;
      },
    },
    {
      key: 'Mod-4',
      stopPropagation: true,
      run: () => {
        commands.exec('h4');
        return true;
      },
    },
    {
      key: 'Mod-5',
      stopPropagation: true,
      run: () => {
        commands.exec('h5');
        return true;
      },
    },
    {
      key: 'Mod-6',
      stopPropagation: true,
      run: () => {
        commands.exec('h6');
        return true;
      },
    },

    {
      key: 'Mod-Shift-m',
      stopPropagation: true,
      run: () => {
        commands.exec('mathBlock');
        return true;
      },
    },

    // Other
    {
      key: 'Mod-Shift-x',
      stopPropagation: true,
      run: () => {
        commands.exec('clearFormatting');
        return true;
      },
    },
    {
      key: 'Mod-Shift-r',
      stopPropagation: true,
      run: () => {
        commands.exec('horizontalRule');
        return true;
      },
    },

    // Layout-independent fallback for the Mod-Shift-digit list shortcuts (#610): with Shift held,
    // the digit row produces a different character on many layouts ('&' on QWERTY, '/' on QWERTZ…)
    // and some browser/layout combos report keyCodes that CodeMirror can't map back to the digit,
    // so the name-based bindings above never match. Matching the PHYSICAL key (event.code) works
    // on every layout; it only runs when no named binding handled the event, so there's no double
    // dispatch. Returning true makes CodeMirror preventDefault, which also stops the browser's own
    // Ctrl+digit fallbacks (tab switching) on layouts where digits are shifted.
    {
      any: (_view, event) => {
        if (!(event.ctrlKey || event.metaKey) || !event.shiftKey || event.altKey) return false;
        // The numeric keypad reports its own codes, so it needs listing alongside the digit row.
        const digitActions: Record<string, string> = {
          Digit7: 'orderedList',
          Numpad7: 'orderedList',
          Digit8: 'list',
          Numpad8: 'list',
          Digit9: 'taskList',
          Numpad9: 'taskList',
        };
        const action = digitActions[event.code];
        if (!action) return false;
        commands.exec(action);
        return true;
      },
      stopPropagation: true,
    },
  ];

  return markdownKeysmap;
}
