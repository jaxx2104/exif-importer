# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `deno task check` - Type check TypeScript files
- `deno task lint` - Run Deno linter
- `deno task format` - Format code with Deno formatter

**CLI Usage:**
- `deno task start` - Run the CLI tool (requires configuration file)
- `deno install --global --allow-read --allow-write --allow-run --allow-env -n exif-importer bin/exif-importer.ts` - Install CLI globally

**Configuration:**
- Create `exif-importer.config.json` in project root or home directory with:
  ```json
  {
    "extensions": ["mp4", "mov"],
    "targetDirectory": "/path/to/video/files"
  }
  ```

## Architecture

This is a Deno CLI tool (migrated from Node.js) that generates XMP metadata files from video files by combining EXIF data and companion XML files.

**Directory Structure:**
```
lib/
├── core/           # Core functionality
│   ├── config.ts         # Configuration loading
│   ├── file-utils.ts     # File discovery and path construction
│   ├── metadata-processor.ts # EXIF and XML data processing
│   ├── xml-parser.ts     # XML parsing utilities
│   ├── xmp-generator.ts  # XMP format generation
│   ├── date-formatter.ts # Date formatting utilities
│   └── index.ts          # Core module exports
└── cli/            # CLI-specific interface
    ├── cli.ts           # CLI configuration interface
    └── index.ts         # CLI module exports
```

**CLI Processing Flow:**
1. `bin/exif-importer.ts` - CLI entry point (Deno script)
2. `lib/cli/` - Configuration loading interface
3. `lib/core/` - Core processing modules
4. Output: XMP sidecar files with standardized Adobe metadata format

**Key Data Sources:**
- EXIF metadata extracted using system `exiftool` command (via Deno.Command)
- Companion XML files (e.g., C0001M01.XML alongside C0001.MP4) containing GPS and device info
- Output: XMP sidecar files with standardized Adobe metadata format

**Module Dependencies:**
- System `exiftool` command for EXIF extraction
- `xml2js` (npm:xml2js) for parsing companion XML files
- `date-fns` (npm:date-fns) for date formatting
- `@std/path` (jsr:@std/path) for path operations
- Uses TypeScript with Deno's native TypeScript support

The tool is designed specifically for Sony camera formats but the architecture supports extending to other camera manufacturers through the XML parsing layer.