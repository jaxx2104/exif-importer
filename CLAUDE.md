# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm install` - Install dependencies
- `npm test` - Run tests (custom test runner in test/test.mjs)
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

**Build and Install:**
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

**Core Processing Flow:**
1. `bin/exif-importer` - Entry point that orchestrates the main workflow
2. `lib/config.mjs` - Loads configuration from JSON file (extension and target directory)
3. `lib/cli.mjs` - Provides configuration loading interface
4. `lib/file-utils.mjs` - Handles file discovery and path construction
5. `lib/metadata-processor.mjs` - Combines EXIF data (via dist-exiftool) with XML companion files
6. `lib/xmp-generator.mjs` - Generates Adobe XMP format output files

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