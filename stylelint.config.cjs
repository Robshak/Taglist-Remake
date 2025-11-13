/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
  ],

  plugins: [
    'stylelint-scss',
    'stylelint-order',
    '@stylistic/stylelint-plugin',
  ],

  rules: {
    /* --- stylistic --- */
    '@stylistic/string-quotes': 'double',
    '@stylistic/color-hex-case': 'lower',
    '@stylistic/unit-case': 'lower',
    'value-keyword-case': ['lower', { ignoreKeywords: ['currentColor'] }],

    /* --- базовая чистота --- */
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] },
    ],
    'declaration-block-no-redundant-longhand-properties': true,
    'alpha-value-notation': 'percentage',
    'color-hex-length': 'short',
    'no-descending-specificity': null,
    '@stylistic/no-empty-first-line': true,
    '@stylistic/no-missing-end-of-source-newline': true,
    '@stylistic/block-closing-brace-empty-line-before': 'never',

    /* --- SCSS best practices --- */
    'scss/at-rule-no-unknown': true,
    'scss/dollar-variable-pattern': '^[_a-z][a-z0-9-]*$',
    // разрешаем импорт партиалов с ведущим подчёркиванием: _vars.scss и т.п.
    'scss/load-no-partial-leading-underscore': null,
    'scss/no-global-function-names': true,
    'scss/selector-no-redundant-nesting-selector': true,

    /* --- селекторы --- */
    // Разрешаем ИЛИ camelCase ИЛИ BEM
    'selector-class-pattern': [
      '^(?:[a-z][a-zA-Z0-9]*|[a-z](?:[a-z0-9-]*)(?:__(?:[a-z0-9-]+))?(?:--[a-z0-9-]+)?)$',
      { resolveNestedSelectors: true, message: 'Используй camelCase (CSS Modules) или BEM: block__elem--mod' },
    ],
    'selector-max-id': 0,
    'selector-max-universal': 1,

    /* --- порядок блоков --- */
    'order/order': [
      'dollar-variables',
      'custom-properties',
      { type: 'at-rule', name: 'include', hasBlock: false },
      'declarations',
      'rules',
      { type: 'at-rule', name: 'include', hasBlock: true },
    ],

    /* --- порядок свойств --- */
    'order/properties-order': [
      'position','inset','top','right','bottom','left','z-index',
      'display','visibility','overflow','overflow-x','overflow-y','box-sizing','float','clear',
      'width','min-width','max-width','height','min-height','max-height','aspect-ratio',
      'margin','margin-top','margin-right','margin-bottom','margin-left',
      'padding','padding-top','padding-right','padding-bottom','padding-left',
      'object-fit','object-position',
      'flex','flex-grow','flex-shrink','flex-basis','flex-flow','flex-direction','flex-wrap',
      'justify-content','justify-items','justify-self',
      'align-content','align-items','align-self',
      'order',
      'grid','grid-template','grid-template-rows','grid-template-columns',
      'grid-row','grid-row-start','grid-row-end','grid-column','grid-column-start','grid-column-end',
      'grid-auto-flow','grid-auto-rows','grid-auto-columns','gap','row-gap','column-gap',
      'place-content','place-items','place-self',
      'font','font-family','font-size','font-weight','font-style','font-variant',
      'font-feature-settings','line-height','letter-spacing','word-spacing',
      'text-align','text-justify','text-transform','text-decoration',
      'text-indent','text-overflow','white-space','vertical-align',
      'color',
      'background','background-color','background-image','background-position','background-size',
      'background-repeat','background-origin','background-clip',
      'border','border-width','border-style','border-color',
      'border-top','border-right','border-bottom','border-left','border-radius',
      'outline','outline-offset','box-shadow','opacity','mix-blend-mode','filter',
      'transition','transition-property','transition-duration','transition-timing-function','transition-delay',
      'animation','animation-name','animation-duration','animation-timing-function','animation-delay',
      'animation-iteration-count','animation-direction','animation-fill-mode','animation-play-state',
      'will-change',
      'cursor','pointer-events','user-select',
    ],

    'declaration-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'after-declaration', 'inside-single-line-block'],
      },
    ],

    /* --- анимации: разрешаем camelCase имена кейфреймов --- */
    'keyframes-name-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Используй camelCase для @keyframes (например, fadeIn, eqPulse)' },
    ],
  },

  ignoreFiles: [
    '**/*.min.css',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/out/**',
    '**/coverage/**',
    '**/node_modules/**',
  ],

  overrides: [
    // Глобальные стили: не ругаться на #root и прочие id-селектора
    {
      files: ['**/globals.scss', 'src/styles/globals.scss', 'src/shared/styles/globals.scss'],
      rules: {
        'selector-max-id': null,
      },
    },
    // CSS Modules: требуем строго camelCase классы и keyframes
    {
      files: ['**/*.module.scss'],
      rules: {
        'selector-class-pattern': [
          '^[a-z][a-zA-Z0-9]*$',
          { resolveNestedSelectors: true, message: 'CSS Modules: используй camelCase для классов' },
        ],
        'keyframes-name-pattern': [
          '^[a-z][a-zA-Z0-9]*$',
          { message: 'CSS Modules: используй camelCase для @keyframes' },
        ],
      },
    },
    // Общий синтаксис для scss/sass/css
    {
      files: ['**/*.{scss,sass,css}'],
      customSyntax: 'postcss-scss',
    },
  ],
};
