import { basename, extname, join } from "@std/path";

export function getFilesWithExtensions(
  targetDir: string,
  extensions: string[],
): string[] {
  const normalizedExtensions = extensions.map((ext: string) =>
    `.${ext.toLowerCase()}`
  );

  const files = Array.from(Deno.readDirSync(targetDir))
    .filter((entry) => entry.isFile)
    .map((entry) => entry.name)
    .filter((file) =>
      normalizedExtensions.includes(extname(file).toLowerCase())
    );

  if (files.length === 0) {
    console.log(
      `指定されたディレクトリには ${
        extensions.join(", ")
      } ファイルが見つかりません。`,
    );
    Deno.exit(0);
  }

  return files;
}

// Backward compatibility function
export function getFilesWithExtension(
  targetDir: string,
  extension: string,
): string[] {
  return getFilesWithExtensions(targetDir, [extension]);
}

export function buildFilePaths(targetDir: string, fileName: string) {
  return {
    inputFile: join(targetDir, fileName),
    outputXMP: join(targetDir, `${basename(fileName, extname(fileName))}.xmp`),
    xmlFile: join(targetDir, `${basename(fileName, extname(fileName))}M01.XML`),
  };
}

export function writeXMPFile(outputPath: string, content: string): void {
  return Deno.writeTextFileSync(outputPath, content);
}

export function readXMLFile(xmlPath: string): string {
  return Deno.readTextFileSync(xmlPath);
}
