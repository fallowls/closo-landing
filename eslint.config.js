import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "uploads/**",
      "xtract/**",
      "client/public/xtract/**",
      "client/src/assets/xtract/**",
      "attached_assets/**",
      "reports/**",
      "migrations/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      complexity: ["warn", { max: 15 }],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      complexity: ["warn", { max: 15 }],
    },
  },
];
