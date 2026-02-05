 import { useEffect, useRef } from "react";
 
 interface SoundCloudEmbedProps {
   trackUrl: string;
   isPlaying: boolean;
   volume: number;
 }
 
 declare global {
   interface Window {
     SC?: {
       Widget: {
         (iframe: HTMLIFrameElement): SCWidget;
         Events: {
           READY: string;
           PLAY: string;
           PAUSE: string;
           FINISH: string;
         };
       };
     };
   }
 }
 
 interface SCWidget {
   bind: (event: string, callback: () => void) => void;
   play: () => void;
   pause: () => void;
   setVolume: (volume: number) => void;
   seekTo: (milliseconds: number) => void;
   getDuration: (callback: (duration: number) => void) => void;
   getPosition: (callback: (position: number) => void) => void;
 }
 
 const SoundCloudEmbed = ({ trackUrl, isPlaying, volume }: SoundCloudEmbedProps) => {
   const iframeRef = useRef<HTMLIFrameElement>(null);
   const widgetRef = useRef<SCWidget | null>(null);
   const isReadyRef = useRef(false);
 
   // Load SoundCloud Widget API
   useEffect(() => {
     if (document.getElementById("sc-widget-api")) return;
 
     const script = document.createElement("script");
     script.id = "sc-widget-api";
     script.src = "https://w.soundcloud.com/player/api.js";
     script.async = true;
     document.body.appendChild(script);
   }, []);
 
   // Initialize widget when iframe loads
   useEffect(() => {
     const initWidget = () => {
       if (!iframeRef.current || !window.SC) return;
 
       const widget = window.SC.Widget(iframeRef.current);
       widgetRef.current = widget;
 
       widget.bind(window.SC.Widget.Events.READY, () => {
         isReadyRef.current = true;
         widget.setVolume(volume);
         if (isPlaying) {
           widget.play();
         }
       });
     };
 
     // Wait for SC API to load
     const checkSC = setInterval(() => {
       if (window.SC) {
         clearInterval(checkSC);
         initWidget();
       }
     }, 100);
 
     return () => clearInterval(checkSC);
   }, [trackUrl]);
 
   // Handle play/pause
   useEffect(() => {
     if (!widgetRef.current || !isReadyRef.current) return;
 
     if (isPlaying) {
       widgetRef.current.play();
     } else {
       widgetRef.current.pause();
     }
   }, [isPlaying]);
 
   // Handle volume
   useEffect(() => {
     if (!widgetRef.current || !isReadyRef.current) return;
     widgetRef.current.setVolume(volume);
   }, [volume]);
 
   const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
 
   return (
     <iframe
       ref={iframeRef}
       width="100%"
       height="0"
       scrolling="no"
       frameBorder="no"
       allow="autoplay"
       src={embedUrl}
       className="hidden"
     />
   );
 };
 
 export default SoundCloudEmbed;