/** @type {import('eslint').Linter.Config[]} */
import base from "./base.js";

export default [
  ...base,
  {
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  }
];
