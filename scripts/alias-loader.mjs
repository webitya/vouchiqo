/**
 * ESM loader hook — resolves @/ path aliases to absolute file paths.
 * Loaded by alias-register.mjs via node:module register().
 */
export async function initialize({ rootUrl }) {
  // Store rootUrl so resolve() can use it
  globalThis.__aliasRootUrl = rootUrl;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rootUrl = globalThis.__aliasRootUrl;
    const rel = specifier.slice(2); // strip "@/"
    // Append .js if no file extension present
    const withExt =
      rel.endsWith(".js") ||
      rel.endsWith(".mjs") ||
      rel.endsWith(".cjs") ||
      rel.endsWith(".json")
        ? rel
        : rel + ".js";
    const resolved = new URL(withExt, rootUrl).href;
    return nextResolve(resolved, context);
  }
  return nextResolve(specifier, context);
}
