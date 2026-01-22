'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ArtworkMetadata from '../components/ArtworkMetadata';

function GalleryContent() {
  const searchParams = useSearchParams();
  const tokenId = searchParams.get('tokenId');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', marginBottom: '40px', textAlign: 'center' }}>Your NFT</h1>
        
        {tokenId ? (
          <ArtworkMetadata tokenId={tokenId} />
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '60px 20px' }}>
            <p>No NFT selected. Mint one to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
