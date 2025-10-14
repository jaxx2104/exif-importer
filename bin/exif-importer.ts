#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

import {
  assembleMetadata,
  buildFilePaths,
  generateXmpContent,
  getFilesWithExtensionsRecursive,
  loadConfig,
  writeXmpFile,
} from "../lib/core/index.ts";

function parseArgs(): { targetDirectory?: string } {
  const args = Deno.args;
  const dirIndex = args.indexOf("--dir");

  if (dirIndex !== -1 && dirIndex + 1 < args.length) {
    return { targetDirectory: args[dirIndex + 1] };
  }

  return {};
}

async function main() {
  try {
    const cliArgs = parseArgs();
    const config = loadConfig();

    // CLI引数でディレクトリが指定されていればオーバーライド
    const targetDirectory = cliArgs.targetDirectory || config.targetDirectory;
    const extensions = config.extensions;

    const fileInfos = getFilesWithExtensionsRecursive(
      targetDirectory,
      extensions,
    );

    for (const fileInfo of fileInfos) {
      try {
        const { inputFile, outputXmp, xmlFile } = buildFilePaths(
          fileInfo.directory,
          fileInfo.fileName,
        );

        const metadata = await assembleMetadata(inputFile, xmlFile);
        const fileExtension = fileInfo.fileName.split(".").pop()
          ?.toUpperCase() || "";
        const xmpContent = generateXmpContent(fileExtension, metadata);

        writeXmpFile(outputXmp, xmpContent);
        console.log(`Successfully created: ${outputXmp}`);
      } catch (error) {
        console.error(`Error processing file ${fileInfo.fileName}:`, error);
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

main();
