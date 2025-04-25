
import { Link } from "react-router-dom";
import { Copyright } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-background border-t subtle-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">{t('company')}</h3>
            <nav className="space-y-3">
              <Link to="/about" className="block text-muted-foreground hover:text-foreground">
                {t('aboutTitle')}
              </Link>
              <Link to="/products" className="block text-muted-foreground hover:text-foreground">
                {t('ourProducts')}
              </Link>
              <Link to="/legal" className="block text-muted-foreground hover:text-foreground">
                {t('legal')}
              </Link>
            </nav>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4">
            <Copyright className="h-4 w-4" />
            <span>{new Date().getFullYear()} DeckMastery. {t('allRightsReserved')}</span>
          </div>
          <p>{t('onePieceDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
};
