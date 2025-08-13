import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const options = {
    socketPath: '/var/run/docker.sock',
    path: '/info',
    method: 'GET'
  };

  const dockerReq = http.request(options, dockerRes => {
    let data = '';
    dockerRes.on('data', chunk => { data += chunk; });
    dockerRes.on('end', () => {
      try {
        res.status(200).json(JSON.parse(data));
      } catch {
        res.status(500).json({ error: 'Failed to parse Docker info' });
      }
    });
  });

  dockerReq.on('error', () => {
    res.status(500).json({ error: 'Could not connect to Docker socket' });
  });

  dockerReq.end();
}
