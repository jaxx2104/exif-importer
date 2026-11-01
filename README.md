# Exif Importer

A Bun CLI tool to generate XMP sidecar files from video and photo files by combining EXIF data and companion XML files.

## Prerequisites

- [Bun](https://bun.sh/) (the version is pinned in `mise.toml`; run `mise install` if you use [mise](https://mise.jdx.dev/))
- [ExifTool](https://exiftool.org/) installed and available in PATH

## Installation

```bash
bun install
```

### Option 1: Run directly

```bash
bun run start
```

### Option 2: Install globally

```bash
bun link
```

This registers the `exif-importer` command from `package.json` `bin`.

## Configuration

Create `exif-importer.config.json` in your current directory or home directory:

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

Override the target directory with `--dir`:

```bash
exif-importer --dir /path/to/files
```

Files are scanned recursively. For each match, a `.xmp` sidecar is written next to the source file.

## Module Structure

- `bin/exif-importer.ts`: CLI entry point
- `lib/core/config.ts`: Configuration loading
- `lib/core/xml-parser.ts`: Companion XML parsing
- `lib/core/date-formatter.ts`: Date formatting
- `lib/core/xmp-generator.ts`: XMP generation
- `lib/file-scanner.ts`: Recursive file discovery
- `lib/file-io.ts`: Path construction and file I/O
- `lib/exif-extractor.ts`: EXIF extraction via `exiftool`
- `lib/metadata-assembler.ts`: Merging EXIF and XML metadata

## Development

```bash
bun run check    # Type check (tsc --noEmit)
bun run lint     # Lint (Biome)
bun run format   # Format (Biome)
bun test         # Unit tests (bun:test, requires exiftool)
bun run sample   # Generate XMP files for files under sample/
```

## License

MIT
