import { parseArgs } from "node:util";

export function parseCliArguments() {
  try {
    const { values } = parseArgs({
      options: {
        ext: { type: "string", short: "e", multiple: false },
        target: { type: "string", short: "t", multiple: false },
      },
      args: process.argv.slice(2),
    });

    if (!values.ext || !values.target) {
      throw new Error("必須の引数が不足しています");
    }

    return {
      extension: values.ext,
      targetDirectory: values.target,
    };
  } catch (error) {
    console.error("使用方法: node main.mjs -e 'mp4' -t '/mnt/c/Users/'");
    process.exit(1);
  }
}
