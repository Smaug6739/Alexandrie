import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Helper module for styling options
const generalContent = {
  fontSize: '14px',
  fontFamily: 'JetBrains Mono, Consolas, monospace',
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
  border: 'none',
  borderRadius: '4px',
  padding: '2px 10px',
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
const base00 = 'var(--bg-color)', // Background - pure white for clean look
  base01 = '', // Lighter background (popups, statuslines)
  base02 = 'var(--font-color)', // Main text - nearly black for contrast
  base03 = 'var(--font-color-light)', // Comments, invisibles - gray 600
  base04 = 'var(--border-color)', // Cursor and line numbers - gray 500
  base05 = '#424242', // Default foreground - gray 800
  base06 = '#eeeeee', // Light borders or divisions - gray 200
  base07 = 'var(--bg-color)', // Light background (gutter) - gray 50
  // Accent colors - using standard Material Design palette
  base08 = 'var(--red)', // Red 500
  base09 = '#ff3e00', // Deep Orange 500
  base0A = '#FF00E9FF', // Pink 500
  base0B = '#ffc107', // Amber 500 (better than yellow for light theme)
  base0C = 'var(--yellow)', // Orange 500
  base0D = 'var(--teal)', // Cyan 600 (better contrast for light theme)
  base0E = 'var(--blue)', // Indigo 600 (better contrast for light theme)
  base0F = 'var(--purple)', // Purple 600 (better contrast for light theme)
  base10 = 'var(--green)', // Green 600 (better contrast for light theme)
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
  activeBracketBorder = base0D, // Active bracket border
  diagnosticWarning = base0C, // Warning color
  linkColor = base0D, // Link color
  visitedLinkColor = base0F, // Visited link color
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
      outline: `1px solid ${base0B}`,
      color: base02,
      borderRadius: generalSearchField.borderRadius,
      '& span': {
        color: base02,
      },
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: base0D,
      color: background,
      padding: generalSearchField.padding,
      '& span': {
        color: background,
      },
    },
    '.cm-search.cm-panel.cm-textfield': {
      color: base02,
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
    },
    '.cm-panel button:hover': {
      backgroundColor: '#CFD8DC',
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
      boxShadow: `0 0 0 2px ${background}, 0 0 0 3px ${base0D}40`,
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
  { tag: tags.keyword, color: base0D, fontWeight: 'bold' },
  { tag: tags.controlKeyword, color: base0D, fontWeight: 'bold' },
  { tag: tags.moduleKeyword, color: base0D, fontWeight: 'bold' },
  // Names and variables
  { tag: [tags.name, tags.deleted, tags.character, tags.macroName], color: base05 },
  { tag: [tags.variableName], color: base05 },
  { tag: [tags.propertyName], color: base11, fontStyle: 'normal' },
  // Classes and types
  { tag: [tags.typeName], color: base0C },
  { tag: [tags.className], color: base0C, fontStyle: 'italic' },
  { tag: [tags.namespace], color: base0E, fontStyle: 'italic' },
  // Operators and punctuation
  { tag: [tags.operator, tags.operatorKeyword], color: base0E },
  { tag: [tags.bracket], color: base0F },
  { tag: [tags.brace], color: base0F },
  { tag: [tags.punctuation], color: base03 },
  // Functions and parameters
  { tag: [tags.function(tags.variableName)], color: base09 },
  { tag: [tags.labelName], color: base12, fontStyle: 'italic' },
  { tag: [tags.definition(tags.function(tags.variableName))], color: base09 },
  { tag: [tags.definition(tags.variableName)], color: base0A },
  // Constants and literals
  { tag: tags.number, color: base0C },
  { tag: tags.changed, color: base0C },
  { tag: tags.annotation, color: invalid, fontStyle: 'italic' },
  { tag: tags.modifier, color: base0C, fontStyle: 'italic' },
  { tag: tags.self, color: base0C },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: base0C,
  },
  { tag: [tags.atom, tags.bool], color: base0F },
  // Strings and regex
  { tag: [tags.processingInstruction, tags.inserted], color: base10 },
  { tag: tags.string, color: base10 },
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
  { tag: tags.heading2, color: base0C, fontSize: '1.1em', fontWeight: 'bold' },
  { tag: tags.heading3, color: base0D, fontSize: '1em', fontWeight: 'bold' },
  { tag: tags.heading4, color: base0E },
  { tag: tags.heading5, color: base0F },
  { tag: tags.heading6, color: base10 },
  { tag: [tags.strong], fontWeight: 'bold', color: base0E },
  { tag: [tags.emphasis], fontStyle: 'italic', color: base0C },
  // Links and URLs
  {
    tag: [tags.link],
    color: visitedLinkColor,
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
  { tag: tags.monospace, color: base02 },
  { tag: [tags.contentSeparator], color: base0D },
  { tag: tags.quote, color: base10 },
]);
/**
 * Combined Material Light theme extension
 */
const materialLight = [materialLightTheme, syntaxHighlighting(materialLightHighlightStyle)];

export { materialLight };
