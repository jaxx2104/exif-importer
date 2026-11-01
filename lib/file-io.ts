import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import type { FilePaths } from "./types.ts";

export function buildFilePaths(targetDir: string, fileName: string): FilePaths {
  return {
    inputFile: join(targetDir, fileName),
    outputXmp: join(targetDir, `${basename(fileName, extname(fileName))}.xmp`),
    xmlFile: join(targetDir, `${basename(fileName, extname(fileName))}M01.XML`),
  };
}

export function writeXmpFile(outputPath: string, content: string): void {
  writeFileSync(outputPath, content);
}

export function readXmlFile(xmlPath: string): string {
  return readFileSync(xmlPath, "utf-8");
}

export function fileExists(filePath: string): boolean {
  try {
    statSync(filePath);
    return true;
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
