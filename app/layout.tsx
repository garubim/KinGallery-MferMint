import RootProvider from './rootProvider';

export const metadata = {
  title: 'KinGallery',
  description: 'Mini app para mintar arte na Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}