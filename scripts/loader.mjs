import { existsSync, lstatSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

const BASE_DIR = process.cwd();

export async function resolve(specifier, context, defaultResolve) {
  let target = specifier;

  if (specifier.startsWith("@/")) {
    const relativePath = specifier.slice(2);
    target = join(BASE_DIR, relativePath);
  } else if (specifier.startsWith(".") && context.parentURL) {
    const parentPath = new URL(context.parentURL).pathname;
    const cleanParentPath =
      process.platform === "win32" && parentPath.startsWith("/")
        ? parentPath.slice(1)
        : parentPath;

    // Decode URI component because parentURL contains percent encoded chars like %28 etc.
    const decodedParentPath = decodeURIComponent(cleanParentPath);
    target = join(decodedParentPath, "..", specifier);
  }

  // If it's an absolute path, resolve extensions
  if (
    target.startsWith("/") ||
    (process.platform === "win32" && /^[a-zA-Z]:/.test(target))
  ) {
    let resolvedPath = target;
    const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".json"];

    if (existsSync(target)) {
      if (lstatSync(target).isDirectory()) {
        for (const ext of extensions) {
          const indexFile = join(target, `index${ext}`);
          if (existsSync(indexFile)) {
            resolvedPath = indexFile;
            break;
          }
        }
      }
    } else {
      for (const ext of extensions) {
        if (existsSync(target + ext)) {
          resolvedPath = target + ext;
          break;
        }
      }
    }

    const fileUrl = pathToFileURL(resolvedPath).href;
    return defaultResolve(fileUrl, context);
  }

  return defaultResolve(specifier, context);
}
