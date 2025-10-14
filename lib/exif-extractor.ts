import type { ExifData } from "./types.ts";
import { MetadataExtractionError } from "./errors.ts";

export async function extractExifMetadata(
  inputFile: string,
): Promise<ExifData> {
  const command = new Deno.Command("exiftool", {
    args: ["-j", inputFile],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();

  if (code !== 0) {
    const errorText = new TextDecoder().decode(stderr);
    throw new MetadataExtractionError(`ExifToolエラー: ${errorText}`);
  }

  const output = new TextDecoder().decode(stdout);
  const data = JSON.parse(output);

  if (!Array.isArray(data) || data.length === 0) {
    throw new MetadataExtractionError("EXIFデータが取得できませんでした");
  }

  return data[0] as ExifData;
}
