import { loadConfig, getFilesWithExtension, buildFilePaths, getMetadata, parseXmlFile } from '../core/index.mjs';
import { promises as fs } from 'fs';
import xml2js from 'xml2js';
import path from 'path';

export class ApiHandlers {
  static async getConfig(req, res) {
    try {
      const config = loadConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFiles(req, res) {
    try {
      const { extension, targetDirectory } = loadConfig();
      const files = getFilesWithExtension(targetDirectory, extension);
      
      const fileList = files.map(file => ({
        name: file,
        path: path.join(targetDirectory, file)
      }));
      
      res.json(fileList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMetadata(req, res) {
    try {
      const { filename } = req.params;
      const { extension, targetDirectory } = loadConfig();
      
      const { inputFile, xmlFile } = buildFilePaths(
        targetDirectory,
        filename,
        extension
      );
      
      const metadata = await getMetadata(inputFile, xmlFile);
      res.json(metadata);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getXmlData(req, res) {
    try {
      const { filename } = req.params;
      const { extension, targetDirectory } = loadConfig();
      
      const { xmlFile } = buildFilePaths(
        targetDirectory,
        filename,
        extension
      );
      
      const xmlData = await parseXmlFile(xmlFile);
      res.json(xmlData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateXmlData(req, res) {
    try {
      const { filename } = req.params;
      const { xmlData } = req.body;
      const { extension, targetDirectory } = loadConfig();
      
      const { xmlFile } = buildFilePaths(
        targetDirectory,
        filename,
        extension
      );
      
      // Convert JSON back to XML format
      const builder = new xml2js.Builder();
      const xmlContent = builder.buildObject(xmlData);
      
      await fs.writeFile(xmlFile, xmlContent);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}