import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiHandlers } from './api-handlers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // API Routes
  app.get('/api/config', ApiHandlers.getConfig);
  app.get('/api/files', ApiHandlers.getFiles);
  app.get('/api/metadata/:filename', ApiHandlers.getMetadata);
  app.get('/api/xml/:filename', ApiHandlers.getXmlData);
  app.put('/api/xml/:filename', ApiHandlers.updateXmlData);

  return app;
}

export function startServer(port = 3000) {
  const app = createApp();
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
  return app;
}