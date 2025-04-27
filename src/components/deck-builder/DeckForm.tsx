
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

interface DeckFormProps {
  deckName: string;
  setDeckName: (name: string) => void;
  deckFormat: string;
  setDeckFormat: (format: string) => void;
  deckDescription: string;
  setDeckDescription: (description: string) => void;
  onSave: () => void;
  selectedCardsCount: number;
  isEditMode: boolean;
}

const DeckForm = ({
  deckName,
  setDeckName,
  deckFormat,
  setDeckFormat,
  deckDescription,
  setDeckDescription,
  onSave,
  selectedCardsCount,
  isEditMode
}: DeckFormProps) => {
  const { t } = useLanguage();

  return (
    <Card className="animate-scale-up">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deck-name">{t('deckName')}</Label>
          <Input
            id="deck-name"
            placeholder={t('enterDeckName')}
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deck-format">{t('format')}</Label>
          <Select value={deckFormat} onValueChange={setDeckFormat}>
            <SelectTrigger id="deck-format">
              <SelectValue placeholder={t('selectFormat')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">{t('standard')}</SelectItem>
              <SelectItem value="Modern">{t('modern')}</SelectItem>
              <SelectItem value="Commander">{t('commander')}</SelectItem>
              <SelectItem value="Legacy">{t('legacy')}</SelectItem>
              <SelectItem value="Vintage">{t('vintage')}</SelectItem>
              <SelectItem value="Casual">{t('casual')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deck-description">{t('description')}</Label>
          <Textarea
            id="deck-description"
            placeholder={t('describeStrategy')}
            rows={4}
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button 
            className="w-full"
            onClick={onSave}
            disabled={deckName === "" || selectedCardsCount === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? t('updateDeck') : t('saveDeck')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckForm;
