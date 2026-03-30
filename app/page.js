'use client';

import { useState } from 'react';

export default function Airdown() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  // ← Change this if your backend URL is different
  const backendUrl = 'https://ytdownback.onrender.com';

  const fetchInfo = async () => {
    if (!url.trim()) {
      setError('Please paste a YouTube link');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch(`${backendUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }

      setVideoInfo(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch video. Make sure your cookies.txt is valid and not expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (formatId) => {
    setDownloading(true);
    const downloadUrl = `${backendUrl}/download?url=${encodeURIComponent(url)}&format_id=${formatId}`;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-6xl font-bold mb-3 tracking-tight">Airdown</h1>
          <p className="text-zinc-400 text-lg">YouTube Downloader with Audio • Personal Use</p>
        </div>

        {/* Input Section */}
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube link here..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-red-600 placeholder:text-zinc-500"
            />
            <button
              onClick={fetchInfo}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-10 rounded-2xl font-semibold disabled:opacity-70 transition-all"
            >
              {loading ? 'Fetching...' : 'Go'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-950 border border-red-800 p-5 rounded-2xl text-red-400 mb-8 text-center">
            {error}
          </div>
        )}

        {/* Video Info & Formats */}
        {videoInfo && (
          <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl">
            <div className="flex gap-6 mb-8">
              {videoInfo.thumbnail && (
                <img 
                  src={videoInfo.thumbnail} 
                  alt="thumbnail" 
                  className="w-48 h-28 object-cover rounded-xl flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold leading-tight mb-3 line-clamp-3">
                  {videoInfo.title}
                </h2>
                <p className="text-zinc-400">Duration: {videoInfo.duration}</p>
              </div>
            </div>

            <h3 className="text-xl font-medium mb-5 text-zinc-300">Available Qualities (with Audio)</h3>

            <div className="space-y-3">
              {videoInfo.formats.map((fmt, index) => (
                <button
                  key={index}
                  onClick={() => handleDownload(fmt.format_id)}
                  disabled={downloading}
                  className="w-full flex justify-between items-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-600 p-6 rounded-2xl transition-all group disabled:opacity-60"
                >
                  <div>
                    <span className="text-xl font-medium">{fmt.quality}</span>
                    <span className="ml-3 text-zinc-500">.{fmt.ext}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-zinc-400">{fmt.filesize}</span>
                    <div className="text-red-500 text-sm mt-1 group-hover:underline">Download →</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-500 mt-16">
          For personal use only • Respect copyright • Cookies-based downloader
        </p>
      </div>
    </div>
  );
                    }
