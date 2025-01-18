# Exif Importer

A tool to export video metadata in XMP format

## Installation

```bash
npm install -g .
```

## Usage

```bash
exif-importer -e <extension> -t <target-directory>
```

Example:

```bash
exif-importer -e mp4 -t /path/to/videos
```

## Module Structure

- `cli.mjs`: CLI argument processing
- `file-utils.mjs`: File operations
- `xml-parser.mjs`: XML parsing
- `date-formatter.mjs`: Date formatting
- `xmp-generator.mjs`: XMP generation
- `metadata-processor.mjs`: Metadata processing

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Run formatter
npm run format
```

## License

MIT
