 import { Music } from "lucide-react";
 import { Skeleton } from "@/components/ui/skeleton";
 import type { Tables } from "@/integrations/supabase/types";
 
 interface NowPlayingProps {
   track: Tables<"tracks"> | null;
   isLoading: boolean;
 }
 
 const NowPlaying = ({ track, isLoading }: NowPlayingProps) => {
   if (isLoading) {
     return (
       <div className="flex items-center gap-4">
         <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
         <div className="flex-1 space-y-2">
           <Skeleton className="h-6 w-3/4" />
           <Skeleton className="h-4 w-1/2" />
         </div>
       </div>
     );
   }
 
   if (!track) {
     return null;
   }
 
   return (
     <div className="flex items-center gap-4">
       {/* Album Art */}
       <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
         {track.cover_image_url ? (
           <img
             src={track.cover_image_url}
             alt={`${track.artist_name} - ${track.track_title}`}
             className="w-full h-full object-cover"
           />
         ) : (
           <div className="w-full h-full flex items-center justify-center">
             <Music className="h-8 w-8 text-muted-foreground" />
           </div>
         )}
       </div>
 
       {/* Track Info */}
       <div className="flex-1 min-w-0">
         <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
           Сейчас играет
         </p>
         <h3 className="font-display text-xl md:text-2xl tracking-wide truncate">
           {track.track_title}
         </h3>
         <p className="text-muted-foreground truncate">
           {track.artist_name}
         </p>
       </div>
     </div>
   );
 };
 
 export default NowPlaying;