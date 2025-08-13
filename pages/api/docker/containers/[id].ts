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
      res.on('end', () => resolve({ status: res.statusCode, data: body }));
    });

    req.on('error', reject);
    req.end();
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, action } = req.query;

  try {
    let result;
    switch (action) {
      case 'start':
        result = await dockerRequest(`/containers/${id}/start`, 'POST');
        break;
      case 'stop':
        result = await dockerRequest(`/containers/${id}/stop`, 'POST');
        break;
      case 'restart':
        result = await dockerRequest(`/containers/${id}/restart`, 'POST');
        break;
      case 'logs':
        result = await dockerRequest(`/containers/${id}/logs?stdout=true&stderr=true`);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Docker API error:', error);
    res.status(500).json({ error: 'Docker socket not available or Docker API error' });
  }
}
