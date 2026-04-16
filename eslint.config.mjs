// eslint.config.mjs
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals.js';

export default [
  {
    ignores: ['node_modules', '.next', 'out', 'build'],
  },
  nextCoreWebVitals,
  {
    rules: {
      // Tus reglas personalizadas aquí
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];