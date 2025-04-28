import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Book, Settings, Menu, X, Moon, Sun, LogIn, ChevronDown, Library, LibraryBig, MessageCircle, Package, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserProfile } from "@/components/user/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useDecks, GameCategory, gameCategories } from "@/hooks/use-decks";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Footer } from "./Footer";
import { ExchangeRate } from "@/components/exchange-rate/ExchangeRate";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const Layout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const { activeGameCategory, changeGameCategory } = useDecks();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentGameName = gameCategories.find(cat => cat.id === activeGameCategory)?.name || 'One Piece';
  
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  const navItems = [{
    path: "/mydecks",
    icon: <Library className="h-5 w-5" />,
    label: t('myDecks')
  }, {
    path: "/collection",
    icon: <LibraryBig className="h-5 w-5" />,
    label: t('collection')
  }, {
    path: "/cards",
    icon: <Book className="h-5 w-5" />,
    label: t('cardLibrary')
  }];

  return <SidebarProvider>
    <div className="min-h-screen flex flex-col w-full">
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-background/80 border-b subtle-border animate-slide-down">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            ) : (
              <SidebarTrigger />
            )}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/9a9a4f13-0ac7-4d75-bf24-d6423c640abe.png" 
                alt="DeckMastery Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="flex items-center">
                <span className="font-display font-semibold text-lg tracking-tight">DeckMastery</span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center ml-1 outline-none">
                    <span className="text-xs text-muted-foreground">{currentGameName}</span>
                    <ChevronDown className="h-3 w-3 ml-0.5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {gameCategories.filter(category => !category.hidden).map((category) => (
                      <DropdownMenuItem 
                        key={category.id}
                        onClick={() => changeGameCategory(category.id as GameCategory)}
                        className={cn(
                          "cursor-pointer",
                          category.id === activeGameCategory && "font-medium bg-accent text-accent-foreground"
                        )}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ExchangeRate />
            
            <LanguageSelector />
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-2" aria-label="Toggle theme">
              {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            
            {!loading && (user ? <UserProfile /> : <Button size="sm" onClick={() => navigate('/auth')} className="ml-2">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('signIn')}
                </Button>)}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={t(item.label)}
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <div className="mt-auto px-3">
              <div className="mt-4 px-3 py-2 text-xs text-muted-foreground">
                <p>DeckMastery {t('version')} 1.0</p>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-4 md:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  </SidebarProvider>;
};

export default Layout;
