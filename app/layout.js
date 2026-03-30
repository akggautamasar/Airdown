import './globals.css';

export const metadata = {
  title: 'Airdown - YouTube Downloader',
  description: 'Download YouTube videos with audio in every quality',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
