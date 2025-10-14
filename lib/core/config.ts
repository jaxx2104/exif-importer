import { resolve } from "@std/path";
import type { Config } from "../types.ts";
import { ConfigError } from "../errors.ts";

const CONFIG_FILENAME = "exif-importer.config.json";

interface ConfigFile {
  extensions?: string[];
  extension?: string;
  targetDirectory?: string;
}

function findConfigFile(): string {
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

  throw new ConfigError(
    `設定ファイルが見つかりません。${CONFIG_FILENAME} を作成してください。\n` +
      `検索場所: ${configPaths.join(", ")}`,
  );
}

function validateConfig(config: ConfigFile): Config {
  // Support both legacy single extension and new multiple extensions
  let extensions: string[];
  if (config.extensions && Array.isArray(config.extensions)) {
    extensions = config.extensions;
  } else if (config.extension) {
    extensions = [config.extension];
  } else {
    throw new ConfigError(
      "設定ファイルに extensions (配列) または extension が必要です",
    );
  }

  if (!config.targetDirectory) {
    throw new ConfigError(
      "設定ファイルに targetDirectory が必要です",
    );
  }

  return {
    extensions,
    targetDirectory: config.targetDirectory,
  };
}

export function loadConfig(): Config {
  try {
    const configPath = findConfigFile();
    const configContent = Deno.readTextFileSync(configPath);
    const config = JSON.parse(configContent) as ConfigFile;

    return validateConfig(config);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigError("設定ファイルのJSON形式が正しくありません");
    }
    throw error;
  }
}
