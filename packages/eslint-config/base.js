/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
      }
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-var": "error",
      "prefer-const": "error"
    }
  }
];
