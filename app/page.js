'use client';

import { useState } from 'react';

export default function Airdown() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please paste a YouTube link');
      return;
    }

    setLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const response = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          isAudioOnly: false,
          isNoTTWatermark: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Service temporarily unavailable. Try again.');
      }

      const data = await response.json();

      if (data.status === 'error' || !data.url) {
        throw new Error(data.text || 'Failed to process this video. Try another link.');
      }

      setVideoInfo({
        title: data.text || 'YouTube Video',
        downloadUrl: data.url,
        thumbnail: `https://i.ytimg.com/vi/${getVideoId(url)}/maxresdefault.jpg`,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch. YouTube is blocking the service right now. Try again in a few minutes or use a different video.');
    } finally {
      setLoading(false);
    }
  };

  const getVideoId = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const handleDownload = () => {
    if (!videoInfo?.downloadUrl) return;
    setDownloading(true);

    const link = document.createElement('a');
    link.href = videoInfo.downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12 pt-10">
          <h1 className="text-6xl font-bold mb-2">Airdown</h1>
          <p className="text-zinc-400">YouTube Downloader • Personal Use</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-3xl mb-10">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube link here..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-red-600 mb-6 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-2xl font-semibold text-lg disabled:opacity-70 transition"
          >
            {loading ? 'Processing...' : 'Get Download Link'}
          </button>
        </form>

        {error && (
          <div className="bg-red-950 border border-red-800 p-6 rounded-2xl text-red-400 mb-8 text-center">
            {error}
          </div>
        )}

        {videoInfo && (
          <div className="bg-zinc-900 rounded-3xl p-8 text-center">
            {videoInfo.thumbnail && (
              <img 
                src={videoInfo.thumbnail} 
                alt="thumbnail" 
                className="w-full rounded-2xl mb-6"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            
            <h3 className="text-2xl font-medium mb-8 line-clamp-3">{videoInfo.title}</h3>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-green-600 hover:bg-green-700 py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              ⬇️ Download Video (with Audio)
            </button>

            <p className="text-xs text-zinc-500 mt-10">
              For personal use only • Powered by Cobalt API
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
