import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const trackSchema = z.object({
  artist_name: z.string().min(1, "Введите имя артиста"),
  track_title: z.string().min(1, "Введите название трека"),
  audio_source_url: z.string().url("Введите корректную ссылку"),
  cover_image_url: z.string().url("Введите корректную ссылку").optional().or(z.literal("")),
  duration_seconds: z.coerce.number().min(1, "Введите длительность"),
  source_type: z.enum(["soundcloud", "youtube", "file"]),
});

type TrackFormData = z.infer<typeof trackSchema>;

const AddTrackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      artist_name: "",
      track_title: "",
      audio_source_url: "",
      cover_image_url: "",
      duration_seconds: 0,
      source_type: "soundcloud",
    },
  });

  const addTrack = useMutation({
    mutationFn: async (data: TrackFormData) => {
      const { error } = await supabase.from("tracks").insert({
        artist_name: data.artist_name,
        track_title: data.track_title,
        audio_source_url: data.audio_source_url,
        cover_image_url: data.cover_image_url || null,
        duration_seconds: data.duration_seconds,
        source_type: data.source_type,
        status: "active",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
      toast({ title: "Трек добавлен" });
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "Ошибка добавления", variant: "destructive" });
    },
  });

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Добавить трек
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Новый трек</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Отмена
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => addTrack.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="artist_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артист</FormLabel>
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
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Track Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="audio_source_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ссылка на трек</FormLabel>
                <FormControl>
                  <Input placeholder="https://soundcloud.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cover_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Обложка (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Длительность (сек)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="180" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="source_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Источник</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="soundcloud">SoundCloud</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="file">Файл</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={addTrack.isPending}>
            {addTrack.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Добавляем...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Добавить
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTrackForm;
