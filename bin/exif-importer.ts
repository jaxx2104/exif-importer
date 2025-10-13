#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

import { getConfiguration } from "../lib/cli/index.ts";
import {
  buildFilePaths,
  generateXMPContent,
  getFilesWithExtensions,
  getMetadata,
  writeXMPFile,
} from "../lib/core/index.ts";

async function main() {
  try {
    const { extensions, targetDirectory } = getConfiguration();
    const files = getFilesWithExtensions(targetDirectory, extensions);

    for (const file of files) {
      try {
        const { inputFile, outputXMP, xmlFile } = buildFilePaths(
          targetDirectory,
          file,
        );

        const metadata = await getMetadata(inputFile, xmlFile);
        const fileExtension = file.split(".").pop()?.toUpperCase() || "";
        const xmpContent = generateXMPContent(fileExtension, metadata);

        await writeXMPFile(outputXMP, xmpContent);
        console.log(`Successfully created: ${outputXMP}`);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

main();
