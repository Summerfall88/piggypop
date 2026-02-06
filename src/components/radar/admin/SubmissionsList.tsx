import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, ExternalLink, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"submissions">;

const SubmissionsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => {
      const { error } = await supabase
        .from("submissions")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast({
        title: variables.status === "approved" ? "Заявка одобрена" : "Заявка отклонена",
      });
    },
    onError: () => {
      toast({ title: "Ошибка", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">На рассмотрении</Badge>;
      case "approved":
        return <Badge variant="default">Одобрено</Badge>;
      case "rejected":
        return <Badge variant="destructive">Отклонено</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Заявок пока нет.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="p-4 rounded-lg border border-border space-y-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">{submission.track_title}</p>
              <p className="text-sm text-muted-foreground">
                {submission.artist_name}
              </p>
            </div>
            {getStatusBadge(submission.status)}
          </div>

          {/* Link */}
          <a
            href={submission.track_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline truncate"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate">{submission.track_url}</span>
          </a>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatDate(submission.created_at)}</span>
              {submission.email && (
                <a
                  href={`mailto:${submission.email}`}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Mail className="h-3 w-3" />
                  {submission.email}
                </a>
              )}
            </div>

            {submission.status === "pending" && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    updateStatus.mutate({ id: submission.id, status: "rejected" })
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Отклонить
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus.mutate({ id: submission.id, status: "approved" })
                  }
                >
                  <Check className="h-4 w-4 mr-1" />
                  Одобрить
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsList;
