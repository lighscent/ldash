import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Container = {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
  Created: number;
};

const ContainersPage: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContainers = async () => {
    try {
      const res = await fetch('/api/docker/containers');
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setContainers(data);
        setError(null);
      } else {
        setError(data.error || 'Invalid response format');
        setContainers([]);
      }
    } catch (error) {
      console.error('Failed to fetch containers:', error);
      setError('Failed to fetch containers');
      setContainers([]);
    }
    setLoading(false);
  };

  const controlContainer = async (id: string, action: string) => {
    try {
      await fetch(`/api/docker/containers/${id}?action=${action}`, { method: 'POST' });
      fetchContainers();
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#000000', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Back to Dashboard</Link>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', margin: '1rem 0' }}>Containers</h1>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#71717a' }}>Loading containers...</p>
          </div>
        ) : error ? (
          <div className="card" style={{
            padding: '1.5rem',
            borderColor: '#dc2626',
            background: 'rgba(220, 38, 38, 0.1)',
          }}>
            <p style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        ) : containers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#71717a' }}>No containers found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {containers.map(container => (
              <div key={container.Id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                      {container.Names[0]?.replace('/', '')}
                    </h3>
                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                      Image: {container.Image}
                    </p>
                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                      Status: <span style={{ 
                        color: container.State === 'running' ? '#22c55e' : '#ef4444' 
                      }}>{container.Status}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {container.State === 'running' ? (
                      <>
                        <button
                          onClick={() => controlContainer(container.Id, 'stop')}
                          style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Stop
                        </button>
                        <button
                          onClick={() => controlContainer(container.Id, 'restart')}
                          style={{ padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Restart
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => controlContainer(container.Id, 'start')}
                        style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ContainersPage;
