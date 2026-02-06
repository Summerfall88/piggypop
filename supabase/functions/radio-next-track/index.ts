import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Track {
  id: string;
  duration_seconds: number;
}

interface RadioState {
  id: number;
  current_track_id: string | null;
  started_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current radio state
    const { data: radioState, error: stateError } = await supabase
      .from("radio_state")
      .select("id, current_track_id, started_at")
      .eq("id", 1)
      .single();

    if (stateError) {
      console.error("Error fetching radio state:", stateError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch radio state" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const state = radioState as RadioState;

    // Get all active tracks
    const { data: tracks, error: tracksError } = await supabase
      .from("tracks")
      .select("id, duration_seconds")
      .eq("status", "active")
      .order("created_at", { ascending: true });

    if (tracksError) {
      console.error("Error fetching tracks:", tracksError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch tracks" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const activeTracks = tracks as Track[];

    if (activeTracks.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active tracks available" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if we need to switch tracks
    let needsSwitch = false;
    let nextTrackId: string;

    if (!state.current_track_id) {
      // No current track, start with first one
      needsSwitch = true;
      nextTrackId = activeTracks[0].id;
    } else {
      // Check if current track has ended
      const currentTrack = activeTracks.find((t) => t.id === state.current_track_id);
      
      if (!currentTrack) {
        // Current track is no longer active, switch to first
        needsSwitch = true;
        nextTrackId = activeTracks[0].id;
      } else {
        const startedAt = new Date(state.started_at).getTime();
        const now = Date.now();
        const elapsedSeconds = (now - startedAt) / 1000;

        if (elapsedSeconds >= currentTrack.duration_seconds) {
          needsSwitch = true;
          
          // Find next track in rotation
          const currentIndex = activeTracks.findIndex((t) => t.id === state.current_track_id);
          const nextIndex = (currentIndex + 1) % activeTracks.length;
          nextTrackId = activeTracks[nextIndex].id;
        } else {
          // Track still playing
          return new Response(
            JSON.stringify({
              message: "Track still playing",
              remaining_seconds: Math.ceil(currentTrack.duration_seconds - elapsedSeconds),
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    if (needsSwitch) {
      const { error: updateError } = await supabase
        .from("radio_state")
        .update({
          current_track_id: nextTrackId!,
          started_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (updateError) {
        console.error("Error updating radio state:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update radio state" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Switched to track: ${nextTrackId}`);
      
      return new Response(
        JSON.stringify({
          message: "Track switched",
          new_track_id: nextTrackId,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "No action needed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
