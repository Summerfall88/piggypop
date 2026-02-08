import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Pause, Trash2, Radio, Loader2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import EditTrackForm from "./EditTrackForm";
import type { Tables } from "@/integrations/supabase/types";

type Track = Tables<"tracks">;

const TracksList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settingCurrent, setSettingCurrent] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: tracks, isLoading } = useQuery({
    queryKey: ["admin-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Track[];
    },
  });

  const { data: radioState } = useQuery({
    queryKey: ["radio-state"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radio_state")
        .select("current_track_id")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      const { error } = await supabase
        .from("tracks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
      toast({ title: "Статус обновлен" });
    },
    onError: () => {
      toast({ title: "Ошибка", variant: "destructive" });
    },
  });

  const setCurrentTrack = useMutation({
    mutationFn: async (trackId: string) => {
      setSettingCurrent(trackId);
      const { error } = await supabase
        .from("radio_state")
        .update({
          current_track_id: trackId,
          started_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radio-state"] });
      toast({ title: "Текущий трек изменен" });
      setSettingCurrent(null);
    },
    onError: () => {
      toast({ title: "Ошибка", variant: "destructive" });
      setSettingCurrent(null);
    },
  });

  const deleteTrack = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tracks"] });
      toast({ title: "Трек удален" });
    },
    onError: () => {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    },
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tracks?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Треков пока нет. Добавьте первый трек.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((track) => {
        const isCurrent = radioState?.current_track_id === track.id;

        if (editingId === track.id) {
          return (
            <EditTrackForm
              key={track.id}
              track={track}
              onClose={() => setEditingId(null)}
            />
          );
        }

        return (
          <div
            key={track.id}
            className={`flex items-center gap-4 p-4 rounded-lg border ${
              isCurrent ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {/* Cover */}
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
              {track.cover_image_url ? (
                <img
                  src={track.cover_image_url}
                  alt={track.track_title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <Radio className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{track.track_title}</p>
                {isCurrent && (
                  <Badge variant="default" className="shrink-0">
                    В эфире
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {track.artist_name} • {formatDuration(track.duration_seconds)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Toggle active */}
              <Switch
                checked={track.status === "active"}
                onCheckedChange={(checked) =>
                  toggleStatus.mutate({
                    id: track.id,
                    status: checked ? "active" : "inactive",
                  })
                }
              />

              {/* Set as current */}
              <Button
                size="icon"
                variant={isCurrent ? "default" : "outline"}
                onClick={() => setCurrentTrack.mutate(track.id)}
                disabled={settingCurrent === track.id || track.status !== "active"}
              >
                {settingCurrent === track.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              {/* Edit */}
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditingId(track.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              {/* Delete */}
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("Удалить этот трек?")) {
                    deleteTrack.mutate(track.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TracksList;
