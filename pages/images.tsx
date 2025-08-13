import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Image = {
  Id: string;
  RepoTags: string[];
  Created: number;
  Size: number;
};

const ImagesPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/docker/images');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setImages(data);
        setError(null);
      } else {
        setError(data.error || 'Invalid response format');
        setImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setError('Failed to fetch images');
      setImages([]);
    }
    setLoading(false);
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#000000', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Back to Dashboard</Link>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', margin: '1rem 0' }}>Docker Images</h1>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#71717a' }}>Loading images...</p>
          </div>
        ) : error ? (
          <div className="card" style={{
            padding: '1.5rem',
            borderColor: '#dc2626',
            background: 'rgba(220, 38, 38, 0.1)',
          }}>
            <p style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#71717a' }}>No images found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {images.map(image => (
              <div key={image.Id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                      {image.RepoTags?.[0] || 'Unnamed Image'}
                    </h3>
                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                      ID: {image.Id.slice(7, 19)}
                    </p>
                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                      Size: {formatSize(image.Size)}
                    </p>
                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                      Created: {formatDate(image.Created)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
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

export default ImagesPage;
