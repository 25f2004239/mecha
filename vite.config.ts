import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-proxy',
      configureServer(server) {
        // Chatbot proxy (currently unused since we went fully local, but kept just in case)
        server.middlewares.use('/api/chat', (req, res, next) => {
          if (req.method !== 'POST') return next();
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const fetch = globalThis.fetch;
              const response = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
              });
              const data = await response.text();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = response.status;
              res.end(data);
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        });

        // Real Local Python Execution
        server.middlewares.use('/api/run', (req, res, next) => {
          if (req.method !== 'POST') return next();
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const code = parsed.code || '';
              
              const tmpFile = path.join(process.cwd(), 'temp_run.py');
              fs.writeFileSync(tmpFile, code);
              
              // Run python code locally
              exec(`python ${tmpFile}`, { timeout: 5000 }, (error, stdout, stderr) => {
                if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
                res.setHeader('Content-Type', 'application/json');
                if (error || stderr) {
                  res.end(JSON.stringify({ error: stderr || error?.message || 'Error executing script' }));
                } else {
                  res.end(JSON.stringify({ output: stdout }));
                }
              });
            } catch (e: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        });

      }
    }
  ],
})
