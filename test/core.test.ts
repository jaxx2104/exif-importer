import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  assembleMetadata,
  buildFilePaths,
  formatDate,
  generateXmpContent,
  getFilesWithExtensions,
  getFilesWithExtensionsRecursive,
  parseXmlFile,
} from "../lib/core/index.ts";
import { fileExists } from "../lib/file-io.ts";

const MOVIE_DIR = "sample/a6500/movie";

describe("formatDate", () => {
  test("converts EXIF date to ISO 8601 with offset", () => {
    expect(formatDate("2024:01:02 03:04:05")).toMatch(
      /^2024-01-02T03:04:05([+-]\d{2}:\d{2}|Z)$/,
    );
  });

  test("returns null for missing or malformed input", () => {
    expect(formatDate(undefined)).toBeNull();
    expect(formatDate("2024:01:02")).toBeNull();
    expect(formatDate("aaaa:bb:cc dd:ee:ff")).toBeNull();
  });
});

describe("buildFilePaths", () => {
  test("derives XMP and companion XML paths", () => {
    expect(buildFilePaths("dir", "C0001.MP4")).toEqual({
      inputFile: "dir/C0001.MP4",
      outputXmp: "dir/C0001.xmp",
      xmlFile: "dir/C0001M01.XML",
    });
  });
});

describe("generateXmpContent", () => {
  test("embeds metadata fields", () => {
    const xmp = generateXmpContent("MP4", {
      createDate: "c",
      modifyDate: "m",
      gpsLongitude: "lon",
      gpsLatitude: "lat",
      cameraModel: "model",
    });
    expect(xmp).toContain(
      "<photoshop:SidecarForExtension>MP4</photoshop:SidecarForExtension>",
    );
    expect(xmp).toContain("<xmp:CreateDate>c</xmp:CreateDate>");
    expect(xmp).toContain("<xmp:ModifyDate>m</xmp:ModifyDate>");
    expect(xmp).toContain("<exif:GPSLongitude>lon</exif:GPSLongitude>");
    expect(xmp).toContain("<exif:GPSLatitude>lat</exif:GPSLatitude>");
    expect(xmp).toContain("<tiff:Model>model</tiff:Model>");
  });
});

describe("file scanning", () => {
  test("finds files case-insensitively in a directory", () => {
    expect(getFilesWithExtensions(MOVIE_DIR, ["mp4"])).toEqual(["C0001.MP4"]);
  });

  test("finds files recursively", () => {
    const found = getFilesWithExtensionsRecursive("sample", ["mp4", "arw"])
      .map((f) => join(f.directory, f.fileName))
      .sort();
    expect(found).toEqual([
      "sample/a6500/movie/C0001.MP4",
      "sample/a6500/photo/DSC09800.ARW",
    ]);
  });

  test("throws when nothing matches", () => {
    expect(() => getFilesWithExtensionsRecursive("sample", ["xyz"])).toThrow();
  });
});

describe("fileExists", () => {
  test("distinguishes existing and missing files", () => {
    const dir = mkdtempSync(join(tmpdir(), "exif-importer-"));
    try {
      const file = join(dir, "a.txt");
      expect(fileExists(file)).toBe(false);
      writeFileSync(file, "x");
      expect(fileExists(file)).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("parseXmlFile", () => {
  test("returns undefined when the XML does not exist", async () => {
    expect(await parseXmlFile(`${MOVIE_DIR}/missing.XML`)).toBeUndefined();
  });

  test("parses Sony companion XML", async () => {
    const xml = await parseXmlFile(`${MOVIE_DIR}/C0001M01.XML`);
    expect(xml?.NonRealTimeMeta?.Device?.modelName).toBeString();
  });
});

describe("assembleMetadata (requires exiftool)", () => {
  test("combines EXIF and XML data", async () => {
    const { inputFile, xmlFile } = buildFilePaths(MOVIE_DIR, "C0001.MP4");
    const metadata = await assembleMetadata(inputFile, xmlFile);
    expect(metadata.cameraModel).not.toBe("N/A");
    expect(metadata.createDate).not.toBe("N/A");
  });
});
