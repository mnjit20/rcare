/** @type {import('eslint').Linter.Config[]} */
import base from "./base.js";

export default [
  ...base,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-types": "warn",
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
];
