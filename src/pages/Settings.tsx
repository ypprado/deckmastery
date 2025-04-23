
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from "@/components/settings/AccountSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings";
import { Card } from "@/components/ui/card";
import LoadingFallback from "@/components/shared/LoadingFallback";

export default function Settings() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">Please sign in to access settings</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card className="p-6">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
          </TabsContent>
          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSettings />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
