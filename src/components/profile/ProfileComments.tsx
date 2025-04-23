
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    avatar_url: string | null;
  };
}

interface ProfileCommentsProps {
  profileId: string;
}

export function ProfileComments({ profileId }: ProfileCommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [profileId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('profile_comments')
      .select(`
        id,
        content,
        created_at,
        author:profiles!profile_comments_author_id_fkey (
          username,
          avatar_url
        )
      `)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('profile_comments')
      .insert({
        profile_id: profileId,
        author_id: user.id,
        content: newComment.trim()
      });

    setIsSubmitting(false);
    
    if (error) {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setNewComment("");
    fetchComments();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={!newComment.trim() || isSubmitting}
          >
            Post Comment
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-background rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {comment.author.username[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium">@{comment.author.username}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No comments yet
          </div>
        )}
      </div>
    </div>
  );
}
