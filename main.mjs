import { readdirSync, readFileSync, writeFileSync } from "fs";
import { extname, join, basename } from "path";
import { execFile } from 'child_process';
import exiftool from 'dist-exiftool';
import { parseArgs } from "node:util";
import { formatISO } from "date-fns";
import { parseStringPromise } from 'xml2js';


// コマンドライン引数の取得
let ext
let target 

try {
  const { values } = parseArgs({ options: {
    ext: { type: "string", short: "e", multiple: false },
    target: { type: "string", short: "t", multiple: false },
  }, args: process.argv.slice(2) });
  ext = values.ext
  target = values.target
} catch (error) {
  console.error("使用方法: node main.mjs -e 'mp4' -t '/mnt/c/Users/'");
  process.exit(1);
}


// 指定ディレクトリ内の特定拡張子を持つファイルを取得
const files = readdirSync(target).filter(file => extname(file).toLowerCase() === `.${ext}`);
if (files.length === 0) {
  console.log(`指定されたディレクトリには ${ext} ファイルが見つかりません。`);
  process.exit(0);
}

// 各ファイルに対して処理を実行
files.forEach(async (file) => {
  const inputFile = join(target, file);
  const outputXMP = join(target, `${basename(file, extname(file))}.xmp`);

  try {
    // XMLファイルのパスを構築
    const xmlFile = join(target, `${basename(file, extname(file))}M01.XML`);
    
    // 並列でメタデータを取得
    const [exifMetadata, xmlMetadata] = await Promise.all([
      // ExifToolのメタデータ
      new Promise((resolve, reject) => {
        execFile(exiftool, ['-j', inputFile], (error, stdout, stderr) => {
          if (error) return reject(`ExifToolエラー: ${error}`);
          resolve(JSON.parse(stdout));
        });
      }),
      // XMLメタデータ
      parseXmlFile(xmlFile)
    ]);
    
    const metadata = exifMetadata[0];
    // ExifToolのメタデータ
    const createDate = formatDate(metadata["CreateDate"]) || xmlMetadata.CreationDate?.[0].$.value || "N/A";
    const modifyDate = formatDate(metadata["ModifyDate"]) || "N/A";
    
    // GPSデータ (XML優先)
    const gps = xmlMetadata.AcquisitionRecord?.[0].Group?.find(g => g.$.name === "ExifGPS")?.Item || [];
    const gpsData = Object.fromEntries(gps.map(item => [item.$.name, item.$.value]));
    
    const gpsLatitude = gpsData.Latitude ? `${gpsData.LatitudeRef} ${gpsData.Latitude}` : metadata["GPSLatitude"] || "N/A";
    const gpsLongitude = gpsData.Longitude ? `${gpsData.LongitudeRef} ${gpsData.Longitude}` : metadata["GPSLongitude"] || "N/A";
    
    // カメラ情報
    const cameraModel = xmlMetadata.Device?.[0].$.modelName || "N/A";
    const fileExtension = extname(file).toUpperCase().replace('.', '');

    console.log(createDate)

    // XMPの内容を構築
    const xmpContent = `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.5.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:exif="http://ns.adobe.com/exif/1.0/"
    xmlns:tiff="http://ns.adobe.com/tiff/1.0/">
   <photoshop:SidecarForExtension>${fileExtension}</photoshop:SidecarForExtension>
   <photoshop:DateCreated>${createDate}</photoshop:DateCreated>
   <xmp:CreateDate>${createDate}</xmp:CreateDate>
   <xmp:ModifyDate>${modifyDate}</xmp:ModifyDate>
   <exif:GPSLongitude>${gpsLongitude}</exif:GPSLongitude>
   <exif:GPSLatitude>${gpsLatitude}</exif:GPSLatitude>
   <tiff:Model>${cameraModel}</tiff:Model>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
`;

    // XMPファイルに書き込み
    await writeFileSync(outputXMP, xmpContent, "utf-8");
  } catch (error) {
    console.error(`エラーが発生しました: ${error}`);
  }
});

// XMLファイルをパースする関数
async function parseXmlFile(xmlPath) {
  try {
    const xmlData = await readFileSync(xmlPath, 'utf-8');
    return await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true
    });
  } catch (error) {
    console.error(`XMLファイルの読み込みに失敗しました: ${error}`);
    return {};
  }
}

function formatDate(inputDateStr) {
  // 入力の日付文字列をパース
  const [datePart, timePart] = inputDateStr.split(" ");
  const [year, month, day] = datePart.split(":");
  const [hour, minute, second] = timePart.split(":");

  // Dateオブジェクトを生成
  const date = new Date(year, month - 1, day, hour, minute, second);

  // ISO形式にフォーマット
  return formatISO(date);
}
