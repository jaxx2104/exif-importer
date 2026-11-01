import { formatDate } from "./core/date-formatter.ts";
import { parseXmlFile } from "./core/xml-parser.ts";
import { extractExifMetadata } from "./exif-extractor.ts";
import type { Metadata, XmlData } from "./types.ts";

function extractGpsValue(
  xmlData: XmlData | undefined,
  key: string,
): string | undefined {
  if (!xmlData) {
    return undefined;
  }

  const items = xmlData.NonRealTimeMeta?.AcquisitionRecord?.Group?.Item;
  if (!items) {
    return undefined;
  }

  const gpsData = Object.fromEntries(
    items.map((item) => [item.name, item.value]),
  );
  return gpsData[key];
}

export async function assembleMetadata(
  inputFile: string,
  xmlFile: string,
): Promise<Metadata> {
  const [exifData, xmlData] = await Promise.all([
    extractExifMetadata(inputFile),
    parseXmlFile(xmlFile),
  ]);

  const nonRealTimeMeta = xmlData?.NonRealTimeMeta;

  return {
    createDate:
      nonRealTimeMeta?.CreationDate?.value ||
      formatDate(exifData.CreateDate) ||
      "N/A",
    modifyDate:
      nonRealTimeMeta?.CreationDate?.value ||
      formatDate(exifData.ModifyDate) ||
      "N/A",
    gpsLongitude: extractGpsValue(xmlData, "Longitude") || "N/A",
    gpsLatitude: extractGpsValue(xmlData, "Latitude") || "N/A",
    cameraModel: nonRealTimeMeta?.Device?.modelName || exifData.Model || "N/A",
  };
}
