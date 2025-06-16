import { parseStringPromise } from "xml2js";
import { readXMLFile } from "./file-utils.mjs";

export async function parseXmlFile(xmlPath) {
  try {
    const xmlData = await readXMLFile(xmlPath);
    return await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true,
    });
  } catch (error) {
    console.error(`XMLファイルの読み込みに失敗しました: ${error}`);
    return {};
  }
}
