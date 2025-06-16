import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_FILENAME = "exif-importer.config.json";

function findConfigFile() {
  const configPaths = [
    resolve(process.cwd(), CONFIG_FILENAME),
    resolve(process.env.HOME, CONFIG_FILENAME),
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  throw new Error(
    `設定ファイルが見つかりません。${CONFIG_FILENAME} を作成してください。\n` +
      `検索場所: ${configPaths.join(", ")}`,
  );
}

export function loadConfig() {
  try {
    const configPath = findConfigFile();
    const configContent = readFileSync(configPath, "utf8");
    const config = JSON.parse(configContent);

    if (!config.extension || !config.targetDirectory) {
      throw new Error(
        "設定ファイルに extension と targetDirectory が必要です",
      );
    }

    return {
      extension: config.extension,
      targetDirectory: config.targetDirectory,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("設定ファイルのJSON形式が正しくありません");
    }
    throw error;
  }
}