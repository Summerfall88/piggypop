import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Search } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const trackSchema = z.object({
  artist_name: z.string().min(1, "Введите имя артиста"),
  track_title: z.string().min(1, "Введите название трека"),
  audio_source_url: z.string().url("Введите корректную ссылку"),
  cover_image_url: z.string().url("Введите корректную ссылку").optional().or(z.literal("")),
  duration_seconds: z.coerce.number().min(1, "Введите длительность"),
});

type TrackFormData = z.infer<typeof trackSchema>;

const AddTrackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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
    },
  });

  const fetchSoundCloudMeta = async (url: string) => {
    if (!url.includes("soundcloud.com")) return;

    setIsFetching(true);
    try {
      const response = await fetch(
        "https://jiixmzwmvxkjpyxyomth.supabase.co/functions/v1/resolve-soundcloud",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      if (data.is_playlist && data.tracks?.length) {
        // It's a playlist — add all tracks
        toast({
          title: `Найден плейлист с ${data.tracks.length} треками`,
          description: "Добавляем все треки...",
        });

        for (const track of data.tracks) {
          await supabase.from("tracks").insert({
            artist_name: track.artist_name || data.artist_name,
            track_title: track.track_title,
            audio_source_url: url, // playlist URL
            cover_image_url: track.cover_image_url || data.cover_image_url || null,
            duration_seconds: track.duration_seconds || 180,
            source_type: "soundcloud" as const,
            status: "active" as const,
          });
        }

        queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
        toast({ title: `${data.tracks.length} треков добавлено` });
        form.reset();
        setIsOpen(false);
        setIsFetching(false);
        return;
      }

      // Single track — populate form
      if (data.artist_name) form.setValue("artist_name", data.artist_name);
      if (data.track_title) form.setValue("track_title", data.track_title);
      if (data.cover_image_url) form.setValue("cover_image_url", data.cover_image_url);
      if (data.duration_seconds > 0) form.setValue("duration_seconds", data.duration_seconds);

      toast({ title: "Метаданные загружены из SoundCloud" });
    } catch (err) {
      console.error("Failed to fetch SoundCloud metadata:", err);
      toast({ title: "Не удалось получить метаданные", variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  };

  const addTrack = useMutation({
    mutationFn: async (data: TrackFormData) => {
      const { error } = await supabase.from("tracks").insert({
        artist_name: data.artist_name,
        track_title: data.track_title,
        audio_source_url: data.audio_source_url,
        cover_image_url: data.cover_image_url || null,
        duration_seconds: data.duration_seconds,
        source_type: "soundcloud" as const,
        status: "active" as const,
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
          {/* URL field with auto-fetch */}
          <FormField
            control={form.control}
            name="audio_source_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ссылка SoundCloud</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="https://soundcloud.com/..."
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        if (e.target.value && e.target.value.includes("soundcloud.com")) {
                          fetchSoundCloudMeta(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isFetching || !field.value}
                    onClick={() => fetchSoundCloudMeta(field.value)}
                  >
                    {isFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="artist_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артист</FormLabel>
                  <FormControl>
                    <Input placeholder="Автоматически из SC" {...field} />
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
                    <Input placeholder="Автоматически из SC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cover_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Обложка (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="Автоматически из SC" {...field} />
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
                    <Input type="number" placeholder="Авто" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
