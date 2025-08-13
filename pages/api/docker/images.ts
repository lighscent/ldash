import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';
import fs from 'fs';

const dockerRequest = (path: string, method: string = 'GET') => {
  return new Promise((resolve, reject) => {
    // Check if Docker socket exists
    if (!fs.existsSync('/var/run/docker.sock')) {
      reject(new Error('Docker socket not available'));
      return;
    }

    const options = {
      socketPath: '/var/run/docker.sock',
      path,
      method
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body || '[]'));
        } catch {
          resolve([]);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const images = await dockerRequest('/images/json');
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Docker socket not available or failed to fetch images' });
  }
}
