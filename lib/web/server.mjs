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
  
  // Serve React build files if they exist, otherwise fall back to original public
  const reactPublicPath = path.join(__dirname, 'public-react');
  const originalPublicPath = path.join(__dirname, 'public');
  
  try {
    // Check if React build exists synchronously
    import('fs').then(fs => fs.statSync(reactPublicPath));
    app.use(express.static(reactPublicPath));
    console.log('Serving React build from public-react');
  } catch {
    // Fall back to original public directory
    app.use(express.static(originalPublicPath));
    console.log('Serving original files from public');
  }

  // API Routes
  app.get('/api/config', ApiHandlers.getConfig);
  app.get('/api/files', ApiHandlers.getFiles);
  app.get('/api/metadata/:filename', ApiHandlers.getMetadata);
  app.get('/api/xml/:filename', ApiHandlers.getXmlData);
  app.get('/api/xmp/:filename', ApiHandlers.getXmpData);
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