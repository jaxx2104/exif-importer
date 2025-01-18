import { readdirSync, writeFileSync } from "fs";
import { extname, join, basename } from "path";
import { execFile } from 'child_process';
import exiftool from 'dist-exiftool';
import { parseArgs } from "node:util";
import { formatISO } from "date-fns";


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
files.forEach(file => {
  const inputFile = join(target, file);
  const outputXMP = join(target, `${basename(file, extname(file))}.xmp`);

  // ExifToolを実行してメタデータを取得
  execFile(exiftool, ['-j', inputFile], (error, stdout, stderr) => {
    if (error) {
      console.error(`ExifToolエラー: ${error}`);
      return;
    }

    const metadata = JSON.parse(stdout);
    const createDate = formatDate(metadata[0]["CreateDate"]) || "N/A";
    const modifyDate = formatDate(metadata[0]["ModifyDate"]) || "N/A";
    const gpsLatitude = metadata[0]["GPSLatitude"] || "N/A";
    const gpsLongitude = metadata[0]["GPSLongitude"] || "N/A";
    const fileExtension = extname(file).toUpperCase().replace('.', '');

    console.log(createDate)

    // XMPの内容を構築
    const xmpContent = `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.5.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:exif="http://ns.adobe.com/exif/1.0/">
   <photoshop:SidecarForExtension>${fileExtension}</photoshop:SidecarForExtension>
   <photoshop:DateCreated>${createDate}</photoshop:DateCreated>
   <xmp:CreateDate>${createDate}</xmp:CreateDate>
   <xmp:ModifyDate>${modifyDate}</xmp:ModifyDate>
   <exif:GPSLongitude>${gpsLongitude}</exif:GPSLongitude>
   <exif:GPSLatitude>${gpsLatitude}</exif:GPSLatitude>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
`;

    // XMPファイルに書き込み
    try {
      writeFileSync(outputXMP, xmpContent, "utf-8");
    } catch (err) {
      console.error(`XMPファイルの書き込みに失敗しました: ${stderr}`);
    }
  });
});

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
