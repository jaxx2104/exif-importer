import { readdirSync, readFileSync, writeFileSync } from "fs";
import { extname, join, basename } from "path";

export function getFilesWithExtensions(targetDir, extensions) {
  const normalizedExtensions = extensions.map(ext => `.${ext.toLowerCase()}`);
  
  const files = readdirSync(targetDir).filter(
    (file) => normalizedExtensions.includes(extname(file).toLowerCase())
  );

  if (files.length === 0) {
    console.log(
      `指定されたディレクトリには ${extensions.join(', ')} ファイルが見つかりません。`
    );
    process.exit(0);
  }

  return files;
}

// Backward compatibility function
export function getFilesWithExtension(targetDir, extension) {
  return getFilesWithExtensions(targetDir, [extension]);
}

export function buildFilePaths(targetDir, fileName) {
  return {
    inputFile: join(targetDir, fileName),
    outputXMP: join(targetDir, `${basename(fileName, extname(fileName))}.xmp`),
    xmlFile: join(targetDir, `${basename(fileName, extname(fileName))}M01.XML`),
  };
}

export function writeXMPFile(outputPath, content) {
  return writeFileSync(outputPath, content, "utf-8");
}

export function readXMLFile(xmlPath) {
  return readFileSync(xmlPath, "utf-8");
}
