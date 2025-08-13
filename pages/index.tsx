import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type DockerInfo = {
  ServerVersion?: string;
  Containers?: number;
  Images?: number;
  OperatingSystem?: string;
};

const Dashboard: React.FC = () => {
  const [info, setInfo] = useState<DockerInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/docker-info')
      .then(res => res.json())
      .then(data => setInfo(data))
      .catch(() => setError('Failed to fetch Docker info'));
  }, []);

  if (!mounted) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 300,
            letterSpacing: '0.5px',
            color: '#ffffff',
          }}>
            LDash
          </h1>
          <p style={{ color: '#71717a', marginTop: '0.5rem' }}>Docker Management</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '2rem',
    }}>
      {/* Header */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '3rem',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 300,
          letterSpacing: '0.5px',
          color: '#ffffff',
          marginBottom: '0.5rem',
        }}>
          LDash
        </h1>
        <p style={{
          color: '#71717a',
          fontSize: '1.1rem',
          fontWeight: 400,
        }}>
          Docker Infrastructure Management
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        maxWidth: '800px',
        margin: '0 auto 3rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
      }}>
        <Link href="/containers" style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          color: '#3b82f6',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
        }}>
          Containers
        </Link>
        <Link href="/images" style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          color: '#3b82f6',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
        }}>
          Images
        </Link>
      </nav>

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {error && (
          <div className="card" style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            borderColor: '#dc2626',
            background: 'rgba(220, 38, 38, 0.1)',
          }}>
            <p style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        )}

        {!info && !error && (
          <div className="card" style={{
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid #27272a',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }} />
            <p style={{ color: '#71717a' }}>Loading Docker information...</p>
          </div>
        )}

        {info && (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: '#3b82f6',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                System Info
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Version</span>
                  <p style={{ color: '#ffffff', fontWeight: 500 }}>{info.ServerVersion}</p>
                </div>
                <div>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>OS</span>
                  <p style={{ color: '#ffffff', fontWeight: 500 }}>{info.OperatingSystem}</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: '#3b82f6',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Resources
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Containers</span>
                  <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.5rem' }}>{info.Containers}</p>
                </div>
                <div>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Images</span>
                  <p style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.5rem' }}>{info.Images}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #27272a',
      }}>
        <p style={{
          color: '#52525b',
          fontSize: '0.9rem',
        }}>
          Powered by Next.js & Docker Engine API
        </p>
      </footer>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Dashboard;
