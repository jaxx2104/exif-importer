# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm install` - Install dependencies
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

**CLI Usage:**
- `npm install -g .` - Install CLI globally
- `exif-importer` - Run the CLI tool (requires configuration file)

**Configuration:**
- Create `exif-importer.config.json` in project root or home directory with:
  ```json
  {
    "extension": "mp4",
    "targetDirectory": "/path/to/video/files"
  }
  ```

## Architecture

This is a Node.js CLI tool that generates XMP metadata files from video files by combining EXIF data and companion XML files.

**Directory Structure:**
```
lib/
├── core/           # Core functionality
│   ├── config.mjs         # Configuration loading
│   ├── file-utils.mjs     # File discovery and path construction
│   ├── metadata-processor.mjs # EXIF and XML data processing
│   ├── xml-parser.mjs     # XML parsing utilities
│   ├── xmp-generator.mjs  # XMP format generation
│   ├── date-formatter.mjs # Date formatting utilities
│   └── index.mjs          # Core module exports
└── cli/            # CLI-specific interface
    ├── cli.mjs           # CLI configuration interface
    └── index.mjs         # CLI module exports
```

**CLI Processing Flow:**
1. `bin/exif-importer` - CLI entry point
2. `lib/cli/` - Configuration loading interface
3. `lib/core/` - Core processing modules
4. Output: XMP sidecar files with standardized Adobe metadata format

**Key Data Sources:**
- EXIF metadata extracted using dist-exiftool package
- Companion XML files (e.g., C0001M01.XML alongside C0001.MP4) containing GPS and device info
- Output: XMP sidecar files with standardized Adobe metadata format

**Module Dependencies:**
- `dist-exiftool` for EXIF extraction
- `xml2js` for parsing companion XML files
- `date-fns` for date formatting
- Uses ES modules (type: "module" in package.json)

The tool is designed specifically for Sony camera formats but the architecture supports extending to other camera manufacturers through the XML parsing layer.