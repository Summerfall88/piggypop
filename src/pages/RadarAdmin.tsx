import { Loader2, LogOut, Radio, Music, Inbox } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "@/components/radar/admin/AdminLogin";
import TracksList from "@/components/radar/admin/TracksList";
import AddTrackForm from "@/components/radar/admin/AddTrackForm";
import SubmissionsList from "@/components/radar/admin/SubmissionsList";

const RadarAdmin = () => {
  const { user, isAdmin, isLoading, signIn, signOut } = useAdminAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <AdminLogin onLogin={signIn} />;
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Доступ запрещен</p>
          <p className="text-muted-foreground text-sm">
            У вас нет прав администратора.
          </p>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Radio className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wider">
                RADAR ADMIN
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tracks" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Треки
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Заявки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-6">
            <AddTrackForm />
            <TracksList />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RadarAdmin;
