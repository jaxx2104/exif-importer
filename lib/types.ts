// Common type definitions

export interface Metadata {
  createDate: string;
  modifyDate: string;
  gpsLongitude: string;
  gpsLatitude: string;
  cameraModel: string;
}

export interface Config {
  extensions: string[];
  targetDirectory: string;
}

export interface FilePaths {
  inputFile: string;
  outputXmp: string;
  xmlFile: string;
}

export interface ExifData {
  CreateDate?: string;
  ModifyDate?: string;
  Model?: string;
  [key: string]: string | undefined;
}

export interface XmlDevice {
  modelName?: string;
}

export interface XmlCreationDate {
  value?: string;
}

export interface XmlGpsItem {
  name: string;
  value: string;
}

export interface XmlAcquisitionRecord {
  Group?: {
    Item?: XmlGpsItem[];
  };
}

export interface XmlData {
  NonRealTimeMeta?: {
    CreationDate?: XmlCreationDate;
    Device?: XmlDevice;
    AcquisitionRecord?: XmlAcquisitionRecord;
  };
}
