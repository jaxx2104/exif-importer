import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { extname, join, basename } from 'path';

export function getFilesWithExtension(targetDir, extension) {
  const files = readdirSync(targetDir).filter(
    (file) => extname(file).toLowerCase() === `.${extension}`,
  );
  
  if (files.length === 0) {
    console.log(`指定されたディレクトリには ${extension} ファイルが見つかりません。`);
    process.exit(0);
  }

  return files;
}

export function buildFilePaths(targetDir, fileName, extension) {
  return {
    inputFile: join(targetDir, fileName),
    outputXMP: join(targetDir, `${basename(fileName, extname(fileName))}.xmp`),
    xmlFile: join(targetDir, `${basename(fileName, extname(fileName))}M01.XML`)
  };
}

export function writeXMPFile(outputPath, content) {
  return writeFileSync(outputPath, content, 'utf-8');
}

export function readXMLFile(xmlPath) {
  return readFileSync(xmlPath, 'utf-8');
}
