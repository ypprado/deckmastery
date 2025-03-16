
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    if (!name) return 'U';
    
    // For email addresses, use the first letter
    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }
    
    // For full names, use first letter of first and last name
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={user.user_metadata?.full_name || user.email || "User"} 
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || user.user_metadata?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut} 
          disabled={isLoggingOut}
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
