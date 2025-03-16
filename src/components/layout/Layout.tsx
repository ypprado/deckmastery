
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Book, 
  Settings, 
  PlusCircle,
  Menu,
  X,
  Github,
  Moon,
  Sun,
  LogIn
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserProfile } from "@/components/user/UserProfile";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for user preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
                 (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    // Close mobile sidebar when route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  const handleCreateDeck = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a deck",
      });
      navigate('/auth');
      return;
    }
    
    navigate('/deck/new');
    toast({
      title: "Create a new deck",
      description: "Start building your perfect deck strategy!",
    });
  };

  const navItems = [
    { path: "/", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { path: "/cards", icon: <Book className="h-5 w-5" />, label: "Card Library" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-background/80 border-b subtle-border animate-slide-down">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-primary-foreground">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L18 3C19.1046 3 20 3.89543 20 5L20 19C20 20.1046 19.1046 21 18 21L6 21C4.89543 21 4 20.1046 4 19L4 5C4 3.89543 4.89543 3 6 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7L12 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-semibold text-lg tracking-tight">DeckMastery</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={handleCreateDeck}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Deck
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" aria-label="GitHub repository">
                <Github className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
            
            {!loading && (
              user ? (
                <UserProfile />
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="ml-2"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "z-20 shrink-0 border-r subtle-border bg-card/80 backdrop-blur-md w-64 md:relative md:block",
            isMobile && "fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out",
            isMobile && !isSidebarOpen && "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-6 pb-4">
            <div className="flex-1 px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-auto px-3">
              <Button 
                onClick={handleCreateDeck}
                className="w-full justify-start"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Deck
              </Button>
              
              <div className="mt-4 px-3 py-2 text-xs text-muted-foreground">
                <p>DeckMastery v1.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-4 md:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
