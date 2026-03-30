import './globals.css';

export const metadata = {
  title: 'Airdown - YouTube Downloader',
  description: 'Download YouTube videos in highest quality with audio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950">{children}</body>
    </html>
  );
}
