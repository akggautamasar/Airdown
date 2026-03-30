'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const backendUrl = 'https://airdownbackend.onrender.com'; // ← CHANGE THIS to your Render URL

  const fetchInfo = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const res = await fetch(`${backendUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load video');

      setVideoInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (formatId) => {
    setDownloading(true);
    const downloadUrl = `${backendUrl}/download?url=${encodeURIComponent(url)}&format_id=${formatId}`;
    window.location.href = downloadUrl;

    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-12">
      <h1 className="text-5xl font-bold text-center mb-2 text-white">Airdown</h1>
      <p className="text-center text-zinc-400 mb-10">YouTube Downloader with Audio in Every Quality</p>

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube link here..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-red-500"
          />
          <button
            onClick={fetchInfo}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-8 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Go'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {videoInfo && (
        <div className="mt-10">
          <div className="flex gap-6 bg-zinc-900 p-6 rounded-2xl">
            <img src={videoInfo.thumbnail} alt="thumbnail" className="w-40 h-28 object-cover rounded-xl" />
            <div>
              <h2 className="text-xl font-semibold line-clamp-2">{videoInfo.title}</h2>
              <p className="text-zinc-400 mt-2">Duration: {videoInfo.duration}</p>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Available Qualities (with Audio)</h3>
          
          <div className="grid gap-3">
            {videoInfo.formats.map((fmt, i) => (
              <button
                key={i}
                onClick={() => handleDownload(fmt.format_id)}
                disabled={downloading}
                className="flex justify-between items-center bg-zinc-900 hover:bg-zinc-800 p-5 rounded-2xl transition-all border border-zinc-700 hover:border-red-600 group"
              >
                <div>
                  <span className="font-medium text-lg">{fmt.quality}</span>
                  <span className="ml-3 text-sm text-zinc-500">.{fmt.ext}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-sm">{fmt.filesize}</span>
                  <div className="text-red-500 text-xs mt-1 group-hover:underline">Download →</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-zinc-500 mt-16">
        For personal use only • Respect copyright
      </p>
    </div>
  );
}
