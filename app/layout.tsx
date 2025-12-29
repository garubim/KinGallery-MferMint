import RootProvider from './rootProvider';

export const metadata = {
  title: 'KinGallery',
  description: 'Mint art on Base with gas sponsorship',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://kingallery.netlify.app/hero.png","button":{"title":"Mint Art","action":{"type":"launch_frame","name":"KinGallery","url":"https://kingallery.netlify.app"}}}' />
      </head>
      <body style={{ margin: 0, padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)', background: '#071017', color: '#fff' }}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}