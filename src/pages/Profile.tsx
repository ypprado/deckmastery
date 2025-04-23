import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Pencil, Share2, UserPlus, UserMinus } from "lucide-react";
import { ProfileComments } from "@/components/profile/ProfileComments";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkFollowStatus();
      fetchFollowerCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setProfile(data);
  };

  const checkFollowStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', user.id)
      .maybeSingle();
      
    setIsFollowing(!!data);
  };

  const fetchFollowerCount = async () => {
    if (!user) return;
    
    const { count } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', user.id);
      
    setFollowerCount(count || 0);
  };

  const handleFollow = async () => {
    if (!user || !profile) return;
    
    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', profile.id);
        
      if (!error) {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: profile.id
        });
        
      if (!error) {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      }
    }
  };

  if (!profile) return null;

  return (
    <div className="container max-w-4xl py-8">
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="rounded-full bg-primary/10 w-full h-full flex items-center justify-center text-2xl font-semibold text-primary">
                  {profile.display_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowing ? (
                <UserMinus className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>

        {profile.bio && (
          <p className="text-muted-foreground mb-6">{profile.bio}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-sm text-muted-foreground">Member since</div>
            <div className="font-semibold">
              {format(new Date(profile.created_at), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-sm text-muted-foreground">Followers</div>
            <div className="font-semibold">{followerCount}</div>
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <div className="text-sm text-muted-foreground">Badges</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">Collector</Badge>
              <Badge variant="secondary">Deck Builder</Badge>
            </div>
          </div>
        </div>

        <ProfileStats userId={user.id} />

        <ProfileComments profileId={user.id} />
      </div>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
    </div>
  );
}
