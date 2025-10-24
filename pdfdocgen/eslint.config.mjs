// @ts-check

import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
        "@typescript-eslint/no-inferrable-types": "off"
    }
  },
  {
    ignores: ["dist/**/*", "build/**/*", "!build/index.js", "!dist/index.js"],
  }
]);