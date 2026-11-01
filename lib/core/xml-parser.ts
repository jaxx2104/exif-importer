import { parseStringPromise } from "xml2js";
import { XmlParseError } from "../errors.ts";
import { fileExists, readXmlFile } from "../file-io.ts";
import type { XmlData } from "../types.ts";

export async function parseXmlFile(
  xmlPath: string,
): Promise<XmlData | undefined> {
  if (!fileExists(xmlPath)) {
    return undefined;
  }

  try {
    const xmlContent = readXmlFile(xmlPath);
    const parsed = await parseStringPromise(xmlContent, {
      explicitArray: false,
      mergeAttrs: true,
    });
    return parsed as XmlData;
  } catch (error) {
    throw new XmlParseError(`XMLファイルの読み込みに失敗しました: ${error}`);
  }
}
