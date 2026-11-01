import { readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { FileNotFoundError } from "./errors.ts";

export function getFilesWithExtensions(
  targetDir: string,
  extensions: string[],
): string[] {
  const normalizedExtensions = extensions.map(
    (ext: string) => `.${ext.toLowerCase()}`,
  );

  const files = readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((file) =>
      normalizedExtensions.includes(extname(file).toLowerCase()),
    );

  if (files.length === 0) {
    throw new FileNotFoundError(
      `指定されたディレクトリには ${extensions.join(
        ", ",
      )} ファイルが見つかりません。`,
    );
  }

  return files;
}

interface FileInfo {
  fileName: string;
  directory: string;
}

function scanDirectoryRecursive(
  targetDir: string,
  extensions: string[],
  results: FileInfo[] = [],
): FileInfo[] {
  const normalizedExtensions = extensions.map(
    (ext: string) => `.${ext.toLowerCase()}`,
  );

  for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
    const fullPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      scanDirectoryRecursive(fullPath, extensions, results);
    } else if (entry.isFile()) {
      if (normalizedExtensions.includes(extname(entry.name).toLowerCase())) {
        results.push({
          fileName: entry.name,
          directory: targetDir,
        });
      }
    }
  }

  return results;
}

export function getFilesWithExtensionsRecursive(
  targetDir: string,
  extensions: string[],
): FileInfo[] {
  const files = scanDirectoryRecursive(targetDir, extensions);

  if (files.length === 0) {
    throw new FileNotFoundError(
      `指定されたディレクトリとサブディレクトリには ${extensions.join(
        ", ",
      )} ファイルが見つかりません。`,
    );
  }

  return files;
}
