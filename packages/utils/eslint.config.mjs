import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

import createConfig from "@repo/eslint-config/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const files = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"];

export default createConfig({ files });
