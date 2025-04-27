
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface CardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeColor: string | null;
  onColorToggle: (color: string) => void;
  availableColors: string[];
  onClearFilters: () => void;
  colorMap: Record<string, string>;
  isAnyFilterActive: boolean;
}

const CardFilters = ({
  searchQuery,
  onSearchChange,
  activeColor,
  onColorToggle,
  availableColors,
  onClearFilters,
  colorMap,
  isAnyFilterActive
}: CardFiltersProps) => {
  const { t } = useLanguage();

  return (
    <Card className="animate-scale-up">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchCards')}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {isAnyFilterActive && (
            <Button variant="ghost" onClick={onClearFilters} className="shrink-0">
              <X className="h-4 w-4 mr-2" />
              {t('clearAll')}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('colors')}</Label>
          </div>
          <div className="flex flex-wrap gap-1">
            {availableColors.map(color => (
              <Badge
                key={color}
                variant={activeColor === color ? "default" : "outline"}
                className={cn(
                  "cursor-pointer hover:bg-muted transition-colors",
                  activeColor === color && colorMap[color]
                )}
                onClick={() => onColorToggle(color)}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardFilters;
