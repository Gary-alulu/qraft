import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", "node_modules/**", ".vercel/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Catch Temporal-Dead-Zone bugs like using a const/let in a useCallback
      // before its declaration in the same scope (crashes at runtime).
      "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
    },
  },
];

export default eslintConfig;