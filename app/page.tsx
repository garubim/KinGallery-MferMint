'use client';

import MagicMintButton from './components/MagicMintButton';
import FarcasterActions from './components/FarcasterActions';

export default function Page() {
  return (
    <main style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
      <MagicMintButton />
      <FarcasterActions />
    </main>
  );
}
