import { resolve } from "@std/path";

const CONFIG_FILENAME = "exif-importer.config.json";

function findConfigFile() {
  const configPaths = [
    resolve(Deno.cwd(), CONFIG_FILENAME),
    resolve(Deno.env.get("HOME") || "", CONFIG_FILENAME),
  ];

  for (const configPath of configPaths) {
    try {
      Deno.statSync(configPath);
      return configPath;
    } catch {
      // File doesn't exist, continue
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
    const configContent = Deno.readTextFileSync(configPath);
    const config = JSON.parse(configContent);

    // Support both legacy single extension and new multiple extensions
    let extensions;
    if (config.extensions && Array.isArray(config.extensions)) {
      extensions = config.extensions;
    } else if (config.extension) {
      extensions = [config.extension];
    } else {
      throw new Error(
        "設定ファイルに extensions (配列) または extension が必要です",
      );
    }

    if (!config.targetDirectory) {
      throw new Error(
        "設定ファイルに targetDirectory が必要です",
      );
    }

    return {
      extensions: extensions,
      targetDirectory: config.targetDirectory,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("設定ファイルのJSON形式が正しくありません");
    }
    throw error;
  }
}
