import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "output/**",
      "node_modules/**",
      ".playwright-mcp/**",
      "brandbook-assets/**",
      "docs/plans/**",
      "fix-mobile.js",
      "rewrite-button.js",
      "postcss.config.mjs",
    ],
  },
  {
    // Allow intentionally-unused args/vars when prefixed with "_".
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
