import { useState, useRef, useCallback } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import NowPlaying from "./NowPlaying";
import SoundCloudEmbed, { type SoundCloudEmbedRef } from "./SoundCloudEmbed";
import { useRadioState } from "@/hooks/useRadioState";
import { useRadioSync } from "@/hooks/useRadioSync";
 
 const RadarPlayer = () => {
   const [isPlaying, setIsPlaying] = useState(true);
   const [volume, setVolume] = useState(80);
   const [isMuted, setIsMuted] = useState(false);
   const { currentTrack, startedAt, isLoading } = useRadioState();
   const soundcloudRef = useRef<SoundCloudEmbedRef>(null);
 
   // Handle track end - trigger next track
    const handleTrackEnd = useCallback(async () => {
      console.log("Track ended, calling radio-next-track with force...");
      
      const callNextTrack = async (attempt: number) => {
        try {
          const response = await fetch(
            "https://jiixmzwmvxkjpyxyomth.supabase.co/functions/v1/radio-next-track",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ force: true }),
            }
          );
          const result = await response.json();
          console.log(`Next track result (attempt ${attempt}):`, result);
          return result;
        } catch (err) {
          console.error(`Error calling radio-next-track (attempt ${attempt}):`, err);
          return null;
        }
      };

      // Try up to 3 times with increasing delays
      let result = await callNextTrack(1);
      if (!result || result.error) {
        await new Promise(r => setTimeout(r, 2000));
        result = await callNextTrack(2);
      }
      if (!result || result.error) {
        await new Promise(r => setTimeout(r, 5000));
        await callNextTrack(3);
      }
    }, []);
 
   const { elapsedSeconds, remainingSeconds, progress, initialSeekMs } = useRadioSync({
     currentTrack,
     startedAt,
     isPlaying,
     onTrackEnd: handleTrackEnd,
   });
 
  // Volume handlers
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
 
          {/* Volume Control */}
          <div className="flex items-center gap-3 max-w-xs mx-auto w-full mt-6">
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