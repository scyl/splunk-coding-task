import js from "@eslint/js";
import globals from "globals";
import parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    rules: {
      quotes: ["error", "double"],
    },
    env: { node: true },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      quotes: ["error", "double"],
      "jsx-quotes": ["error", "prefer-double"],
      semi: ["error", "always"],
      "react/react-in-jsx-scope": "off", // CRA doesn't need React in scope
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
