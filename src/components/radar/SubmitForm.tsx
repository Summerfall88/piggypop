 import { useState } from "react";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { z } from "zod";
 import { Send, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Checkbox } from "@/components/ui/checkbox";
 import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from "@/components/ui/form";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 
 const submitSchema = z.object({
   artist_name: z.string().min(1, "Введите имя артиста"),
   track_title: z.string().min(1, "Введите название трека"),
   track_url: z
     .string()
     .url("Введите корректную ссылку")
     .refine(
       (url) => url.includes("soundcloud.com"),
       "Ссылка должна быть на SoundCloud"
     ),
   email: z.string().email("Введите корректный email").optional().or(z.literal("")),
   agreed_to_terms: z.boolean().refine((val) => val === true, {
     message: "Необходимо согласиться с условиями",
   }),
 });
 
 type SubmitFormData = z.infer<typeof submitSchema>;
 
 const SubmitForm = () => {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { toast } = useToast();
 
   const form = useForm<SubmitFormData>({
     resolver: zodResolver(submitSchema),
     defaultValues: {
       artist_name: "",
       track_title: "",
       track_url: "",
       email: "",
       agreed_to_terms: false,
     },
   });
 
   const onSubmit = async (data: SubmitFormData) => {
     setIsSubmitting(true);
 
     try {
       const { error } = await supabase.from("submissions").insert({
         artist_name: data.artist_name,
         track_title: data.track_title,
         track_url: data.track_url,
         email: data.email || null,
         agreed_to_terms: data.agreed_to_terms,
       });
 
       if (error) throw error;
 
       toast({
         title: "Заявка отправлена!",
         description: "Мы рассмотрим твой трек в ближайшее время.",
       });
 
       form.reset();
     } catch (error) {
       console.error("Submit error:", error);
       toast({
         title: "Ошибка",
         description: "Не удалось отправить заявку. Попробуй позже.",
         variant: "destructive",
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   return (
     <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
         <FormField
           control={form.control}
           name="artist_name"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Имя артиста</FormLabel>
               <FormControl>
                 <Input placeholder="PIGGY POP" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
 
         <FormField
           control={form.control}
           name="track_title"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Название трека</FormLabel>
               <FormControl>
                 <Input placeholder="Underground Vibes" {...field} />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
 
         <FormField
           control={form.control}
           name="track_url"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Ссылка на SoundCloud</FormLabel>
               <FormControl>
                 <Input
                   placeholder="https://soundcloud.com/artist/track"
                   {...field}
                 />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
 
         <FormField
           control={form.control}
           name="email"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Email (опционально)</FormLabel>
               <FormControl>
                 <Input
                   type="email"
                   placeholder="artist@example.com"
                   {...field}
                 />
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
 
         <FormField
           control={form.control}
           name="agreed_to_terms"
           render={({ field }) => (
             <FormItem className="flex flex-row items-start space-x-3 space-y-0">
               <FormControl>
                 <Checkbox
                   checked={field.value}
                   onCheckedChange={field.onChange}
                 />
               </FormControl>
               <div className="space-y-1 leading-none">
                 <FormLabel className="text-sm font-normal">
                   Я подтверждаю, что являюсь правообладателем или имею разрешение на использование этого трека
                 </FormLabel>
                 <FormMessage />
               </div>
             </FormItem>
           )}
         />
 
         <Button type="submit" className="w-full" disabled={isSubmitting}>
           {isSubmitting ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Отправляем...
             </>
           ) : (
             <>
               <Send className="mr-2 h-4 w-4" />
               Отправить заявку
             </>
           )}
         </Button>
       </form>
     </Form>
   );
 };
 
 export default SubmitForm;