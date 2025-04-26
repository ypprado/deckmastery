import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { commentSchema, sanitizeUserInput } from "@/utils/validation";

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
  const [error, setError] = useState<string | null>(null);

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

  const validateAndSanitizeComment = (content: string) => {
    try {
      const result = commentSchema.parse(content);
      return { isValid: true, sanitized: result };
    } catch (error) {
      if (error instanceof Error) {
        return { isValid: false, error: error.message };
      }
      return { isValid: false, error: "Invalid comment" };
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    const validation = validateAndSanitizeComment(newComment);
    if (!validation.isValid) {
      toast({
        title: "Invalid comment",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('profile_comments')
        .insert({
          profile_id: profileId,
          author_id: user.id,
          content: validation.sanitized
        });

      if (submitError) throw submitError;

      setNewComment("");
      fetchComments();
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to post comment");
      toast({
        title: "Error posting comment",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setError(null);
            }}
            maxLength={1000}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button 
            onClick={handleSubmitComment} 
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
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
                <div className="font-medium">
                  {sanitizeUserInput(comment.author.username)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(comment.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {sanitizeUserInput(comment.content)}
            </p>
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
