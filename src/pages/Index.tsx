
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to DeckMastery</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        The ultimate platform for creating and managing your trading card game decks
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {user ? (
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        )}
        
        <Link to="/cards">
          <Button variant="outline" size="lg" className="px-8">
            Explore Card Library
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-8">
        <div className="bg-card p-6 rounded-lg border subtle-border">
          <h3 className="text-lg font-semibold mb-2">Multiple Game Support</h3>
          <p className="text-muted-foreground">
            Build decks for Magic, Pokémon, Yu-Gi-Oh!, and One Piece card games.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border subtle-border">
          <h3 className="text-lg font-semibold mb-2">Track Your Collection</h3>
          <p className="text-muted-foreground">
            Manage your card collection and track card prices over time.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border subtle-border">
          <h3 className="text-lg font-semibold mb-2">Share Deck Strategies</h3>
          <p className="text-muted-foreground">
            Create, save, and share your winning deck strategies with the community.
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/static-data">
          <Button variant="link" size="sm">
            Static JSON Data Manager
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
