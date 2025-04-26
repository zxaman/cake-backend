import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  prettierPluginRecommended,
  {
    files: [".eslintrc.{js,cjs}"],
    languageOptions: {
      sourceType: "script",
    },
    env: {
      node: true,
    },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      eqeqeq: ["error", "always"],
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ["error", "always"],
      indent: ["error", 2],
    },
  },
];
