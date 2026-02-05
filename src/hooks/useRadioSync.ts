 import { useState, useEffect, useCallback, useRef } from "react";
 import type { Tables } from "@/integrations/supabase/types";
 
 interface UseRadioSyncProps {
   currentTrack: Tables<"tracks"> | null;
   startedAt: Date | null;
   isPlaying: boolean;
   onTrackEnd?: () => void;
 }
 
 interface RadioSyncState {
   seekPosition: number; // in milliseconds
   elapsedSeconds: number;
   remainingSeconds: number;
   progress: number; // 0-100
 }
 
 export function useRadioSync({
   currentTrack,
   startedAt,
   isPlaying,
   onTrackEnd,
 }: UseRadioSyncProps) {
   const [state, setState] = useState<RadioSyncState>({
     seekPosition: 0,
     elapsedSeconds: 0,
     remainingSeconds: 0,
     progress: 0,
   });
   
   const hasCalledTrackEnd = useRef(false);
   const lastTrackId = useRef<string | null>(null);
 
   // Calculate initial seek position when track/startedAt changes
   const calculateSeekPosition = useCallback(() => {
     if (!currentTrack || !startedAt) {
       return 0;
     }
 
     const now = new Date();
     const elapsedMs = now.getTime() - startedAt.getTime();
     const trackDurationMs = currentTrack.duration_seconds * 1000;
 
     // If elapsed time exceeds track duration, we've looped or need next track
     if (elapsedMs >= trackDurationMs) {
       // Return position within current loop (in case of single track repeat)
       return elapsedMs % trackDurationMs;
     }
 
     return Math.max(0, elapsedMs);
   }, [currentTrack, startedAt]);
 
   // Reset track end flag when track changes
   useEffect(() => {
     if (currentTrack?.id !== lastTrackId.current) {
       hasCalledTrackEnd.current = false;
       lastTrackId.current = currentTrack?.id || null;
     }
   }, [currentTrack?.id]);
 
   // Update state periodically
   useEffect(() => {
     if (!currentTrack || !startedAt) {
       setState({
         seekPosition: 0,
         elapsedSeconds: 0,
         remainingSeconds: 0,
         progress: 0,
       });
       return;
     }
 
     const updateState = () => {
       const now = new Date();
       const elapsedMs = now.getTime() - startedAt.getTime();
       const trackDurationMs = currentTrack.duration_seconds * 1000;
       const trackDurationSec = currentTrack.duration_seconds;
 
       // Check if track should have ended
       if (elapsedMs >= trackDurationMs && !hasCalledTrackEnd.current) {
         hasCalledTrackEnd.current = true;
         onTrackEnd?.();
       }
 
       const elapsedSeconds = Math.min(
         Math.floor(elapsedMs / 1000),
         trackDurationSec
       );
       const remainingSeconds = Math.max(0, trackDurationSec - elapsedSeconds);
       const progress = Math.min((elapsedMs / trackDurationMs) * 100, 100);
 
       setState({
         seekPosition: calculateSeekPosition(),
         elapsedSeconds,
         remainingSeconds,
         progress,
       });
     };
 
     // Initial update
     updateState();
 
     // Update every second while playing
     const interval = isPlaying ? setInterval(updateState, 1000) : null;
 
     return () => {
       if (interval) clearInterval(interval);
     };
   }, [currentTrack, startedAt, isPlaying, calculateSeekPosition, onTrackEnd]);
 
   return {
     ...state,
     initialSeekMs: calculateSeekPosition(),
   };
 }
 
 // Format seconds to MM:SS
 export function formatTime(seconds: number): string {
   const mins = Math.floor(seconds / 60);
   const secs = Math.floor(seconds % 60);
   return `${mins}:${secs.toString().padStart(2, "0")}`;
 }