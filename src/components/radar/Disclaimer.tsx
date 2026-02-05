 import { AlertCircle, Mail } from "lucide-react";
 
 const Disclaimer = () => {
   return (
     <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground space-y-4 border-t border-border pt-8">
       <div className="flex items-start gap-3 text-left bg-muted/50 rounded-lg p-4">
         <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
         <div className="space-y-2">
           <p>
             <strong>Дисклеймер:</strong> Music Radar — некоммерческий проект. 
             Вся музыка используется с разрешения артистов или из открытых источников.
           </p>
           <p>
             Если вы правообладатель и хотите удалить свой контент, 
             свяжитесь с нами, и мы оперативно удалим его.
           </p>
         </div>
       </div>
 
       <div className="flex items-center justify-center gap-2">
         <Mail className="h-4 w-4" />
         <a
           href="mailto:radar@piggypop.com"
           className="hover:text-foreground transition-colors underline underline-offset-4"
         >
           radar@piggypop.com
         </a>
       </div>
     </div>
   );
 };
 
 export default Disclaimer;