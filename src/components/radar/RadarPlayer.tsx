 import { useState, useRef, useCallback } from "react";
 import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Slider } from "@/components/ui/slider";
 import { Progress } from "@/components/ui/progress";
 import NowPlaying from "./NowPlaying";
 import SoundCloudEmbed, { type SoundCloudEmbedRef } from "./SoundCloudEmbed";
 import { useRadioState } from "@/hooks/useRadioState";
 import { useRadioSync, formatTime } from "@/hooks/useRadioSync";
 import { supabase } from "@/integrations/supabase/client";
 
 const RadarPlayer = () => {
   const [isPlaying, setIsPlaying] = useState(false);
   const [volume, setVolume] = useState(80);
   const [isMuted, setIsMuted] = useState(false);
   const { currentTrack, startedAt, isLoading } = useRadioState();
   const soundcloudRef = useRef<SoundCloudEmbedRef>(null);
 
   // Handle track end - trigger next track
   const handleTrackEnd = useCallback(async () => {
     console.log("Track ended, fetching next track...");
     
     try {
       // Get all active tracks
       const { data: tracks, error } = await supabase
         .from("tracks")
         .select("id")
         .eq("status", "active")
         .order("created_at", { ascending: true });
 
       if (error || !tracks || tracks.length === 0) {
         console.log("No active tracks available");
         return;
       }
 
       // Find current track index and get next one
       const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
       const nextIndex = (currentIndex + 1) % tracks.length;
       const nextTrackId = tracks[nextIndex].id;
 
       // Note: In production, this would be handled by an Edge Function
       // For now, we just log - the admin will manage track changes
       console.log("Next track would be:", nextTrackId);
     } catch (err) {
       console.error("Error handling track end:", err);
     }
   }, [currentTrack?.id]);
 
   const { elapsedSeconds, remainingSeconds, progress, initialSeekMs } = useRadioSync({
     currentTrack,
     startedAt,
     isPlaying,
     onTrackEnd: handleTrackEnd,
   });
 
   const handlePlayPause = () => {
     setIsPlaying(!isPlaying);
   };
 
   const handleVolumeChange = (value: number[]) => {
     setVolume(value[0]);
     if (value[0] > 0 && isMuted) {
       setIsMuted(false);
     }
   };
 
   const toggleMute = () => {
     setIsMuted(!isMuted);
   };
 
   return (
     <div className="relative">
       {/* Live indicator */}
       <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
         <div className="flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-foreground opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive-foreground"></span>
           </span>
           LIVE
         </div>
       </div>
 
       {/* Main player card */}
       <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 shadow-xl">
         {/* Now Playing */}
         <NowPlaying track={currentTrack} isLoading={isLoading} />
 
         {/* Progress Bar */}
         {currentTrack && (
           <div className="mt-4 space-y-2">
             <Progress value={progress} className="h-1" />
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>{formatTime(elapsedSeconds)}</span>
               <span>-{formatTime(remainingSeconds)}</span>
             </div>
           </div>
         )}
 
         {/* SoundCloud Embed (hidden, controls audio) */}
         {currentTrack && (
           <SoundCloudEmbed
             ref={soundcloudRef}
             trackUrl={currentTrack.audio_source_url}
             isPlaying={isPlaying}
             volume={isMuted ? 0 : volume}
             initialSeekMs={initialSeekMs}
             onTrackEnd={handleTrackEnd}
           />
         )}
 
         {/* Controls */}
         <div className="flex flex-col gap-4 mt-6">
           {/* Play/Pause Button */}
           <div className="flex justify-center">
             <Button
               size="lg"
               onClick={handlePlayPause}
               disabled={!currentTrack}
               className="w-16 h-16 rounded-full"
             >
               {isPlaying ? (
                 <Pause className="h-8 w-8" />
               ) : (
                 <Play className="h-8 w-8 ml-1" />
               )}
             </Button>
           </div>
 
           {/* Volume Control */}
           <div className="flex items-center gap-3 max-w-xs mx-auto w-full">
             <Button
               variant="ghost"
               size="icon"
               onClick={toggleMute}
               className="shrink-0"
             >
               {isMuted || volume === 0 ? (
                 <VolumeX className="h-5 w-5" />
               ) : (
                 <Volume2 className="h-5 w-5" />
               )}
             </Button>
             <Slider
               value={[isMuted ? 0 : volume]}
               onValueChange={handleVolumeChange}
               max={100}
               step={1}
               className="flex-1"
             />
           </div>
         </div>
 
         {/* No track message */}
         {!isLoading && !currentTrack && (
           <div className="text-center mt-6 text-muted-foreground">
             <Radio className="h-12 w-12 mx-auto mb-2 opacity-50" />
             <p>Сейчас ничего не играет</p>
             <p className="text-sm">Скоро начнётся трансляция...</p>
           </div>
         )}
       </div>
     </div>
   );
 };
 
 export default RadarPlayer;