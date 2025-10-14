import { basename, extname, join } from "@std/path";
import type { FilePaths } from "./types.ts";

export function buildFilePaths(targetDir: string, fileName: string): FilePaths {
  return {
    inputFile: join(targetDir, fileName),
    outputXmp: join(targetDir, `${basename(fileName, extname(fileName))}.xmp`),
    xmlFile: join(targetDir, `${basename(fileName, extname(fileName))}M01.XML`),
  };
}

export function writeXmpFile(outputPath: string, content: string): void {
  return Deno.writeTextFileSync(outputPath, content);
}

export function readXmlFile(xmlPath: string): string {
  return Deno.readTextFileSync(xmlPath);
}

export function fileExists(filePath: string): boolean {
  try {
    Deno.statSync(filePath);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}
