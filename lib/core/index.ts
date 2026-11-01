// Core functionality exports

export { extractExifMetadata } from "../exif-extractor.ts";
export { buildFilePaths, writeXmpFile } from "../file-io.ts";
export {
  getFilesWithExtensions,
  getFilesWithExtensionsRecursive,
} from "../file-scanner.ts";
export { assembleMetadata } from "../metadata-assembler.ts";
export { loadConfig } from "./config.ts";
export { formatDate } from "./date-formatter.ts";
export { parseXmlFile } from "./xml-parser.ts";
export { generateXmpContent } from "./xmp-generator.ts";
