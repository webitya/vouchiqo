/**
 * ESM path alias resolver for Node.js scripts.
 * Translates `@/foo/bar` → `<projectRoot>/foo/bar.js`
 *
 * Usage: node --import ./scripts/alias-register.mjs scripts/seed.mjs
 */
import { register } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve as resolvePath } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = resolvePath(__filename, "../../");
const loaderUrl = pathToFileURL(resolvePath(projectRoot, "scripts", "alias-loader.mjs")).href;

register(loaderUrl, { parentURL: import.meta.url, data: { rootUrl: pathToFileURL(projectRoot + "/").href } });
