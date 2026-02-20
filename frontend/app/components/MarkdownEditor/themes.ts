import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const preferences = usePreferencesStore();
// Helper module for styling options

function loadTheme() {
  const generalContent = {
    fontSize: (preferences.get('editorFontSize').value || 14) + 'px',
    fontFamily: preferences.get('editorFontFamily').value + ', JetBrains Mono, Consolas, monospace',
    lineHeight: '1.6',
  };
  const generalCursor = {
    borderLeftWidth: '2px',
  };
  const generalDiff = {
    insertedTextDecoration: 'none',
    deletedTextDecoration: 'line-through',
    insertedLinePadding: '1px 3px',
    borderRadious: '3px',
  };
  const generalGutter = {
    border: 'none',
    paddingRight: '8px',
    fontSize: '0.9em',
    fontWeight: '500',
  };
  const generalPanel = {
    border: '1px solid var(--primary)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '13px',
  };
  const generalLine = {
    borderRadius: '2px',
  };
  const generalMatching = {
    borderRadius: '2px',
  };
  const generalPlaceholder = {
    borderRadius: '4px',
    padding: '0 5px',
    margin: '0 2px',
  };
  const generalScroller = {
    width: '8px',
    height: '12px',
    borderRadius: '6px',
  };
  const generalSearchField = {
    borderRadius: '4px',
    padding: '2px 6px',
  };
  const generalTooltip = {
    borderRadius: '4px',
    borderRadiusSelected: '3px',
    lineHeight: '1.3',
    padding: '4px 8px',
    paddingRight: '8px',
  };

  // Base colors
  const base00 = 'var(--surface-base)',
    base01 = 'var(--surface-overlay)',
    base02 = 'var(--text-body)',
    base03 = 'var(--text-secondary)',
    base04 = 'var(--border)',
    base05 = '#424242',
    base06 = '#eeeeee',
    base07 = 'var(--surface-base)',
    // Accent colors - using standard Material Design palette
    base08 = 'var(--red)',
    base09 = '#ff3e00',
    base0A = '#FF00E9FF',
    yellowWhite = '#ffc107',
    yellow = 'var(--orange)',
    teal = 'var(--teal)',
    blue = 'var(--blue)',
    purple = 'var(--purple)',
    green = 'var(--green)',
    base11 = '#00897b', // Teal 600 (better contrast for light theme)
    base12 = '#1e88e5'; // Blue 600 (better contrast for light theme)
  // UI specific colors
  const invalid = base08,
    highlightBackground = '#00000008', // Line highlight
    background = base00,
    tooltipBackground = base01,
    selection = '#DDEEFF', // Selection background
    selectionMatch = '#90a4ae26', // Selection match background
    cursor = base04, // Cursor color
    activeBracketBg = '#DDEEFF80', // Active bracket background
    activeBracketBorder = teal, // Active bracket border
    diagnosticWarning = yellow, // Warning color
    linkColor = base12, // Link color
    hoverHighlight = '#ECEFF180'; // Hover highlight
  // Diff/merge specific colors
  const addedBackground = '#e6ffed80', // Light green with transparency for insertions
    removedBackground = '#ffebe980', // Light red with transparency for deletions
    addedText = '#28a745', // Bright green for added text
    removedText = '#d73a49'; // Bright red for removed text
  /**
   * Enhanced editor theme styles for Material Light
   */
  const materialLightTheme = EditorView.theme(
    {
      // Base editor styles
      '&': {
        color: base02,
        backgroundColor: background,
        fontSize: generalContent.fontSize,
        fontFamily: generalContent.fontFamily,
      },
      '.cm-button': {
        backgroundColor: tooltipBackground,
        backgroundImage: 'none',
        color: base02,
        border: generalPanel.border,
        fontSize: '80%',
        borderRadius: generalPanel.borderRadius,
        padding: '8px',
        cursor: 'pointer',
      },

      '.cm-scroller, .c1': {
        fontFamily: generalContent.fontFamily,
      },
      // Content and cursor
      '.cm-content': {
        caretColor: cursor,
        lineHeight: generalContent.lineHeight,
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: cursor,
        borderLeftWidth: generalCursor.borderLeftWidth,
      },
      '.cm-fat-cursor': {
        backgroundColor: `${base02}99`,
        color: background,
      },
      // Selection
      '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: selection,
      },
      // Make sure selection appears above active line
      '.cm-selectionLayer': {
        zIndex: 100,
      },
      // Search functionality
      '.cm-searchMatch': {
        backgroundColor: '#FFA72680',
        outline: `1px solid ${yellowWhite}`,
        color: base02,
        borderRadius: generalSearchField.borderRadius,
        '& span': {
          color: base02,
        },
      },
      '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: teal,
        color: background,
        padding: generalSearchField.padding,
        '& span': {
          color: background,
        },
      },
      '.cm-search': {
        backgroundColor: 'var(--surface-raised)',
      },
      '.cm-search input': {
        padding: '6px 8px',
        width: 'calc(100% - 16px)',
        fontSize: '14px',
      },
      '.cm-search label input': {
        width: 'fit-content',
      },
      '.cm-search label': {
        display: 'flex',
        alignItems: 'center',
      },
      '.cm-textfield': {
        color: base02,
        backgroundColor: 'var(--surface-raised)',
        borderRadius: generalSearchField.borderRadius,
        padding: generalSearchField.padding,
      },
      // Panels
      '.cm-panels': {
        backgroundColor: base06,
        color: base02,
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      '.cm-panels.cm-panels-top': {
        borderBottom: `1px solid ${base04}`,
      },
      '.cm-panels.cm-panels-bottom': {
        borderTop: `1px solid ${base04}`,
      },
      '.cm-panel button': {
        backgroundColor: tooltipBackground,
        color: base02,
        border: generalPanel.border,
        borderRadius: generalPanel.borderRadius,
        padding: generalPanel.padding,
        fontSize: generalPanel.fontSize,
        cursor: 'pointer',
      },
      '.cm-panel button:hover': {
        backgroundColor: hoverHighlight,
      },
      '.cm-panel.cm-search [name=close]': {
        fontSize: '25px',
      },
      // Line highlighting
      '.cm-activeLine': {
        backgroundColor: highlightBackground,
        borderRadius: generalLine.borderRadius,
        zIndex: 1,
      },
      // Gutters
      '.cm-gutters': {
        backgroundColor: base07,
        color: base03,
        border: generalGutter.border,
        borderRight: `1px solid ${base04}`,
        paddingRight: generalGutter.paddingRight,
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#E0E0E0',
        color: base02,
        fontWeight: generalGutter.fontWeight,
      },
      '.cm-lineNumbers': {
        fontSize: generalGutter.fontSize,
      },
      '.cm-foldGutter': {
        fontSize: generalGutter.fontSize,
      },
      '.cm-foldGutter .cm-gutterElement': {
        color: base03,
        cursor: 'pointer',
        transition: 'color 0.15s ease',
      },
      '.cm-foldGutter .cm-gutterElement:hover': {
        color: base02,
      },
      // Diff/Merge View Styles
      // Inserted/Added Content
      '.cm-insertedLine': {
        textDecoration: generalDiff.insertedTextDecoration,
        backgroundColor: addedBackground,
        color: addedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadious,
      },
      'ins.cm-insertedLine, ins.cm-insertedLine:not(:has(.cm-changedText))': {
        textDecoration: generalDiff.insertedTextDecoration,
        backgroundColor: `${addedBackground} !important`,
        color: addedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadious,
        border: `1px solid ${addedText}30`,
      },
      'ins.cm-insertedLine .cm-changedText': {
        background: 'transparent !important',
      },
      // Deleted/Removed Content
      '.cm-deletedLine': {
        textDecoration: generalDiff.deletedTextDecoration,
        backgroundColor: removedBackground,
        color: removedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadious,
      },
      'del.cm-deletedLine, del, del:not(:has(.cm-deletedText))': {
        textDecoration: generalDiff.deletedTextDecoration,
        backgroundColor: `${removedBackground} !important`,
        color: removedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadious,
        border: `1px solid ${removedText}30`,
      },
      'del .cm-deletedText, del .cm-changedText': {
        background: 'transparent !important',
      },
      // Tooltips and autocomplete
      '.cm-tooltip': {
        backgroundColor: tooltipBackground,
        border: `1px solid ${base04}`,
        borderRadius: generalTooltip.borderRadius,
        padding: generalTooltip.padding,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      '.cm-tooltip-autocomplete': {
        '& > ul': {
          backgroundColor: tooltipBackground,
          border: 'none',
        },
        '& > ul > li': {
          padding: generalTooltip.padding,
          lineHeight: generalTooltip.lineHeight,
        },
        '& > ul > li[aria-selected]': {
          backgroundColor: hoverHighlight,
          color: base02,
          borderRadius: generalTooltip.borderRadiusSelected,
        },
        '& > ul > li:hover': {
          backgroundColor: hoverHighlight,
        },
        '& > ul > li > span.cm-completionIcon': {
          color: base03,
          paddingRight: generalTooltip.paddingRight,
        },
        '& > ul > li > span.cm-completionDetail': {
          color: base03,
          fontStyle: 'italic',
        },
      },
      '.cm-tooltip .cm-tooltip-arrow:before': {
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      },
      '.cm-tooltip .cm-tooltip-arrow:after': {
        borderTopColor: tooltipBackground,
        borderBottomColor: tooltipBackground,
      },
      // Diagnostics styling
      '.cm-diagnostic': {
        '&-error': {
          borderLeft: `3px solid ${invalid}`,
        },
        '&-warning': {
          borderLeft: `3px solid ${diagnosticWarning}`,
        },
        '&-info': {
          borderLeft: `3px solid ${linkColor}`,
        },
      },
      '.cm-lintPoint-error': {
        borderBottom: `2px wavy ${invalid}`,
      },
      '.cm-lintPoint-warning': {
        borderBottom: `2px wavy ${diagnosticWarning}`,
      },
      // Matching brackets
      '.cm-matchingBracket': {
        backgroundColor: activeBracketBg,
        outline: `1px solid ${activeBracketBorder}`,
        borderRadius: generalMatching.borderRadius,
      },
      '.cm-nonmatchingBracket': {
        backgroundColor: `${invalid}20`,
        outline: `1px solid ${invalid}`,
        borderRadius: generalMatching.borderRadius,
      },
      // Selection matches
      '.cm-selectionMatch': {
        backgroundColor: selectionMatch,
        outline: `1px solid ${base03}30`,
        borderRadius: generalMatching.borderRadius,
      },
      // Fold placeholder
      '.cm-foldPlaceholder': {
        backgroundColor: base01,
        color: base03,
        border: `1px dotted ${base03}70`,
        borderRadius: generalPlaceholder.borderRadius,
        padding: generalPlaceholder.padding,
        margin: generalPlaceholder.margin,
      },
      // Focus outline
      '&.cm-focused': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${background}, 0 0 0 3px ${teal}40`,
      },
      // Scrollbars
      '& .cm-scroller::-webkit-scrollbar': {
        width: generalScroller.width,
        height: generalScroller.height,
      },
      '& .cm-scroller::-webkit-scrollbar-track': {
        background: base07,
      },
      '& .cm-scroller::-webkit-scrollbar-thumb': {
        backgroundColor: base04,
        borderRadius: generalScroller.borderRadius,
        border: `3px solid ${base07}`,
      },
      '& .cm-scroller::-webkit-scrollbar-thumb:hover': {
        backgroundColor: base02,
      },
      // Ghost text
      '.cm-ghostText': {
        opacity: '0.5',
        color: base03,
      },
    },
    { dark: false },
  );

  const materialLightHighlightStyle = HighlightStyle.define([
    // Keywords and control flow
    { tag: tags.keyword, color: teal, fontWeight: 'bold' },
    { tag: tags.controlKeyword, color: teal, fontWeight: 'bold' },
    { tag: tags.moduleKeyword, color: teal, fontWeight: 'bold' },
    // Names and variables
    { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: base05 },
    { tag: [tags.variableName], color: base05 },
    { tag: [tags.propertyName], color: base11, fontStyle: 'normal' },
    // Classes and types
    { tag: [tags.typeName], color: yellow },
    { tag: [tags.className], color: yellow, fontStyle: 'italic' },
    { tag: [tags.namespace], color: blue, fontStyle: 'italic' },
    // Operators and punctuation
    { tag: [tags.operator, tags.operatorKeyword], color: blue },
    { tag: [tags.bracket], color: purple },
    { tag: [tags.brace], color: purple },
    { tag: [tags.punctuation], color: base03 },
    // Functions and parameters
    { tag: [tags.function(tags.variableName)], color: base09 },
    { tag: [tags.labelName], color: base12, fontStyle: 'italic' },
    { tag: [tags.definition(tags.function(tags.variableName))], color: base09 },
    { tag: [tags.definition(tags.variableName)], color: base0A },
    // Constants and literals
    { tag: tags.number, color: yellow },
    { tag: tags.changed, color: yellow },
    { tag: tags.annotation, color: invalid, fontStyle: 'italic' },
    { tag: tags.modifier, color: yellow, fontStyle: 'italic' },
    { tag: tags.self, color: yellow },
    {
      tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
      color: yellow,
    },
    { tag: [tags.atom, tags.bool], color: purple },
    // Strings and regex
    { tag: [tags.processingInstruction, tags.inserted], color: green },
    { tag: tags.string, color: green },
    { tag: [tags.special(tags.string), tags.regexp], color: base0A },
    // Punctuation and structure
    { tag: tags.definition(tags.typeName), color: base0A, fontWeight: 'bold' },
    { tag: [tags.definition(tags.name), tags.separator], color: base0A },
    // Comments and documentation
    { tag: tags.meta, color: base03 },
    { tag: tags.comment, fontStyle: 'italic', color: base03 },
    { tag: tags.docComment, fontStyle: 'italic', color: base03 },
    // HTML/XML elements
    { tag: [tags.tagName], color: base09 },
    { tag: [tags.attributeName], color: base05 },
    // Markdown and text formatting
    { tag: [tags.heading], fontWeight: 'bold', color: base11 },
    { tag: tags.heading1, color: base12, fontSize: '1.2em', fontWeight: 'bold' },
    { tag: tags.heading2, color: purple, fontSize: '1.1em', fontWeight: 'bold' },
    { tag: tags.heading3, color: teal, fontSize: '1em', fontWeight: 'bold' },
    { tag: tags.heading4, color: yellow },
    { tag: tags.heading5, color: purple },
    { tag: tags.heading6, color: green },
    { tag: [tags.strong], fontWeight: 'bold', color: purple },
    { tag: [tags.emphasis], fontStyle: 'italic', color: yellow },
    // Links and URLs
    {
      tag: [tags.link],
      color: linkColor,
      fontWeight: '500',
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
    },
    {
      tag: [tags.url],
      color: linkColor,
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
    // Special states
    {
      tag: [tags.invalid],
      color: base02,
      textDecoration: 'underline wavy',
      borderBottom: `1px dotted ${base08}`,
    },
    { tag: [tags.strikethrough], color: invalid, textDecoration: 'line-through' },
    // Enhanced syntax highlighting
    { tag: tags.constant(tags.name), color: base09 },
    { tag: tags.deleted, color: invalid },
    { tag: tags.squareBracket, color: base08 },
    { tag: tags.angleBracket, color: base02 },
    // Additional specific styles
    { tag: [tags.contentSeparator], color: teal },
    { tag: tags.quote, color: green },
  ]);
  /**
   * Combined Material Light theme extension
   */
  const materialLight = [materialLightTheme, syntaxHighlighting(materialLightHighlightStyle)];
  return materialLight;
}
export { loadTheme };
