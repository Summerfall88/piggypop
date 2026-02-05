 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import type { Tables } from "@/integrations/supabase/types";
 
 interface RadioState {
   currentTrack: Tables<"tracks"> | null;
   startedAt: Date | null;
   isLoading: boolean;
   error: Error | null;
 }
 
 export function useRadioState() {
   const [state, setState] = useState<RadioState>({
     currentTrack: null,
     startedAt: null,
     isLoading: true,
     error: null,
   });
 
   useEffect(() => {
     const fetchRadioState = async () => {
       try {
         // Get radio state with current track
         const { data: radioState, error: radioError } = await supabase
           .from("radio_state")
           .select(`
             *,
             tracks (*)
           `)
           .eq("id", 1)
           .single();
 
         if (radioError) throw radioError;
 
         setState({
           currentTrack: radioState?.tracks as Tables<"tracks"> | null,
           startedAt: radioState?.started_at ? new Date(radioState.started_at) : null,
           isLoading: false,
           error: null,
         });
       } catch (error) {
         console.error("Error fetching radio state:", error);
         setState((prev) => ({
           ...prev,
           isLoading: false,
           error: error as Error,
         }));
       }
     };
 
     fetchRadioState();
 
     // Subscribe to realtime updates
     const channel = supabase
       .channel("radio-state-changes")
       .on(
         "postgres_changes",
         {
           event: "UPDATE",
           schema: "public",
           table: "radio_state",
           filter: "id=eq.1",
         },
         async (payload) => {
           // Refetch to get the joined track data
           const { data: trackData } = await supabase
             .from("tracks")
             .select("*")
             .eq("id", payload.new.current_track_id)
             .single();
 
           setState((prev) => ({
             ...prev,
             currentTrack: trackData,
             startedAt: payload.new.started_at
               ? new Date(payload.new.started_at)
               : null,
           }));
         }
       )
       .subscribe();
 
     return () => {
       supabase.removeChannel(channel);
     };
   }, []);
 
   return state;
 }