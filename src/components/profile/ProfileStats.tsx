
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileStatsProps {
  userId: string;
}

export function ProfileStats({ userId }: ProfileStatsProps) {
  const [totalCards, setTotalCards] = useState(0);
  const [totalDecks, setTotalDecks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      console.log("Fetching stats for user ID:", userId);
      
      try {
        // In a real app, fetch actual stats from the database based on userId
        // For now using placeholder data but we're logging the userId for debugging
        setTotalCards(150);
        setTotalDecks(5);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Collection Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Cards</span>
              <span className="font-medium">{loading ? "..." : totalCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Decks Created</span>
              <span className="font-medium">{loading ? "..." : totalDecks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
