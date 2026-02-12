import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactHooks.configs["recommended-latest"], reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module"
      }
    },
    plugins: {
      react,
      import: importPlugin,
      prettier
    },
    rules: {
      ...prettierConfig.rules,

      // Prettier
      "prettier/prettier": "warn",

      // General
      "no-console": ["warn", { allow: ["error", "warn", "info"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "prefer-const": "warn",
      "no-var": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-trailing-spaces": "warn",
      "brace-style": ["warn", "1tbs", { allowSingleLine: true }],
      curly: "warn",
      eqeqeq: ["warn", "always"],
      semi: ["warn", "always"],
      quotes: ["warn", "double", { avoidEscape: true }],

      // React
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-key": "warn",
      "react/no-unescaped-entities": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],

      // Import
      "import/no-duplicates": "warn",
      "import/no-unresolved": "off",
      "import/newline-after-import": "warn",
      "import/no-named-as-default": "warn",
      "import/no-named-as-default-member": "off"
    }
  }
]);
