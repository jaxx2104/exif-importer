# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Bun is managed with mise (`mise.toml`). Run `bun install` first.

Development:
- `bun run check` - Type check with `tsc --noEmit`
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun test` - Run unit tests (`test/`, bun:test; needs `exiftool`)
- `bunx biome ci` - Lint + format check as run in CI

CLI usage:
- `bun run start` - Run the CLI tool (requires configuration file)
- `bun run sample` - Run the CLI against `sample/`
- `bun link` - Install the `exif-importer` command globally

Configuration:
- Create `exif-importer.config.json` in the current directory or home directory with:
  ```json
  {
    "extensions": ["mp4", "mov"],
    "targetDirectory": "/path/to/video/files"
  }
  ```

## Architecture

This is a Bun CLI tool (migrated from Deno) that generates XMP metadata files from video/photo files by combining EXIF data and companion XML files.

Directory structure:
```
bin/exif-importer.ts        # CLI entry point (--dir overrides targetDirectory)
lib/
├── core/
│   ├── config.ts           # Configuration loading
│   ├── xml-parser.ts       # Companion XML parsing
│   ├── xmp-generator.ts    # XMP format generation
│   ├── date-formatter.ts   # Date formatting
│   └── index.ts            # Public exports
├── file-scanner.ts         # Recursive file discovery
├── file-io.ts              # Path construction and file I/O
├── exif-extractor.ts       # exiftool invocation (Bun.spawn)
├── metadata-assembler.ts   # Merge EXIF + XML into Metadata
├── errors.ts               # Custom error classes
└── types.ts                # Shared types
test/                       # bun:test suites
```

Key data sources:
- EXIF metadata extracted using the system `exiftool` command (via `Bun.spawn`)
- Companion XML files (e.g., C0001M01.XML alongside C0001.MP4) containing GPS and device info
- Output: XMP sidecar files with standardized Adobe metadata format

Dependencies:
- System `exiftool` command for EXIF extraction
- `xml2js` for parsing companion XML files
- `date-fns` for date formatting
- `node:fs` / `node:path` for file system and path operations
- TypeScript runs natively on Bun; `tsc` is used only for type checking

The tool is designed specifically for Sony camera formats but the architecture supports extending to other camera manufacturers through the XML parsing layer.
