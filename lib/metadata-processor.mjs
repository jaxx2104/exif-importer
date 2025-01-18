import { execFile } from 'child_process';
import exiftool from 'dist-exiftool';
import { parseXmlFile } from './xml-parser.mjs';
import { formatDate } from './date-formatter.mjs';

export async function getMetadata(inputFile, xmlFile) {
  try {
    const [exifMetadata, xmlMetadata] = await Promise.all([
      getExifMetadata(inputFile),
      parseXmlFile(xmlFile)
    ]);

    const metadata = exifMetadata[0];
    const xmlData = xmlMetadata.NonRealTimeMeta || {};

    return {
      createDate: xmlData.CreationDate?.value || formatDate(metadata['CreateDate']) || 'N/A',
      modifyDate: xmlData.CreationDate?.value || formatDate(metadata['ModifyDate']) || 'N/A',
      gpsLongitude: getXmlGpsValue(xmlData, 'Longitude') || 'N/A',
      gpsLatitude: getXmlGpsValue(xmlData, 'Latitude') || 'N/A',
      cameraModel: xmlData.Device?.modelName || metadata['Model'] || 'N/A'
    };
  } catch (error) {
    throw new Error(`メタデータの取得に失敗しました: ${error}`);
  }
}

function getXmlGpsValue(xmlData, key) {
  const gps = xmlData.AcquisitionRecord?.Group?.Item || [];
  const gpsData = Object.fromEntries(
    gps.map((item) => [item.name, item.value])
  );
  return gpsData[key];
}

function getExifMetadata(inputFile) {
  return new Promise((resolve, reject) => {
    execFile(exiftool, ['-j', inputFile], (error, stdout, stderr) => {
      if (error) return reject(`ExifToolエラー: ${error}`);
      resolve(JSON.parse(stdout));
    });
  });
}
