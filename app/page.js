const fetchInfo = async () => {
  if (!url.trim()) {
    setError("Please paste a YouTube link");
    return;
  }

  setLoading(true);
  setError("");
  setVideoInfo(null);

  try {
    const response = await fetch(`${backendUrl}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch video info");
    }

    setVideoInfo(data);
  } catch (err) {
    console.error(err);
    setError(err.message || "Failed to fetch video. Make sure cookies are valid.");
  } finally {
    setLoading(false);
  }
};

const handleDownload = (formatId) => {
  const downloadUrl = `${backendUrl}/download?url=${encodeURIComponent(url)}&format_id=${formatId}`;
  window.location.href = downloadUrl;
};
