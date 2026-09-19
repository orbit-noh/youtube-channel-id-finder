const YOUTUBE_FETCH_TIMEOUT_MS = 10_000;
const YOUTUBE_URL_TYPE = {
  CHANNEL: 'channel',
  VIDEO: 'video',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== '/api') {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    if (request.method !== 'GET') {
      return new Response(null, {
        status: 405,
        headers: { Allow: 'GET' },
      });
    }

    const inputYoutubeUrl = url.searchParams.get('url')?.trim();

    if (!inputYoutubeUrl) {
      return new Response(null, { status: 400 });
    }

    const youtubeUrl = normalizeYoutubeUrl(inputYoutubeUrl);
    const youtubeUrlType = getYoutubeUrlType(youtubeUrl);

    if (!youtubeUrlType) {
      return new Response(null, { status: 400 });
    }

    try {
      const res = await fetch(youtubeUrl, {
        signal: AbortSignal.timeout(YOUTUBE_FETCH_TIMEOUT_MS),
      });

      if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) {
        return new Response(null, { status: 502 });
      }

      const html = await res.text();
      const channelId = extractChannelId(html, youtubeUrlType);

      if (!channelId) {
        return new Response(null, { status: 502 });
      }

      return Response.json({ channelId });
    } catch (error) {
      const status = error.name === 'TimeoutError' ? 504 : 502;

      return new Response(null, { status });
    }
  },
};

function normalizeYoutubeUrl(url) {
  const path = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  return `https://www.${path}`;
}

function getYoutubeUrlType(url) {
  if (/^https:\/\/www\.youtube\.com\/@[A-Za-z0-9._-]+$/.test(url)) {
    return YOUTUBE_URL_TYPE.CHANNEL;
  }

  if (/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(url)) {
    return YOUTUBE_URL_TYPE.VIDEO;
  }

  return null;
}

function extractChannelId(html, youtubeUrlType) {
  if (youtubeUrlType === YOUTUBE_URL_TYPE.CHANNEL) {
    return (
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})">/.exec(
        html,
      )?.[1] ?? null
    );
  }

  return (
    /"videoDetails"\s*:\s*\{[\s\S]*?"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/.exec(html)?.[1] ??
    null
  );
}
