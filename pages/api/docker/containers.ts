import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';
import fs from 'fs';

const dockerRequest = (path: string, method: string = 'GET', data?: Record<string, unknown>) => {
  return new Promise((resolve, reject) => {
    // Check if Docker socket exists
    if (!fs.existsSync('/var/run/docker.sock')) {
      reject(new Error('Docker socket not available'));
      return;
    }

    const options = {
      socketPath: '/var/run/docker.sock',
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const statusCode = res.statusCode || 500;
          resolve(statusCode >= 400 ? { error: body } : JSON.parse(body || '{}'));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const containers = await dockerRequest('/containers/json?all=true');
        res.status(200).json(containers);
        break;
      
      case 'POST':
        const created = await dockerRequest('/containers/create', 'POST', req.body);
        res.status(201).json(created);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Docker API error:', error);
    res.status(500).json({ error: 'Docker socket not available or Docker API error' });
  }
}
