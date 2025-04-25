
import { Link } from "react-router-dom";
import { Copyright } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-background border-t subtle-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Update the grid to a flex layout */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <Link to="/about" className="text-muted-foreground hover:text-foreground">
            {t('aboutTitle')}
          </Link>
          <Link to="/products" className="text-muted-foreground hover:text-foreground">
            {t('ourProducts')}
          </Link>
          <Link to="/legal" className="text-muted-foreground hover:text-foreground">
            {t('legal')}
          </Link>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} DeckMastery. {t('allRightsReserved')}</span>
          </div>
          <p className="text-center">{t('onePieceDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
};
