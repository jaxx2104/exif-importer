import { parseXmlFile } from "./xml-parser.ts";
import { formatDate } from "./date-formatter.ts";

interface Metadata {
  createDate: string;
  modifyDate: string;
  gpsLongitude: string;
  gpsLatitude: string;
  cameraModel: string;
}

export async function getMetadata(
  inputFile: string,
  xmlFile: string,
): Promise<Metadata> {
  try {
    const [exifMetadata, xmlMetadata] = await Promise.all([
      getExifMetadata(inputFile),
      parseXmlFile(xmlFile),
    ]);

    const metadata = exifMetadata[0];
    const xmlData = xmlMetadata.NonRealTimeMeta || {};

    return {
      createDate: xmlData.CreationDate?.value ||
        formatDate(metadata["CreateDate"]) ||
        "N/A",
      modifyDate: xmlData.CreationDate?.value ||
        formatDate(metadata["ModifyDate"]) ||
        "N/A",
      gpsLongitude: getXmlGpsValue(xmlData, "Longitude") || "N/A",
      gpsLatitude: getXmlGpsValue(xmlData, "Latitude") || "N/A",
      cameraModel: xmlData.Device?.modelName || metadata["Model"] || "N/A",
    };
  } catch (error) {
    throw new Error(`メタデータの取得に失敗しました: ${error}`);
  }
}

// deno-lint-ignore no-explicit-any
function getXmlGpsValue(xmlData: any, key: string): string | undefined {
  const gps = xmlData.AcquisitionRecord?.Group?.Item || [];
  const gpsData = Object.fromEntries(
    // deno-lint-ignore no-explicit-any
    gps.map((item: any) => [item.name, item.value]),
  );
  return gpsData[key];
}

// deno-lint-ignore no-explicit-any
async function getExifMetadata(inputFile: string): Promise<any[]> {
  const command = new Deno.Command("exiftool", {
    args: ["-j", inputFile],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();

  if (code !== 0) {
    const errorText = new TextDecoder().decode(stderr);
    throw new Error(`ExifToolエラー: ${errorText}`);
  }

  const output = new TextDecoder().decode(stdout);
  return JSON.parse(output);
}
