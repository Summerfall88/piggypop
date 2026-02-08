import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { Check, X, Loader2 } from "lucide-react";

type Track = Tables<"tracks">;

interface EditTrackFormProps {
  track: Track;
  onClose: () => void;
}

const EditTrackForm = ({ track, onClose }: EditTrackFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    artist_name: track.artist_name,
    track_title: track.track_title,
    audio_source_url: track.audio_source_url,
    cover_image_url: track.cover_image_url || "",
    duration_seconds: track.duration_seconds,
  });

  const updateTrack = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tracks")
        .update({
          artist_name: form.artist_name,
          track_title: form.track_title,
          audio_source_url: form.audio_source_url,
          cover_image_url: form.cover_image_url || null,
          duration_seconds: form.duration_seconds,
        })
        .eq("id", track.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
      toast({ title: "Трек обновлён" });
      onClose();
    },
    onError: () => {
      toast({ title: "Ошибка обновления", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-3 p-4 border border-primary/30 rounded-lg bg-primary/5">
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={form.artist_name}
          onChange={(e) => setForm((p) => ({ ...p, artist_name: e.target.value }))}
          placeholder="Артист"
        />
        <Input
          value={form.track_title}
          onChange={(e) => setForm((p) => ({ ...p, track_title: e.target.value }))}
          placeholder="Название"
        />
      </div>
      <Input
        value={form.audio_source_url}
        onChange={(e) => setForm((p) => ({ ...p, audio_source_url: e.target.value }))}
        placeholder="URL трека"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={form.cover_image_url}
          onChange={(e) => setForm((p) => ({ ...p, cover_image_url: e.target.value }))}
          placeholder="URL обложки"
        />
        <Input
          type="number"
          value={form.duration_seconds}
          onChange={(e) => setForm((p) => ({ ...p, duration_seconds: parseInt(e.target.value) || 0 }))}
          placeholder="Длительность (сек)"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-1" /> Отмена
        </Button>
        <Button size="sm" onClick={() => updateTrack.mutate()} disabled={updateTrack.isPending}>
          {updateTrack.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default EditTrackForm;
