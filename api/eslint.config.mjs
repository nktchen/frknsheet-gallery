import globals from "globals";

/** @type {import('eslint').Linter.Config} */
export default {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: globals.node,
  extends: ["eslint:recommended", "plugin:@eslint/js/recommended", "prettier"],
  overrides: [
    {
      files: ["**/*.js"],
      languageOptions: {
        sourceType: "commonjs",
      },
    },
  ],
  rules: {
    // ваши правила
  },
};
