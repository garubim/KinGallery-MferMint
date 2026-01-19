import RootProvider from './rootProvider';

export const metadata = {
  title: 'KinGallery - The Smile at 9h',
  description: 'This is not animation; it\'s a ritual. Mint art on Base with gas sponsorship.',
  openGraph: {
    title: 'KinGallery - The Smile at 9h',
    description: 'This is not animation; it\'s a ritual. Mint art on Base.',
    images: ['https://kingallery.netlify.app/hero.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KinGallery - The Smile at 9h',
    description: 'This is not animation; it\'s a ritual',
    images: ['https://kingallery.netlify.app/hero.png'],
  },
  other: {
    // Farcaster Mini App metadata
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: 'https://kingallery.netlify.app/hero.png',
      button: {
        title: 'Mint Art',
        action: {
          type: 'launch_miniapp',
          name: 'KinGallery',
          url: 'https://kingallery.netlify.app',
          splashImageUrl: 'https://kingallery.netlify.app/splash.png',
          splashBackgroundColor: '#05080a',
        },
      },
    }),
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#071017" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Base.app optimizations */}
        <meta property="eth:chain" content="base" />
        <meta property="eth:chainId" content="8453" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)', background: '#071017', color: '#fff', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}