// eslint.config.js – ESLint v9 configuration (ESM)
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

import js from "@eslint/js";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["./tsconfig.json", "./artifacts/pkmp/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        window: true,
        document: true,
        setTimeout: true,
        clearTimeout: true,
      },
    },

    plugins: { "@typescript-eslint": tsPlugin },
    settings: {},
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  }
];
