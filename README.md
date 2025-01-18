# Exif Importer

A tool that extracts metadata from media files in a specified directory and outputs them as XMP files.

## Installation

1. Install Node.js
2. Run the following in the project directory:

```bash
npm install
```

## Usage

```bash
node main.mjs -e [extension] -t [target directory]
```

Example:

```bash
node main.mjs -e mp4 -t /path/to/directory
```

## Dependencies

- [date-fns](https://date-fns.org/) - Date manipulation library
- [dist-exiftool](https://github.com/Sobesednik/node-exiftool) - ExifTool wrapper

## License

ISC License
