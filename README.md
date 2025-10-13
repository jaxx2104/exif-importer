# Exif Importer

A Deno CLI tool to generate XMP metadata files from video files by combining EXIF data and companion XML files.

## Prerequisites

- [Deno](https://deno.com/) installed
- [ExifTool](https://exiftool.org/) installed and available in PATH

## Installation

### Option 1: Run directly

```bash
deno task start
```

### Option 2: Install globally

```bash
deno install --global --allow-read --allow-write --allow-run --allow-env -n exif-importer bin/exif-importer.ts
```

## Configuration

Create `exif-importer.config.json` in your project root or home directory:

```json
{
  "extensions": ["mp4", "mov"],
  "targetDirectory": "/path/to/video/files"
}
```

Or use the legacy single extension format:

```json
{
  "extension": "mp4",
  "targetDirectory": "/path/to/video/files"
}
```

## Usage

After configuration:

```bash
exif-importer
```

Or run directly:

```bash
deno task start
```

## Module Structure

- `lib/core/config.ts`: Configuration loading
- `lib/core/file-utils.ts`: File operations
- `lib/core/xml-parser.ts`: XML parsing
- `lib/core/date-formatter.ts`: Date formatting
- `lib/core/xmp-generator.ts`: XMP generation
- `lib/core/metadata-processor.ts`: Metadata processing
- `lib/cli/`: CLI interface

## Development

```bash
# Check types
deno task check

# Run linter
deno task lint

# Run formatter
deno task format
```

## License

MIT
