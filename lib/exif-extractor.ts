import { MetadataExtractionError } from "./errors.ts";
import type { ExifData } from "./types.ts";

export async function extractExifMetadata(
  inputFile: string,
): Promise<ExifData> {
  const proc = Bun.spawn(["exiftool", "-j", inputFile], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [output, errorText, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (code !== 0) {
    throw new MetadataExtractionError(`ExifToolエラー: ${errorText}`);
  }

  const data = JSON.parse(output);

  if (!Array.isArray(data) || data.length === 0) {
    throw new MetadataExtractionError("EXIFデータが取得できませんでした");
  }

  return data[0] as ExifData;
}
