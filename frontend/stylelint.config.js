export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  plugins: ['stylelint-order'],
  overrides: [
    // .vue => parser HTML
    { files: ['**/*.vue'], customSyntax: 'postcss-html' },
    // .scss => parser SCSS
    { files: ['**/*.scss'], customSyntax: 'postcss-scss' },
  ],
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.json', '**/*.md', 'node_modules/**/*', 'dist/**/*'],
  rules: {
    // Exemple d'ordre basé sur le box model
    'order/properties-order': [
      [
        // Positionnement
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',

        // Box Model
        'display',
        'float',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'box-sizing',
        'margin',
        'padding',
        'border',
        'border-width',
        'border-style',
        'border-color',
        'border-radius',

        // Typographie
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'color',
        'text-align',

        // Background & effets
        'background',
        'background-color',
        'background-image',
        'background-size',
        'background-position',
        'box-shadow',
        'opacity',
        'transition',
      ],
      { unspecified: 'bottomAlphabetical' },
    ],

    // Bonnes pratiques générales
    'block-no-empty': true,
    'color-hex-length': 'short',
    'declaration-block-no-duplicate-properties': true,
    'no-empty-source': null,
    'no-descending-specificity': null,
    'declaration-property-value-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-no-unknown': null,
  },
};
