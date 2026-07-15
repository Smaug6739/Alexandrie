import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const preferences = usePreferencesStore();

const makeSvgUrl = (svg: string) => 'url("data:image/svg+xml,' + svg + '")';

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
    borderRadius: '3px',
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
    padding: '6px 8px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
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
    orange = 'var(--orange)',
    teal = 'var(--teal)',
    blue = 'var(--blue)',
    purple = 'var(--purple)',
    pink = 'var(--pink)',
    green = 'var(--green)';
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
    diagnosticWarning = orange, // Warning color
    linkColor = blue, // Link color
    hoverHighlight = '#ECEFF180'; // Hover highlight
  // Diff/merge specific colors
  const addedBackground = '#e6ffed80', // Light green with transparency for insertions
    removedBackground = '#ffebe980', // Light red with transparency for deletions
    addedText = '#28a745', // Bright green for added text
    removedText = '#d73a49'; // Bright red for removed text
  /**
   * Enhanced editor theme styles for Material Light
   */
  const materialTheme = EditorView.theme(
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
        fontFamily: generalPanel.fontFamily,
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
        textTransform: 'capitalize',
      },
      '.cm-panel label': {
        fontSize: generalPanel.fontSize,
        color: base02,
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
        borderRadius: generalDiff.borderRadius,
      },
      'ins.cm-insertedLine, ins.cm-insertedLine:not(:has(.cm-changedText))': {
        textDecoration: generalDiff.insertedTextDecoration,
        backgroundColor: `${addedBackground} !important`,
        color: addedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadius,
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
        borderRadius: generalDiff.borderRadius,
      },
      'del.cm-deletedLine, del, del:not(:has(.cm-deletedText))': {
        textDecoration: generalDiff.deletedTextDecoration,
        backgroundColor: `${removedBackground} !important`,
        color: removedText,
        padding: generalDiff.insertedLinePadding,
        borderRadius: generalDiff.borderRadius,
        border: `1px solid ${removedText}30`,
      },
      'del .cm-deletedText, del .cm-changedText': {
        background: 'transparent !important',
      },
      // Tooltips and autocomplete
      '.cm-tooltip': {
        backgroundColor: 'var(--surface-base) !important',
        border: '1px solid var(--border) !important',
        borderRadius: '8px !important',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.05) !important',
        overflow: 'hidden !important',
        backdropFilter: 'blur(12px) !important',
        '-webkit-backdrop-filter': 'blur(12px) !important',
      },
      '.cm-tooltip-arrow': {
        display: 'none !important',
      },
      '.cm-tooltip-autocomplete': {
        padding: '5px !important',
        animation: 'cm-slide-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) !important',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif !important',
      },
      '.cm-tooltip-autocomplete::after': {
        content: '"↑↓ to navigate   ·   Enter to select"',
        display: 'block !important',
        padding: '6px 12px 4px !important',
        fontSize: '9px !important',
        fontWeight: '600 !important',
        color: 'var(--text-muted) !important',
        borderTop: '1px solid var(--border) !important',
        backgroundColor: 'color-mix(in srgb, var(--surface-base) 40%, transparent) !important',
        textAlign: 'center !important',
        textTransform: 'uppercase !important',
        letterSpacing: '0.8px !important',
        marginTop: '4px !important',
        opacity: '0.8 !important',
      },
      '.cm-tooltip-autocomplete > ul': {
        backgroundColor: 'transparent !important',
        border: 'none !important',
        maxHeight: '280px !important',
        padding: '0 !important',
        margin: '0 !important',
      },
      '.cm-tooltip-autocomplete > ul > li': {
        display: 'flex !important',
        alignItems: 'center !important',
        gap: '10px !important',
        padding: '4px 8px !important',
        lineHeight: '1.4 !important',
        borderRadius: '8px !important',
        margin: '2px 0 !important',
        cursor: 'pointer !important',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important',
        color: 'var(--text-body) !important',
        fontSize: '13px !important',
        border: 'none !important',
        borderLeft: '3px solid transparent !important',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif !important',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
        backgroundColor: 'var(--accent-bg) !important',
        color: 'var(--accent) !important',
        fontWeight: '500 !important',
        borderLeft: '3px solid var(--accent) !important',
        transform: 'translateX(2px) !important',
        paddingLeft: '11px !important',
      },
      '.cm-tooltip-autocomplete > ul > li:hover:not([aria-selected])': {
        backgroundColor: 'var(--surface-transparent) !important',
        color: 'var(--text-primary) !important',
        transform: 'translateX(1px) !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon': {
        display: 'inline-flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        width: '22px !important',
        height: '22px !important',
        borderRadius: '6px !important',
        fontSize: '0 !important',
        flexShrink: '0 !important',
        marginRight: '2px !important',
        padding: '0 !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon::before': {
        content: '""',
        display: 'block !important',
        width: '12px !important',
        height: '12px !important',
        backgroundColor: 'currentColor !important',
        '-webkit-mask-size': 'contain !important',
        '-webkit-mask-repeat': 'no-repeat !important',
        '-webkit-mask-position': 'center !important',
        maskSize: 'contain !important',
        maskRepeat: 'no-repeat !important',
        maskPosition: 'center !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-snippet': {
        backgroundColor: 'var(--purple-bg) !important',
        color: 'var(--purple) !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-snippet::before': {
        '-webkit-mask-image':
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='16 18 22 12 16 6'/%3E%3Cpolyline points='8 6 2 12 8 18'/%3E%3C/svg%3E",
          ) + ' !important',
        maskImage:
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='16 18 22 12 16 6'/%3E%3Cpolyline points='8 6 2 12 8 18'/%3E%3C/svg%3E",
          ) + ' !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-math': {
        backgroundColor: 'var(--orange-bg) !important',
        color: 'var(--orange) !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-math::before': {
        '-webkit-mask-image':
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16v3M4 4l8 8-8 8M4 20h16v-3'/%3E%3C/svg%3E",
          ) + ' !important',
        maskImage:
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16v3M4 4l8 8-8 8M4 20h16v-3'/%3E%3C/svg%3E",
          ) + ' !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-reference': {
        backgroundColor: 'var(--blue-bg) !important',
        color: 'var(--blue) !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionIcon-reference::before': {
        '-webkit-mask-image':
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3C/svg%3E",
          ) + ' !important',
        maskImage:
          makeSvgUrl(
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3C/svg%3E",
          ) + ' !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionLabel': {
        flex: '1 1 auto !important',
        fontWeight: '400 !important',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected] > span.cm-completionLabel': {
        fontWeight: '500 !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionMatched': {
        color: 'var(--accent) !important',
        fontWeight: '700 !important',
        textDecoration: 'none !important',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected] > span.cm-completionMatched': {
        color: 'inherit !important',
        fontWeight: '700 !important',
      },
      '.cm-tooltip-autocomplete > ul > li > span.cm-completionDetail': {
        marginLeft: 'auto !important',
        fontSize: '9px !important',
        fontWeight: '700 !important',
        textTransform: 'uppercase !important',
        letterSpacing: '0.6px !important',
        padding: '2px 6px !important',
        borderRadius: '5px !important',
        fontStyle: 'normal !important',
        border: '1px solid transparent !important',
        transition: 'all 0.12s ease !important',
        opacity: '0.9 !important',
      },
      '.cm-tooltip-autocomplete > ul > li:has(span.cm-completionIcon-snippet) > span.cm-completionDetail': {
        backgroundColor: 'var(--purple-bg) !important',
        color: 'var(--purple) !important',
      },
      '.cm-tooltip-autocomplete > ul > li:has(span.cm-completionIcon-math) > span.cm-completionDetail': {
        backgroundColor: 'var(--orange-bg) !important',
        color: 'var(--orange) !important',
      },
      '.cm-tooltip-autocomplete > ul > li:has(span.cm-completionIcon-reference) > span.cm-completionDetail': {
        backgroundColor: 'var(--blue-bg) !important',
        color: 'var(--blue) !important',
      },
      '.cm-tooltip-autocomplete > ul > li[aria-selected] > span.cm-completionDetail': {
        backgroundColor: 'var(--surface-base) !important',
        borderColor: 'var(--accent-border) !important',
        color: 'var(--accent) !important',
        opacity: '1 !important',
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

  const materialHighlightStyle = HighlightStyle.define([
    // Keywords and control flow
    { tag: tags.keyword, color: teal, fontWeight: 'bold' },
    { tag: tags.controlKeyword, color: teal, fontWeight: 'bold' },
    { tag: tags.moduleKeyword, color: teal, fontWeight: 'bold' },
    // Names and variables
    { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: base05 },
    { tag: [tags.variableName], color: base05 },
    { tag: [tags.propertyName], color: green, fontStyle: 'normal' },
    // Classes and types
    { tag: [tags.typeName], color: orange },
    { tag: [tags.className], color: orange, fontStyle: 'italic' },
    { tag: [tags.namespace], color: blue, fontStyle: 'italic' },
    // Operators and punctuation
    { tag: [tags.operator, tags.operatorKeyword], color: blue },
    { tag: [tags.bracket], color: purple },
    { tag: [tags.brace], color: purple },
    { tag: [tags.punctuation], color: base03 },
    // Functions and parameters
    { tag: [tags.function(tags.variableName)], color: base09 },
    { tag: [tags.labelName], color: blue, fontStyle: 'italic' },
    { tag: [tags.definition(tags.function(tags.variableName))], color: base09 },
    { tag: [tags.definition(tags.variableName)], color: base0A },
    // Constants and literals
    { tag: tags.number, color: orange },
    { tag: tags.changed, color: orange },
    { tag: tags.annotation, color: invalid, fontStyle: 'italic' },
    { tag: tags.modifier, color: orange, fontStyle: 'italic' },
    { tag: tags.self, color: orange },
    {
      tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
      color: orange,
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
    { tag: [tags.heading], fontWeight: 'bold', color: green },
    { tag: tags.heading1, color: blue, fontSize: '1.2em', fontWeight: 'bold' },
    { tag: tags.heading2, color: purple, fontSize: '1.1em', fontWeight: 'bold' },
    { tag: tags.heading3, color: teal, fontSize: '1em', fontWeight: 'bold' },
    { tag: tags.heading4, color: pink },
    { tag: tags.heading5, color: purple },
    { tag: tags.heading6, color: green },
    { tag: [tags.strong], fontWeight: 'bold', color: orange },
    { tag: [tags.emphasis], fontStyle: 'italic', color: pink },
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

  const material = [materialTheme, syntaxHighlighting(materialHighlightStyle)];
  return material;
}
export { loadTheme };
