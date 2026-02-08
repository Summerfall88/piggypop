import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SoundCloudMetadata {
  artist_name: string;
  track_title: string;
  cover_image_url: string | null;
  duration_seconds: number;
  is_playlist: boolean;
  tracks?: SoundCloudMetadata[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch oEmbed data for basic info
    const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const oembedRes = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    });

    console.log("oEmbed status:", oembedRes.status);

    if (!oembedRes.ok) {
      const body = await oembedRes.text();
      console.error("oEmbed error body:", body);
      return new Response(
        JSON.stringify({ error: "Failed to fetch SoundCloud metadata. Check the URL.", details: body }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const oembed = await oembedRes.json();

    // 2. Fetch the actual page to extract duration and check if playlist
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)",
        "Accept": "text/html",
      },
    });

    const html = await pageRes.text();

    // Check if it's a playlist/set
    const isPlaylist = url.includes("/sets/") || oembed.title?.includes(" by ") && html.includes("soundcloud://playlists:");

    // Extract duration from meta tags or JSON in page
    let durationSeconds = 0;

    // Try to find duration in the page's structured data
    // SoundCloud pages have JSON-LD or hydration data with duration
    const durationMatch = html.match(/"duration":(\d+)/);
    if (durationMatch) {
      // SoundCloud stores duration in milliseconds in their JSON data
      durationSeconds = Math.round(parseInt(durationMatch[1]) / 1000);
    }

    // Fallback: try meta tag
    if (durationSeconds === 0) {
      const metaDuration = html.match(/<meta\s+property="music:duration"\s+content="(\d+)"/);
      if (metaDuration) {
        durationSeconds = parseInt(metaDuration[1]);
      }
    }

    // Parse artist and title from oEmbed
    // oEmbed title format is usually "Track Title by Artist Name"
    let artistName = oembed.author_name || "";
    let trackTitle = oembed.title || "";

    // oEmbed title often includes "by Artist" - clean it up
    const byMatch = trackTitle.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      trackTitle = byMatch[1].trim();
      if (!artistName) {
        artistName = byMatch[2].trim();
      }
    }

    // Get higher quality thumbnail
    let coverUrl = oembed.thumbnail_url || null;
    if (coverUrl) {
      // Replace small thumbnail with larger version
      coverUrl = coverUrl.replace("-t500x500.", "-t500x500.").replace("-large.", "-t500x500.");
    }

    // If it's a playlist, try to extract individual track data
    let playlistTracks: SoundCloudMetadata[] | undefined;
    
    if (isPlaylist || url.includes("/sets/")) {
      // Extract track data from the page's hydration script
      const tracksDataMatch = html.match(/"tracks":\s*\[([\s\S]*?)\]/);
      if (tracksDataMatch) {
        try {
          // Try to parse individual track entries
          const trackEntries = html.matchAll(/"title":"([^"]+)"[\s\S]*?"duration":(\d+)[\s\S]*?"username":"([^"]+)"/g);
          playlistTracks = [];
          for (const match of trackEntries) {
            playlistTracks.push({
              artist_name: match[3],
              track_title: match[1],
              cover_image_url: coverUrl,
              duration_seconds: Math.round(parseInt(match[2]) / 1000),
              is_playlist: false,
            });
          }
        } catch {
          // Parsing failed, that's ok
        }
      }
    }

    const result: SoundCloudMetadata = {
      artist_name: artistName,
      track_title: trackTitle,
      cover_image_url: coverUrl,
      duration_seconds: durationSeconds,
      is_playlist: isPlaylist || url.includes("/sets/"),
      tracks: playlistTracks,
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error resolving SoundCloud URL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to resolve SoundCloud URL" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
