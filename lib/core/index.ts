// Core functionality exports
export { loadConfig } from "./config.ts";
export { formatDate } from "./date-formatter.ts";
export {
  buildFilePaths,
  getFilesWithExtension,
  getFilesWithExtensions,
  writeXMPFile,
} from "./file-utils.ts";
export { getMetadata } from "./metadata-processor.ts";
export { parseXmlFile } from "./xml-parser.ts";
export { generateXMPContent } from "./xmp-generator.ts";
