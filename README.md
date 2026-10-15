# YouTube Thumbnail Previewer

A single-page web app that shows how a video title, thumbnail, avatar, and channel name would look in the YouTube desktop and mobile home feeds, placed among real trending videos so you can judge it in context. Run `npm install`, then `npm run dev` for a local dev server, `npm run build` for a production build, `npm run test` for the unit tests, and `npm run lint` to lint. Everything runs client-side: your uploaded images are read with `URL.createObjectURL` and never leave your browser, and the only network requests at runtime are thumbnail/avatar images loaded from YouTube's public image hosts.

## Refreshing the filler feed

The filler videos come from a committed snapshot at `src/data/feed.json`. To regenerate it with the current most-popular videos:

1. Create an API key in the [Google Cloud Console](https://console.cloud.google.com/): create a project, enable **YouTube Data API v3**, then create an API key under **APIs & Services -> Credentials**.
2. Create a `.env` file in the project root containing `YT_API_KEY=your_key`.
3. Run `npm run feed:fetch`.

This calls only `videos.list` and `channels.list` (1 quota unit each), using roughly **20 of the free 10,000 units** available per day, so you can run it many times over. If no key is present the command instead writes a small placeholder feed (using real YouTube thumbnail IDs) so the app still runs. YouTube's API terms ask that stored data be refreshed at least every 30 days, so re-run `npm run feed:fetch` within a month of the last snapshot.
