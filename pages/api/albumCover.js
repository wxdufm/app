// URL for the library-metadata-lookup Python service (Discogs)
// uses localhost:8000 locally, or whatever LML_URL is set to in production
const LML_URL = process.env.LML_URL || 'http://localhost:8000';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wxdu.art';

const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN || null;

export default async function getAlbumCover(artist, song, album){
    if (!artist || !album || !song) return null;

  // starts by using local discogs through Jake's metadata, then api.wxdu.art API, then final Discogs own API
 const cover =
    await useDiscogsLocal(artist, song, album) ||
    await useMongodb(artist, song, album) ||
    await useDiscogsAPI(artist, song, album);

  return cover;
}

// given an artist, song and album name, searches Discogs and returns an album cover URL
async function useDiscogsLocal(artist, song, album) {

  try {
    // step 1: search Discogs for releases that contain this track
    // encodeURIComponent converts spaces/special chars to URL-safe format
    // e.g. "200 Years" becomes "200%20Years"
    const trackRes = await fetch(
      `${LML_URL}/api/v1/discogs/track-releases?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(song)}`
    );
    const trackData = await trackRes.json();

    // if no releases found on Discogs, return null (no art)
    if (!trackData.releases?.length) return null;

    // take the first matching release's ID
    const releaseId = trackData.releases[0].release_id;

    // step 2: fetch full release details using that ID, which includes artwork_url
    const releaseRes = await fetch(`${LML_URL}/api/v1/discogs/release/${releaseId}`);
    const releaseData = await releaseRes.json();

    return releaseData.artwork_url || null;
  } catch (e) {
    // if anything fails, return null so the widget still works without art
    console.error("[useDiscogsLocal]", e);
    return null;
  }
}

// calling the wxdu.art release API to get album covers from Mongodb
async function useMongodb(artist, song, album){
    let url;

    try{
        const response = await fetch(`${API_URL}/api/releases?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(album)}`)
        const data = await response.json()
        url = data?.[0]?.cover_url
    }catch(e){
        console.error("[useMongodb]", e);
        return null;
    }

    if (!url) return null
    return `${API_URL}/${url}`
}

//using Discogs API direcly instead of Jake's metadata.
// error 429 may occur if two many requests are sent. so use this rarely.
async function useDiscogsAPI(artist, song, album){
  if (!DISCOGS_TOKEN){
    return null
  }
  // setting up URL search parameters
  let params = new URLSearchParams({
    type: "release",
    token: DISCOGS_TOKEN
  });

  // adding to the parameters all that we can find.
  if (artist) params.append("artist", artist);
  if (album) params.append("release_title", album);
  if (song) params.append("track", song);

  // querrying Discogs API
  const res = await fetch(
    `https://api.discogs.com/database/search?${params}`
  );

  if (!res.ok) {
    throw new Error(`Discogs API error: ${res.status}`);
  }

  const data = await res.json();

  // if the first array element does not contain cover image, goes to the next elements until it finds one with cover_image
  // if none is find, returns null
  return (
    data.results?.[0]?.cover_image ??
    data.results?.find(item => item?.cover_image)?.cover_image ??
    null
  );
}